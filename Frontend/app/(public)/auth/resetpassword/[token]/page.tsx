"use client"
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation"
import axios from "axios";
import API_URL from "../../../../lib/api";

function ConfirmNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/users/resetpassword/${token}`,
        { newPassword: password }
      );
      alert("Password reset successfully!");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative h-screen bg-linear-to-r from-[#e5ebf0] to-blue-200">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <form onSubmit={handleSubmit} className="w-full max-w-lg py-12 px-20 backdrop-blur-xl border border-black/20 rounded-2xl shadow-2xl">
            <img
              src="/assets/lock-solid.png"
              width={70}
              className="object-cover block m-auto p-2 bg-[#1033566f] rounded-full mb-4"
              alt=""
            />
            <p className="text-2xl my-2.5 font-bold text-[#103356]">
              Set Your New Password
            </p>
            <p className="text-sm text-[#808080] mb-5.5">
              Your new password should be different from previously used ones
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-xl text-gray-700 mb-2">Password</label>
                <input
                  className="block appearance-none w-full bg-white border border-gray-200 text-[#103356] py-3 px-4 pr-8 rounded focus:border-gray-500"
                  type="password"
                  placeholder="Enter your New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-gray-700 mb-2">Confirm your new Password</label>
                <input
                  className="block appearance-none w-full bg-white border border-gray-200 text-[#103356] py-3 px-4 pr-8 rounded focus:border-gray-500"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-2 w-full bg-[#103356] text-white rounded-xl text-xl mt-8 block m-auto disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Confirm"}
            </button>
            <p className="text-sm text-[#103356] text-center mt-3.5">
              I already have an Account{" "}
              <span className="text-blue-800 ml-5 cursor-pointer" onClick={() => router.push("/auth/login")}>
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfirmNewPassword;
