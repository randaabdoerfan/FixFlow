 "use client";

import axios from "axios";
import API_URL from "../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
export default function Profile() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getProfile() {
            try {
               const userId = localStorage.getItem("userId");

                console.log(userId)
                const token = localStorage.getItem("token");

                if (!userId || !token) {
                    setLoading(false);
                    return;
                }
                const res = await axios.get(
                    `${API_URL}/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(res.data);
                console.log(res.data)

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        getProfile();
    }, []);

const handleBackToDashboard = () => {
  switch (user?.role) {
    case "admin":
      router.push("/admin");
      break;

    case "manager":
      router.push("/manager");
      break;

    case "agent":
      router.push("/developer");
      break;

    case "client":
    default:
      router.push("/clientTicket");
      break;
  }
};

    if (loading) return <h1>Loading...</h1>;

    return (
        <div className="max-w-2xl mx-auto mt-16 bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold text-[#103356] mb-8">
                My Profile
            </h1>

            <div className="space-y-5">

                <div>
                    <p className="text-gray-500">Name</p>
                    <p className="text-xl">{user.name}</p>
                </div>

                <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-xl">{user.email}</p>
                </div>

                <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="text-xl">{user.phone || "-"}</p>
                </div>

                <div>
                    <p className="text-gray-500">Role</p>
                    <p className="text-xl capitalize">{user.role}</p>
                </div>

            </div>
<div className="d-flex gap-5 align-items-center justify-content-center">
            <button
                onClick={() => router.push("/profile/update")}
                className="mt-8 bg-[#103356] text-white px-6 py-3 rounded-lg"
            >
                Update Profile
            </button>
            <button
                onClick={handleBackToDashboard}
                className="mt-8 bg-[#103356] text-white px-6 py-3 rounded-lg"
            >
                Back to Dashboard
            </button>
</div>

        </div>
    );
}