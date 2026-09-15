import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../App';
import { Download, Search, Trash2 } from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const [deleteModal, setDeleteModal] = useState({ show: false, step: 1, id: null });

  const initiateDelete = (id) => {
    setDeleteModal({ show: true, step: 1, id });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, step: 1, id: null });
  };

  const confirmDeleteStep1 = () => {
    setDeleteModal(prev => ({ ...prev, step: 2 }));
  };

  const confirmDeleteStep2 = async () => {
    try {
      const res = await api.delete(`/api/admin/contacts/${deleteModal.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setInquiries(inquiries.filter(app => app.id !== deleteModal.id));
        alert("Entry deleted successfully.");
      } else {
        alert("Unable to delete entry. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to delete entry. Please try again.");
    }
    cancelDelete();
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/api/admin/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setInquiries(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/contacts/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(inquiries.map(app => app.id === id ? { ...app, status } : app));
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = inquiries.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    if (inquiries.length === 0) return alert("No data to export");
    
    const headers = ['Name', 'Phone', 'Email', 'State', 'Country', 'Qualification', 'Course', 'Service', 'Date', 'Status'];
    
    const csvRows = [headers.join(',')];
    
    inquiries.forEach(item => {
      let state = 'N/A';
      let country = 'N/A';
      let qual = 'N/A';
      let course = 'N/A';

      if (item.message && item.message.includes('State:')) {
        const parts = item.message.split(' | ');
        parts.forEach(part => {
          if (part.startsWith('State:')) state = part.replace('State:', '').trim();
          if (part.startsWith('Country:')) country = part.replace('Country:', '').trim();
          if (part.startsWith('Qualification:')) qual = part.replace('Qualification:', '').trim();
          if (part.startsWith('Course:')) course = part.replace('Course:', '').trim();
        });
      }

      const row = [
        `"${item.name || ''}"`,
        `"${item.phone || ''}"`,
        `"${item.email || ''}"`,
        `"${state}"`,
        `"${country}"`,
        `"${qual}"`,
        `"${course}"`,
        `"${item.interest || ''}"`,
        `"${new Date(item.createdAt).toLocaleString()}"`,
        `"${item.status || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `contact_forms_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-full box-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Contact Forms</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            Total Submissions: {inquiries.length}
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold whitespace-nowrap">Name & Contact</th>
                <th className="p-4 font-semibold whitespace-nowrap">Location (State/Country)</th>
                <th className="p-4 font-semibold min-w-[150px]">Academics (Qual/Course)</th>
                <th className="p-4 font-semibold min-w-[150px]">Service</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date/Time</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No Contact Enquiries Yet</td></tr>
              ) : (
                filtered.map(item => {
                  let state = 'N/A';
                  let country = 'N/A';
                  let qual = 'N/A';
                  let course = 'N/A';

                  if (item.message && item.message.includes('State:')) {
                    const parts = item.message.split(' | ');
                    parts.forEach(part => {
                      if (part.startsWith('State:')) state = part.replace('State:', '').trim();
                      if (part.startsWith('Country:')) country = part.replace('Country:', '').trim();
                      if (part.startsWith('Qualification:')) qual = part.replace('Qualification:', '').trim();
                      if (part.startsWith('Course:')) course = part.replace('Course:', '').trim();
                    });
                  }

                  return (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4 text-sm">
                      <div className="font-medium text-slate-800">{item.name}</div>
                      <div className="text-slate-600">{item.phone}</div>
                      <div className="text-slate-500 text-xs">{item.email}</div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="text-slate-800">{state}</div>
                      <div className="text-slate-500 text-xs">{country}</div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="text-slate-800">{qual}</div>
                      <div className="text-slate-500 text-xs">{course}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 capitalize">{item.interest || 'N/A'}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="p-4 whitespace-nowrap">
                      <select 
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`text-sm rounded-full px-3 py-1 font-medium border-0 outline-none cursor-pointer
                          ${item.status === 'New' ? 'bg-blue-100 text-blue-700' : ''}
                          ${item.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : ''}
                          ${item.status === 'Resolved' ? 'bg-green-100 text-green-700' : ''}
                        `}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <button onClick={(e) => { e.stopPropagation(); initiateDelete(item.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {deleteModal.step === 1 ? (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Entry</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to delete this entry?</p>
                <div className="flex justify-end gap-3">
                  <button onClick={cancelDelete} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">Cancel</button>
                  <button onClick={confirmDeleteStep1} className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition">Continue / Yes</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-red-600 mb-2">Permanent Deletion</h3>
                <p className="text-slate-600 mb-6">Are you absolutely sure? This action will permanently delete this entry.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={cancelDelete} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">Cancel</button>
                  <button onClick={confirmDeleteStep2} className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition">Yes, Delete Permanently</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
