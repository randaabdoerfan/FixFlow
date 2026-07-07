"use client";

import axios from "axios";
import API_URL from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                API_URL + "/users/register",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    phone: formData.phone || undefined,
                },{withCredentials:true}
            );

            router.push(
                `/auth/registration-success?message=${encodeURIComponent(
                    response.data.message
                )}`
            );
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Registration failed. Please try again.";

            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-r from-[#e5ebf0] to-blue-200 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg">
                <form
                    onSubmit={handleForm}
                    className="bg-white/40 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl py-8 px-9"
                >
                    <h1 className="text-3xl font-bold text-center text-[#103356]">
                        FixFlow System
                    </h1>

                    <p className="text-center text-gray-600 mt-2 mb-8">
                        Create your account
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-3 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="mb-5">
                        <label className="block text-[#103356] font-semibold mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            required
                            autoComplete="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#103356] focus:outline-none focus:ring-2 focus:ring-[#103356] transition"
                        />
                    </div>

        
                    <div className="mb-5">
                        <label className="block text-[#103356] font-semibold mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#103356] focus:outline-none focus:ring-2 focus:ring-[#103356] transition"
                        />
                    </div>

               
                    <div className="mb-5">
                        <label className="block text-[#103356] font-semibold mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            required
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#103356] focus:outline-none focus:ring-2 focus:ring-[#103356] transition"
                        />

                        <ul className="text-xs text-gray-600 mt-3 ml-5 list-disc space-y-1">

                        </ul>
                    </div>

        
                    <div className="mb-5">
                        <label className="block text-[#103356] font-semibold mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            required
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value,
                                })
                            }
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#103356] focus:outline-none focus:ring-2 focus:ring-[#103356] transition"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-6">
                        <label className="block text-[#103356] font-semibold mb-2">
                            Phone <span className="text-gray-500">(Optional)</span>
                        </label>

                        <input
                            type="text"
                            placeholder="01XXXXXXXXX"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#103356] focus:outline-none focus:ring-2 focus:ring-[#103356] transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-2 bg-[#103356] text-white rounded-xl text-lg font-semibold transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <p className="text-center text-gray-700 mt-6">
                        Already have an account?
                        <span
                            onClick={() => router.push("/auth/login")}
                            className="ml-2 text-[#103356] font-semibold cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}