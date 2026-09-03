import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, User, LogOut, GraduationCap, PhoneCall, Award } from 'lucide-react';
import { useAuth } from '../App';

export default function Sidebar({ slug }) {
  const { logout, counsellor } = useAuth();
  
  const navItems = [
    { to: `/c/${slug}`, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: `/c/${slug}/students`, label: 'My Students', icon: GraduationCap },
    { to: `/c/${slug}/assigned`, label: 'Assigned Students', icon: Users },
    { to: `/c/${slug}/enrolled`, label: 'Enrolled Students', icon: Award },
    { to: `/c/${slug}/callbacks`, label: 'Call Back Requests', icon: PhoneCall },
    { to: `/c/${slug}/profile`, label: 'My Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-blue-400">SPINFYOT<br/><span className="text-white">Counsellor</span></h1>
        <p className="text-xs text-slate-400 mt-2">Welcome, {counsellor?.name}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
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
