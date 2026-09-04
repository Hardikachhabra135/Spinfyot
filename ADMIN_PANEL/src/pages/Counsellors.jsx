import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Copy, Trash2, Power, Search, Key } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../App';

export default function Counsellors() {
  const { token, logout } = useAuth();
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    counsellorId: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    bio: ''
  });

  const fetchCounsellors = async () => {
    try {
      const res = await api.get('/api/admin/counsellors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCounsellors(res.data.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Your session has expired or is invalid. Please log out and log back in.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsellors();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/admin/counsellors', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setIsCreateModalOpen(false);
        setFormData({ name: '', counsellorId: '', email: '', phone: '', password: '', specialization: '', bio: '' });
        fetchCounsellors();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to create counsellor');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await api.put(`/api/admin/counsellors/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCounsellors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete counsellor? Are you sure you want to completely remove this counsellor?')) return;
    try {
      await api.delete(`/api/admin/counsellors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCounsellors();
    } catch (error) {
      console.error(error);
    }
  };
  
  const resetPassword = async (id) => {
    const newPassword = window.prompt("Enter new password for counsellor:");
    if (!newPassword) return;
    
    try {
      const res = await api.put(`/api/admin/counsellors/${id}/reset-password`, { password: newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert("Password reset successfully.");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to reset password");
    }
  };

  const copyToClipboard = (slug) => {
    const isLocal = window.location.hostname === 'localhost';
    const baseUrl = import.meta.env.VITE_COUNSELLOR_PORTAL_URL || (isLocal ? 'http://localhost:5175' : 'https://counsellor-portal-lilac.vercel.app');
    const url = `${baseUrl}/c/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Counsellor portal link copied!');
  };

  const filteredCounsellors = counsellors.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.counsellorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Briefcase className="text-blue-500" /> Counsellors
          </h1>
          <p className="text-slate-500 mt-2">Create and manage SpinFyot counsellor accounts.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} />
          Add New Counsellor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search counsellors by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name / ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Contact</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Leads</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Appointments</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCounsellors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No counsellors found.
                  </td>
                </tr>
              ) : (
                filteredCounsellors.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-sm text-slate-500 mt-1">{c.counsellorId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{c.email}</div>
                      <div className="text-sm text-slate-500">{c.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">
                      {c.leads}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">
                      {c.appointments}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => copyToClipboard(c.slug)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Copy Portal Link"
                        >
                          <Copy size={18} />
                        </button>
                        <button 
                          onClick={() => resetPassword(c.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <Key size={18} />
                        </button>
                        <button 
                          onClick={() => toggleStatus(c.id, c.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            c.status === 'Active' 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={c.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                        >
                          <Power size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Counsellor"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Counsellor</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Counsellor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Counsellor ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. COUN001"
                    value={formData.counsellorId}
                    onChange={(e) => setFormData({...formData, counsellorId: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. UK Admissions, Test Prep"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                >
                  Create Counsellor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
