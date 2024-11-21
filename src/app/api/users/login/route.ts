import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!(email.trim().length > 0 && password.trim().length > 0)) {
      return NextResponse.json({
        success: false,
        message: "Invalid input. Please fill all fields.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already exists in the database",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid password",
      });
    }
    // Create a new JWT token
    const tokenData = {
      userId: existingUser._id,
      email: existingUser.email,
      username: existingUser.username,
      role: existingUser.role,
      isVerified: existingUser.isVerified,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({
      success: true,
      message: "User registered successfully",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    return response;
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json({
      success: false,
      message: "An error occurred while registering the user.",
    });
  }
}
