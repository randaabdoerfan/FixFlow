import Link from "next/link";

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[#103356]">
                    Welcome to FixFlow
                </h1>

                <p className="mt-6 text-xl text-gray-600">
                    Smart Incident Management System
                </p>
                <div className="mt-7 flex flex-cols gap-7 items-center justify-center">

                <Link className="mt-8 bg-[#103356] text-white px-6 py-3 rounded-xl" href={"/auth/signup"}>
                    Get Started
                </Link>
                <Link className="mt-8 bg-[#103356] text-white px-6 py-3 rounded-xl" href={"/auth/login"}>
                    Login
                </Link>
                </div>
            </div>
            <img  src="/assets/mainPic.png"
                                alt="FixFlow Hero"
                                width={800}
                                height={600}/>
        </section>
    );
}