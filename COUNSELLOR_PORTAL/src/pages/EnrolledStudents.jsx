import React, { useState, useEffect } from 'react';
import { Award, Upload, FileText, Eye, FileDown, FolderDown, Loader2 } from 'lucide-react';
import { useAuth } from '../App';
import { API_BASE_URL } from '../utils/api';

export default function EnrolledStudents() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [files, setFiles] = useState(null);
  const [downloadingProfileId, setDownloadingProfileId] = useState(null);
  const [downloadingDocsId, setDownloadingDocsId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/students`, {
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

  const downloadProfile = async (student) => {
    setDownloadingProfileId(student.id);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();
      
      const safeParse = (str) => {
        try { return JSON.parse(str) || {}; } catch (e) { return {}; }
      };
      
      const fam = safeParse(student.familyContact);
      const e10 = safeParse(student.edu10th);
      const e12 = safeParse(student.edu12th);
      const eDip = safeParse(student.eduDiploma);
      const eGrad = safeParse(student.eduGraduation);
      const eMas = safeParse(student.eduMasters);
      const job = safeParse(student.jobExperience);
      const lang = safeParse(student.languageTests);
      const ref = safeParse(student.referredBy);

      try {
        const img = new Image();
        img.src = '/logo.png';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        const ratio = img.height / img.width;
        // Draw logo at width 50mm
        doc.addImage(img, 'PNG', 14, 10, 50, 50 * ratio);
      } catch (e) {
        // Fallback to text if image fails to load
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text('SPINFYOT', 14, 20);
      }
      
      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      doc.text('Student Profile Form', 14, 32);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      let currentY = 42;

      autoTable(doc, {
        startY: currentY,
        head: [['Personal Details', '']],
        body: [
          ['Name as per Passport', student.name || 'N/A'],
          ['Passport Number', student.passportNo || 'N/A'],
          ['Phone Number', student.phone || 'N/A'],
          ['Email ID', student.email || 'N/A'],
          ['Age', student.age || 'N/A'],
          ['Source of Income', student.sourceOfIncome || 'N/A'],
          ['Family Contact', fam.details || 'N/A'],
          ['Relation', fam.relation || 'N/A'],
          ['Address', student.address || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
      });
      currentY = doc.lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: currentY,
        head: [['Educational Details', '']],
        body: [
          ['10th Year', e10.year || 'N/A'],
          ['10th Board & Stream', `${e10.board || ''} / ${e10.stream || ''}`],
          ['10th Percentage', e10.percentage || 'N/A'],
          ['12th Year', e12.year || 'N/A'],
          ['12th Board & Stream', `${e12.board || ''} / ${e12.stream || ''}`],
          ['12th Percentage', e12.percentage || 'N/A'],
          ['Diploma', `${eDip.name || 'N/A'} (${eDip.year || ''}) - ${eDip.percentage || ''}`],
          ['Graduation', `${eGrad.course || 'N/A'} at ${eGrad.university || ''} (${eGrad.year || ''}) - ${eGrad.percentage || ''}`],
          ['Masters', `${eMas.course || 'N/A'} at ${eMas.university || ''} (${eMas.year || ''}) - ${eMas.percentage || ''}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
      });
      currentY = doc.lastAutoTable.finalY + 10;

      // Add a new page if getting too long
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      autoTable(doc, {
        startY: currentY,
        head: [['Work Experience / Gap', '']],
        body: [
          ['Gap Years', job.gapYears || 'N/A'],
          ['Experience Years', job.experienceYears || 'N/A'],
          ['Company Name', job.companyName || 'N/A'],
          ['Designation', job.designation || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
      });
      currentY = doc.lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: currentY,
        head: [['Language Details', '']],
        body: [
          ['English Level', student.englishLevel || 'N/A'],
          ['Language Test', lang.test === 'Other' ? lang.otherName : (lang.test || 'N/A')],
          ['Test Score', lang.score || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
      });
      currentY = doc.lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: currentY,
        head: [['Study Abroad Preference', '']],
        body: [
          ['Target Country', student.targetCountry || 'N/A'],
          ['Preferable Country', student.prefCountry || 'N/A'],
          ['Course', student.targetCourse || 'N/A'],
          ['University', student.targetUniversity || 'N/A'],
          ['Intake', student.intakeTerm || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
      });
      currentY = doc.lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: currentY,
        head: [['Referral', '']],
        body: [
          ['Is Referred?', ref.isReferred || 'N/A'],
          ['Referred By Name', ref.name || 'N/A'],
          ['Contact / Details', ref.contact || 'N/A'],
          ['Relationship', ref.relation || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
      });

      const safeName = (student.name || 'Student').replace(/[^a-z0-9]/gi, '_');
      doc.save(`${safeName}_Profile.pdf`);
    } catch (error) {
      console.error(error);
      alert('Unable to generate PDF profile. Please try again.');
    } finally {
      setDownloadingProfileId(null);
    }
  };

  const downloadDocuments = async (student) => {
    let docs = [];
    try {
      docs = JSON.parse(student.documents || '[]');
    } catch (e) {}

    if (!docs || docs.length === 0) {
      alert("No documents available for this student.");
      return;
    }

    setDownloadingDocsId(student.id);

    try {
      if (docs.length === 1) {
        const doc = docs[0];
        const res = await fetch(`${API_BASE_URL}${doc.path}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Network response was not ok');
        const blob = await res.blob();
        const { saveAs } = await import('file-saver');
        saveAs(blob, doc.name);
      } else {
        const JSZip = (await import('jszip')).default;
        const { saveAs } = await import('file-saver');
        const zip = new JSZip();

        for (const doc of docs) {
          const res = await fetch(`${API_BASE_URL}${doc.path}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const blob = await res.blob();
            zip.file(doc.name, blob);
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const safeName = (student.name || 'Student').replace(/[^a-z0-9]/gi, '_');
        saveAs(zipBlob, `${safeName}_Documents.zip`);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to download documents. Please try again.");
    } finally {
      setDownloadingDocsId(null);
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

  const openUploadModal = (student) => {
    setSelectedStudent(student);
    setIsUploadModalOpen(true);
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleDeleteDocument = async (student, docIndex) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    let docs = [];
    try { docs = JSON.parse(student.documents || '[]'); } catch(e) {}
    
    docs.splice(docIndex, 1);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/students/${student.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ documents: JSON.stringify(docs) })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state to reflect deletion
        const updatedStudent = { ...student, documents: JSON.stringify(docs) };
        setSelectedStudent(updatedStudent);
        setStudents(prev => prev.map(s => s.id === student.id ? updatedStudent : s));
      } else {
        alert(data.error || 'Failed to delete document');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting document');
    }
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
                          
                          <button 
                            onClick={() => downloadProfile(s)} 
                            disabled={downloadingProfileId === s.id}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50" 
                            title="Download Student Form"
                          >
                            {downloadingProfileId === s.id ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
                          </button>
                          
                          <button 
                            onClick={() => downloadDocuments(s)} 
                            disabled={downloadingDocsId === s.id}
                            className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg disabled:opacity-50" 
                            title="Download Documents"
                          >
                            {downloadingDocsId === s.id ? <Loader2 size={18} className="animate-spin" /> : <FolderDown size={18} />}
                          </button>

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
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-700 font-medium truncate max-w-[60%]">
                          <FileText size={18} className="text-blue-500 flex-shrink-0" /> 
                          <span className="truncate">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <a href={`${API_BASE_URL}${doc.path}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors" download>
                            Download
                          </a>
                          <button onClick={() => handleDeleteDocument(selectedStudent, idx)} className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
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
