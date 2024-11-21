"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>("");

  const logout = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/logout");

      if (response.status === 200) {
        alert("User logged out successfully");
        router.push("/login");
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error: any) {
      console.error(`Logout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/me");
      if (response.status === 200) {
        const user = response.data.data;
        setUser(user);
      } else {
        throw new Error("Failed to get user details");
      }
    } catch (error: any) {
      console.error(`Get User Details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Profile Page</h1>
        {user ? (
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-800">
              Welcome,{" "}
              <span className="text-blue-600">{user.username || "User"}</span>
            </p>
            <p className="text-sm text-gray-600">
              User ID:{" "}
              <Link
                href={`/profile/${user._id}`}
                className="text-blue-600 hover:underline"
              >
                {user._id}
              </Link>
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-6">
            No user details available
          </p>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={getUserDetails}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Fetching Details..." : "Fetch User Details"}
          </button>
          <button
            onClick={logout}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Logging Out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
