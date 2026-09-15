import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../App';
import { Download, Search, FileText, FileSpreadsheet, Trash2, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, step: 1, id: null, recordType: null, loading: false, error: null, success: false });
  const { token } = useAuth();

  const initiateDelete = (id, recordType) => {
    setDeleteModal({ show: true, step: 1, id, recordType, loading: false, error: null, success: false });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, step: 1, id: null, recordType: null, loading: false, error: null, success: false });
  };

  const confirmDeleteStep1 = () => {
    setDeleteModal(prev => ({ ...prev, step: 2, error: null }));
  };

  const confirmDeleteStep2 = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true, error: null }));
    try {
      const endpoint = deleteModal.recordType === 'contact' 
        ? `/api/admin/contacts/${deleteModal.id}` 
        : `/api/admin/appointments/${deleteModal.id}`;
      const res = await api.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAppointments(appointments.filter(app => !(app.id === deleteModal.id && app._recordType === deleteModal.recordType)));
        setDeleteModal(prev => ({ ...prev, loading: false, success: true }));
        setTimeout(() => cancelDelete(), 1500);
      } else {
        setDeleteModal(prev => ({ ...prev, loading: false, error: res.data.error || "Unable to delete entry. Please try again." }));
      }
    } catch (error) {
      console.error(error);
      setDeleteModal(prev => ({ ...prev, loading: false, error: error.response?.data?.error || "Unable to delete entry. Please try again." }));
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, recordType) => {
    try {
      const endpoint = recordType === 'contact' 
        ? `/api/admin/contacts/${id}/status`
        : `/api/admin/appointments/${id}/status`;
        
      await api.put(endpoint, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.map(app => 
        (app.id === id && app._recordType === recordType) ? { ...app, status } : app
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = (type) => {
    if (type === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(appointments);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
      XLSX.writeFile(workbook, "Appointments.xlsx");
    } else if (type === 'pdf') {
      const doc = new jsPDF();
      doc.text("Booked Appointments", 14, 15);
      const tableColumn = ["Name", "Email", "Phone", "Level", "Status"];
      const tableRows = appointments.map(app => [
        app.name, app.email, app.phoneNumber, app.classType, app.status
      ]);
      autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
      doc.save("Appointments.pdf");
    }
  };

  const filtered = appointments.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 w-full max-w-full box-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Booked Appointments</h1>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleExport('excel')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <FileSpreadsheet size={18} /> Export Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            <FileText size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
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
                <th className="p-4 font-semibold whitespace-nowrap">Name</th>
                <th className="p-4 font-semibold whitespace-nowrap">Contact Info</th>
                <th className="p-4 font-semibold min-w-[150px]">Level / Interest</th>
                <th className="p-4 font-semibold min-w-[200px]">Message</th>
                <th className="p-4 font-semibold whitespace-nowrap">Source Page</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date Submitted</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-500">No appointments found.</td></tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-800 break-words">{app.name}</td>
                    <td className="p-4 text-sm break-words">
                      <div className="text-slate-800 break-all">{app.email}</div>
                      <div className="text-slate-500">{app.phoneNumber}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 break-words whitespace-pre-wrap">{app.classType || app.interest || '-'}</td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="max-h-24 overflow-y-auto whitespace-pre-wrap break-words">{app.message || '-'}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-500"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono whitespace-nowrap">{app.sourcePage}</span></td>
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 whitespace-nowrap">
                      <select
                        className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1 focus:outline-none min-w-[110px]"
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value, app._recordType || 'appointment')}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <button onClick={(e) => { e.stopPropagation(); initiateDelete(app.id, app._recordType || 'appointment'); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {deleteModal.success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Entry deleted successfully</h3>
              </div>
            ) : deleteModal.step === 1 ? (
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
                <p className="text-slate-600 mb-4">Are you absolutely sure? This action will permanently delete this entry.</p>
                {deleteModal.error && (
                  <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 break-words">
                    {deleteModal.error}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button onClick={cancelDelete} disabled={deleteModal.loading} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition disabled:opacity-50">Cancel</button>
                  <button onClick={confirmDeleteStep2} disabled={deleteModal.loading} className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition disabled:opacity-50 min-w-[160px] flex justify-center">
                    {deleteModal.loading ? 'Deleting...' : 'Yes, Delete Permanently'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
