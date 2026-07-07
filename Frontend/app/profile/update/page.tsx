"use client";

import axios from "axios";
import API_URL from "../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateProfile() {
    const router = useRouter();
    const [user, setUser] = useState({ name: "", email: "", phone: "", role: "", avatar: "" });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function getProfile() {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            if (!userId || !token) return;
            try {
                const res = await axios.get(`${API_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getProfile();
    }, []);

    async function handleUpdate() {
        try {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");

            await axios.put(`${API_URL}/users/${userId}`, user, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Profile updated successfully");
            router.push("/profile/view");
        } catch (err) {
            console.log(err);
        }
    }

    async function handleAvatarUpload(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) return;
        setUploading(true);
        setMessage("");
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            const res = await axios.put(`${API_URL}/users/avatar/${userId}`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });
            setUser((prev) => ({ ...prev, avatar: res.data.data?.avatar || prev.avatar }));
            setMessage("Avatar updated successfully!");
            setFile(null);
            setPreview("");
        } catch (err: any) {
            setMessage(err?.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="w-3xl max-w-5xl mx-auto mt-16 bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#103356] mb-8">Update Profile</h1>

            <div className="flex flex-col items-center mb-8">
                <img
                    src={preview || user.avatar || "/assets/profile.jpg"}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover border-4 border-[#103356] mb-2"
                />
                <form onSubmit={handleAvatarUpload} className="flex items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
                        }}
                        className="text-sm w-48"
                    />
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="bg-[#103356] text-white px-4 py-1.5 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {uploading ? "..." : "Upload"}
                    </button>
                </form>
                {message && (
                    <p className={`text-sm mt-1 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
            </div>

            <label>Name</label>
            <input
                className="border p-3 rounded-lg w-full mb-4"
                value={user.name ?? ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
            />

            <label>Email</label>
            <input
                className="border p-2 rounded-lg w-full mb-3"
                value={user.email ?? ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <label>Phone</label>
            <input
                className="border p-2 rounded-lg w-full mb-3"
                value={user.phone ?? ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />

            <button
                onClick={handleUpdate}
                className="bg-[#103356] text-white px-6 py-3 rounded-lg cursor-pointer"
            >
                Save Changes
            </button>
        </div>
    );
}
