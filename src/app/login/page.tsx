"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisable, setButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setButtonDisable(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/users/login", user);
      console.log(response.data);
      alert(response.data.message);
      router.push("/profile");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-600 mb-6">
          {loading ? "Processing..." : "Log In"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={buttonDisable || loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
              buttonDisable || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div role="status" className="flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291a7.963 7.963 0 01-2-5.291H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-2 text-white">Logging...</span>
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
