"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";


export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            id="contact"
            className="bg-[#103356] text-white mt-20"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Logo */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">


                            <Link href="/" className="flex flex-col bg-white rounded-sm p-2">
                                <img
                                    src="/assets/logo.jpg"
                                    alt="FixFlow Logo"
                                    width={180}
                                    height={60}
                                />

                                <span className="text-sm text-gray-500 ml-2">
                                    Incident Management System
                                </span>
                            </Link>
                        </div>

                        <p className="text-gray-300 leading-7">
                            FixFlow helps organizations report, assign, monitor, and resolve
                            incidents efficiently through one centralized platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-5">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-gray-300">
                            <li>
                                <Link href="/fixflow" className="hover:text-white transition">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <a href="#features" className="hover:text-white transition">
                                    Features
                                </a>
                            </li>

                            <li>
                                <a href="#workflow" className="hover:text-white transition">
                                    Workflow
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-semibold mb-5">
                            Contact
                        </h3>

                        <div className="space-y-4 text-gray-300">

                            <div className="flex items-center gap-3">
                                <Mail size={18} />
                                <span>support@fixflow.com</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone size={18} />
                                <span>+20 100 123 4567</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin size={18} />
                                <span>Cairo, Egypt</span>
                            </div>

                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-xl font-semibold mb-5">
                            Follow Us
                        </h3>

                        <p className="text-gray-300 mb-5">
                            Stay connected with the latest updates and releases.
                        </p>

                        <div className="flex gap-4">
                            <a href="http://github.com">

                                <img
                                    src="/assets/github.jpeg"
                                    alt=""
                                    className="rounded-sm w-13 p-2 bg-white/10 hover:bg-white hover:text-[#103356] flex items-center justify-center transition"
                                />
                            </a>


                            <a href="http://github.com">
                                <img
                                    src="/assets/linkedin.jpeg"
                                    alt=""
                                    className="rounded-sm p-3 bg-white/10 hover:bg-white hover:text-[#103356] flex items-center justify-center transition"
                                /> 
                            </a>


                        </div>
                    </div>

                </div>

                <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-300">

                    <p>
                        © {year} FixFlow. All rights reserved.
                    </p>

                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition">
                            Privacy Policy
                        </Link>

                        <Link href="#" className="hover:text-white transition">
                            Terms of Service
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    );
}