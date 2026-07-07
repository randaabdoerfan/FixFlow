"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { menuConfig, Role } from "./mainConfig";

export default function Sidebar() {
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<Role>("user");

  useEffect(() => {
    const savedRole = localStorage.getItem("role") as Role | null;
    if (savedRole && ["admin", "manager", "agent", "user"].includes(savedRole)) {
      setRole(savedRole);
    } else {
      setRole("user");
    }
  }, []);

  const menuItems = menuConfig[role];

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="text-heading bg-transparent border border-transparent duration-300 ease-in-out hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
        </svg>
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${
          open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto rounded" style={{ backgroundColor: "var(--main2-color)" }}>
          <button onClick={() => setOpen(false)} className="block sm:hidden text-white p-2">
            ✕
          </button>

          <div className="flex mb-20">
            <img src="/assets/Vector.png" className="h-8 me-3" alt="Logo" />
            <span className="self-center text-lg font-semibold whitespace-nowrap" style={{ color: "var(--main-color)" }}>
              FixFlow System
            </span>
          </div>

          <ul className="space-y-6 font-medium">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center px-2 py-1.5 rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                  style={{ color: "var(--main-color)" }}
                >
                  <img src={item.icon} alt={item.label} />
                  <span className="ms-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
