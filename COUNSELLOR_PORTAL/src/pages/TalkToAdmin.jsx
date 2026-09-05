import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useAuth } from "../App";
import { Send, User, Check, Loader2, MessageSquare } from "lucide-react";

export default function TalkToAdmin() {
  const { token } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);

  const fetchAdmins = async (quiet = false) => {
    if (!quiet) setLoadingList(true);
    try {
      const res = await api.get("/api/counsellor/messages/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAdmins(res.data.admins);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      if (!quiet) setLoadingList(false);
    }
  };

  const fetchMessages = async (adminId, quiet = false) => {
    if (!adminId) return;
    if (!quiet) setLoadingMessages(true);
    try {
      const res = await api.get(`/api/counsellor/messages/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      if (!quiet) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    const interval = setInterval(() => fetchAdmins(true), 15000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (selectedAdmin) {
      fetchMessages(selectedAdmin.id);
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      pollingInterval.current = setInterval(() => {
        fetchMessages(selectedAdmin.id, true);
        fetchAdmins(true);
      }, 5000);
    }
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [selectedAdmin, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedAdmin) return;
    setSending(true);
    try {
      const res = await api.post(
        `/api/counsellor/messages/${selectedAdmin.id}`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessage("");
        fetchAdmins(true);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden m-4 md:m-8">
      {/* Sidebar - Contacts */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${selectedAdmin ? "hidden md:flex" : "flex"} h-full`}>
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Support</h2>
          <p className="text-xs text-slate-500">Contact administrators</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-sm">No admins available.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {admins.map((admin) => (
                <li key={admin.id}>
                  <button
                    onClick={() => setSelectedAdmin(admin)}
                    className={`w-full text-left p-4 flex gap-3 transition-colors hover:bg-slate-50 ${selectedAdmin?.id === admin.id ? "bg-blue-50" : ""}`}
                  >
                    <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold overflow-hidden">
                      <User size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-slate-800 truncate pr-2">{admin.name}</h3>
                        {admin.lastMessage && (
                          <span className="text-xs text-slate-400 flex-shrink-0">{formatTime(admin.lastMessage.createdAt)}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate pr-2 ${admin.unreadCount > 0 ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                          {admin.lastMessage ? admin.lastMessage.content : "Start a conversation"}
                        </p>
                        {admin.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            {admin.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedAdmin ? "hidden md:flex" : "flex"} h-full bg-slate-50`}>
        {selectedAdmin ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4 shadow-sm z-10">
              <button
                className="md:hidden text-slate-500 hover:text-slate-800"
                onClick={() => setSelectedAdmin(null)}
              >
                &larr; Back
              </button>
              <div className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold overflow-hidden">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 leading-tight">{selectedAdmin.name}</h2>
                <span className="text-xs text-slate-500">Support Team</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                  <MessageSquare size={48} className="opacity-20" />
                  <p>No messages yet. Send a message to start the conversation.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isCounsellor = msg.sender === "Counsellor";
                  return (
                    <div key={msg.id} className={`flex flex-col ${isCounsellor ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isCounsellor ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"}`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] text-slate-400 font-medium">{formatTime(msg.createdAt)}</span>
                        {isCounsellor && msg.isRead && <Check size={12} className="text-blue-500" />}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[56px]"
                >
                  {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageSquare size={64} className="opacity-10 mb-4" />
            <h3 className="text-lg font-medium text-slate-500">Chat with Admin</h3>
            <p className="text-sm">Select an admin from the list to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
