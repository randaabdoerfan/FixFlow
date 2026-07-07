"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import API_URL from "../../lib/api";

function Tickets() {
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    if (!token || !["admin", "manager", "agent", "user"].includes(role || "")) {
      router.replace("/auth/login");
    }
  }, [token, role, router]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const [agents, setAgents] = useState<any[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [managerInfo, setManagerInfo] = useState<any>(null);
  const [managerMessages, setManagerMessages] = useState<any[]>([]);
  const [managerBody, setManagerBody] = useState("");
  const [chatMode, setChatMode] = useState<"ticket" | "manager">("ticket");
  const [searchQuery, setSearchQuery] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const isManager = role === "manager";

  useEffect(() => {
    async function getTickets() {
      try {
        let res;
        if (role === "agent" || role === "manager") {
          res = await axios.get(API_URL + "/tickets/getAssignedTicket/" + userId, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (role === "admin") {
          res = await axios.get(API_URL + "/tickets/getAllTickets", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          res = await axios.get(API_URL + "/tickets/getTicketByUser/" + userId, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        setTickets(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      } catch (err) {
        console.log(err);
      }
    }
    if (userId) getTickets();
  }, [userId, role]);

  useEffect(() => {
    if (!isManager || !token) return;
    axios.get(API_URL + "/users/agents/workload", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setAgents(res.data.data || [])).catch(console.log);
  }, [isManager, token]);

  useEffect(() => {
    if (role !== "agent" || !token || !userId) return;
    async function loadManager() {
      try {
        const userRes = await axios.get(`${API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.data;
        let mgrId = userData?.managerId?._id || userData?.managerId;
        if (!mgrId && userData?.team) {
          const teamId = typeof userData.team === "object" ? userData.team._id : userData.team;
          const teamRes = await axios.get(`${API_URL}/teams/getTeam/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const team = teamRes.data?.data || teamRes.data;
          mgrId = team?.managerId?._id || team?.managerId;
        }
        if (mgrId) {
          const mgrRes = await axios.get(`${API_URL}/users/${mgrId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setManagerInfo(mgrRes.data);
        }
      } catch (err) { console.log(err); }
    }
    loadManager();
  }, [role, token, userId]);

  async function assignTicket(ticketId: string, agentId: string) {
    if (!token) return;
    setAssigningId(ticketId);
    try {
      const res = await axios.put(
        `${API_URL}/tickets/assignTicket/${ticketId}`,
        { assignedTo: agentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTickets((prev) => prev.map((t) => (t._id === ticketId ? res.data.data : t)));
      if (selectedTicket?._id === ticketId) setSelectedTicket(res.data.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Assignment failed");
    } finally {
      setAssigningId(null);
    }
  }

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(API_URL, { withCredentials: true });
      socketRef.current.on("connect", () => {
        if (userId) socketRef.current?.emit("join", userId);
      });
      socketRef.current.on("newMessage", (message: any) => {
        if (selectedTicket && message.ticket_id === selectedTicket._id) {
          setMessages((prev) => prev.some((m) => m._id === message._id) ? prev : [...prev, message]);
        }
        if (managerInfo && !message.ticket_id &&
            ((message.sender?._id || message.sender) === managerInfo._id ||
             (message.sender?._id || message.sender) === userId)) {
          setManagerMessages((prev) => prev.some((m) => m._id === message._id) ? prev : [...prev, message]);
        }
      });
      socketRef.current.on("ticketAssigned", (ticket: any) => {
        setTickets((prev) => {
          const exists = prev.find((t) => t._id === ticket._id);
          return exists ? prev.map((t) => (t._id === ticket._id ? ticket : t)) : [...prev, ticket];
        });
      });
    }
    return () => {
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
    };
  }, [userId, selectedTicket, managerInfo]);

  async function openTicket(ticket: any) {
    setSelectedTicket(ticket);
    try {
      const [msgRes, docRes] = await Promise.all([
        axios.get(`${API_URL}/messages/ticket/${ticket._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/documents/ticket/${ticket._id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setMessages(msgRes.data.data);
      setDocs(docRes.data || []);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleMessage() {
    if (!token || !userId || !selectedTicket || !body.trim()) return;
    const receiver = selectedTicket.createdBy?._id || selectedTicket.createdBy;
    const data = { sender: userId, receiver, ticket_id: selectedTicket._id, body };
    try {
      const res = await axios.post(API_URL + "/messages/create", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => [...prev, res.data.data]);
      setBody("");
    } catch (err: any) {
      console.log(err.response?.data);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !selectedTicket || !token || !userId) return;
    const receiver = selectedTicket.createdBy?._id || selectedTicket.createdBy;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("file_url", files[i]);
    formData.append("sender", userId);
    formData.append("receiver", receiver);
    formData.append("ticket_id", selectedTicket._id);
    try {
      const res = await axios.post(API_URL + "/documents", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setDocs((prev) => [...prev, res.data.document]);
    } catch (err: any) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function openManagerChat() {
    if (!managerInfo?._id || !userId || !token) return;
    setChatMode("manager");
    try {
      const res = await axios.get(`${API_URL}/messages/conversation/${userId}/${managerInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagerMessages(res.data.data || []);
    } catch (err) { console.log(err); }
  }

  async function handleManagerMessage() {
    if (!token || !userId || !managerInfo?._id || !managerBody.trim()) return;
    try {
      const res = await axios.post(API_URL + "/messages/create",
        { sender: userId, receiver: managerInfo._id, body: managerBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setManagerMessages((prev) => [...prev, res.data.data]);
      setManagerBody("");
    } catch (err: any) { console.log(err.response?.data); }
  }

  async function handleStatusChange(newStatus: string) {
    if (!token || !selectedTicket) return;
    try {
      const res = await axios.put(
        `${API_URL}/tickets/changeStatus/${selectedTicket._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedTicket(res.data.data);
      setTickets((prev) => prev.map((t) => (t._id === selectedTicket._id ? res.data.data : t)));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to change status");
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-100 p-4 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-full">
        <div className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="flex items-center bg-gray-100 rounded-xl p-3 m-4 flex-shrink-0">
            <img src="/assets/search.png" className="w-5 h-5 mr-2" alt="" />
            <input type="text" placeholder="Search Tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          {isManager && agents.length > 0 && (
            <div className="px-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Agents Workload</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {agents.map((a: any) => (
                  <span key={a._id} className={`text-xs px-2 py-0.5 rounded-full ${a.ticketCount > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {a.name}: {a.ticketCount}
                  </span>
                ))}
              </div>
            </div>
          )}
          {role === "agent" && (
            <div className="px-4 pb-3">
              {managerInfo ? (
                <button onClick={() => openManagerChat()}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${chatMode === "manager" ? "bg-[#103356] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  💬 Chat with Manager ({managerInfo.name || "Manager"})
                </button>
              ) : (
                <p className="text-xs text-gray-400 px-2">No manager assigned to you</p>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
            {tickets.filter((t) => {
              const q = searchQuery.toLowerCase();
              return !q || (t.title && t.title.toLowerCase().includes(q)) || (t.description && t.description.toLowerCase().includes(q));
            }).map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => openTicket(ticket)}
                className={`p-3 rounded-xl border cursor-pointer hover:bg-gray-100 ${
                  selectedTicket?._id === ticket._id ? "bg-[#103356] text-white" : ""
                }`}
              >
                <h3 className="font-bold">{ticket.title}</h3>
                <p className="text-sm truncate">{ticket.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs inline-block px-2 py-0.5 rounded-full ${
                    ticket.status === "opened" ? "bg-yellow-100 text-yellow-800" :
                    ticket.status === "assignedTo" || ticket.status === "inProgress" ? "bg-blue-100 text-blue-800" :
                    ticket.status === "resolved" ? "bg-green-100 text-green-800" :
                    ticket.status === "closed" ? "bg-gray-200 text-gray-600" : ""
                  }`}>{ticket.status}</span>
                  {ticket.team?.name && (
                    <span className="text-xs text-gray-400">• {ticket.team.name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          {role === "agent" && managerInfo && (
            <div className="flex gap-2 px-4 pt-3 pb-0 flex-shrink-0">
              <button onClick={() => setChatMode("ticket")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${chatMode === "ticket" ? "bg-[#103356] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                Ticket Chat
              </button>
              <button onClick={() => { setChatMode("manager"); openManagerChat(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${chatMode === "manager" ? "bg-[#103356] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                💬 Manager Chat
              </button>
            </div>
          )}
          {chatMode === "manager" ? (
            <>
              <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="font-bold text-[#103356]">Chat with Manager{managerInfo?.name ? ` (${managerInfo.name})` : ""}</h2>
                  <p className="text-sm text-gray-500">Direct messages with your manager</p>
                </div>
                <button onClick={() => setChatMode("ticket")}
                  className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">Back to Tickets</button>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-4">
                {managerMessages.map((msg: any) => {
                  const isMine = msg.sender?._id === userId || msg.sender === userId;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{msg.sender?.name || "User"}</p>
                        <div className={`px-4 py-2 rounded-xl max-w-sm ${isMine ? "bg-[#103356] text-white" : "bg-gray-200"}`}>
                          {msg.body}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {managerMessages.length === 0 && (
                  <p className="text-gray-400 text-center pt-8">No messages yet. Start a conversation with your manager.</p>
                )}
              </div>
              <div className="border-t p-4 flex-shrink-0">
                <div className="flex gap-3">
                  <input type="text" value={managerBody} onChange={(e) => setManagerBody(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleManagerMessage()}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-xl p-3 outline-none focus:border-[#103356]" />
                  <button onClick={handleManagerMessage}
                    className="px-8 bg-[#103356] text-white rounded-xl hover:bg-[#1a4b79] transition">Send</button>
                </div>
              </div>
            </>
          ) : (
            <>
          <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="font-bold text-[#103356]">{selectedTicket?.title || "Select a ticket"}</h2>
              <p className="text-sm text-gray-500">
                {selectedTicket ? `Status: ${selectedTicket.status}` : ""}
                {selectedTicket?.assignedTo?.name ? ` · Agent: ${selectedTicket.assignedTo.name}` : ""}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              {isManager && selectedTicket && selectedTicket.status === "opened" && agents.length > 0 && (
                <select
                  className="text-sm border rounded-lg px-2 py-1"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) assignTicket(selectedTicket._id, e.target.value);
                  }}
                  disabled={assigningId === selectedTicket._id}
                >
                  <option value="">Assign to...</option>
                  {agents.map((a: any) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.ticketCount} tickets)
                    </option>
                  ))}
                </select>
              )}
              {selectedTicket && selectedTicket.status !== "closed" && (
                <>
                  {selectedTicket.status === "assignedTo" && (
                    <button onClick={() => handleStatusChange("inProgress")}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">Start Progress</button>
                  )}
                  {selectedTicket.status === "inProgress" && role === "agent" && (
                    <button onClick={() => handleStatusChange("resolved")}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Resolve</button>
                  )}
                  {selectedTicket.status === "inProgress" && isManager && (
                    <button onClick={() => handleStatusChange("resolved")}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Resolve</button>
                  )}
                  {selectedTicket.status === "resolved" && (role === "admin" || isManager) && (
                    <button onClick={() => handleStatusChange("closed")}
                      className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">Close</button>
                  )}
                  {selectedTicket.status === "resolved" && role === "agent" && (
                    <button onClick={async () => {
                      try {
                        await axios.post(`${API_URL}/tickets/requestClose/${selectedTicket._id}`, {}, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        alert("Closure request sent to admins");
                      } catch (err: any) {
                        alert(err?.response?.data?.message || "Failed to request closure");
                      }
                    }}
                      className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">Request Close</button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-4">
            {messages.map((msg: any) => {
              const isMine = msg.sender?._id === userId || msg.sender === userId;
              return (
                <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{msg.sender?.name || "User"}</p>
                    <div className={`px-4 py-2 rounded-xl max-w-sm ${isMine ? "bg-[#103356] text-white" : "bg-gray-200"}`}>
                      {msg.body}
                    </div>
                  </div>
                </div>
              );
            })}

            {docs.length > 0 && selectedTicket && (
              <div className="border-t pt-3 mt-3">
                <p className="text-xs text-gray-500 mb-2 font-semibold">Attachments</p>
                <div className="flex flex-wrap gap-2">
                  {docs.map((doc: any) =>
                    doc.file_url?.map((url: string, i: number) => (
                      <a key={i} href={url} download target="_blank" rel="noreferrer"
                        className="text-xs bg-white border rounded px-2 py-1 text-blue-600 hover:bg-blue-50">
                        📎 Download File {i + 1}
                      </a>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4 flex-shrink-0 space-y-2">
            <div className="flex gap-3">
              <input type="text" value={body} onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMessage()}
                placeholder={selectedTicket?.status === "closed" ? "Chat closed" : "Type your message..."}
                disabled={selectedTicket?.status === "closed"}
                className="flex-1 border rounded-xl p-3 outline-none focus:border-[#103356] disabled:bg-gray-100 disabled:cursor-not-allowed" />
              <button onClick={handleMessage} disabled={selectedTicket?.status === "closed"}
                className="px-8 bg-[#103356] text-white rounded-xl hover:bg-[#1a4b79] transition disabled:opacity-50">Send</button>
            </div>
            <div className="flex items-center gap-3">
              <input type="file" ref={fileRef} multiple onChange={handleFileUpload} className="text-sm" disabled={selectedTicket?.status === "closed" || uploading} />
              {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tickets;
