import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../App';
import { Download, Search, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

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

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.map(app => app.id === id ? { ...app, status } : app));
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Booked Appointments</h1>
        <div className="flex gap-3">
          <button onClick={() => handleExport('excel')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <FileSpreadsheet size={18} /> Export Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            <FileText size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Level</th>
                <th className="p-4 font-semibold">Source Page</th>
                <th className="p-4 font-semibold">Date Submitted</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No appointments found.</td></tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-800">{app.name}</td>
                    <td className="p-4 text-sm">
                      <div className="text-slate-800">{app.email}</div>
                      <div className="text-slate-500">{app.phoneNumber}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{app.classType}</td>
                    <td className="p-4 text-sm text-slate-500"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{app.sourcePage}</span></td>
                    <td className="p-4 text-sm text-slate-600">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <select 
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`text-sm rounded-full px-3 py-1 font-medium border-0 outline-none cursor-pointer
                          ${app.status === 'New' ? 'bg-blue-100 text-blue-700' : ''}
                          ${app.status === 'Contacted' ? 'bg-amber-100 text-amber-700' : ''}
                          ${app.status === 'Resolved' ? 'bg-green-100 text-green-700' : ''}
                        `}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
