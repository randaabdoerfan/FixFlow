"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../../lib/api";

function ForgetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(API_URL + "/users/resetpassword", { email });
            setMessage(res.data.message);
        } catch (err: any) {
            setMessage(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="relative h-screen bg-linear-to-r from-[#e5ebf0] to-blue-200">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <form onSubmit={handleSubmit} className="w-full max-w-lg py-12 px-20 backdrop-blur-xl border border-black/20 rounded-2xl shadow-2xl">
                        <img src="/assets/lock-solid.png" width={70} className="object-cover block m-auto p-2 bg-[#1033566f] rounded-full mb-4" alt="" />
                        <p className="text-2xl my-2.5 font-bold text-[#103356]">Forget Your Password?</p>
                        <p className="text-[#808080] mb-1.5">Enter your Email to reset it</p>

                        {message && (
                            <div className="bg-blue-100 border border-blue-400 text-blue-700 rounded-lg p-3 mb-4 text-sm">
                                {message}
                            </div>
                        )}

                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase text-gray-700 mb-2">e-mail</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block appearance-none w-full bg-white border border-gray-200 text-[#103356] py-3 px-4 pr-8 rounded focus:border-gray-500"
                                    type="email"
                                    placeholder="Enter your Email"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 w-full bg-[#103356] text-white rounded-xl text-xl mt-8 block m-auto disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Confirm"}
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

export default ForgetPassword;
