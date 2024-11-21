import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({
        message: "No token found",
        success: false,
      });
    }

    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true,
    });

    response.cookies.set("token", "", {
      expires: new Date(0), // Delete the cookie
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    console.log(`Error getting logout from ${error.message}`);
    return NextResponse.json({
      message: "Failed to get logout",
      success: false,
    });
  }
}
