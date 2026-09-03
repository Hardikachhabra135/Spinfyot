import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../utils/api';
import { useAuth } from '../App';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // null, 'add', or 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', quote: '', isActive: true, photoUrl: '', photo: null });
  const [submitting, setSubmitting] = useState(false);

  const openAddModal = () => {
    setFormData({ name: '', quote: '', isActive: true, photoUrl: '', photo: null });
    setEditTarget(null);
    setModalMode('add');
  };

  const openEditModal = (item) => {
    setFormData({
      name: item.name,
      quote: item.quote,
      isActive: item.isActive,
      photoUrl: item.photoUrl || '',
      photo: null
    });
    setEditTarget(item);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditTarget(null);
  };
  const { token } = useAuth();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/api/admin/testimonials', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTestimonials(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const activeCount = testimonials.filter(t => t.isActive).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('quote', formData.quote);
      data.append('isActive', formData.isActive);
      if (formData.photo) {
        data.append('photo', formData.photo);
      } else if (formData.photoUrl) {
        data.append('photoUrl', formData.photoUrl);
      }

      if (modalMode === 'add') {
        const res = await api.post('/api/admin/testimonials', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setTestimonials([res.data.data, ...testimonials]);
          closeModal();
        }
      } else if (modalMode === 'edit') {
        const res = await api.put(`/api/admin/testimonials/${editTarget.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          // Refresh the list to get the updated photo URL if it changed
          fetchTestimonials();
          closeModal();
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || `Failed to ${modalMode} testimonial`);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/api/admin/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Testimonials</h1>
          <p className="text-sm text-slate-500 mt-1">Manage student testimonials (Active: {activeCount}/6)</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {activeCount >= 6 && (
        <div className="mb-6 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
          You have reached the maximum of 6 active testimonials. You must deactivate or delete one before adding a new active testimonial.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Quote</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : testimonials.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No testimonials found.</td></tr>
              ) : (
                testimonials.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                          {item.photoUrl ? (
                            <img src={getImageUrl(item.photoUrl)} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{item.name.charAt(0)}</div>
                          )}
                        </div>
                        <span className="font-medium text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 italic whitespace-pre-wrap">"{item.quote}"</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${item.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 transition" title="Delete">
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

      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'add' ? 'Add New Testimonial' : 'Edit Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Student Name</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Quote</label>
                <textarea required className="w-full border p-2 rounded h-24" value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Upload Photo</label>
                <input type="file" accept="image/*" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, photo: e.target.files[0]})} />
              </div>
              <div className="text-center text-slate-500 text-sm">OR</div>
              <div>
                <label className="block text-sm font-semibold mb-1">Photo URL Link</label>
                <input type="url" className="w-full border p-2 rounded" value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                <label htmlFor="isActive" className="text-sm font-semibold">Active on Website</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded text-slate-600">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Save Testimonial' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
