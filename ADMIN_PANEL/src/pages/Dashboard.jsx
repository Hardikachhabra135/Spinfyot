import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, FileText, Star, TrendingUp, HelpCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../App';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    newAppointments: 0,
    totalContacts: 0,
    totalQuestions: 0,
    publishedBlogs: 0,
    activeTestimonials: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, [token]);

  const statCards = [
    { label: 'Total Appointments', value: stats.totalAppointments, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'New Appointments', value: stats.newAppointments, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Contact Messages', value: stats.totalContacts, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Questions Asked', value: stats.totalQuestions, icon: HelpCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Published Blogs', value: stats.publishedBlogs, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Active Testimonials', value: stats.activeTestimonials, icon: Star, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back to Spinfyot Admin Panel.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
              <card.icon size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{card.label}</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Website Analytics (Clicks/Interactions)</h2>
        <div className="flex items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Analytics Chart Placeholder (Recharts)
        </div>
      </div>
    </div>
  );
}
