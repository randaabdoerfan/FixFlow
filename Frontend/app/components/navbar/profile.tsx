import { useRouter } from "next/navigation";

interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const router = useRouter();
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  return (
    <div className="rounded-xl shadow-xl border p-5 w-80 z-50" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>My Profile</h2>
      <div className="flex flex-col items-center">
        <img
          src={user.avatar || "/assets/profile.jpg"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: "var(--border-color)" }}
        />
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Name</p>
          <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>{user.name}</p>
        </div>
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Email</p>
          <p className="text-lg" style={{ color: "var(--text-primary)" }}>{user.email}</p>
        </div>
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Phone</p>
          <p className="text-lg" style={{ color: "var(--text-primary)" }}>{user.phone || "-"}</p>
        </div>
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Role</p>
          <p className="text-lg capitalize" style={{ color: "var(--text-primary)" }}>{user.role}</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => router.push("/profile/update")}
            className="w-[50%] py-1 text-white rounded-xl font-semibold hover:opacity-90 cursor-pointer" style={{ backgroundColor: "var(--main2-color)" }}
          >
            Edit
          </button>
          <button
            onClick={() => router.push("/profile/view")}
            className="w-[50%] py-1 text-white rounded-xl font-semibold hover:opacity-90 cursor-pointer" style={{ backgroundColor: "var(--main2-color)" }}
          >
            Show
          </button>
        </div>
      </div>
    </div>
  );
}
