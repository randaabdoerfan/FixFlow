"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import API_URL from "../../lib/api";

function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    if (!token || role !== "admin") {
      router.replace("/auth/login");
    }
  }, [token, role, router]);

  const [userCount, setUserCount] = useState({ total: 0, users: 0, agents: 0, managers: 0, admins: 0 });
  const [ticketCount, setTicketCount] = useState({ total: 0, opened: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "tickets" | "logs" | "documents" | "create-user" | "teams" | "my-tickets">("dashboard");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["dashboard","users","tickets","logs","documents","create-user","teams","my-tickets"].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "user", team: "" });
  const [newTeam, setNewTeam] = useState({ name: "", managerId: "" });
  const [editTeam, setEditTeam] = useState<any>(null);
  const [editTeamForm, setEditTeamForm] = useState({ name: "", managerId: "" });
  const [createMsg, setCreateMsg] = useState("");
  const [logFilter, setLogFilter] = useState("");
  const [editTicket, setEditTicket] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [editUserForm, setEditUserForm] = useState({ name: "", email: "", role: "", team: "", managerId: "" });
  const [agents, setAgents] = useState<any[]>([]);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [mySelectedTicket, setMySelectedTicket] = useState<any>(null);
  const [myMessages, setMyMessages] = useState<any[]>([]);
  const [myDocs, setMyDocs] = useState<any[]>([]);
  const [myBody, setMyBody] = useState("");
  const [myUploading, setMyUploading] = useState(false);
  const myFileRef = useRef<HTMLInputElement>(null);

  async function apiGet(url: string, fallback: any = null) {
    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    } catch (err: any) {
      console.log(`API error: ${url}`, err?.response?.status, err?.response?.data?.message);
      return fallback;
    }
  }
  async function handleMyStatusChange(ticketId: string, newStatus: string) {
    if (!token) return;
    try {
      const res = await axios.put(
        `${API_URL}/tickets/changeStatus/${ticketId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMySelectedTicket((prev: any) => prev?._id === ticketId ? { ...prev, status: newStatus } : prev);
      setMyTickets((prev) => prev.map((t) => t._id === ticketId ? { ...t, status: newStatus } : t));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to change status");
    }
  }

  useEffect(() => {
    if (!token) return;
    async function fetchData() {
      const statsRes = await apiGet(API_URL + "/users/stats");
      if (statsRes?.data?.users) {
        setUserCount(statsRes.data.users);
        setTicketCount(statsRes.data.tickets);
      } else {
        const countRes = await apiGet(API_URL + "/users/count");
        if (countRes?.data) setUserCount(countRes.data);
        const dashRes = await apiGet(API_URL + "/tickets/dashboard/counts");
        if (dashRes?.data) setTicketCount(dashRes.data);
      }

      const usersRes = await apiGet(API_URL + "/users/all");
      if (Array.isArray(usersRes)) setUsers(usersRes);
      else if (usersRes?.data) setUsers(usersRes.data);

      const ticketsRes = await apiGet(API_URL + "/tickets/getAllTickets");
      if (Array.isArray(ticketsRes)) setTickets(ticketsRes);
      else if (ticketsRes?.data) setTickets(ticketsRes.data);

      const teamsRes = await apiGet(API_URL + "/teams/getAllTeams", []);
      if (Array.isArray(teamsRes)) setTeams(teamsRes);

      const docsRes = await apiGet(API_URL + "/documents");
      if (Array.isArray(docsRes)) setDocuments(docsRes);

      const agentsRes = await apiGet(API_URL + "/users/agents/workload", []);
      if (agentsRes?.data) setAgents(agentsRes.data);
      else if (Array.isArray(agentsRes)) setAgents(agentsRes);

      const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      if (uid) {
        const userRes = await apiGet(`${API_URL}/users/${uid}`);
        if (userRes) {
          const userTeam = userRes.team && typeof userRes.team === "object" ? userRes.team._id : (userRes.team || null);
          if (userTeam) {
            const teamTicketsRes = await apiGet(`${API_URL}/tickets/getTicketByTeam/${userTeam}`, []);
            if (Array.isArray(teamTicketsRes)) setMyTickets(teamTicketsRes);
          } else {
            const assignedRes = await apiGet(`${API_URL}/tickets/getAssignedTicket/${uid}`, []);
            if (Array.isArray(assignedRes)) setMyTickets(assignedRes);
          }
        }
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    if (!token || activeTab !== "logs") return;
    apiGet(API_URL + "/activity-logs/all").then((res) => {
      if (res?.data) setLogs(res.data);
    });
  }, [token, activeTab]);

  async function toggleUserStatus(userId: string) {
    try {
      await axios.patch(`${API_URL}/users/${userId}/status`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: !u.isActive } : u)));
    } catch (err) { console.log(err); }
  }

  const [detailTicket, setDetailTicket] = useState<any>(null);
  const [detailMessages, setDetailMessages] = useState<any[]>([]);
  const [detailDocs, setDetailDocs] = useState<any[]>([]);
  const [detailBody, setDetailBody] = useState("");
  const [detailUploading, setDetailUploading] = useState(false);
  const detailFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    axios.get(API_URL + "/users/online", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setOnlineUsers(res.data.data || [])).catch(console.log);

    if (!socketRef.current) {
      socketRef.current = io(API_URL, { withCredentials: true });
      const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      socketRef.current.on("connect", () => {
        if (uid) socketRef.current?.emit("join", uid);
      });
      socketRef.current.on("userOnline", (userId: string) => {
        setOnlineUsers((prev) => prev.includes(userId) ? prev : [...prev, userId]);
      });
      socketRef.current.on("userOffline", (userId: string) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      });
      socketRef.current.on("newMessage", (message: any) => {
        if (mySelectedTicket && message.ticket_id === mySelectedTicket._id) {
          setMyMessages((prev) => [...prev, message]);
        }
        if (detailTicket && message.ticket_id === detailTicket._id) {
          setDetailMessages((prev) => [...prev, message]);
        }
      });
    }
    return () => { if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; } };
  }, [token, mySelectedTicket, detailTicket]);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreateMsg("");
    if (newUser.password !== newUser.confirmPassword) {
      setCreateMsg("Passwords do not match");
      return;
    }
    try {
      const payload = { ...newUser };
      if (!payload.team) { delete payload.team; } else {
        const t = teams.find((x: any) => x._id === payload.team);
        if (t?.managerId) payload.managerId = t.managerId._id || t.managerId;
      }
      const res = await axios.post(API_URL + "/users/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreateMsg(res.data.message || "User created successfully");
      setTimeout(() => setCreateMsg(""), 5000);
      setNewUser({ name: "", email: "", password: "", confirmPassword: "", role: "user", team: "" });
      const usersRes = await axios.get(API_URL + "/users/all", { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(usersRes.data)) setUsers(usersRes.data);
    } catch (err: any) {
      setCreateMsg(err?.response?.data?.message || "Failed to create user");
    }
  }

  async function handleDeleteTeam(id: string) {
    if (!confirm("Delete this team?")) return;
    try {
      await axios.delete(`${API_URL}/teams/deleteTeam/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete team");
    }
  }

  async function openDetail(ticket: any) {
    setDetailTicket(ticket);
    try {
      const [msgRes, docRes] = await Promise.all([
        axios.get(`${API_URL}/messages/ticket/${ticket._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/documents/ticket/${ticket._id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setDetailMessages(msgRes.data.data || []);
      setDetailDocs(docRes.data || []);
    } catch (err) { console.log(err); }
  }

  async function handleDetailMessage() {
    if (!token || !uid || !detailTicket || !detailBody.trim()) return;
    const receiver = detailTicket.createdBy?._id || detailTicket.createdBy;
    try {
      const res = await axios.post(API_URL + "/messages/create",
        { sender: uid, receiver, ticket_id: detailTicket._id, body: detailBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetailMessages((prev) => [...prev, res.data.data]);
      setDetailBody("");
    } catch (err: any) { console.log(err.response?.data); }
  }

  async function handleDetailFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !detailTicket || !token || !uid) return;
    const receiver = detailTicket.createdBy?._id || detailTicket.createdBy;
    setDetailUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("file_url", files[i]);
    formData.append("sender", uid);
    formData.append("receiver", receiver);
    formData.append("ticket_id", detailTicket._id);
    try {
      const res = await axios.post(API_URL + "/documents", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setDetailDocs((prev) => [...prev, res.data.document]);
    } catch (err: any) { console.log(err); alert("Upload failed"); } finally {
      setDetailUploading(false);
      if (detailFileRef.current) detailFileRef.current.value = "";
    }
  }

  async function handleDetailStatus(newStatus: string) {
    if (!token || !detailTicket) return;
    try {
      await axios.put(`${API_URL}/tickets/changeStatus/${detailTicket._id}`, { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetailTicket((prev: any) => ({ ...prev, status: newStatus }));
      setTickets((prev) => prev.map((t) => t._id === detailTicket._id ? { ...t, status: newStatus } : t));
    } catch (err: any) { alert(err?.response?.data?.message || "Status change failed"); }
  }

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = { ...newTeam };
      if (!payload.managerId) delete payload.managerId;
      await axios.post(API_URL + "/teams/createTeam", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Team created successfully");
      setNewTeam({ name: "", managerId: "" });
      const teamsRes = await axios.get(API_URL + "/teams/getAllTeams", { headers: { Authorization: `Bearer ${token}` } });
      setTeams(teamsRes.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create team");
    }
  }

  function handleEditTeamClick(team: any) {
    setEditTeam(team);
    setEditTeamForm({
      name: team.name || "",
      managerId: team.managerId?._id || team.managerId || "",
    });
  }

  async function saveEditTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!editTeam) return;
    try {
      const payload: any = {};
      if (editTeamForm.name !== editTeam.name) payload.name = editTeamForm.name;
      const currentMgr = editTeam.managerId?._id || editTeam.managerId || "";
      if (editTeamForm.managerId !== currentMgr) payload.managerId = editTeamForm.managerId || null;
      await axios.put(`${API_URL}/teams/updateTeam/${editTeam._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditTeam(null);
      const teamsRes = await axios.get(API_URL + "/teams/getAllTeams", { headers: { Authorization: `Bearer ${token}` } });
      setTeams(teamsRes.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update team");
    }
  }

  async function handleEditTicket(ticket: any) {
    setEditTicket(ticket);
    setEditTitle(ticket.title);
  }

  async function saveEditTicket() {
    if (!editTicket || !editTitle.trim()) return;
    try {
      await axios.put(`${API_URL}/tickets/updateTicket/${editTicket._id}`, { title: editTitle }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets((prev) => prev.map((t) => t._id === editTicket._id ? { ...t, title: editTitle } : t));
      setEditTicket(null);
      setEditTitle("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update ticket");
    }
  }

  async function handleAdminStatus(ticketId: string, status: string) {
    if (!token) return;
    setStatusLoading(ticketId);
    try {
      await axios.put(`${API_URL}/tickets/changeStatus/${ticketId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(API_URL + "/tickets/getAllTickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) setTickets(res.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Status change failed");
    } finally {
      setStatusLoading(null);
    }
  }

  function handleEditUser(user: any) {
    setEditUser(user);
    const teamId = user.team && typeof user.team === "object" ? user.team._id : (user.team || "");
    const tm = teams.find((x: any) => x._id === teamId);
    setEditUserForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      team: teamId,
      managerId: tm?.managerId?._id || tm?.managerId || user.managerId?._id || user.managerId || "",
    });
  }

  async function saveEditUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    try {
      const payload: any = {};
      if (editUserForm.name !== editUser.name) payload.name = editUserForm.name;
      if (editUserForm.email !== editUser.email) payload.email = editUserForm.email;
      if (editUserForm.role !== editUser.role) payload.role = editUserForm.role;
      const currentTeam = editUser.team && typeof editUser.team === "object" ? editUser.team._id : editUser.team;
      if (editUserForm.team !== currentTeam) {
        payload.team = editUserForm.team || null;
        const tm = teams.find((x: any) => x._id === editUserForm.team);
        payload.managerId = tm?.managerId?._id || tm?.managerId || null;
      }
      await axios.put(`${API_URL}/users/${editUser._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map((u) => u._id === editUser._id ? { ...u, ...payload, team: payload.team !== undefined ? (payload.team || null) : u.team } : u));
      setEditUser(null);
      const teamsRes = await axios.get(API_URL + "/teams/getAllTeams", { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(teamsRes.data)) setTeams(teamsRes.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update user");
    }
  }

  const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  async function openMyTicket(ticket: any) {
    setMySelectedTicket(ticket);
    try {
      const [msgRes, docRes] = await Promise.all([
        axios.get(`${API_URL}/messages/ticket/${ticket._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/documents/ticket/${ticket._id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setMyMessages(msgRes.data.data || []);
      setMyDocs(docRes.data || []);
    } catch (err) { console.log(err); }
  }

  async function handleMyMessage() {
    if (!token || !uid || !mySelectedTicket || !myBody.trim()) return;
    const receiver = mySelectedTicket.createdBy?._id || mySelectedTicket.createdBy;
    try {
      const res = await axios.post(API_URL + "/messages/create",
        { sender: uid, receiver, ticket_id: mySelectedTicket._id, body: myBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyMessages((prev) => [...prev, res.data.data]);
      setMyBody("");
    } catch (err: any) { console.log(err.response?.data); }
  }

  async function handleMyFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !mySelectedTicket || !token || !uid) return;
    const receiver = mySelectedTicket.createdBy?._id || mySelectedTicket.createdBy;
    setMyUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("file_url", files[i]);
    formData.append("sender", uid);
    formData.append("receiver", receiver);
    formData.append("ticket_id", mySelectedTicket._id);
    try {
      const res = await axios.post(API_URL + "/documents", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setMyDocs((prev) => [...prev, res.data.document]);
    } catch (err: any) { console.log(err); alert("Upload failed"); } finally {
      setMyUploading(false);
      if (myFileRef.current) myFileRef.current.value = "";
    }
  }

  async function handleDeleteTicket(id: string) {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axios.delete(`${API_URL}/tickets/deleteTicket/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete ticket");
    }
  }

  const tabBtn = (key: typeof activeTab, label: string) => (
    <button onClick={() => setActiveTab(key)}
      className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === key ? "bg-[#103356] text-white" : "bg-white text-gray-700"}`}>
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabBtn("dashboard", "Dashboard")}
        {tabBtn("users", "Users")}
        {tabBtn("tickets", "Tickets")}
        {tabBtn("logs", "Logs")}
        {tabBtn("documents", "Documents")}
        {tabBtn("my-tickets", "My Tickets")}
        {tabBtn("create-user", "+ User")}
        {tabBtn("teams", "Teams")}
      </div>

      {/* ===================== DASHBOARD ===================== */}
      {activeTab === "dashboard" && (
        <div>
          <h2 className="text-xl font-bold text-[#103356] mb-4">Users</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total", value: userCount.total, color: "" },
              { label: "Clients", value: userCount.users, color: "" },
              { label: "Agents", value: userCount.agents, color: "" },
              { label: "Managers", value: userCount.managers, color: "" },
              { label: "Admins", value: userCount.admins, color: "" },
            ].map((c) => (
              <div key={c.label} className="bg-white p-5 rounded-xl shadow">
                <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
                <p className="text-gray-500">{c.label}</p>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-[#103356] mb-4">Tickets</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Total", value: ticketCount.total, color: "" },
              { label: "Opened", value: ticketCount.opened, color: "text-yellow-600" },
              { label: "In Progress", value: ticketCount.inProgress, color: "text-blue-600" },
              { label: "Resolved", value: ticketCount.resolved, color: "text-green-600" },
              { label: "Closed", value: ticketCount.closed, color: "text-gray-600" },
            ].map((c) => (
              <div key={c.label} className="bg-white p-5 rounded-xl shadow">
                <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
                <p className="text-gray-500">{c.label}</p>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-[#103356] mb-4 mt-8">Teams</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {teams.map((t: any) => (
              <div key={t._id} className="bg-white p-4 rounded-xl shadow">
                <p className="font-semibold text-[#103356]">{t.name}</p>
                <p className="text-xs text-gray-500 mt-1">Manager: {t.managerId?.name || "—"}</p>
                <p className="text-xs text-gray-500">Members: {t.number_of_team || 0}</p>
                {t.members && t.members.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    {t.members.map((m: any) => (
                      <span key={m._id} className="inline-block mr-1 mb-0.5 px-1.5 py-0.5 bg-gray-100 rounded">{m.name}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {teams.length === 0 && (
              <p className="text-gray-400 text-sm col-span-full">No teams created yet</p>
            )}
          </div>
        </div>
      )}

      {/* ===================== USERS TABLE ===================== */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Verified</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${onlineUsers.includes(u._id) ? "bg-green-500" : "bg-gray-300"}`} />
                    {u.name}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 text-xs">{teams.find((t: any) => t._id === (u.team?._id || u.team))?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.isEmailVerified ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEditUser(u)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:opacity-80">Edit</button>
                    <button onClick={() => toggleUserStatus(u._id)}
                      className={`px-3 py-1 rounded text-xs text-white ${u.isActive ? "bg-red-500" : "bg-green-500"}`}>
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== TICKETS TABLE ===================== */}
      {activeTab === "tickets" && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-left">Created By</th>
                <th className="px-4 py-3 text-left">Assigned To</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => openDetail(t)}>
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      t.status === "opened" ? "bg-yellow-100 text-yellow-700" :
                      t.status === "assignedTo" ? "bg-purple-100 text-purple-700" :
                      t.status === "inProgress" ? "bg-blue-100 text-blue-700" :
                      t.status === "resolved" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3">{t.team?.name || "—"}</td>
                  <td className="px-4 py-3">{t.createdBy?.name || "N/A"}</td>
                  <td className="px-4 py-3">{t.assignedTo?.name || "Unassigned"}</td>
                  <td className="px-4 py-3">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 items-center">
                      <select
                        className="text-xs border rounded px-1 py-0.5"
                        value=""
                        onChange={(e) => { if (e.target.value) handleAdminStatus(t._id, e.target.value); }}
                        disabled={statusLoading === t._id}
                      >
                        <option value="">Status...</option>
                        <option value="opened">Opened</option>
                        <option value="assignedTo">Assigned</option>
                        <option value="inProgress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button onClick={() => handleEditTicket(t)}
                        className="px-2 py-0.5 bg-blue-400 text-white rounded text-xs hover:opacity-80">Edit</button>
                      <button onClick={() => handleDeleteTicket(t._id)}
                        className="px-2 py-0.5 bg-red-500 text-white rounded text-xs hover:opacity-80">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== ACTIVITY LOGS ===================== */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <div className="p-3 border-b flex items-center gap-2">
            <img src="/assets/search.png" className="w-4 h-4" alt="" />
            <input
              type="text" placeholder="Filter by ticket title..."
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Ticket</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs
                .filter((log: any) =>
                  !logFilter || (log.ticketId?.title || "").toLowerCase().includes(logFilter.toLowerCase())
                )
                .map((log: any) => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{log.ticketId?.title || "—"}</td>
                  <td className="px-4 py-3">{log.user?.name || "—"} <span className="text-xs text-gray-400">({log.user?.role})</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      log.action === "created" ? "bg-blue-100 text-blue-700" :
                      log.action === "assigned" ? "bg-purple-100 text-purple-700" :
                      log.action === "status_changed" ? "bg-yellow-100 text-yellow-700" :
                      log.action === "resolved" ? "bg-green-100 text-green-700" :
                      log.action === "closed" ? "bg-gray-100 text-gray-700" : "bg-gray-50"
                    }`}>{log.action}</span>
                    {log.action === "resolved" && log.ticketId?.status === "closed" && (
                      <span className="ml-1 text-xs text-green-600">✓</span>
                    )}
                    {log.action === "resolved" && log.ticketId?.status !== "closed" && (
                      <span className="ml-1 text-xs text-yellow-600">⋯</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.description}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No activity logs yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== DOCUMENTS ===================== */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
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
              {documents.map((doc: any) => (
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
              {documents.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No documents found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== CREATE USER ===================== */}
      {activeTab === "create-user" && (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-bold text-[#103356] mb-6">Create New User</h2>
          {createMsg && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${createMsg.includes("Fail") || createMsg.includes("error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {createMsg}
            </div>
          )}
          <form onSubmit={handleCreateUser} className="space-y-4">
            <input placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full border rounded-lg p-3 text-sm" required />
            <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full border rounded-lg p-3 text-sm" required />
            <input type="password" placeholder="Password (min 8 chars)" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full border rounded-lg p-3 text-sm" required />
            <input type="password" placeholder="Confirm Password" value={newUser.confirmPassword} onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
              className="w-full border rounded-lg p-3 text-sm" required />
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full border rounded-lg p-3 text-sm">
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <select value={newUser.team} onChange={(e) => setNewUser({ ...newUser, team: e.target.value })}
              className="w-full border rounded-lg p-3 text-sm">
              <option value="">No Team</option>
              {teams.map((t: any) => (
                <option key={t._id} value={t._id}>{t.name}{t.managerId?.name ? ` (Mgr: ${t.managerId.name})` : ""}</option>
              ))}
            </select>
            <button type="submit" className="w-full py-3 bg-[#103356] text-white rounded-lg font-semibold hover:opacity-90">Create User</button>
          </form>
        </div>
      )}

      {/* ===================== MY TICKETS ===================== */}
      {activeTab === "my-tickets" && (
        <div className="h-[calc(100vh-180px)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-full">
            <div className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-bold text-[#103356]">My Tickets ({myTickets.length})</h2>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 pt-3">
                {myTickets.map((ticket) => (
                  <div key={ticket._id}
                    onClick={() => openMyTicket(ticket)}
                    className={`p-3 rounded-xl border cursor-pointer hover:bg-gray-100 ${
                      mySelectedTicket?._id === ticket._id ? "bg-[#103356] text-white" : ""
                    }`}
                  >
                    <h3 className="font-bold">{ticket.title}</h3>
                    <p className="text-sm truncate">{ticket.description}</p>
                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                      ticket.status === "opened" ? "bg-yellow-100 text-yellow-800" :
                      ticket.status === "assignedTo" || ticket.status === "inProgress" ? "bg-blue-100 text-blue-800" :
                      ticket.status === "resolved" ? "bg-green-100 text-green-800" :
                      ticket.status === "closed" ? "bg-gray-200 text-gray-600" : ""
                    }`}>{ticket.status}</span>
                    <p className="text-xs text-gray-400 mt-1">by: {ticket.createdBy?.name || "N/A"}</p>
                  </div>
                ))}
                {myTickets.length === 0 && (
                  <p className="text-gray-400 text-sm text-center pt-8">No tickets assigned to you</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
              <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="font-bold text-[#103356]">{mySelectedTicket?.title || "Select a ticket"}</h2>
                  <p className="text-sm text-gray-500">
                    {mySelectedTicket ? `Status: ${mySelectedTicket.status}` : ""}
                    {mySelectedTicket?.createdBy?.name ? ` · Client: ${mySelectedTicket.createdBy.name}` : ""}
                  </p>
                </div>
                {mySelectedTicket && (
                  <div className="flex gap-2 items-center">
                    <select className="text-sm border rounded-lg px-2 py-1"
                      value="" onChange={(e) => { if (e.target.value) handleMyStatusChange(mySelectedTicket._id, e.target.value); }}>
                      <option value="">Change Status...</option>
                      <option value="opened">Opened</option>
                      <option value="assignedTo">Assigned</option>
                      <option value="inProgress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-4">
                {myMessages.map((msg: any) => {
                  const isMine = msg.sender?._id === uid || msg.sender === uid;
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
                {myDocs.length > 0 && mySelectedTicket && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs text-gray-500 mb-2 font-semibold">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {myDocs.map((doc: any) =>
                        doc.file_url?.map((url: string, i: number) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer"
                            className="text-xs bg-white border rounded px-2 py-1 text-blue-600 hover:bg-blue-50">
                            📎 File {i + 1}
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {!mySelectedTicket && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Select a ticket from the left to view details and chat</p>
                  </div>
                )}
              </div>

              <div className="border-t p-4 flex-shrink-0 space-y-2">
                <div className="flex gap-3">
                  <input type="text" value={myBody} onChange={(e) => setMyBody(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleMyMessage()}
                    placeholder={mySelectedTicket?.status === "closed" ? "Chat closed" : "Type your message..."}
                    disabled={mySelectedTicket?.status === "closed"}
                    className="flex-1 border rounded-xl p-3 outline-none focus:border-[#103356] disabled:bg-gray-100 disabled:cursor-not-allowed" />
                  <button onClick={handleMyMessage} disabled={mySelectedTicket?.status === "closed"}
                    className="px-8 bg-[#103356] text-white rounded-xl hover:bg-[#1a4b79] transition disabled:opacity-50">Send</button>
                </div>
                <div className="flex items-center gap-3">
                  <input type="file" ref={myFileRef} multiple onChange={handleMyFileUpload} className="text-sm" disabled={mySelectedTicket?.status === "closed" || myUploading} />
                  {myUploading && <span className="text-xs text-gray-500">Uploading...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TICKET DETAIL MODAL ===================== */}
      {detailTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDetailTicket(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-[700px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-bold text-[#103356]">{detailTicket.title}</h2>
                <p className="text-sm text-gray-500">
                  Status: {detailTicket.status} · Created by: {detailTicket.createdBy?.name || "—"}
                  {detailTicket.assignedTo?.name ? ` · Assigned to: ${detailTicket.assignedTo.name}` : ""}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                {detailTicket.status !== "closed" && (
                  <>
                    {detailTicket.status === "assignedTo" && (
                      <button onClick={() => handleDetailStatus("inProgress")}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">Start Progress</button>
                    )}
                    {detailTicket.status === "inProgress" && (
                      <button onClick={() => handleDetailStatus("resolved")}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Resolve</button>
                    )}
                    {detailTicket.status === "resolved" && (
                      <button onClick={() => handleDetailStatus("closed")}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">Close</button>
                    )}
                  </>
                )}
                {detailTicket.status === "closed" && (
                  <button onClick={() => handleDetailStatus("opened")}
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">Reopen</button>
                )}
                <button onClick={() => setDetailTicket(null)}
                  className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">Close</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-4">
              <p className="text-sm text-gray-600"><strong>Description:</strong> {detailTicket.description}</p>
              {detailMessages.map((msg: any) => {
                const isMine = msg.sender?._id === uid || msg.sender === uid;
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
              {detailDocs.length > 0 && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {detailDocs.map((doc: any) =>
                      doc.file_url?.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer"
                          className="text-xs bg-white border rounded px-2 py-1 text-blue-600 hover:bg-blue-50">
                          File {i + 1}
                        </a>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-4 flex-shrink-0 space-y-2">
              <div className="flex gap-3">
                <input type="text" value={detailBody} onChange={(e) => setDetailBody(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDetailMessage()}
                  placeholder={detailTicket.status === "closed" ? "Chat closed" : "Type your message..."}
                  disabled={detailTicket.status === "closed"}
                  className="flex-1 border rounded-xl p-3 outline-none focus:border-[#103356] disabled:bg-gray-100 disabled:cursor-not-allowed" />
                <button onClick={handleDetailMessage} disabled={detailTicket.status === "closed"}
                  className="px-8 bg-[#103356] text-white rounded-xl hover:bg-[#1a4b79] transition disabled:opacity-50">Send</button>
              </div>
              <div className="flex items-center gap-3">
                <input type="file" ref={detailFileRef} multiple onChange={handleDetailFileUpload} className="text-sm" disabled={detailTicket.status === "closed" || detailUploading} />
                {detailUploading && <span className="text-xs text-gray-500">Uploading...</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EDIT TICKET MODAL ===================== */}
      {editTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-bold text-[#103356] mb-4">Edit Ticket</h2>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditTicket(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
              <button onClick={saveEditTicket}
                className="px-4 py-2 bg-[#103356] text-white rounded-lg text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EDIT USER MODAL ===================== */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-bold text-[#103356] mb-4">Edit User</h2>
            <form onSubmit={saveEditUser} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input value={editUserForm.name} onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  className="w-full border rounded-lg p-3 text-sm" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input type="email" value={editUserForm.email} onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  className="w-full border rounded-lg p-3 text-sm" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Role</label>
                <select value={editUserForm.role} onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                  className="w-full border rounded-lg p-3 text-sm">
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Team</label>
                <select value={editUserForm.team} onChange={(e) => {
                  const tid = e.target.value;
                  const tm = teams.find((x: any) => x._id === tid);
                  setEditUserForm({ ...editUserForm, team: tid, managerId: tm?.managerId?._id || tm?.managerId || "" });
                }}
                  className="w-full border rounded-lg p-3 text-sm">
                  <option value="">No Team</option>
                  {teams.map((t: any) => (
                    <option key={t._id} value={t._id}>
                      {t.name}{t.managerId?.name ? ` (Mgr: ${t.managerId.name})` : ""}
                    </option>
                  ))}
                </select>
                {editUserForm.managerId && (
                  <p className="text-xs text-gray-400 mt-1">Manager ID: {editUserForm.managerId}</p>
                )}
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setEditUser(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-[#103356] text-white rounded-lg text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== TEAMS ===================== */}
      {activeTab === "teams" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold text-[#103356] mb-4">Existing Teams</h2>
            {teams.length === 0 ? (
              <p className="text-gray-400 text-sm">No teams yet</p>
            ) : (
              <div className="space-y-3">
                {teams.map((t: any) => (
                  <div key={t._id} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{t.name}</p>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditTeamClick(t)}
                          className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs hover:opacity-80">Edit</button>
                        <button onClick={() => handleDeleteTeam(t._id)}
                          className="px-2 py-0.5 bg-red-500 text-white rounded text-xs hover:opacity-80">Delete</button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Manager: {t.managerId?.name || "None"} · Members: {t.number_of_team || 0}</p>
                    {t.members && t.members.length > 0 && (
                      <div className="mt-1 text-xs text-gray-400 flex flex-wrap gap-1">
                        {t.members.map((m: any) => (
                          <span key={m._id} className="px-1.5 py-0.5 bg-gray-100 rounded">{m.name} ({m.role})</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold text-[#103356] mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <input placeholder="Team Name" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                className="w-full border rounded-lg p-3 text-sm" required />
              <select value={newTeam.managerId} onChange={(e) => setNewTeam({ ...newTeam, managerId: e.target.value })}
                className="w-full border rounded-lg p-3 text-sm">
                <option value="">No Manager</option>
                {users.filter((u) => u.role === "manager" || u.role === "admin").map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              <button type="submit" className="w-full py-3 bg-[#103356] text-white rounded-lg font-semibold hover:opacity-90">Create Team</button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== EDIT TEAM MODAL ===================== */}
      {editTeam && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-bold text-[#103356] mb-4">Edit Team</h2>
            <form onSubmit={saveEditTeam} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Team Name</label>
                <input value={editTeamForm.name} onChange={(e) => setEditTeamForm({ ...editTeamForm, name: e.target.value })}
                  className="w-full border rounded-lg p-3 text-sm" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Manager</label>
                <select value={editTeamForm.managerId} onChange={(e) => setEditTeamForm({ ...editTeamForm, managerId: e.target.value })}
                  className="w-full border rounded-lg p-3 text-sm">
                  <option value="">No Manager</option>
                  {users.filter((u) => u.role === "manager" || u.role === "admin").map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setEditTeam(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-[#103356] text-white rounded-lg text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
