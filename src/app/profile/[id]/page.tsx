"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const UserDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  // Unwrap the params object
  const { id } = React.use(params);

  useEffect(() => {
    if (!id) return; // Don't fetch if there's no id yet
    const fetchUserDetails = () => {
      setLoading(true);
      axios
        .get(`/api/users/me`)
        .then((response) => {
          if (response.status === 200) {
            setUser(response.data.data);
            console.log(response.data.data);
          } else {
            throw new Error("Failed to fetch user details");
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchUserDetails();
  }, [id]); // Re-run the effect when the ID changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
      {/* Full-width isVerified bar */}
      <div
        className={`w-full text-white text-center py-2 font-semibold ${
          user.isVerified ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {user.isVerified ? "Account Verified" : "Account Not Verified"}
      </div>

      {/* User Details Container */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 mt-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          User Details
        </h1>
        <ul className="space-y-4">
          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Username:</span>
            <span>{user.username}</span>
          </li>
          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Email:</span>
            <span>{user.email}</span>
          </li>
          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Is Verified:</span>
            <span>{user.isVerified ? "Yes" : "No"}</span>
          </li>
          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Is Admin:</span>
            <span>{user.isAdmin ? "Yes" : "No"}</span>
          </li>
        </ul>
        <button
          onClick={() => router.push("/profile")}
          className="mt-6 w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700"
        >
          Back to Profile
        </button>{" "}
        <button
          onClick={logout}
          className="mt-2 w-full py-2 px-4 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDetailsPage;
