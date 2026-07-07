"use client";

import { useRouter } from "next/navigation";

export default function CallToAction() {
  const router = useRouter();

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto bg-[#103356] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl">

        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to Simplify Incident Management?
        </h2>

        <p className="mt-6 text-lg text-gray-200 max-w-3xl mx-auto leading-8">
          Join FixFlow and manage incidents more efficiently. Report issues,
          assign agents, track progress, and resolve incidents faster with one
          centralized platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">

          <button
            onClick={() => router.push("/auth/signup")}
            className="bg-white text-[#103356] font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/auth/login")}
            className="border-2 border-white px-8 py-4 rounded-xl hover:bg-white hover:text-[#103356] transition duration-300"
          >
            Login
          </button>

        </div>

      </div>
    </section>
  );
}