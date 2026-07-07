"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Profile from "./profile";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useTheme } from "../../context/ThemeContext";
import API_URL from "../../lib/api";

export default function Navbar() {
  const router = useRouter();
  const { dark, toggle } = useTheme();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function getProfile() {
      try {
        if (!userId || !token) return;

        const res = await axios.get(`${API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    getProfile();
  }, [userId, token]);

  useEffect(() => {
    async function getNotifications() {
      if (!userId) return;
      try {
        const res = await axios.get(
          `${API_URL}/notifications/user/${userId}/unread`
        );
        setNotifications(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    }

    getNotifications();
  }, [userId]);

  useEffect(() => {
    if (!socketRef.current && userId) {
      socketRef.current = io(API_URL, {
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        socketRef.current?.emit("join", userId);
      });

      socketRef.current.on("newNotification", (notification: any) => {
        setNotifications((prev) => [notification, ...prev]);
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
        }, 20000);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);

  async function markAllSeen() {
    if (!userId || !token || notifications.length === 0) return;
    try {
      await axios.patch(
        `${API_URL}/notifications/user/${userId}/seen-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLogout() {
    try {
      await axios.post(
        API_URL + "/users/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      router.replace("/fixflow");
    }
  }

  return (
    <header className="h-16 shadow-md" style={{ backgroundColor: "var(--bg-card)" }}>
      <div className="w-11/12 h-full mx-auto flex justify-end items-center gap-8">
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="rounded-full hover:bg-gray-100 transition p-1 cursor-pointer flex items-center gap-2"
          >
            <img
              src={user.avatar || "/assets/profile.jpg"}
              alt="user"
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover"
            />
            <span className="text-sm font-medium hidden md:block" style={{ color: "var(--text-primary)" }}>
              {user.name}
            </span>
          </button>

          {showProfile && (
            <div className="absolute top-12 right-0 z-50">
              <Profile user={user} />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllSeen(); }}
            className="relative cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-primary)" }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-10 right-0 w-80 rounded-xl shadow-xl border z-50 max-h-96 overflow-y-auto" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}>
              <div className="p-3 border-b font-semibold" style={{ color: "var(--text-primary)", borderColor: "var(--border-color)" }}>
                Notifications
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-sm" style={{ color: "var(--text-secondary)" }}>No new notifications</div>
              ) : (
                notifications.map((n: any, i: number) => (
                  <div key={i} className="p-3 border-b text-sm" style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                    {n.body || n.message?.body || "New notification"}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggle}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="py-2 px-5 rounded-xl text-white bg-[#103356] border border-[#103356] cursor-pointer hover:bg-white hover:text-[#103356] transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
