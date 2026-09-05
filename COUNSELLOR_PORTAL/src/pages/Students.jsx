import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Upload, PhoneCall, FileText, Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import { useAuth } from '../App';
import { API_BASE_URL } from '../utils/api';

export default function Students() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [files, setFiles] = useState(null);

  const initialForm = {
    name: '', email: '', phone: '', notes: '', callbackRequested: false, callbackTime: '',
    age: '', currentEducation: '', currentCity: '', targetCountry: '', targetCourse: '', visaApplied: false, budget: '', intakeTerm: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data.filter(s => s.status !== 'Enrolled'));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing ? `${API_BASE_URL}/api/counsellor/students/${selectedStudent.id}` : `${API_BASE_URL}/api/counsellor/students`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData(initialForm);
        setIsEditing(false);
        fetchStudents();
      } else {
        alert(data.error || 'Failed to save student');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const markEnrolled = async (id) => {
    if (!window.confirm("Mark this student as Enrolled? They will be moved to the Enrolled section.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Enrolled' })
      });
      const data = await res.json();
      if (data.success) fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    const formPayload = new FormData();
    for (let i = 0; i < files.length; i++) {
      formPayload.append('documents', files[i]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/students/${selectedStudent.id}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload
      });
      const data = await res.json();
      if (data.success) {
        setIsUploadModalOpen(false);
        setFiles(null);
        setSelectedStudent(null);
        fetchStudents();
        alert('Documents uploaded successfully!');
      } else {
        alert(data.error || 'Failed to upload documents');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading documents');
    }
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setSelectedStudent(s);
    setFormData({
      name: s.name || '', email: s.email || '', phone: s.phone || '', notes: s.notes || '',
      callbackRequested: s.callbackRequested || false, callbackTime: s.callbackTime ? s.callbackTime.slice(0,16) : '',
      age: s.age || '', currentEducation: s.currentEducation || '', currentCity: s.currentCity || '',
      targetCountry: s.targetCountry || '', targetCourse: s.targetCourse || '', visaApplied: s.visaApplied || false,
      budget: s.budget || '', intakeTerm: s.intakeTerm || ''
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openUploadModal = (student) => {
    setSelectedStudent(student);
    setIsUploadModalOpen(true);
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <GraduationCap className="text-blue-500" /> My Students
          </h1>
          <p className="text-slate-500 mt-2">Manage your complete student CRM.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} />
          Add New Student
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Student Info</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Target</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Call Back</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Documents</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No students added yet.</td>
              </tr>
            ) : (
              students.map(s => {
                let docs = [];
                try { docs = JSON.parse(s.documents || '[]'); } catch(e) {}
                
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-sm text-slate-500">{s.email}</div>
                      <div className="text-sm text-slate-500">{s.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{s.targetCountry || 'N/A'}</div>
                      <div className="text-sm text-slate-500">{s.targetCourse || 'N/A'}</div>
                      <div className="text-xs text-blue-600 mt-1">{s.intakeTerm || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      {s.callbackRequested ? (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-sm font-medium w-fit">
                          <PhoneCall size={14} />
                          {s.callbackTime ? new Date(s.callbackTime).toLocaleString() : 'Requested'}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-[150px]">
                        {docs.length > 0 ? (
                          <span className="text-sm text-blue-600 font-medium">{docs.length} files attached</span>
                        ) : (
                          <span className="text-sm text-slate-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => markEnrolled(s.id)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Mark as Enrolled"><CheckCircle size={18} /></button>
                        <button onClick={() => openViewModal(s)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="View Full Details"><Eye size={18} /></button>
                        <button onClick={() => openUploadModal(s)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Upload Document"><Upload size={18} /></button>
                        <button onClick={() => openEditModal(s)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-slate-800 border-b pb-2 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current City</label>
                    <input type="text" value={formData.currentCity} onChange={(e) => setFormData({...formData, currentCity: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Education</label>
                    <input type="text" value={formData.currentEducation} onChange={(e) => setFormData({...formData, currentEducation: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Targets */}
              <div>
                <h3 className="font-semibold text-slate-800 border-b pb-2 mb-4">Study Abroad Targets</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Country</label>
                    <input type="text" value={formData.targetCountry} onChange={(e) => setFormData({...formData, targetCountry: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. UK, USA, Canada" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Course</label>
                    <input type="text" value={formData.targetCourse} onChange={(e) => setFormData({...formData, targetCourse: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. MSc Computer Science" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Intake Term / Year</label>
                    <input type="text" value={formData.intakeTerm} onChange={(e) => setFormData({...formData, intakeTerm: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Fall 2027" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Budget</label>
                    <input type="text" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. $40,000" />
                  </div>
                  <div className="col-span-2 flex items-center mt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.visaApplied} onChange={(e) => setFormData({...formData, visaApplied: e.target.checked})} className="w-5 h-5 text-blue-600 rounded" />
                      <span className="font-medium text-slate-700">Visa Already Applied?</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Call Back & Notes */}
              <div>
                <h3 className="font-semibold text-slate-800 border-b pb-2 mb-4">Follow Up & Notes</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Counsellor Notes</label>
                  <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" checked={formData.callbackRequested} onChange={(e) => setFormData({...formData, callbackRequested: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm font-medium text-slate-700">Request Call Back?</span>
                  </label>
                  {formData.callbackRequested && (
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Call Back Time</label>
                      <input type="datetime-local" required value={formData.callbackTime} onChange={(e) => setFormData({...formData, callbackTime: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Details Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b pb-4">Student Profile</h2>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Full Name</p>
                <p className="font-semibold text-lg text-slate-900">{selectedStudent.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Contact</p>
                <p className="font-semibold text-slate-900">{selectedStudent.email || '-'}</p>
                <p className="font-semibold text-slate-900">{selectedStudent.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Age & City</p>
                <p className="font-semibold text-slate-900">{selectedStudent.age || '-'} yrs, {selectedStudent.currentCity || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Current Education</p>
                <p className="font-semibold text-slate-900">{selectedStudent.currentEducation || '-'}</p>
              </div>
              <div className="col-span-2 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-500 uppercase tracking-wide font-bold mb-2">Target Goals</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-500 text-sm">Country:</span> <span className="font-semibold">{selectedStudent.targetCountry || '-'}</span></div>
                  <div><span className="text-slate-500 text-sm">Course:</span> <span className="font-semibold">{selectedStudent.targetCourse || '-'}</span></div>
                  <div><span className="text-slate-500 text-sm">Intake:</span> <span className="font-semibold">{selectedStudent.intakeTerm || '-'}</span></div>
                  <div><span className="text-slate-500 text-sm">Budget:</span> <span className="font-semibold">{selectedStudent.budget || '-'}</span></div>
                  <div><span className="text-slate-500 text-sm">Visa Applied:</span> <span className={`font-semibold ${selectedStudent.visaApplied ? 'text-green-600' : 'text-slate-700'}`}>{selectedStudent.visaApplied ? 'Yes' : 'No'}</span></div>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500 uppercase tracking-wide">Counsellor Notes</p>
                <p className="text-slate-800 bg-slate-50 p-4 rounded-lg mt-1 whitespace-pre-wrap">{selectedStudent.notes || 'No notes.'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">Uploaded Documents</p>
                <div className="flex flex-col gap-2">
                  {(() => {
                    let docs = [];
                    try { docs = JSON.parse(selectedStudent.documents || '[]'); } catch(e) {}
                    if (docs.length === 0) return <span className="text-slate-400 italic">No documents uploaded.</span>;
                    return docs.map((doc, idx) => (
                      <a key={idx} href={`${API_BASE_URL}${doc.path}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-blue-600 font-medium transition-colors">
                        <FileText size={18} /> {doc.name}
                      </a>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 flex justify-end gap-3 border-t">
              <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Documents</h2>
            <p className="text-sm text-slate-500 mb-4">Uploading for: <span className="font-semibold text-slate-900">{selectedStudent?.name}</span></p>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Files (JPG, PNG, PDF, JPEG)</label>
                <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setFiles(e.target.files)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="pt-4 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setIsUploadModalOpen(false); setFiles(null); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
