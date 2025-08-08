import React, { useState } from "react";
import { useRegisterUserMutation } from "../../redux/Slice/Auth.Slice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


 const validate = () => {
  const newErrors = {};

  if (!form.firstName.trim()) newErrors.firstName = "First name is required";
  if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

  if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
    newErrors.email = "Valid email is required";

  if (!form.password || form.password.length < 6)
    newErrors.password = "Password must be at least 6 characters";
  else if (!/[A-Z]/.test(form.password) || !/[!@#$%^&]/.test(form.password))
    newErrors.password =
      "Password must have 1 capital letter and 1 special character";

  if (form.password !== form.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match";

  if (!form.phoneNumber.trim() || !/^\d{10}$/.test(form.phoneNumber))
    newErrors.phoneNumber = "Valid 10-digit phone number required";

  if (!form.dateOfBirth)
    newErrors.dateOfBirth = "Date of Birth is required";
    
  if (!profilePhoto)
    newErrors.profilePhoto = "Profile image is required";

  setErrors(newErrors);

  // Show toast errors
  Object.values(newErrors).forEach((msg) => toast.error(msg));

  return Object.keys(newErrors).length === 0;
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors({ ...errors, profilePhoto: "Only JPG or PNG allowed" });
      return;
    }
    setProfilePhoto(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    formData.append("profilePhoto", profilePhoto);

    try {
      const res = await registerUser(formData).unwrap();
      toast.success("User registered successfully!");
      navigate("/Login");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Registration failed");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Create Your Account ✨
      </h2>

      {/* Profile Upload */}
      <div className="flex flex-col items-center">
        <label htmlFor="profilePhoto" className="cursor-pointer">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500 shadow-md hover:opacity-90 transition"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm ring-2 ring-dashed ring-purple-400 hover:ring-purple-600 transition">
              Upload
            </div>
          )}
        </label>
        <input
          type="file"
          id="profilePhoto"
          className="hidden"
          onChange={handleImageChange}
        />
        {errors.profilePhoto && (
          <span className="text-red-500 text-xs mt-1">
            {errors.profilePhoto}
          </span>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={handleInputChange}
        />
      </div>
      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={handleInputChange}
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

      {/* Password */}
    <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
    onChange={handleInputChange}
  />
  <div
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </div>
  {errors.password && (
    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
  )}
</div>

{/* Confirm Password */}
<div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    placeholder="Confirm Password"
    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
    onChange={handleInputChange}
  />
  <div
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
  </div>
  {errors.confirmPassword && (
    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
  )}
</div>

      {/* Phone Number */}
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={handleInputChange}
      />
      {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}

      {/* DOB */}
      <input
        type="date"
        name="dateOfBirth"
        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={handleInputChange}
      />
      {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>}

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
      >
        Sign Up
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-purple-600 hover:underline font-medium"
        >
          Login
        </a>
      </p>
    </form>
  </div>
);

};

export default SignUp;
