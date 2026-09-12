import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, HelpCircle, FileText, Star, MessageSquare, Target, UserCheck, Search, SearchX, MousePointerClick, Filter } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const { token } = useAuth();
  
  // Dashboard Stats
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalAppointments: 0,
    newAppointments: 0,
    todaysAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalContacts: 0,
    totalQuestions: 0,
    publishedBlogs: 0,
    activeTestimonials: 0,
    interestStats: {
      mostInterested: 0,
      midInterested: 0,
      leastInterested: 0
    }
  });

  // Website Analytics State
  const [analyticsDays, setAnalyticsDays] = useState(30);
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    pageViews: 0,
    interactions: 0,
    leadsGenerated: 0,
    traffic: [],
    topInteractions: [],
    topPages: [],
    funnel: {}
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await api.get('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [token]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      try {
        const res = await api.get(`/api/admin/analytics?days=${analyticsDays}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, [token, analyticsDays]);

  const leadCards = [
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-100' },
    { label: 'Most Interested', value: stats?.interestStats?.mostInterested || 0, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
    { label: 'Mid Interested', value: stats?.interestStats?.midInterested || 0, icon: Search, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    { label: 'Least Interested', value: stats?.interestStats?.leastInterested || 0, icon: SearchX, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
  ];

  const apptCards = [
    { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'New Appointments', value: stats?.newAppointments || 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Today\'s Appts', value: stats?.todaysAppointments || 0, icon: HelpCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Upcoming Appts', value: stats?.upcomingAppointments || 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const analyticsOverview = [
    { label: 'Total Visitors', value: analytics?.totalVisitors || 0 },
    { label: 'Page Views', value: analytics?.pageViews || 0 },
    { label: 'Interactions', value: analytics?.interactions || 0 },
    { label: 'Leads Generated', value: analytics?.leadsGenerated || 0 },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back to Spinfyot Admin Panel.</p>
        </div>
      </div>
      
      {/* ========================================== */}
      {/* LEAD OVERVIEW */}
      {/* ========================================== */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Lead Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {leadCards.map((card, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-5 hover:shadow-md transition-shadow ${card.border}`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
              <card.icon size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{card.label}</p>
              <p className={`text-3xl font-bold mt-1 ${card.color.replace('text-', 'text-').replace('600', '700')}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* APPOINTMENTS */}
      {/* ========================================== */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Leads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {apptCards.map((card, idx) => (
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

      {/* ========================================== */}
      {/* WEBSITE ANALYTICS */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-10">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MousePointerClick className="text-blue-500" />
            Website Analytics
          </h2>
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={analyticsDays}
              onChange={(e) => setAnalyticsDays(parseInt(e.target.value))}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              <option value={1}>Today</option>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
        </div>

        {loadingAnalytics ? (
          <div className="p-12 text-center text-slate-400">Loading analytics data...</div>
        ) : (
          <div className="p-6">
            
            {/* Analytics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {analyticsOverview.map((item, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <p className="text-slate-500 text-sm font-medium mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{item.value.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Traffic Chart */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Website Visitors</h3>
              <div className="h-72 w-full">
                {(analytics?.traffic || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics?.traffic || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                      />
                      <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No website analytics data yet.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top Interactions */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Top Website Interactions</h3>
                {(analytics?.topInteractions || []).length > 0 ? (
                  <div className="space-y-3">
                    {(analytics?.topInteractions || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-sm font-medium text-slate-700 truncate mr-3">{item.action}</span>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No interactions recorded.</p>
                )}
              </div>

              {/* Most Visited Pages */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Most Visited Pages</h3>
                {(analytics?.topPages || []).length > 0 ? (
                  <div className="space-y-3">
                    {(analytics?.topPages || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-sm font-medium text-slate-700 truncate mr-3">{item.page}</span>
                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No page views recorded.</p>
                )}
              </div>

              {/* Lead Conversion Funnel */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Lead Conversion Funnel</h3>
                {analytics.totalVisitors > 0 ? (
                  <div className="space-y-2">
                      {[
                        { label: 'Website Visitors', value: analytics.funnel?.visitors || 0, color: 'bg-slate-100', width: '100%' },
                        { label: 'CTA Clicks', value: analytics.funnel?.ctaClicks || 0, color: 'bg-blue-100', width: `${Math.max(15, Math.min(100, ((analytics.funnel?.ctaClicks || 0) / (analytics.funnel?.visitors || 1)) * 100))}%` },
                        { label: 'Forms Started', value: analytics.funnel?.formsStarted || 0, color: 'bg-indigo-100', width: `${Math.max(15, Math.min(100, ((analytics.funnel?.formsStarted || 0) / (analytics.funnel?.visitors || 1)) * 100))}%` },
                        { label: 'Forms Submitted', value: analytics.funnel?.formsSubmitted || 0, color: 'bg-purple-100', width: `${Math.max(15, Math.min(100, ((analytics.funnel?.formsSubmitted || 0) / (analytics.funnel?.visitors || 1)) * 100))}%` },
                        { label: 'Leads Generated', value: analytics.funnel?.leadsGenerated || 0, color: 'bg-green-100', width: `${Math.max(15, Math.min(100, ((analytics.funnel?.leadsGenerated || 0) / (analytics.funnel?.visitors || 1)) * 100))}%` },
                      ].map((step, idx) => (
                      <div key={idx} className="relative h-10 w-full bg-slate-50 rounded-lg overflow-hidden flex items-center border border-slate-100">
                        <div className={`absolute top-0 left-0 h-full ${step.color} transition-all duration-1000`} style={{ width: step.width }}></div>
                        <div className="relative w-full px-3 flex justify-between items-center z-10">
                          <span className="text-xs font-semibold text-slate-700">{step.label}</span>
                          <span className="text-sm font-bold text-slate-800">{step.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Not enough data for funnel.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
