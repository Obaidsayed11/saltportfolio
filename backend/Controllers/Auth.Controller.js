import asyncHandler from "../Utils/AsyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiSuccess from "../Utils/ApiSuccess.js";
import User from "../Models/User.Model.js";
import fileUpload from "../Utils/FileUpload.js";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import bcrypt from 'bcrypt'

dayjs.extend(isSameOrBefore);


const RegisterContoller = asyncHandler(async (req, res) => {
  const { email, password,confirmPassword, firstName, lastName, phoneNumber, dateOfBirth } = req.body;

  if (!email || !password || !confirmPassword || !firstName || !lastName || !phoneNumber || !dateOfBirth) {
    throw new ApiError(400, "All fields are required");
  }

  // Password Validation (Minimum 6 characters, at least 1 capital letter and 1 special character)
   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{6,}$/;
if (!passwordRegex.test(password)) {
  throw new ApiError(
    400,
    "Password must be at least 6 characters, contain 1 capital letter and 1 special character"
  );
}

if(confirmPassword !== password) {
  throw new ApiError(
    400,
    "Confirm Paswword is not matching password"
  )
}

  
  const dob = dayjs(dateOfBirth);
  const age = dayjs().diff(dob, 'year');
  if (age < 18) {
    throw new ApiError(400, "User must be at least 18 years old");
  }

  // Email Uniqueness
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User with Email already exists");
  }

  // Profile Image Upload
  let profilePhotoUrl = "";
  if (req.files && req.files.profilePhoto && req.files.profilePhoto[0]) {
    const uploadedFile = req.files.profilePhoto[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      throw new ApiError(400, "Only PNG or JPEG images are allowed");
    }

    const cloudinaryResponse = await fileUpload(uploadedFile.path);
    if (!cloudinaryResponse) {
      throw new ApiError(500, "Image upload failed");
    }
    profilePhotoUrl = cloudinaryResponse.secure_url;
  }

  // Create User
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    profilePhoto: profilePhotoUrl,
    dateOfBirth: dob.toDate()
  });

  if (!user) throw new ApiError(500, "User creation failed");

  return res.status(201).json(
    new ApiSuccess(201, user, "User registered successfully")
  );
});


const LoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existedUser = await User.findOne({ email });
  if (!existedUser) {
    throw new ApiError(404, "User doesn't exist");
  }

  
  const isPasswordValid = await bcrypt.compare(password, existedUser.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const accessTokenGenerate = existedUser.generateToken();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  };

  const loggedInUser = await User.findById(existedUser.id).select("-password");

  return res
    .status(200)
    .cookie("accesToken", accessTokenGenerate, options)
    .json(
      new ApiSuccess(
        200,
        {
          user: loggedInUser,
          accessToken: accessTokenGenerate,
        },
        "User logged in successfully"
      )
    );
});

const LogoutController = asyncHandler(async (req, res) => {
  res.clearCookie("accesToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res
    .status(200)
    .json(new ApiSuccess(200, null, "User logged out successfully"));
});

const userInfoController = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!id) {
    throw new ApiError(401, "User is not authenticated");
  }

  const findUser = await User.findById(id).select("-password");
  if (!findUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiSuccess(
      200,
      {
        id: findUser._id,
        email: findUser.email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        profilePhoto: findUser.profilePhoto, 
        phoneNumber: findUser.phoneNumber,
        dateOfBirth: findUser.dateOfBirth 
      },
      "User found successfully"
    )
  );
});






export default {
  RegisterContoller,
  LoginController,
  userInfoController,
  LogoutController
  
};
