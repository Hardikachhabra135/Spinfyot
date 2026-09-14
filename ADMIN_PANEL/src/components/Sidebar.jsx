import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, HelpCircle, Star, FileText, LogOut, Share2, Briefcase, Plus, BookOpen } from "lucide-react";
import { useAuth } from "../App";
import api from "../utils/api";
import AddStudentModal from "./AddStudentModal";

export default function Sidebar() {
  const { logout, token } = useAuth();
  const [unreadDirect, setUnreadDirect] = useState(0);
  const [unreadEveryone, setUnreadEveryone] = useState(0);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let interval;
    if (token) {
      const fetchUnread = async () => {
        try {
          const res = await api.get("/api/admin/messages/unread-count", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            setUnreadDirect(res.data.directUnread || 0);
            setUnreadEveryone(res.data.everyoneUnread || 0);
          }
        } catch (error) {
          // silently fail
        }

        try {
          const contactRes = await api.get('/api/admin/contact-forms?status=NEW', { headers: { Authorization: `Bearer ${token}` } });
          if (contactRes.data.success) {
            setUnreadContacts(contactRes.data.data.length);
          }
        } catch (error) {
          // silently fail
        }
      };

      fetchUnread();
      interval = setInterval(fetchUnread, 10000);
    }
    return () => clearInterval(interval);
  }, [token, location.pathname]);

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/appointments", label: "Leads", icon: Users },
    { to: "/contact-forms", label: "Contact Forms", icon: BookOpen, badge: unreadContacts },
    { to: "/assign-counsellor", label: "Assign to Counsellor", icon: Briefcase },
    { to: "/questions", label: "Ask a Question", icon: HelpCircle },
    { to: "/testimonials", label: "Testimonials", icon: Star },
    { to: "/blogs", label: "Blogs", icon: FileText },
    { to: "/influencer-links", label: "Influencer Links", icon: Share2 },
    { to: "/counsellors", label: "Counsellors", icon: Users },
    { to: "/chat", label: "Talk to Counselor", icon: MessageSquare, badge: unreadDirect },
    { to: "/everyone-chat", label: "Everyone", icon: Users, badge: unreadEveryone },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <div className="flex flex-col gap-3">
          <div className="bg-white/95 p-3 rounded-xl shadow-inner inline-block">
            <img src="/logo.png" alt="SPINFYOT Logo" className="w-48 object-contain" />
          </div>
          <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase ml-1">Admin Panel</h2>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <button
          onClick={() => setIsAddStudentOpen(true)}
          className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-white w-full"
        >
          <div className="flex items-center gap-3">
            <Plus size={20} />
            <span className="font-medium">Add New Student</span>
          </div>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

      <AddStudentModal 
        isOpen={isAddStudentOpen} 
        onClose={() => setIsAddStudentOpen(false)} 
        token={token}
        onSuccess={(student) => {
          // If we need to trigger a refresh of appointments/students
          // A simple window event can be used if they're listening
          // Or they will see it when they navigate to Assign to Counsellor
          const event = new CustomEvent('studentAdded', { detail: student });
          window.dispatchEvent(event);
        }}
      />
    </div>
  );
}
