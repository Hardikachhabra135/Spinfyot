import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, HelpCircle, Star, FileText, LogOut, Share2, Briefcase } from "lucide-react";
import { useAuth } from "../App";
import api from "../utils/api";

export default function Sidebar() {
  const { logout, token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
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
            setUnreadCount(res.data.count);
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
    { to: "/appointments", label: "Appointments", icon: Users },
    { to: "/assign-counsellor", label: "Assign to Counsellor", icon: Briefcase },
    { to: "/questions", label: "Ask a Question", icon: HelpCircle },
    { to: "/testimonials", label: "Testimonials", icon: Star },
    { to: "/blogs", label: "Blogs", icon: FileText },
    { to: "/influencer-links", label: "Influencer Links", icon: Share2 },
    { to: "/counsellors", label: "Counsellors", icon: Users },
    { to: "/chat", label: "Talk to Counselor", icon: MessageSquare, badge: unreadCount },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">SPINFYOT<span className="text-white">Admin</span></h1>
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
    </div>
  );
}
