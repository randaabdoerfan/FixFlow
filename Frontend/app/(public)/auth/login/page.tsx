"use client";

import axios from "axios";
import API_URL from "../../../lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [resetExpired, setResetExpired] = useState(false);
    const [checkingLogin, setCheckingLogin] = useState(true);

    useEffect(() => {
        async function checkExistingSession() {
            const existingToken = localStorage.getItem("token");
            const existingUserId = localStorage.getItem("userId");

            if (!existingToken || !existingUserId) {
                setCheckingLogin(false);
                return;
            }

            try {
                const res = await axios.get(
                    API_URL + "/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${existingToken}`,
                        },
                        withCredentials: true,
                    }
                );

                const user = res.data.user;
                if (!user) throw new Error("No user data");

                localStorage.setItem("userId", user._id);
                localStorage.setItem("role", user.role);
                localStorage.setItem("user", JSON.stringify(user));

                if (user.role === "admin") {
                    router.replace("/admin");
                } else if (user.role === "manager") {
                    router.replace("/manager");
                } else if (user.role === "agent") {
                    router.replace("/developer");
                } else {
                    router.replace("/clientTicket");
                }
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                localStorage.removeItem("user");
                setCheckingLogin(false);
            }
        }

        checkExistingSession();
    }, [router]);

    useEffect(() => {
        async function autoLogin() {
            const token = searchParams.get("token");

            if (!token) return;

            setCheckingLogin(true);

            try {
                localStorage.setItem("token", token);

                const res = await axios.get(
                    API_URL + "/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                const user = res.data.user;
                if (!user) throw new Error("No user data");

                localStorage.setItem("userId", user._id);
                localStorage.setItem("role", user.role);
                localStorage.setItem("user", JSON.stringify(user));

                if (user.role === "admin") {
                    router.replace("/admin");
                } else if (user.role === "manager") {
                    router.replace("/manager");
                } else if (user.role === "agent") {
                    router.replace("/developer");
                } else {
                    router.replace("/clientTicket");
                }
            } catch (err: any) {
                setError("Automatic login failed. Please log in manually.");
                setCheckingLogin(false);
                console.log(err);
            }
        }

        if (searchParams.get("verified") === "true") {
            setVerified(true);
        }
        if (searchParams.get("reset") === "expired") {
            setError("Reset link expired. Please request a new one.");
        }

        autoLogin();
    }, [searchParams, router]);

    if (checkingLogin) {
        return (
            <div className="min-h-screen bg-linear-to-r from-[#e5ebf0] to-blue-200 flex items-center justify-center">
                <p className="text-[#103356] text-lg">Checking session...</p>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                API_URL + "/users/login",
                formData,
                {
                    withCredentials: true,
                }
            );

            const { token, user } = response.data;
            

            localStorage.setItem("token", token);
            localStorage.setItem("userId", user._id);
            localStorage.setItem("role", user.role);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "admin") {
                router.replace("/admin");
            }else if (user.role === "manager") {
                router.replace("/manager");
            } else if (user.role === "agent") {
                router.replace("/developer");
            } else if (user.role === "user") {
                router.replace("/clientTicket");
            } else {
                router.replace("/login");


            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Login failed. Please check your credentials.";

            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-r from-[#e5ebf0] to-blue-200 flex items-center justify-center px-4">
            <div className="w-full max-w-lg">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/40 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl py-8 px-9"
                >
                    <h1 className="text-3xl font-bold text-center text-[#103356]">
                        Welcome Back to FixFlow System
                    </h1>

                    <p className="text-center text-gray-600 mt-2 mb-8">
                        Sign in to your account
                    </p>

                    {verified && (
                        <div className="bg-green-100 border border-green-400 text-green-700 rounded-lg p-3 mb-6 text-sm">
                            Email verified successfully! You can now log in.
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-3 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="mb-5">
                        <label className="block text-[#103356] font-semibold mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#103356] focus:outline-none focus:ring-2 focus:ring-[#103356]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-[#103356] font-semibold mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#103356] focus:outline-none focus:ring-2 focus:ring-[#103356]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#103356] text-white rounded-xl text-lg font-semibold hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-gray-700 mt-6">
                        Don't have an account?
                        <span
                            className="ml-2 text-[#103356] font-semibold cursor-pointer hover:underline"
                            onClick={() => router.push("/auth/signup")}
                        >
                            Sign Up
                        </span>
                    </p>

                    <p className="text-center mt-2">
                        <span
                            className="text-[#103356] font-semibold cursor-pointer hover:underline"
                            onClick={() => router.push("/auth/forgot-password")}
                        >
                            Forgot Password?
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}