"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
// import Image from "next/image";

export default function NavbarHero() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-25 h-15 rounded-xl bg-[white] text-white flex items-center justify-center text-xl font-bold">


                            <img
                                src="/assets/logo.jpg"
                                alt="FixFlow Hero"
                                width={800}
                                height={600}
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl text-bold text-[#103356]">
                                Incident 
                            </h1>
                            <p className="text-xs text-gray-500 -mt-1">
                                Management System
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

                        <Link
                            href="/fixflow"
                            className="hover:text-[#103356] transition"
                        >
                            Home
                        </Link>
                        <Link
                            href="#workflow"
                            className="hover:text-[#103356] transition"
                        >
                            Workflow
                        </Link>

                        <Link
                            href="#features"
                            className="hover:text-[#103356] transition"
                        >
                            Features
                        </Link>



                        <Link
                            href="/about"
                            className="hover:text-[#103356] transition"
                        >
                            About
                        </Link>

                        <Link
                            href="/contact"
                            className="hover:text-[#103356] transition"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Buttons */}
                    <div className="hidden md:flex items-center gap-4">

                        <Link
                            href="/auth/login"
                            className="text-[#103356] font-semibold hover:underline"
                        >
                            Login
                        </Link>

                        <Link
                            href="/auth/signup"
                            className="bg-[#103356] text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-[#103356]"
                    >
                        {isOpen ? <X size={30} /> : <Menu size={30} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white rounded-xl shadow-lg p-6 mb-4">

                        <div className="flex flex-col gap-5">

                            <Link
                                href="/fixflow"
                                onClick={() => setIsOpen(false)}
                                className="hover:text-[#103356]"
                            >
                                Home
                            </Link>

                            <Link
                                href="#features"
                                onClick={() => setIsOpen(false)}
                                className="hover:text-[#103356]"
                            >
                                Features
                            </Link>

                            <Link
                                href="#workflow"
                                onClick={() => setIsOpen(false)}
                                className="hover:text-[#103356]"
                            >
                                Workflow
                            </Link>

                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className="hover:text-[#103356]"
                            >
                                About
                            </Link>

                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="hover:text-[#103356]"
                            >
                                Contact
                            </Link>

                            <hr />

                            <Link
                                href="/auth/login"
                                onClick={() => setIsOpen(false)}
                                className="text-[#103356] font-semibold"
                            >
                                Login
                            </Link>

                            <Link
                                href="/auth/signup"
                                onClick={() => setIsOpen(false)}
                                className="bg-[#103356] text-white text-center py-3 rounded-xl"
                            >
                                Sign Up
                            </Link>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}