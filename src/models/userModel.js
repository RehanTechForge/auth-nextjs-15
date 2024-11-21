import mongoose, { Schema } from "mongoose";
import { type } from "os";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
