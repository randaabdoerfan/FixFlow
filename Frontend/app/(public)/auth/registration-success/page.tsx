'use client'
import Link from "next/link"
import { useSearchParams } from "next/navigation";

export default function successRegisteration() {
    const searchParams = useSearchParams();

    const message = searchParams.get("message") || "Your account has been created successfully ."



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">🎉</div>

                <h1 className="text-3xl font-bold text-green-600">
                    Registration Successful
                </h1>
                <p className="text-gray-700">{message}</p>
                <Link
                    href="/auth/login"
                    className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );


}