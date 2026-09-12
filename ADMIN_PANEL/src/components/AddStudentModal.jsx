import React, { useState } from 'react';
import api from '../utils/api';
import { LOCATIONS, COMMON_QUALIFICATIONS } from '../utils/locations';

export default function AddStudentModal({ isOpen, onClose, onSuccess, token }) {
  const initialForm = {
    name: '', passportNo: '', phone: '', email: '', age: '', address: '', sourceOfIncome: '',
    familyContact: '', familyRelation: '',
    edu10thYear: '', edu10thBoard: '', edu10thStream: '', edu10thPercentage: '',
    edu12thYear: '', edu12thBoard: '', edu12thStream: '', edu12thPercentage: '',
    eduDiplomaYear: '', eduDiplomaName: '', eduDiplomaPercentage: '',
    eduGradYear: '', eduGradCourse: '', eduGradUniversity: '', eduGradPercentage: '',
    eduMasterYear: '', eduMasterCourse: '', eduMasterUniversity: '', eduMasterPercentage: '',
    gapYears: '', jobExperienceYears: '', companyName: '', designation: '',
    englishLevel: '', languageTest: '', languageTestOther: '', languageTestScore: '',
    targetCountry: '', prefCountry: '', targetCourse: '', targetUniversity: '', intakeTerm: '',
    isReferred: 'No', referrerName: '', referrerContact: '', referrerRelation: '',
    files: []
  };

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file size and type
    const validFiles = selectedFiles.filter(file => {
      const isUnder10MB = file.size <= 10 * 1024 * 1024;
      if (!isUnder10MB) alert(`File ${file.name} is too large (max 10MB).`);
      return isUnder10MB;
    });

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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
        eduGraduation: JSON.stringify({ year: formData.eduGradYear, course: formData.eduGradCourse, university: formData.eduGradUniversity, percentage: formData.eduGradPercentage }),
        eduMasters: JSON.stringify({ year: formData.eduMasterYear, course: formData.eduMasterCourse, university: formData.eduMasterUniversity, percentage: formData.eduMasterPercentage }),
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

      const res = await api.post('/api/admin/students', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        const newStudentId = res.data.data.id;
        
        // Handle file uploads
        if (formData.files && formData.files.length > 0) {
          const uploadData = new FormData();
          formData.files.forEach(file => {
            uploadData.append('documents', file);
          });
          
          const uploadRes = await api.post(`/api/admin/students/${newStudentId}/upload`, uploadData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          if (!uploadRes.data.success) {
            alert('Student created, but there was an error uploading documents.');
          }
        }
        
        alert('Student created successfully.');
        setFormData(initialForm);
        onSuccess(res.data.data);
        onClose();
      } else {
        alert(res.data.error || 'Failed to save student');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || error.message || 'Error creating student.';
      alert('Error creating student: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left">
      <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Add New Student</h2>
        
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
              </div><h4 className="md:col-span-2 font-semibold text-slate-600 mt-4 mb-1 border-b pb-1">12th / Class 12</h4>
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
              </div><h4 className="md:col-span-2 font-semibold text-slate-600 mt-4 mb-1 border-b pb-1">Diploma</h4>
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
              </div><h4 className="md:col-span-2 font-semibold text-slate-600 mt-4 mb-1 border-b pb-1">Graduation</h4>
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
              </div><h4 className="md:col-span-2 font-semibold text-slate-600 mt-4 mb-1 border-b pb-1">Masters</h4>
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
              </div>{formData.languageTest === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Test Name </label>
                <input type="text" name="languageTestOther" value={formData.languageTestOther} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  />
              </div>)}{formData.languageTest !== 'None' && formData.languageTest !== '' && (
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
              </div>{formData.isReferred === 'Yes' && (
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
              </div></React.Fragment>
        )}
            </div>
          </div>


          <div className="flex justify-end gap-3 mt-8 border-t pt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 disabled:opacity-70">
              {loading ? 'Saving...' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
