import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Users, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../App';

export default function AssignCounsellor() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  
  const [activeModalId, setActiveModalId] = useState(null);
  const [selectedCounsellor, setSelectedCounsellor] = useState('');

  const fetchData = async () => {
    try {
      const [appRes, workRes] = await Promise.all([
        api.get('/api/admin/assignments/appointments', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/admin/assignments/workload', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (appRes.data.success) setAppointments(appRes.data.data);
      if (workRes.data.success) setWorkload(workRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAssign = async (appointmentId, counsellorId) => {
    try {
      await api.post('/api/admin/assignments', { appointmentId, counsellorId }, { headers: { Authorization: `Bearer ${token}` } });
      setActiveModalId(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error assigning counsellor');
    }
  };

  const handleUnassign = async (appointmentId) => {
    try {
      await api.post('/api/admin/assignments/unassign', { appointmentId }, { headers: { Authorization: `Bearer ${token}` } });
      setActiveModalId(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error unassigning counsellor');
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const term = search.toLowerCase();
    const matchesSearch = a.name.toLowerCase().includes(term) || a.email.toLowerCase().includes(term) || a.phoneNumber.includes(term);
    
    let matchesFilter = true;
    if (filter === 'Assigned') matchesFilter = a.Assignments && a.Assignments.length > 0;
    if (filter === 'Unassigned') matchesFilter = !a.Assignments || a.Assignments.length === 0;

    return matchesSearch && matchesFilter;
  });

  const getLoadText = (count) => {
    if (count > 15) return { text: 'High Load', color: 'text-red-500' };
    if (count > 8) return { text: 'Medium Load', color: 'text-amber-500' };
    return { text: 'Low Load', color: 'text-green-500' };
  };

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Assign to Counsellor</h1>
        <p className="text-slate-500 mt-2">Manage student assignments and monitor counsellor workload.</p>
      </div>

      {/* Workload Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {workload.map(c => {
          const load = getLoadText(c.assignedCount);
          return (
            <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <UserCheck size={20} />
                </div>
                <h3 className="font-semibold text-slate-900">{c.name}</h3>
              </div>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-sm text-slate-500">Assigned</p>
                  <p className="text-2xl font-bold text-slate-900">{c.assignedCount}</p>
                </div>
                <div className={`text-sm font-medium ${load.color}`}>
                  {load.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search students by name, email, or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Appointments</option>
          <option value="Unassigned">Unassigned Only</option>
          <option value="Assigned">Assigned Only</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Student Info</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Appointment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Assignment Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No appointments found.</td></tr>
            ) : (
              filteredAppointments.map(a => {
                const assignment = a.Assignments && a.Assignments.length > 0 ? a.Assignments[0] : null;
                const isAssigned = !!assignment;

                return (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{a.name}</div>
                      <div className="text-sm text-slate-500">{a.email}</div>
                      <div className="text-sm text-slate-500">{a.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{new Date(a.createdAt).toLocaleDateString()}</div>
                      <div className="text-sm text-slate-500">{a.classType || 'General Consultation'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {isAssigned ? (
                        <div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Assigned
                          </span>
                          <div className="text-sm text-slate-700 mt-1 font-medium">To: {assignment.Counsellor?.name}</div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {activeModalId === a.id ? (
                        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-lg relative z-10">
                          <select 
                            value={selectedCounsellor}
                            onChange={(e) => setSelectedCounsellor(e.target.value)}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                          >
                            <option value="">Select Counsellor</option>
                            {workload.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <button 
                            onClick={() => {
                              if (selectedCounsellor) handleAssign(a.id, selectedCounsellor);
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                          >
                            Save
                          </button>
                          {isAssigned && (
                            <button 
                              onClick={() => handleUnassign(a.id)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-sm font-medium rounded-lg"
                            >
                              Unassign
                            </button>
                          )}
                          <button 
                            onClick={() => setActiveModalId(null)}
                            className="px-2 py-1.5 text-slate-400 hover:text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setActiveModalId(a.id); setSelectedCounsellor(assignment?.counsellorId || ''); }}
                          className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-700 text-sm font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 ml-auto"
                        >
                          {isAssigned ? 'Reassign' : 'Assign'} <ChevronDown size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
