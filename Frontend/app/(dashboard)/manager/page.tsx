"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import API_URL from "../../lib/api";

function ManagerPage() {
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    if (!token || role !== "manager") {
      router.replace("/auth/login");
    }
  }, [token, role, router]);
  const [activeTab, setActiveTab] = useState<"tickets" | "documents" | "teams">("tickets");

  const [userInfo, setUserInfo] = useState<any>(null);
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);

  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatDocs, setChatDocs] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [chatTarget, setChatTarget] = useState<"client" | "agent">("client");
  const [filterMember, setFilterMember] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatAgent, setChatAgent] = useState<any>(null);
  const [agentMessages, setAgentMessages] = useState<any[]>([]);
  const [agentBody, setAgentBody] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!token || !userId) return;
    axios.get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setUserInfo(res.data)).catch(console.log);
  }, [token, userId]);

  useEffect(() => {
    if (!userInfo?.team || !token || !userId) return;
    const teamId = typeof userInfo.team === "object" ? userInfo.team._id : userInfo.team;
    Promise.all([
      axios.get(`${API_URL}/tickets/getTicketByTeam/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}/users/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}/teams/getTeam/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}/documents/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}/teams/getAllTeams`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}/users/by-manager/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]).then(([tickRes, agentsRes, teamRes, docsRes, teamsRes, mgrRes]) => {
      setTickets(tickRes.data);
      const teamMembers = agentsRes.data;
      const mgrUsers = Array.isArray(mgrRes.data) ? mgrRes.data : (mgrRes.data?.data || []);
      const merged = [...teamMembers];
      mgrUsers.forEach((u: any) => {
        if (!merged.find((m: any) => m._id === u._id)) merged.push(u);
      });
      setAgents(merged);
      setTeamInfo(teamRes.data?.data || teamRes.data);
      setDocs(docsRes.data || []);
      setTeams(teamsRes.data);
    }).catch(console.log);
  }, [userInfo, token, userId]);

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
        if (chatAgent && !message.ticket_id &&
            ((message.sender?._id || message.sender) === chatAgent._id ||
             (message.sender?._id || message.sender) === userId)) {
          setAgentMessages((prev) => prev.some((m) => m._id === message._id) ? prev : [...prev, message]);
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
  }, [userId, selectedTicket, chatAgent]);

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

  async function openTicket(ticket: any) {
    setSelectedTicket(ticket);
    try {
      const [msgRes, docRes] = await Promise.all([
        axios.get(`${API_URL}/messages/ticket/${ticket._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/documents/ticket/${ticket._id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setMessages(msgRes.data.data);
      setChatDocs(docRes.data || []);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleMessage() {
    if (!token || !userId || !selectedTicket || !body.trim()) return;
    let receiver;
    if (chatTarget === "agent" && selectedTicket.assignedTo?._id) {
      receiver = selectedTicket.assignedTo._id;
    } else {
      receiver = selectedTicket.createdBy?._id || selectedTicket.createdBy;
    }
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
    let receiver;
    if (chatTarget === "agent" && selectedTicket.assignedTo?._id) {
      receiver = selectedTicket.assignedTo._id;
    } else {
      receiver = selectedTicket.createdBy?._id || selectedTicket.createdBy;
    }
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
      setChatDocs((prev) => [...prev, res.data.document]);
    } catch (err: any) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
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

  async function openAgentChat(agent: any) {
    setChatAgent(agent);
    if (!userId || !token) return;
    try {
      const res = await axios.get(`${API_URL}/messages/conversation/${userId}/${agent._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgentMessages(res.data.data || []);
    } catch (err) { console.log(err); }
  }

  async function handleAgentMessage() {
    if (!token || !userId || !chatAgent || !agentBody.trim()) return;
    try {
      const res = await axios.post(API_URL + "/messages/create",
        { sender: userId, receiver: chatAgent._id, body: agentBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAgentMessages((prev) => [...prev, res.data.data]);
      setAgentBody("");
    } catch (err: any) { console.log(err.response?.data); }
  }

  const tabBtn = (key: typeof activeTab, label: string) => (
    <button onClick={() => setActiveTab(key)}
      className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === key ? "bg-[#103356] text-white" : "bg-white text-gray-700"}`}>
      {label}
    </button>
  );

  const teamId = userInfo?.team ? (typeof userInfo.team === "object" ? userInfo.team._id : userInfo.team) : null;
  const teamAgents = agents; // all members of the team

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-100 p-4 overflow-hidden">
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {tabBtn("tickets", "Tickets")}
        {tabBtn("documents", "Documents")}
        {tabBtn("teams", "Team Info")}
        {teamInfo?.name && (
          <span className="ml-auto text-sm font-medium text-[#103356] bg-white px-3 py-1.5 rounded-lg shadow">
            Team: {teamInfo.name}
          </span>
        )}
      </div>

      {/* ===================== TICKETS ===================== */}
      {activeTab === "tickets" && (
        <div className="flex flex-col h-[calc(100%-60px)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-3">
            {(() => {
              const filtered = filterMember
                ? tickets.filter((t) => t.assignedTo?._id === filterMember || t.createdBy?._id === filterMember)
                : tickets;
              return [
                { label: "Total", value: filtered.length, color: "" },
                { label: "Opened", value: filtered.filter((t) => t.status === "opened").length, color: "text-yellow-600" },
                { label: "Assigned", value: filtered.filter((t) => t.status === "assignedTo").length, color: "text-purple-600" },
                { label: "In Progress", value: filtered.filter((t) => t.status === "inProgress").length, color: "text-blue-600" },
                { label: "Resolved", value: filtered.filter((t) => t.status === "resolved").length, color: "text-green-600" },
                { label: "Closed", value: filtered.filter((t) => t.status === "closed").length, color: "text-gray-600" },
              ];
            })().map((c) => (
              <div key={c.label} className="bg-white p-2 rounded-xl shadow text-center">
                <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">
          <div className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-center bg-gray-100 rounded-xl p-3 m-4 flex-shrink-0">
              <img src="/assets/search.png" className="w-5 h-5 mr-2" alt="" />
              <input type="text" placeholder="Search Tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm" />
            </div>
            {teamAgents.length > 0 && (
              <div className="px-4 pb-2">
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Team Members ({teamAgents.length})
                </p>
                <div className="space-y-1 mb-2">
                  <button onClick={() => setFilterMember(null)}
                    className={`text-xs px-2 py-0.5 rounded-full mb-1 ${!filterMember ? 'bg-[#103356] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    All
                  </button>
                  {teamAgents.map((a: any) => {
                    const totalAssigned = tickets.filter((t) => t.assignedTo?._id === a._id);
                    const solvedTickets = totalAssigned.filter((t) => t.status === "resolved" || t.status === "closed");
                    return (
                      <div key={a._id} className="flex items-center gap-1">
                        <button onClick={() => setFilterMember(a._id)}
                          className={`flex items-center gap-2 text-xs flex-1 text-left px-2 py-1 rounded ${filterMember === a._id ? 'bg-[#103356] text-white' : 'hover:bg-gray-100'}`}>
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-medium truncate">{a.name}</span>
                          <span className="text-gray-400 text-xs capitalize flex-shrink-0">({a.role})</span>
                          {a.role === "agent" && (
                            <span className="ml-auto flex-shrink-0">{solvedTickets.length} solved</span>
                          )}
                        </button>
                        <button onClick={() => openAgentChat(a)}
                          className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${chatAgent?._id === a._id ? 'bg-[#103356] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          title={`Chat with ${a.name}`}>💬</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
              {tickets.filter((t) => {
                const memberMatch = !filterMember || t.assignedTo?._id === filterMember || t.createdBy?._id === filterMember;
                const searchMatch = !searchQuery || (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) || (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
                return memberMatch && searchMatch;
              }).map((ticket) => (
                <div
                  key={ticket._id}
                  onClick={() => openTicket(ticket)}
                  className={`p-3 rounded-xl border cursor-pointer hover:bg-gray-100 ${
                    selectedTicket?._id === ticket._id ? "bg-[#103356] text-white" : ""
                  }`}
                >
                  <h3 className="font-bold text-sm">{ticket.title}</h3>
                  <p className="text-xs truncate text-gray-500">{ticket.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ticket.status === "opened" ? "bg-yellow-100 text-yellow-800" :
                      ticket.status === "assignedTo" || ticket.status === "inProgress" ? "bg-blue-100 text-blue-800" :
                      ticket.status === "resolved" ? "bg-green-100 text-green-800" :
                      ticket.status === "closed" ? "bg-gray-200 text-gray-600" : ""
                    }`}>{ticket.status}</span>
                    {ticket.assignedTo?.name && (
                      <span className="text-xs text-gray-400">→ {ticket.assignedTo.name}</span>
                    )}
                  </div>
                </div>
              ))}
              {tickets.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No tickets for your team</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden relative">
            <>
            <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-bold text-[#103356]">{selectedTicket?.title || "Select a ticket"}</h2>
                <p className="text-sm text-gray-500">
                  {selectedTicket ? `Status: ${selectedTicket.status} · Created by: ${selectedTicket.createdBy?.name || "—"}` : ""}
                  {selectedTicket?.assignedTo ? ` · Assigned to: ${selectedTicket.assignedTo.name}` : ""}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                {selectedTicket && selectedTicket.status === "opened" && teamAgents.filter((a: any) => a.role === "agent").length > 0 && (
                  <select
                    className="text-sm border rounded-lg px-2 py-1"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) assignTicket(selectedTicket._id, e.target.value);
                    }}
                    disabled={assigningId === selectedTicket._id}
                  >
                    <option value="">Assign to...</option>
                    {teamAgents.filter((a: any) => a.role === "agent").map((a: any) => (
                      <option key={a._id} value={a._id}>{a.name}</option>
                    ))}
                  </select>
                )}
                {selectedTicket && selectedTicket.status !== "closed" && (
                  <>
                    {selectedTicket.status === "assignedTo" && (
                      <button onClick={() => handleStatusChange("inProgress")}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">Start Progress</button>
                    )}
                    {selectedTicket.status === "inProgress" && (
                      <button onClick={() => handleStatusChange("resolved")}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Resolve</button>
                    )}
                    {selectedTicket.status === "resolved" && (
                      <button onClick={() => handleStatusChange("closed")}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">Close</button>
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

              {chatDocs.length > 0 && selectedTicket && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {chatDocs.map((doc: any) =>
                      doc.file_url?.map((url: string, i: number) => (
                        <a key={i} href={url} download target="_blank" rel="noreferrer"
                          className="text-xs bg-white border rounded px-2 py-1 text-blue-600 hover:bg-blue-50">
                          Download File {i + 1}
                        </a>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4 flex-shrink-0 space-y-2">
              {selectedTicket && (
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="text-gray-500">Chat with:</span>
                  <button onClick={() => setChatTarget("client")}
                    className={`px-2 py-0.5 rounded-full ${chatTarget === "client" ? "bg-[#103356] text-white" : "bg-gray-100 text-gray-600"}`}>
                    Client {selectedTicket.createdBy?.name ? `(${selectedTicket.createdBy.name})` : ""}
                  </button>
                  {selectedTicket.assignedTo?._id && (
                    <button onClick={() => setChatTarget("agent")}
                      className={`px-2 py-0.5 rounded-full ${chatTarget === "agent" ? "bg-[#103356] text-white" : "bg-gray-100 text-gray-600"}`}>
                      Agent {selectedTicket.assignedTo?.name ? `(${selectedTicket.assignedTo.name})` : ""}
                    </button>
                  )}
                </div>
              )}
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
          </div>
        </div>
        </div>
      )}

      {/* ===================== DOCUMENTS ===================== */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-xl shadow overflow-x-auto h-[calc(100%-60px)]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Ticket</th>
                <th className="px-4 py-3 text-left">Sender</th>
                <th className="px-4 py-3 text-left">Receiver</th>
                <th className="px-4 py-3 text-left">Files</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc: any) => (
                <tr key={doc._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{doc.ticket_id?.title || "—"}</td>
                  <td className="px-4 py-3">{doc.sender?.name || "—"}</td>
                  <td className="px-4 py-3">{doc.receiver?.name || "—"}</td>
                  <td className="px-4 py-3">
                    {doc.file_url?.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer"
                        className="text-blue-600 hover:underline mr-2 text-xs">File {i + 1}</a>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {docs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No documents yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== TEAM INFO ===================== */}
      {activeTab === "teams" && (
        <div className="bg-white rounded-xl shadow p-6 h-[calc(100%-60px)] overflow-y-auto">
          {teamInfo ? (
            <div>
              <h2 className="text-xl font-bold text-[#103356] mb-4">{teamInfo.name}</h2>
              {/* <p className="text-sm text-gray-600 mb-2">Manager: {teamInfo.managerId?.name || "—"}</p> */}
              <p className="text-sm text-gray-600 mb-4">Team Members: {teamInfo.number_of_team || 0}</p>
              <h3 className="font-semibold text-[#103356] mb-2">Team Members</h3>
              <div className="space-y-3">
                {teamAgents.map((a: any) => {
                  const assignedTickets = tickets.filter((t) => t.assignedTo?._id === a._id);
                  const openTickets = assignedTickets.filter((t) => t.status !== "closed" && t.status !== "resolved");
                  const solvedTickets = assignedTickets.filter((t) => t.status === "resolved" || t.status === "closed");
                  return (
                    <div key={a._id} className="border-b pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {a.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{a.name}</p>
                            <span className="text-xs text-gray-400 capitalize">({a.role})</span>
                          </div>
                          <p className="text-xs text-gray-500">{a.email}</p>
                        </div>
                        <div className="text-right text-xs">
                          <span className="font-semibold text-green-600">{solvedTickets.length}</span>
                          <span className="text-gray-400"> solved</span>
                          <br />
                          <span className="font-semibold text-blue-600">{openTickets.length}</span>
                          <span className="text-gray-400"> active</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${a.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {a.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {a.role === "agent" && (
                        <div className="ml-11 mt-1 text-xs text-gray-500">
                          {openTickets.length > 0 ? (
                            <div>
                              <span className="font-medium text-[#103356]">{openTickets.length} open ticket{openTickets.length > 1 ? "s" : ""}:</span>
                              {openTickets.map((t) => (
                                <div key={t._id} className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                                  <span>{t.title}</span>
                                  <span className="text-gray-400">({t.status})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span>No open tickets</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {teamAgents.length === 0 && <p className="text-gray-400 text-sm">No members in this team</p>}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">You are not assigned to any team</p>
          )}
        </div>
      )}

      {/* Agent direct chat modal */}
      {chatAgent && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          onClick={() => setChatAgent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[600px] flex flex-col overflow-hidden m-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-bold text-[#103356]">Chat with Agent{chatAgent.name ? ` (${chatAgent.name})` : ""}</h2>
                <p className="text-sm text-gray-500">{chatAgent.email}</p>
              </div>
              <button onClick={() => setChatAgent(null)}
                className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-4">
              {agentMessages.map((msg: any) => {
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
              {agentMessages.length === 0 && (
                <p className="text-gray-400 text-center pt-8">No messages yet. Start a conversation with this agent.</p>
              )}
            </div>
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex gap-3">
                <input type="text" value={agentBody} onChange={(e) => setAgentBody(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAgentMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-xl p-3 outline-none focus:border-[#103356]" />
                <button onClick={handleAgentMessage}
                  className="px-8 bg-[#103356] text-white rounded-xl hover:bg-[#1a4b79] transition">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerPage;
