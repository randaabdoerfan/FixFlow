"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../lib/api";
import { useRouter } from "next/navigation";

interface Document {
    _id: string;
    file_url: string[];
    sender: { name: string; _id: string };
    receiver: { name: string; _id: string };
    ticket_id: { title: string; _id: string };
}

function Documents() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    useEffect(() => {
        if (!token) return;
        const endpoint = role === "admin"
            ? API_URL + "/documents"
            : API_URL + "/documents/my";

        axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setDocuments(Array.isArray(res.data) ? res.data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token, role]);

    return (
        <div className="p-6 align-baseline">
        <h1 className="text-2xl font-bold text-[#103356] mb-6">Documents</h1>
            <div className="flex justify-center">
                
                {loading ? (
                    <p className="text-gray-500">Loading documents...</p>
                ) : documents.length === 0 ? (
                    <p className="text-gray-500">No documents found.</p>
                ) : (
                    <div className="relative overflow-x-auto shadow-sm rounded-xl">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Ticket</th>
                                    <th className="px-6 py-3">Sender</th>
                                    <th className="px-6 py-3">Receiver</th>
                                    <th className="px-6 py-3">Files</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map(doc => (
                                    <tr key={doc._id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            {doc.ticket_id?.title || "—"}
                                        </td>
                                        <td className="px-6 py-4">{doc.sender?.name || "—"}</td>
                                        <td className="px-6 py-4">{doc.receiver?.name || "—"}</td>
                                        <td className="px-6 py-4">
                                            {doc.file_url?.map((url, i) => (
                                                <a key={i} href={url} target="_blank" rel="noreferrer"
                                                    className="text-blue-600 underline mr-2 block">
                                                    📎 File {i + 1}
                                                </a>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            </div>

    );
}

export default Documents;
