import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
connect();

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  if (!token) {
    return NextResponse.json({
      message: "Unauthenticated",
      status: 401,
    });
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decodedToken) {
      return NextResponse.json({
        message: "Invalid Token",
        status: 401,
      });
    }
    console.log("Decoded Token", decodedToken);

    const user = await User.findById({ _id: decodedToken.userId });
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Success",
      data: user,
      status: 200,
    });
  } catch (error: any) {
    console.log(`Error Token ${error.message}`);
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
}
