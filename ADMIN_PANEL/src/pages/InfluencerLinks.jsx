import React, { useState, useEffect } from 'react';
import { Share2, Plus, Copy, Trash2, Power, PowerOff, Search, Link as LinkIcon, BarChart3, TrendingUp, Users } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';
import { useAuth } from '../App';

export default function InfluencerLinks() {
  const { token } = useAuth();
  const [links, setLinks] = useState([]);
  const [summary, setSummary] = useState({ totalLinks: 0, activeLinks: 0, totalClicks: 0, totalConversions: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    influencerName: '',
    slug: '',
    promoCode: '',
    discountType: 'Percentage',
    discountValue: ''
  });

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/referrals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLinks(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/referrals-summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Promise.all([fetchLinks(), fetchSummary()]).finally(() => setLoading(false));
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/referrals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        setFormData({ influencerName: '', slug: '', promoCode: '', discountType: 'Percentage', discountValue: '' });
        fetchLinks();
        fetchSummary();
      } else {
        alert(data.error || 'Failed to create');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating link');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await fetch(`${API_BASE_URL}/api/admin/referrals/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchLinks();
      fetchSummary();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete referral link? Are you sure you want to delete this referral link? Historical analytics associated with this link may be affected.')) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/referrals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLinks();
      fetchSummary();
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (slug) => {
    let baseUrl = window.location.origin;
    if (baseUrl.includes('5174')) {
      baseUrl = baseUrl.replace('5174', '5173');
    } else if (baseUrl.includes('admin')) {
      baseUrl = baseUrl.replace('-admin', '').replace('admin.', '');
    }
    const url = `${baseUrl}/ref/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Link copied!');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, influencerName: name, slug });
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.influencerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          link.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (link.promoCode && link.promoCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || link.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Share2 className="text-blue-500" /> Influencer & Referral Links
          </h1>
          <p className="text-slate-500 mt-2">Create, manage and track referral links for SpinFyot influencers.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Create Referral Link
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-xl"><LinkIcon size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Links</p>
            <p className="text-2xl font-bold text-slate-900">{summary.totalLinks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-green-50 text-green-600 p-4 rounded-xl"><Power size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Links</p>
            <p className="text-2xl font-bold text-slate-900">{summary.activeLinks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-purple-50 text-purple-600 p-4 rounded-xl"><BarChart3 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Clicks</p>
            <p className="text-2xl font-bold text-slate-900">{summary.totalClicks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-orange-50 text-orange-600 p-4 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Conversions</p>
            <p className="text-2xl font-bold text-slate-900">{summary.totalConversions}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search influencers, slugs or promos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Influencer</th>
                <th className="p-4 font-medium">Promo Code</th>
                <th className="p-4 font-medium text-center">Clicks</th>
                <th className="p-4 font-medium text-center">Unique Visitors</th>
                <th className="p-4 font-medium text-center">Appointments</th>
                <th className="p-4 font-medium text-center">Conversions</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map(link => (
                <tr key={link.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{link.influencerName}</div>
                    <div className="text-sm text-slate-500">/ref/{link.slug}</div>
                  </td>
                  <td className="p-4">
                    {link.promoCode ? (
                      <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-mono font-medium tracking-wide">
                        {link.promoCode}
                      </span>
                    ) : <span className="text-slate-400 text-sm">-</span>}
                  </td>
                  <td className="p-4 text-center font-medium">{link.clicks || 0}</td>
                  <td className="p-4 text-center font-medium text-slate-600">{link.uniqueVisitors || 0}</td>
                  <td className="p-4 text-center font-medium text-slate-600">{link.appointments || 0}</td>
                  <td className="p-4 text-center font-bold text-blue-600">{link.conversions || 0}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      link.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {link.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => copyToClipboard(link.slug)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Copy Link">
                        <Copy size={18} />
                      </button>
                      <button onClick={() => toggleStatus(link.id, link.status)} className={`p-2 rounded-lg transition-colors ${link.status === 'Active' ? 'text-slate-400 hover:text-orange-500 hover:bg-orange-50' : 'text-slate-400 hover:text-green-500 hover:bg-green-50'}`} title={link.status === 'Active' ? 'Disable' : 'Enable'}>
                        {link.status === 'Active' ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                      <button onClick={() => handleDelete(link.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLinks.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">No referral links found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Create Referral Link</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Influencer Name</label>
                <input required type="text" value={formData.influencerName} onChange={handleNameChange} placeholder="e.g. Rahul Sharma" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Custom Link Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-500 text-sm">/ref/</span>
                  <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} className="w-full px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Promo Code (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                    <input type="text" value={formData.promoCode} onChange={e => setFormData({...formData, promoCode: e.target.value.toUpperCase()})} placeholder="e.g. RAHUL10" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono uppercase" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                      <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="Percentage">Percentage (%)</option>
                        <option value="Fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                      <input type="number" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} placeholder="e.g. 10" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Create Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
