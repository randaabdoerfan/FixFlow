export type Role = "admin" | "manager" | "agent" | "user";

export interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

export const menuConfig: Record<Role, MenuItem[]> = {
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: "/assets/dashboard.png" },
    { label: "Admin Panel", href: "/admin", icon: "/assets/dashboard.png" },
    { label: "Teams", href: "/teams", icon: "/assets/teams.png" },
    { label: "Tickets", href: "/tickets", icon: "/assets/tickets.png" },
    { label: "Documents", href: "/documents", icon: "/assets/documents.png" },
    { label: "Logs", href: "/admin?tab=logs", icon: "/assets/dashboard.png" },
  ],

  manager: [
    { label: "Dashboard", href: "/dashboard", icon: "/assets/dashboard.png" },
    { label: "Manager Panel", href: "/manager", icon: "/assets/dashboard.png" },
    { label: "Documents", href: "/documents", icon: "/assets/documents.png" },
  ],

  agent: [
    { label: "Dashboard", href: "/dashboard", icon: "/assets/dashboard.png" },
    { label: "Tickets", href: "/tickets", icon: "/assets/tickets.png" },
    { label: "Documents", href: "/documents", icon: "/assets/documents.png" },
  ],

  user: [
    { label: "My Tickets", href: "/clientTicket", icon: "/assets/dashboard.png" },
    { label: "Create Ticket", href: "/clientForm", icon: "/assets/clients.png" },
  ],
};
