import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useAuth } from "../App";
import { Send, Search, User, Clock, Check, Loader2, MessageSquare } from "lucide-react";

export default function TalkToCounselor() {
  const { token } = useAuth();
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);

  // Fetch list of counsellors
  const fetchCounsellors = async (quiet = false) => {
    if (!quiet) setLoadingList(true);
    try {
      const res = await api.get("/api/admin/messages/counsellors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setCounsellors(res.data.counsellors);
      }
    } catch (error) {
      console.error("Failed to fetch counsellors:", error);
    } finally {
      if (!quiet) setLoadingList(false);
    }
  };

  // Fetch messages for selected counsellor
  const fetchMessages = async (counsellorId, quiet = false) => {
    if (!counsellorId) return;
    if (!quiet) setLoadingMessages(true);
    try {
      const res = await api.get(`/api/admin/messages/${counsellorId}`, {
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
    fetchCounsellors();
    // Poll for new conversations/unread counts
    const interval = setInterval(() => fetchCounsellors(true), 15000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (selectedCounsellor) {
      fetchMessages(selectedCounsellor.id);
      
      // Setup active chat polling
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      pollingInterval.current = setInterval(() => {
        fetchMessages(selectedCounsellor.id, true);
        fetchCounsellors(true); // Update left sidebar unread badges too
      }, 5000);
    }
    
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [selectedCounsellor, token]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedCounsellor) return;

    setSending(true);
    try {
      const res = await api.post(
        `/api/admin/messages/${selectedCounsellor.id}`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessage("");
        fetchCounsellors(true); // Update last message in sidebar
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const filteredCounsellors = counsellors.filter(c => 
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.counsellorId || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-full flex-col md:flex-row bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden m-4 md:m-8">
      {/* Sidebar - Contacts */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${selectedCounsellor ? "hidden md:flex" : "flex"} h-full`}>
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Conversations</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search counselors..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : filteredCounsellors.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-sm">No counselors found.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredCounsellors.map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedCounsellor(c)}
                    className={`w-full text-left p-4 flex gap-3 transition-colors hover:bg-slate-50 ${selectedCounsellor?.id === c.id ? "bg-blue-50" : ""}`}
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold overflow-hidden">
                      {c.profileImage ? (
                        <img src={`/uploads/counsellors/${c.profileImage}`} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        (c.name || "C").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-slate-800 truncate pr-2">{c.name}</h3>
                        {c.lastMessage && (
                          <span className="text-xs text-slate-400 flex-shrink-0">
                            {formatTime(c.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate pr-2 ${c.unreadCount > 0 ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                          {c.lastMessage ? c.lastMessage.content : "Start a conversation"}
                        </p>
                        {c.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            {c.unreadCount}
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
      <div className={`flex-1 flex flex-col ${!selectedCounsellor ? "hidden md:flex" : "flex"} h-full bg-slate-50`}>
        {selectedCounsellor ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button 
                  className="md:hidden text-slate-500 hover:text-slate-800"
                  onClick={() => setSelectedCounsellor(null)}
                >
                  &larr; Back
                </button>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold overflow-hidden">
                  {selectedCounsellor.profileImage ? (
                    <img src={`/uploads/counsellors/${selectedCounsellor.profileImage}`} alt={selectedCounsellor.name} className="w-full h-full object-cover" />
                  ) : (
                    (selectedCounsellor.name || "C").charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 leading-tight">{selectedCounsellor.name}</h2>
                  <span className="text-xs text-slate-500">{selectedCounsellor.specialization || "Counselor"} • ID: {selectedCounsellor.counsellorId}</span>
                </div>
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
                messages.map((msg, index) => {
                  const isAdmin = msg.sender === "Admin";
                  const showAvatar = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;
                  
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isAdmin ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"}`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] text-slate-400 font-medium">{formatTime(msg.createdAt)}</span>
                        {isAdmin && msg.isRead && (
                          <Check size={12} className="text-blue-500" />
                        )}
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
            <h3 className="text-lg font-medium text-slate-500">Talk to Counselor</h3>
            <p className="text-sm">Select a counselor from the list to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}

