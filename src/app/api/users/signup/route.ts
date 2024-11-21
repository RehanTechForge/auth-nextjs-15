import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcrypt";
import sendEmail from "@/helpers/sendMail";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (
      !(
        username.trim().length > 0 &&
        email.trim().length > 0 &&
        password.trim().length > 0
      )
    ) {
      return NextResponse.json({
        success: false,
        message: "Invalid input. Please fill all fields.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already exists. Please choose a different one.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });

    return NextResponse.json({
      success: true,
      message: "User registration successful!",
      newUser,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json({
      success: false,
      message: "An error occurred while registering the user.",
    });
  }
}
