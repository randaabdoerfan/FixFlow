"use client";

import axios from "axios";
import API_URL from "../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Dashboard() {
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    if (!token || !["admin", "manager", "agent"].includes(role || "")) {
      router.replace("/auth/login");
    }
  }, [token, role, router]);
  const [ticketCount, setTicketCount] = useState({ total: 0, opened: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [section, setSection] = useState<"tickets" | "documents">("tickets");
  const [documents, setDocuments] = useState<any[]>([]);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        const uid = userId;
        let ticketsData;
        if (role === "agent" && uid) {
          const res = await axios.get(`${API_URL}/tickets/getAssignedTicket/${uid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          ticketsData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        } else {
          const res = await axios.get(API_URL + "/tickets/getAllTickets", {
            headers: { Authorization: `Bearer ${token}` },
          });
          ticketsData = res.data;
        }

        const total = ticketsData.length;
        const opened = ticketsData.filter((t: any) => t.status === "opened").length;
        const inProgress = ticketsData.filter((t: any) => t.status === "inProgress" || t.status === "assignedTo").length;
        const resolved = ticketsData.filter((t: any) => t.status === "resolved").length;
        const closed = ticketsData.filter((t: any) => t.status === "closed").length;
        setTicketCount({ total, opened, inProgress, resolved, closed });
        setRecentTickets(ticketsData.slice(-5).reverse());
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [token, role, userId]);

  useEffect(() => {
    if (!token || section !== "documents") return;
    axios.get(API_URL + "/documents/my", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setDocuments(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    }).catch(console.log);
  }, [token, section]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <p className="text-3xl font-bold">{ticketCount.total}</p>
            <p className="text-gray-500">Total Tickets</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <span className="text-2xl">🟡</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-600">{ticketCount.opened}</p>
            <p className="text-gray-500">Opened</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">{ticketCount.resolved}</p>
            <p className="text-gray-500">Resolved</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <span className="text-2xl">🔒</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-600">{ticketCount.closed}</p>
            <p className="text-gray-500">Closed</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setSection("tickets")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${section === "tickets" ? "bg-[#103356] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          Recent Tickets
        </button>
        <button onClick={() => setSection("documents")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${section === "documents" ? "bg-[#103356] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          Documents
        </button>
      </div>

      {section === "tickets" && (
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <div className="p-4 border-b">
          <h3 className="font-bold text-[#103356] text-lg">Recent Tickets</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Team</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.map((ticket) => (
              <tr key={ticket._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{ticket.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    ticket.status === "opened" ? "bg-yellow-100 text-yellow-700" :
                    ticket.status === "assignedTo" ? "bg-purple-100 text-purple-700" :
                    ticket.status === "inProgress" ? "bg-blue-100 text-blue-700" :
                    ticket.status === "resolved" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">{ticket.team?.name || "—"}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
              {recentTickets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No tickets yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {section === "documents" && (
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h3 className="font-bold text-[#103356] text-lg">My Documents</h3>
        </div>
        <div className="p-4 space-y-3">
          {documents.map((doc: any) => (
            <div key={doc._id} className="border rounded-lg p-3">
              <p className="text-sm font-medium text-gray-800">
                {doc.ticket_id?.title && <>Ticket: {doc.ticket_id.title} — </>}
                {doc.sender?.name || "Unknown"} → {doc.receiver?.name || "Unknown"}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(doc.file_url || []).map((url: string, i: number) => (
                  <a key={i} href={url} download target="_blank" rel="noreferrer"
                    className="text-xs bg-blue-50 border rounded px-2 py-1 text-blue-600 hover:bg-blue-100">
                    📎 File {i + 1}
                  </a>
                ))}
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-center text-gray-400 py-8">No documents found</p>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

export default Dashboard;
