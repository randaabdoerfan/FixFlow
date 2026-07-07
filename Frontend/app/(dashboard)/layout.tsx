import Navbar from "../components/navbar/navbar";
import Sidebar from "../components/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="sm:ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-2">
          {children}
        </main>
      </div>
    </div>
  );
}