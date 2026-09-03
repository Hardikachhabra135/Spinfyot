import React, { useState, useEffect } from 'react';
import { Award, Upload, FileText, Eye } from 'lucide-react';
import { useAuth } from '../App';

export default function EnrolledStudents() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [files, setFiles] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/counsellor/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data.filter(s => s.status === 'Enrolled'));
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    const formPayload = new FormData();
    for (let i = 0; i < files.length; i++) {
      formPayload.append('documents', files[i]);
    }
    try {
      const res = await fetch(`http://localhost:5000/api/counsellor/students/${selectedStudent.id}/upload`, {
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
            <Award className="text-green-500" /> Enrolled Students
          </h1>
          <p className="text-slate-500 mt-2">Students who have successfully enrolled.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Student Info</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Target</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Documents</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No enrolled students yet.</td>
              </tr>
            ) : (
              students.map(s => {
                let docs = [];
                try { docs = JSON.parse(s.documents || '[]'); } catch(e) {}
                
                return (
                  <tr key={s.id} className="hover:bg-green-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        {s.name} <Award size={16} className="text-green-500" />
                      </div>
                      <div className="text-sm text-slate-500">{s.email}</div>
                      <div className="text-sm text-slate-500">{s.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{s.targetCountry || 'N/A'}</div>
                      <div className="text-sm text-slate-500">{s.targetCourse || 'N/A'}</div>
                      <div className="text-xs text-blue-600 mt-1">{s.intakeTerm || ''}</div>
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
                        <button onClick={() => openViewModal(s)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="View Full Details"><Eye size={18} /></button>
                        <button onClick={() => openUploadModal(s)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Upload Document"><Upload size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* View Full Details Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto border-t-4 border-green-500">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b pb-4 flex items-center gap-3">
              Student Profile <Award className="text-green-500" />
            </h2>
            
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
              <div className="col-span-2 bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-green-600 uppercase tracking-wide font-bold mb-2">Enrollment Goals</p>
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
                      <a key={idx} href={`http://localhost:5000${doc.path}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-blue-600 font-medium transition-colors">
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
