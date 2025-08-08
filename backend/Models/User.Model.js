import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      match: [/^[A-Za-z]+$/, "First Name must contain only alphabets"]
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      match: [/^[A-Za-z]+$/, "Last Name must contain only alphabets"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"]
    },
    profilePhoto: {
      type: String,
      required: false
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of Birth is required"]
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User' , userSchema);

export default User;