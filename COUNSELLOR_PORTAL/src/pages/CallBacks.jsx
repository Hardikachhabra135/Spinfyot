import React, { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle, CalendarClock } from 'lucide-react';
import { useAuth } from '../App';

export default function CallBacks() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule State
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/counsellor/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Filter only those who requested a callback
        const callbacks = data.data.filter(s => s.callbackRequested === true);
        // Sort by callbackTime ascending (closest first)
        callbacks.sort((a, b) => new Date(a.callbackTime) - new Date(b.callbackTime));
        setStudents(callbacks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const markResolved = async (id) => {
    if (!window.confirm("Mark this call back as resolved?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/counsellor/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ callbackRequested: false })
      });
      const data = await res.json();
      if (data.success) {
        fetchStudents();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openReschedule = (student) => {
    setSelectedStudent(student);
    setNewTime('');
    setNewNotes(student.notes || '');
    setIsRescheduleOpen(true);
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/counsellor/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          callbackRequested: true, 
          callbackTime: newTime,
          notes: newNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsRescheduleOpen(false);
        fetchStudents();
        alert("Call back rescheduled successfully!");
      } else {
        alert(data.error || "Failed to reschedule.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <PhoneCall className="text-amber-500" /> Call Back Requests
          </h1>
          <p className="text-slate-500 mt-2">Students waiting for a call back.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Student Info</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Notes</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Requested Time</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No pending call back requests.</td>
              </tr>
            ) : (
              students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="text-sm text-slate-500">{s.email}</div>
                    <div className="text-sm text-slate-500 font-medium text-blue-600">{s.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 max-w-[200px] whitespace-normal">
                    {s.notes || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-semibold w-fit border border-amber-100">
                      <PhoneCall size={16} />
                      {s.callbackTime ? new Date(s.callbackTime).toLocaleString() : 'ASAP'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openReschedule(s)}
                        className="p-2 px-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 border border-slate-200 hover:border-blue-200 bg-white"
                        title="Reschedule Call Back"
                      >
                        <CalendarClock size={16} />
                        <span className="text-sm font-medium">Reschedule</span>
                      </button>
                      <button 
                        onClick={() => markResolved(s.id)}
                        className="p-2 px-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                        title="Mark as Resolved"
                      >
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Resolve</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Reschedule Call Back</h2>
            <p className="text-sm text-slate-500 mb-6">Scheduling another call for <strong>{selectedStudent.name}</strong></p>
            
            <form onSubmit={handleReschedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Date & Time *</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Update Notes (Optional)</label>
                <textarea 
                  rows="3" 
                  value={newNotes} 
                  onChange={(e) => setNewNotes(e.target.value)} 
                  placeholder="e.g. Student was busy, requested call back tomorrow..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsRescheduleOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
