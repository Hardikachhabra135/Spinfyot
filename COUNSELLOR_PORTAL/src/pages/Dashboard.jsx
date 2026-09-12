import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { API_BASE_URL } from '../utils/api';
import { Users, TrendingUp, PhoneCall, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { token, counsellor } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    newStudents: 0,
    pendingCallbacks: 0,
    enrolledStudents: 0,
    upcomingCallbacks: []
  });
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, assignRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/counsellor/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/counsellor/assigned-students`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const dashData = await dashRes.json();
        const assignData = await assignRes.json();

        if (dashData.success) {
          setStats(dashData.data);
        }

        if (assignData.success) {
          // Filter assignments that have a reminderDate or nextFollowUp that is >= today
          const today = new Date();
          today.setHours(0,0,0,0);
          
          const upcoming = assignData.data.filter(a => {
            if (a.counsellorStatus === 'Converted' || a.counsellorStatus === 'Closed') return false;
            if (a.reminderDate && new Date(a.reminderDate) >= today) return true;
            if (a.nextFollowUp && new Date(a.nextFollowUp) >= today) return true;
            return false;
          });
          
          // Sort by date (closest first)
          upcoming.sort((a, b) => {
            const dateA = a.reminderDate ? new Date(a.reminderDate) : new Date(a.nextFollowUp);
            const dateB = b.reminderDate ? new Date(b.reminderDate) : new Date(b.nextFollowUp);
            return dateA - dateB;
          });
          
          setReminders(upcoming);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <div className="p-8 text-slate-500">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {counsellor?.name?.toUpperCase()}</h1>
        <p className="text-slate-500 mt-2">Here is your student pipeline overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">New Students</p>
              <p className="text-2xl font-bold text-slate-900">{stats.newStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <PhoneCall size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Call Backs</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingCallbacks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Enrolled Students</p>
              <p className="text-2xl font-bold text-slate-900">{stats.enrolledStudents}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PhoneCall size={20} className="text-amber-500" /> Upcoming Call Backs
            </h2>
            <Link to={`/c/${counsellor?.slug}/callbacks`} className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
          </div>
          <div className="p-0">
            {stats.upcomingCallbacks.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No upcoming callbacks scheduled.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {stats.upcomingCallbacks.map((student) => (
                  <li key={student.id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{student.name}</p>
                      <p className="text-sm text-slate-500 mt-1">{student.phone} • {student.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-semibold">
                        <Clock size={16} />
                        {student.callbackTime ? new Date(student.callbackTime).toLocaleString() : 'ASAP'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link 
                to={`/c/${counsellor?.slug}/students`}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl transition-all group"
              >
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-blue-700">Add New Student</p>
                  <p className="text-sm text-slate-500">Create a new student profile</p>
                </div>
                <div className="text-blue-600 bg-white p-2 rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users size={20} />
                </div>
              </Link>
              
              <Link 
                to={`/c/${counsellor?.slug}/callbacks`}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 rounded-xl transition-all group"
              >
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-amber-700">Resolve Call Backs</p>
                  <p className="text-sm text-slate-500">View your pending call queue</p>
                </div>
                <div className="text-amber-600 bg-white p-2 rounded-lg shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <PhoneCall size={20} />
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock size={20} className="text-indigo-500" /> Upcoming Reminders
              </h2>
              <Link to={`/c/${counsellor?.slug}/assigned-students`} className="text-sm text-blue-600 font-medium hover:underline">View Assigned</Link>
            </div>
            <div className="p-0">
              {reminders.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No upcoming reminders or follow-ups.</div>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                  {reminders.map((a) => {
                    const student = a.Appointment;
                    if(!student) return null;
                    const dateToShow = a.reminderDate ? new Date(a.reminderDate).toLocaleDateString() : new Date(a.nextFollowUp).toLocaleString();
                    const isToday = new Date(dateToShow).toDateString() === new Date().toDateString();
                    return (
                      <li key={a.id} className="p-5 hover:bg-slate-50 transition-colors flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-sm text-slate-500 mt-1">Status: {a.counsellorStatus}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${isToday ? 'bg-red-100 text-red-700' : 'bg-indigo-50 text-indigo-700'}`}>
                            {isToday ? 'TODAY' : dateToShow}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
