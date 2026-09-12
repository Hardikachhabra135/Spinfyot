import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Upload, PhoneCall, FileText, Edit, Trash2, Eye, CheckCircle, FileDown, FolderDown, Loader2 } from 'lucide-react';
import { useAuth } from '../App';
import { API_BASE_URL } from '../utils/api';
import { LOCATIONS, COMMON_QUALIFICATIONS } from '../utils/locations';

export default function Students() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [files, setFiles] = useState(null);
  
  const [downloadingDocsId, setDownloadingDocsId] = useState(null);
  const [downloadingProfileId, setDownloadingProfileId] = useState(null);

  const initialForm = {
    name: '', passportNo: '', phone: '', email: '', age: '', address: '',
    sourceOfIncome: '', familyContact: '', familyRelation: '',
    
    edu10thYear: '', edu10thBoard: '', edu10thStream: '', edu10thPercentage: '',
    edu12thYear: '', edu12thBoard: '', edu12thStream: '', edu12thPercentage: '',
    eduDiplomaYear: '', eduDiplomaName: '', eduDiplomaPercentage: '',
    eduGradYear: '', eduGradCourse: '', eduGradUni: '', eduGradPercentage: '',
    eduMasterYear: '', eduMasterCourse: '', eduMasterUni: '', eduMasterPercentage: '',
  
    gapYears: '', jobExperienceYears: '', companyName: '', designation: '',
  
    englishLevel: 'Average', languageTest: 'None', languageTestOther: '', languageTestScore: '',
  
    targetCountry: '', prefCountry: '', targetCourse: '', targetUniversity: '', intakeTerm: '',
  
    isReferred: 'No', referrerName: '', referrerContact: '', referrerRelation: ''
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
      
      const payload = {
        name: formData.name,
        passportNo: formData.passportNo,
        phone: formData.phone,
        email: formData.email,
        age: formData.age,
        address: formData.address,
        sourceOfIncome: formData.sourceOfIncome,
        
        familyContact: JSON.stringify({ details: formData.familyContact, relation: formData.familyRelation }),
        
        edu10th: JSON.stringify({ year: formData.edu10thYear, board: formData.edu10thBoard, stream: formData.edu10thStream, percentage: formData.edu10thPercentage }),
        edu12th: JSON.stringify({ year: formData.edu12thYear, board: formData.edu12thBoard, stream: formData.edu12thStream, percentage: formData.edu12thPercentage }),
        eduDiploma: JSON.stringify({ year: formData.eduDiplomaYear, name: formData.eduDiplomaName, percentage: formData.eduDiplomaPercentage }),
        eduGraduation: JSON.stringify({ year: formData.eduGradYear, course: formData.eduGradCourse, university: formData.eduGradUni, percentage: formData.eduGradPercentage }),
        eduMasters: JSON.stringify({ year: formData.eduMasterYear, course: formData.eduMasterCourse, university: formData.eduMasterUni, percentage: formData.eduMasterPercentage }),
        
        jobExperience: JSON.stringify({ gapYears: formData.gapYears, experienceYears: formData.jobExperienceYears, companyName: formData.companyName, designation: formData.designation }),
        
        englishLevel: formData.englishLevel,
        languageTests: JSON.stringify({ test: formData.languageTest, otherName: formData.languageTestOther, score: formData.languageTestScore }),
        
        targetCountry: formData.targetCountry,
        prefCountry: formData.prefCountry,
        targetCourse: formData.targetCourse,
        targetUniversity: formData.targetUniversity,
        intakeTerm: formData.intakeTerm,
        
        referredBy: JSON.stringify({ isReferred: formData.isReferred, name: formData.referrerName, contact: formData.referrerContact, relation: formData.referrerRelation })
      };
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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
      alert('Error saving student.');
    }
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
    
    const safeParse = (str) => {
      try { return JSON.parse(str) || {}; } catch (e) { return {}; }
    };
    
    const fam = safeParse(s.familyContact);
    const e10 = safeParse(s.edu10th);
    const e12 = safeParse(s.edu12th);
    const eDip = safeParse(s.eduDiploma);
    const eGrad = safeParse(s.eduGraduation);
    const eMas = safeParse(s.eduMasters);
    const job = safeParse(s.jobExperience);
    const lang = safeParse(s.languageTests);
    const ref = safeParse(s.referredBy);

    setFormData({
      name: s.name || '', passportNo: s.passportNo || '', phone: s.phone || '', email: s.email || '', 
      age: s.age || '', address: s.address || '', sourceOfIncome: s.sourceOfIncome || '', 
      familyContact: fam.details || '', familyRelation: fam.relation || '',
      
      edu10thYear: e10.year || '', edu10thBoard: e10.board || '', edu10thStream: e10.stream || '', edu10thPercentage: e10.percentage || '',
      edu12thYear: e12.year || '', edu12thBoard: e12.board || '', edu12thStream: e12.stream || '', edu12thPercentage: e12.percentage || '',
      eduDiplomaYear: eDip.year || '', eduDiplomaName: eDip.name || '', eduDiplomaPercentage: eDip.percentage || '',
      eduGradYear: eGrad.year || '', eduGradCourse: eGrad.course || '', eduGradUni: eGrad.university || '', eduGradPercentage: eGrad.percentage || '',
      eduMasterYear: eMas.year || '', eduMasterCourse: eMas.course || '', eduMasterUni: eMas.university || '', eduMasterPercentage: eMas.percentage || '',
      
      gapYears: job.gapYears || '', jobExperienceYears: job.experienceYears || '', companyName: job.companyName || '', designation: job.designation || '',
      
      englishLevel: s.englishLevel || 'Average', languageTest: lang.test || 'None', languageTestOther: lang.otherName || '', languageTestScore: lang.score || '',
      
      targetCountry: s.targetCountry || '', prefCountry: s.prefCountry || '', targetCourse: s.targetCourse || '', targetUniversity: s.targetUniversity || '', intakeTerm: s.intakeTerm || '',
      
      isReferred: ref.isReferred || 'No', referrerName: ref.name || '', referrerContact: ref.contact || '', referrerRelation: ref.relation || ''
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleCountryChange = (e) => {
    setFormData({
      ...formData,
      currentCountry: e.target.value,
      currentCity: '' // reset city when country changes
    });
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
                        <button onClick={() => downloadProfile(s)} disabled={downloadingProfileId === s.id} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50" title="Download Student Profile">
                          {downloadingProfileId === s.id ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
                        </button>
                        <button onClick={() => downloadDocuments(s)} disabled={downloadingDocsId === s.id} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg disabled:opacity-50" title="Download Student Documents">
                          {downloadingDocsId === s.id ? <Loader2 size={18} className="animate-spin" /> : <FolderDown size={18} />}
                        </button>
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
          <datalist id="countries-list">
            {Object.keys(LOCATIONS).map(c => <option key={c} value={c} />)}
          </datalist>
          <datalist id="courses-list">
            {COMMON_QUALIFICATIONS.map(q => <option key={q} value={q} />)}
          </datalist>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">SECTION 1 - PERSONAL DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name as per Passport *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Passport Number *</label>
                <input type="text" name="passportNo" value={formData.passportNo} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email ID *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age </label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source of Income </label>
                <input type="text" name="sourceOfIncome" value={formData.sourceOfIncome} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Family Contact Details </label>
                <input type="text" name="familyContact" value={formData.familyContact} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Relation with Family Contact </label>
                <input type="text" name="familyRelation" value={formData.familyRelation} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Address </label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" rows="2" ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">SECTION 2 - EDUCATIONAL DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <h4 className="md:col-span-2 font-semibold text-slate-600 mt-2 mb-1 border-b pb-1">10th / Class 10</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">10th Pass-out Year </label>
                <input type="number" name="edu10thYear" value={formData.edu10thYear} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Board </label>
                <input type="text" name="edu10thBoard" value={formData.edu10thBoard} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stream </label>
                <input type="text" name="edu10thStream" value={formData.edu10thStream} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Percentage </label>
                <input type="text" name="edu10thPercentage" value={formData.edu10thPercentage} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <h4 className="md:col-span-2 font-semibold text-slate-600 mt-4 mb-1 border-b pb-1">12th / Class 12</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">12th Pass-out Year </label>
                <input type="number" name="edu12thYear" value={formData.edu12thYear} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Board </label>
                <input type="text" name="edu12thBoard" value={formData.edu12thBoard} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stream </label>
                <input type="text" name="edu12thStream" value={formData.edu12thStream} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Percentage </label>
                <input type="text" name="edu12thPercentage" value={formData.edu12thPercentage} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <h4 className="md:col-span-2 font-semibold text-slate-600 mt-4 mb-1 border-b pb-1">Diploma</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Diploma Year </label>
                <input type="number" name="eduDiplomaYear" value={formData.eduDiplomaYear} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Diploma Name </label>
                <input type="text" name="eduDiplomaName" value={formData.eduDiplomaName} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Marks / Percentage </label>
                <input type="text" name="eduDiplomaPercentage" value={formData.eduDiplomaPercentage} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <h4 className="md:col-span-2 font-semibold text-slate-600 mt-4 mb-1 border-b pb-1">Graduation</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Year </label>
                <input type="number" name="eduGradYear" value={formData.eduGradYear} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course </label>
                <input type="text" name="eduGradCourse" value={formData.eduGradCourse} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">University Name </label>
                <input type="text" name="eduGradUni" value={formData.eduGradUni} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Percentage / CGPA </label>
                <input type="text" name="eduGradPercentage" value={formData.eduGradPercentage} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <h4 className="md:col-span-2 font-semibold text-slate-600 mt-4 mb-1 border-b pb-1">Masters</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Masters Year </label>
                <input type="number" name="eduMasterYear" value={formData.eduMasterYear} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course / Degree </label>
                <input type="text" name="eduMasterCourse" value={formData.eduMasterCourse} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">University Name </label>
                <input type="text" name="eduMasterUni" value={formData.eduMasterUni} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Percentage / CGPA </label>
                <input type="text" name="eduMasterPercentage" value={formData.eduMasterPercentage} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">SECTION 3 - WORK EXPERIENCE / GAP</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years Without Any Job / Education Gap </label>
                <input type="number" name="gapYears" value={formData.gapYears} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Experience Years </label>
                <input type="number" name="jobExperienceYears" value={formData.jobExperienceYears} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name </label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Designation </label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">SECTION 4 - LANGUAGE DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rate Your English Language Level </label>
                <select name="englishLevel" value={formData.englishLevel} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" >
                  <option value="">Select...</option>
                  <option value="Poor">Poor</option>
                  <option value="Average">Average</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Any Language Test </label>
                <select name="languageTest" value={formData.languageTest} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" >
                  <option value="">Select...</option>
                  <option value="None">None</option>
                  <option value="IELTS">IELTS</option>
                  <option value="PTE">PTE</option>
                  <option value="German">German</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {formData.languageTest === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Test Name </label>
                <input type="text" name="languageTestOther" value={formData.languageTestOther} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>)}
              {formData.languageTest !== 'None' && formData.languageTest !== '' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Test Score </label>
                <input type="text" name="languageTestScore" value={formData.languageTestScore} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>)}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">SECTION 5 - STUDY ABROAD PREFERENCE</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country for Which Student Enrolled *</label>
                <input type="text" name="targetCountry" value={formData.targetCountry} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required list="countries-list" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Any Other Preferable Country? </label>
                <input type="text" name="prefCountry" value={formData.prefCountry} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  list="countries-list" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course </label>
                <input type="text" name="targetCourse" value={formData.targetCourse} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  list="courses-list" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">University </label>
                <input type="text" name="targetUniversity" value={formData.targetUniversity} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Intake </label>
                <select name="intakeTerm" value={formData.intakeTerm} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" >
                  <option value="">Select...</option>
                  <option value="Fall (Sep/Oct)">Fall (Sep/Oct)</option>
                  <option value="Spring (Jan/Feb)">Spring (Jan/Feb)</option>
                  <option value="Summer (May/Jun)">Summer (May/Jun)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">SECTION 6 - REFERRAL</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Is Referred By Someone? </label>
                <select name="isReferred" value={formData.isReferred} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" >
                  <option value="">Select...</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              {formData.isReferred === 'Yes' && (
                <React.Fragment>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Referred By Name </label>
                    <input type="text" name="referrerName" value={formData.referrerName} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Referred By Contact Number / Details </label>
                    <input type="text" name="referrerContact" value={formData.referrerContact} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Relationship / Source </label>
                    <input type="text" name="referrerRelation" value={formData.referrerRelation} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg font-medium">
              {isEditing ? 'Save Changes' : 'Create Student'}
            </button>
          </div>
        </form>
          </div>
        </div>
      )}

      {/* View Full Details Modal */}
        {isViewModalOpen && selectedStudent && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b pb-4">Student Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Personal Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
                    <div><p className="text-sm text-slate-500">Name</p><p className="font-semibold">{selectedStudent.name}</p></div>
                    <div><p className="text-sm text-slate-500">Passport</p><p className="font-semibold">{selectedStudent.passportNo || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">Phone</p><p className="font-semibold">{selectedStudent.phone || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">Email</p><p className="font-semibold">{selectedStudent.email || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">Age</p><p className="font-semibold">{selectedStudent.age || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">Source of Income</p><p className="font-semibold">{selectedStudent.sourceOfIncome || 'N/A'}</p></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Study Abroad Preference</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl">
                    <div><p className="text-sm text-slate-500">Target Country</p><p className="font-semibold">{selectedStudent.targetCountry || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">Target Course</p><p className="font-semibold">{selectedStudent.targetCourse || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">University</p><p className="font-semibold">{selectedStudent.targetUniversity || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">Intake</p><p className="font-semibold">{selectedStudent.intakeTerm || 'N/A'}</p></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Other Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
                    <div><p className="text-sm text-slate-500">English Level</p><p className="font-semibold">{selectedStudent.englishLevel || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">Status</p><p className="font-semibold">{selectedStudent.status || 'N/A'}</p></div>
                    <div><p className="text-sm text-slate-500">Callback</p><p className="font-semibold">{selectedStudent.callbackRequested ? 'Yes' : 'No'}</p></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-8 border-t">
                <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl">Close</button>
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
