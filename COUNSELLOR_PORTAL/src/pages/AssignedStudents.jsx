import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Calendar, MapPin, Clock, Edit, UserPlus, Filter, Download, PlusCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../App';
import { API_BASE_URL } from '../utils/api';

export default function AssignedStudents() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterInterest, setFilterInterest] = useState('All');

  const [activeModal, setActiveModal] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    counsellorStatus: '', counsellorNote: '', nextFollowUp: '', 
    interestLevel: '', reminderDate: ''
  });

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

  const fetchUnassignedLeads = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/unassigned-leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUnassignedLeads(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [token]);

  const handleClaimLead = async (appointmentId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/claim-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ appointmentId })
      });
      const data = await res.json();
      if (data.success) {
        alert('Lead claimed successfully!');
        fetchAssignments();
        fetchUnassignedLeads();
      } else {
        alert(data.error || 'Failed to claim lead');
      }
    } catch (error) {
      console.error(error);
      alert('Error claiming lead');
    }
  };

  const handleDownloadReport = () => {
    if (assignments.length === 0) {
      alert("No data to download.");
      return;
    }
    const headers = ["Student Name", "Phone", "Email", "Status", "Interest Level", "Reminder Date", "Notes"];
    const rows = assignments.map(a => [
      a.Appointment?.name || 'N/A',
      a.Appointment?.phoneNumber || 'N/A',
      a.Appointment?.email || 'N/A',
      a.counsellorStatus || 'N/A',
      a.interestLevel || 'N/A',
      a.reminderDate ? new Date(a.reminderDate).toLocaleDateString() : 'N/A',
      (a.counsellorNote || '').replace(/,/g, ' ')
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "counsellor_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      counsellorStatus: assignment.counsellorStatus || '',
      counsellorNote: assignment.counsellorNote || '',
      nextFollowUp: assignment.nextFollowUp ? new Date(assignment.nextFollowUp).toISOString().slice(0, 16) : '',
      interestLevel: assignment.interestLevel || '',
      reminderDate: assignment.reminderDate || ''
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

  const normalizeInterest = (val) => {
    if (!val) return '';
    const s = val.toLowerCase().replace(/_|-/g, ' ');
    if (s.includes('most')) return 'Most Interested';
    if (s.includes('mid')) return 'Mid Interested';
    if (s.includes('least')) return 'Least Interested';
    return val;
  };

  const filteredAssignments = assignments.filter(a => {
    if (filterInterest === 'All') return true;
    return normalizeInterest(a.interestLevel) === filterInterest;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" /> Assigned Students
          </h1>
          <p className="text-slate-500 mt-2">Students assigned to you by the Admin team.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={filterInterest} 
              onChange={e => setFilterInterest(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="All">All Interests</option>
              <option value="Most Interested">Most Interested</option>
              <option value="Mid Interested">Mid Interested</option>
              <option value="Least Interested">Least Interested</option>
            </select>
          </div>
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={16} /> Report
          </button>
          <button 
            onClick={() => { setIsClaimModalOpen(true); fetchUnassignedLeads(); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <PlusCircle size={16} /> Add Assigned Lead
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No students found matching your criteria.</p>
          </div>
        ) : (
          filteredAssignments.map(a => {
            const student = a.Appointment;
            if (!student) return null;
            return (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          a.counsellorStatus === 'New' ? 'bg-blue-100 text-blue-800' :
                          a.counsellorStatus === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                          a.counsellorStatus === 'Converted' ? 'bg-green-100 text-green-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {a.counsellorStatus}
                        </span>
                        {a.interestLevel && (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            normalizeInterest(a.interestLevel) === 'Most Interested' ? 'bg-green-100 text-green-800' :
                            normalizeInterest(a.interestLevel) === 'Mid Interested' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {normalizeInterest(a.interestLevel)}
                          </span>
                        )}
                      </div>
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

                  {a.reminderDate && (
                    <div className="mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">
                        <Calendar size={14} /> Reminder Date
                      </div>
                      <div className="text-sm font-medium text-slate-700">
                        {new Date(a.reminderDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {a.nextFollowUp && (
                    <div className="mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
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
                  {student.email && student.email.trim() !== '' ? (
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${student.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors text-center shadow-sm flex items-center justify-center"
                    >
                      Email
                    </a>
                  ) : (
                    <div className="flex-1 relative group flex items-stretch">
                      <button 
                        disabled
                        className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-400 text-sm font-medium rounded-xl cursor-not-allowed shadow-sm flex items-center justify-center"
                      >
                        Email
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs px-2 py-1 bg-slate-800 text-white text-xs rounded z-10 text-center shadow-lg">
                        No email address available.
                      </div>
                    </div>
                  )}
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
            
            <form onSubmit={handleUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Interest Level</label>
                  <select 
                    value={editData.interestLevel} 
                    onChange={e => setEditData({...editData, interestLevel: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Level</option>
                    <option value="Most Interested">Most Interested</option>
                    <option value="Mid Interested">Mid Interested</option>
                    <option value="Least Interested">Least Interested</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reminder Date</label>
                  <input 
                    type="date" 
                    value={editData.reminderDate} 
                    onChange={e => setEditData({...editData, reminderDate: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Next Follow-up (Time)</label>
                  <input 
                    type="datetime-local" 
                    value={editData.nextFollowUp} 
                    onChange={e => setEditData({...editData, nextFollowUp: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Counsellor Notes</label>
                <textarea 
                  rows="3" 
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
      {/* Claim Lead Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Claim Unassigned Lead</h2>
            <p className="text-slate-500 mb-6 text-sm">Select an available lead to assign it to yourself.</p>
            
            {unassignedLeads.length === 0 ? (
              <div className="p-8 text-center border rounded-xl bg-slate-50">
                <p className="text-slate-500">No unassigned leads available at the moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unassignedLeads.map(lead => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-800">{lead.name}</h4>
                      <div className="text-sm text-slate-500 flex gap-4 mt-1">
                        <span><Phone size={14} className="inline mr-1" />{lead.phoneNumber}</span>
                        <span><Mail size={14} className="inline mr-1" />{lead.email}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleClaimLead(lead.id)}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle size={16} /> Claim
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsClaimModalOpen(false)} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
