import {
  ShieldCheck,
  ClipboardList,
  Users,
  Bell,
  FileText,
  BarChart3,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <ClipboardList size={40} className="text-[#103356]" />,
      title: "Incident Reporting",
      description:
        "Create and submit incident reports with all required details and attachments.",
    },
    {
      icon: <Users size={40} className="text-[#103356]" />,
      title: "Role-Based Access",
      description:
        "Separate permissions for Admin, Manager, Agent, and Client to ensure secure access.",
    },
    {
      icon: <Bell size={40} className="text-[#103356]" />,
      title: "Email Notifications",
      description:
        "Notify users instantly about incident updates and important actions.",
    },
    {
      icon: <FileText size={40} className="text-[#103356]" />,
      title: "Document Management",
      description:
        "Upload images, PDFs, and other files related to each incident.",
    },
    {
      icon: <BarChart3 size={40} className="text-[#103356]" />,
      title: "Dashboard & Reports",
      description:
        "Monitor incident status, priorities, and team performance through analytics.",
    },
    {
      icon: <ShieldCheck size={40} className="text-[#103356]" />,
      title: "Secure Authentication",
      description:
        "Protect user accounts with JWT authentication, email verification, and role authorization.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#103356]">
            Powerful Features
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            FixFlow provides everything your organization needs to manage,
            monitor, and resolve incidents efficiently.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#f8fbfd] rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-[#103356] mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}