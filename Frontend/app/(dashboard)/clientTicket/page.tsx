"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import API_URL from "../../lib/api";

function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [docs, setDocs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function getTickets() {
      try {
        const res = await axios.get(
          API_URL + "/tickets/getTicketByUser/" + userId,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTickets(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    if (userId) getTickets();
  }, [userId]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(API_URL, { withCredentials: true });
      socketRef.current.on("connect", () => {
        if (userId) socketRef.current?.emit("join", userId);
      });
      socketRef.current.on("newMessage", (message: any) => {
        if (selectedTicket && message.ticket_id === selectedTicket._id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
    return () => {
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
    };
  }, [userId, selectedTicket]);

  async function openTicket(ticket: any) {
    setSelectedTicket(ticket);
    try {
      const [msgRes, docRes] = await Promise.all([
        axios.get(`${API_URL}/messages/ticket/${ticket._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/documents/ticket/${ticket._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMessages(msgRes.data.data);
      setDocs(docRes.data || []);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleMessage() {
    if (!token || !userId || !selectedTicket || !body.trim()) return;
    if (!selectedTicket.assignedTo) {
      alert("Ticket not assigned yet. Please wait for an agent to be assigned.");
      return;
    }
    const receiver = selectedTicket.assignedTo?._id || selectedTicket.assignedTo;
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
    if (!selectedTicket.assignedTo) {
      alert("Ticket not assigned yet.");
      return;
    }
    const receiver = selectedTicket.assignedTo?._id || selectedTicket.assignedTo;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file_url", files[i]);
    }
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

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-100 p-4 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-full">
        <div className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="flex items-center bg-gray-100 rounded-xl p-3 m-4 flex-shrink-0">
            <img src="/assets/search.png" className="w-5 h-5 mr-2" alt="" />
            <input type="text" placeholder="Search Tickets..." className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => openTicket(ticket)}
                className={`p-3 rounded-xl border cursor-pointer hover:bg-gray-100 ${
                  selectedTicket?._id === ticket._id ? "bg-[#103356] text-white" : ""
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
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="border-b p-4 flex items-center gap-3 flex-shrink-0">
            <div>
              <h2 className="font-bold text-[#103356]">{selectedTicket?.title || "Select a ticket"}</h2>
              <p className="text-sm text-gray-500">
                {selectedTicket ? `Status: ${selectedTicket.status}${!selectedTicket.assignedTo ? " (awaiting assignment)" : ""}` : ""}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-4">
            {messages.map((msg: any) => {
              const isMine = msg.sender?._id === userId || msg.sender === userId;
              return (
                <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-2 rounded-xl max-w-sm ${isMine ? "bg-[#103356] text-white" : "bg-gray-200"}`}>
                    {msg.body}
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
                      <a key={i} href={url} target="_blank" rel="noreferrer"
                        className="text-xs bg-white border rounded px-2 py-1 text-blue-600 hover:bg-blue-50">
                        📎 File {i + 1}
                      </a>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4 flex-shrink-0 space-y-2">
            <div className="flex gap-3">
              <input
                type="text" value={body} onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMessage()}
                placeholder={selectedTicket?.status === "closed" ? "Chat closed" : "Type your message..."}
                disabled={selectedTicket?.status === "closed"}
                className="flex-1 border rounded-xl p-3 outline-none focus:border-[#103356] disabled:bg-gray-100"
              />
              <button onClick={handleMessage} disabled={selectedTicket?.status === "closed"}
                className="px-8 bg-[#103356] text-white rounded-xl hover:bg-[#1a4b79] transition disabled:opacity-50">
                Send
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input type="file" ref={fileRef} multiple onChange={handleFileUpload} className="text-sm" disabled={selectedTicket?.status === "closed" || uploading} />
              {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tickets;
