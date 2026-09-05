import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Calendar, MapPin, Clock, Edit, UserPlus } from 'lucide-react';
import { useAuth } from '../App';
import { API_BASE_URL } from '../utils/api';

export default function AssignedStudents() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeModal, setActiveModal] = useState(null);
  const [editData, setEditData] = useState({ counsellorStatus: '', counsellorNote: '', nextFollowUp: '' });

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/assigned-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [token]);

  const handleAddToMyStudents = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/assigned-students/${id}/add-to-mystudents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('Student successfully added to your My Students list!');
        fetchAssignments();
      } else {
        alert(data.error || 'Failed to add student');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding student');
    }
  };

  const openManageModal = (assignment) => {
    setActiveModal(assignment);
    setEditData({
      counsellorStatus: assignment.counsellorStatus || 'New',
      counsellorNote: assignment.counsellorNote || '',
      nextFollowUp: assignment.nextFollowUp ? new Date(assignment.nextFollowUp).toISOString().slice(0, 16) : ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/assigned-students/${activeModal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (data.success) {
        setActiveModal(null);
        fetchAssignments();
      } else {
        alert(data.error || 'Failed to update');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating assignment');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Assigned Students...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Users className="text-blue-600" /> Assigned Students
        </h1>
        <p className="text-slate-500 mt-2">Students assigned to you by the Admin team.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No students have been assigned to you yet.</p>
          </div>
        ) : (
          assignments.map(a => {
            const student = a.Appointment;
            if (!student) return null;
            return (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-2 ${
                        a.counsellorStatus === 'New' ? 'bg-blue-100 text-blue-800' :
                        a.counsellorStatus === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                        a.counsellorStatus === 'Converted' ? 'bg-green-100 text-green-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {a.counsellorStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="text-slate-400" /> {student.phoneNumber}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail size={16} className="text-slate-400" /> {student.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Calendar size={16} className="text-slate-400" /> Appt: {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                    {student.classType && (
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <MapPin size={16} className="text-slate-400" /> {student.classType}
                      </div>
                    )}
                  </div>

                  {a.nextFollowUp && (
                    <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                        <Clock size={14} /> Next Follow-up
                      </div>
                      <div className="text-sm font-medium text-slate-700">
                        {new Date(a.nextFollowUp).toLocaleString()}
                      </div>
                    </div>
                  )}

                  {a.counsellorStatus !== 'Converted' && (
                    <button
                      onClick={() => handleAddToMyStudents(a.id)}
                      className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <UserPlus size={16} /> Add to My Students
                    </button>
                  )}
                </div>
                <div className="p-4 bg-slate-50 flex gap-2">
                  <a 
                    href={`tel:${student.phoneNumber}`}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors text-center shadow-sm"
                  >
                    Call
                  </a>
                  <a 
                    href={`mailto:${student.email}`}
                    className="flex-1 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors text-center shadow-sm"
                  >
                    Email
                  </a>
                  <button 
                    onClick={() => openManageModal(a)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> Manage
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manage Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Student: {activeModal.Appointment?.name}</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={editData.counsellorStatus} 
                  onChange={e => setEditData({...editData, counsellorStatus: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Application Started">Application Started</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Next Follow-up (Optional)</label>
                <input 
                  type="datetime-local" 
                  value={editData.nextFollowUp} 
                  onChange={e => setEditData({...editData, nextFollowUp: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Counsellor Notes</label>
                <textarea 
                  rows="4" 
                  value={editData.counsellorNote} 
                  onChange={e => setEditData({...editData, counsellorNote: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Keep track of conversations here..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
