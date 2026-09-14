import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ChevronDown, Check, X, Calendar, 
  Clock, Mail, Phone, MapPin, GraduationCap, Briefcase, 
  Download, ArrowRight, UserCheck, MessageSquare, History, Archive
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../App';

export default function ContactForms() {
  const { token } = useAuth();
  
  // Data State
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('Newest First');
  
  // Detail Drawer State
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Interaction State
  const [noteText, setNoteText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/contact-forms?status=${statusFilter}&sort=${sortFilter}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setContacts(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, sortFilter, token]);

  const fetchContactDetails = async (id) => {
    try {
      const res = await api.get(`/api/admin/contact-forms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSelectedContact(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch contact details:', error);
    }
  };

  const handleOpenContact = async (contact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
    await fetchContactDetails(contact.id);
    
    // Automatically mark as VIEWED if NEW
    if (contact.status === 'NEW') {
      await changeStatus(contact.id, 'VIEWED');
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await api.patch(`/api/admin/contact-forms/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchContactDetails(id);
      fetchContacts();
    } catch (error) {
      console.error('Failed to change status:', error);
      alert('Error updating status');
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      await api.post(`/api/admin/contact-forms/${selectedContact.id}/notes`, { note: noteText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNoteText('');
      await fetchContactDetails(selectedContact.id);
    } catch (error) {
      alert('Error adding note');
    }
  };

  const scheduleFollowUp = async () => {
    if (!followUpDate || !followUpTime) return alert("Date and Time are required");
    try {
      await api.post(`/api/admin/contact-forms/${selectedContact.id}/follow-up`, { 
        date: followUpDate, 
        time: followUpTime, 
        note: followUpNote 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowUpDate('');
      setFollowUpTime('');
      setFollowUpNote('');
      await fetchContactDetails(selectedContact.id);
      fetchContacts();
    } catch (error) {
      alert('Error scheduling follow up');
    }
  };

  const convertToLead = async () => {
    if (!window.confirm("Are you sure you want to convert this contact into a Student Lead?")) return;
    try {
      setIsConverting(true);
      const res = await api.post(`/api/admin/contact-forms/${selectedContact.id}/convert`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert("Successfully converted to Student Lead!");
        await fetchContactDetails(selectedContact.id);
        fetchContacts();
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to convert to lead. Email may already exist.');
    } finally {
      setIsConverting(false);
    }
  };
  
  const archiveContact = async () => {
    if (!window.confirm("Are you sure you want to archive this contact?")) return;
    try {
      await api.post(`/api/admin/contact-forms/${selectedContact.id}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsDrawerOpen(false);
      fetchContacts();
    } catch (error) {
      alert('Error archiving contact');
    }
  };

  
  const exportCSV = () => {
    if (contacts.length === 0) return alert("No data to export");
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'State', 'Country', 'Qualification', 'Course', 'Service', 'Source', 'Status', 'Submitted At'];
    
    const csvRows = [headers.join(',')];
    
    contacts.forEach(c => {
      const row = [
        c.submission_id || `CF-${c.id}`,
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.phone || ''}"`,
        `"${c.state || ''}"`,
        `"${c.country || ''}"`,
        `"${c.qualification || ''}"`,
        `"${c.course || ''}"`,
        `"${c.service || ''}"`,
        `"${c.source || ''}"`,
        `"${c.status}"`,
        `"${new Date(c.createdAt).toLocaleString()}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `contact_forms_export_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'VIEWED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FOLLOW-UP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CONVERTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'NEW').length,
    converted: contacts.filter(c => c.status === 'CONVERTED').length,
    followUp: contacts.filter(c => c.status === 'FOLLOW-UP').length
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header & Stats */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contact Forms</h1>
          <p className="text-slate-500 mt-1">Manage public website enquiries and convert leads.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-semibold text-slate-500">Total Submissions</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <p className="text-sm font-semibold text-blue-600">New Enquiries</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{stats.new}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
          <p className="text-sm font-semibold text-purple-600">Follow-ups Due</p>
          <p className="text-3xl font-bold text-purple-700 mt-2">{stats.followUp}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <p className="text-sm font-semibold text-green-600">Converted Leads</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{stats.converted}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={exportCSV} className="px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl hover:bg-slate-700 focus:outline-none flex items-center gap-2 text-sm font-medium">
            <Download size={16} /> Export CSV
          </button>
          <select

            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="NEW">New</option>
            <option value="VIEWED">Viewed</option>
            <option value="CONTACTED">Contacted</option>
            <option value="FOLLOW-UP">Follow-up</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select 
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="Newest First">Newest First</option>
            <option value="Oldest First">Oldest First</option>
            <option value="Recently Updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Interest</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading contacts...</td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                  <Mail className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="text-lg font-medium text-slate-600">No Contact Enquiries Yet</p>
                  <p className="text-sm">New enquiries submitted through the website will appear here.</p>
                </td>
              </tr>
            ) : (
              contacts.map(contact => (
                <tr 
                  key={contact.id} 
                  onClick={() => handleOpenContact(contact)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{contact.submission_id || `CF-${contact.id}`}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{contact.name}</div>
                    <div className="text-sm text-slate-500">{contact.email}</div>
                    <div className="text-xs text-slate-400">{contact.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">{contact.country || 'N/A'}</div>
                    <div className="text-xs text-slate-500">{contact.course || contact.interest || 'No Course'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer Overlay */}
      {isDrawerOpen && selectedContact && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Contact Details</h2>
                <p className="text-sm text-slate-500">{selectedContact.submission_id}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={archiveContact} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Archive">
                  <Archive size={20} />
                </button>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => changeStatus(selectedContact.id, 'CONTACTED')} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Mark Contacted
                </button>
                <button onClick={() => changeStatus(selectedContact.id, 'CLOSED')} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Close Enquiry
                </button>
                {selectedContact.status !== 'CONVERTED' && (
                  <button onClick={convertToLead} disabled={isConverting} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 ml-auto flex items-center gap-2">
                    <UserCheck size={16} />
                    {isConverting ? 'Converting...' : 'Convert to Lead'}
                  </button>
                )}
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><UserCheck size={14}/> Contact Info</h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-slate-500 block text-xs">Name</span> <span className="font-medium text-slate-800">{selectedContact.name}</span></p>
                    <p><span className="text-slate-500 block text-xs">Email</span> <span className="font-medium text-slate-800">{selectedContact.email}</span></p>
                    <p><span className="text-slate-500 block text-xs">Phone</span> <span className="font-medium text-slate-800">{selectedContact.phone}</span></p>
                    <p><span className="text-slate-500 block text-xs">State / Region</span> <span className="font-medium text-slate-800">{selectedContact.state || 'N/A'}</span></p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><MapPin size={14}/> Study Interest</h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-slate-500 block text-xs">Target Country</span> <span className="font-medium text-slate-800">{selectedContact.country || 'N/A'}</span></p>
                    <p><span className="text-slate-500 block text-xs">Course</span> <span className="font-medium text-slate-800">{selectedContact.course || 'N/A'}</span></p>
                    <p><span className="text-slate-500 block text-xs">Service</span> <span className="font-medium text-slate-800">{selectedContact.service || 'N/A'}</span></p>
                    <p><span className="text-slate-500 block text-xs">Current Qualification</span> <span className="font-medium text-slate-800">{selectedContact.qualification || 'N/A'}</span></p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><MessageSquare size={14}/> Message / Enquiry</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedContact.message || 'No message provided.'}</p>
                <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
                  Source: <span className="font-medium text-slate-600">{selectedContact.source || 'Direct Website'}</span>
                </div>
              </div>

              {/* Follow-up Scheduler */}
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2"><Calendar size={14}/> Schedule Follow-up</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="px-3 py-2 rounded-lg border border-purple-200 text-sm flex-1 outline-none focus:ring-2 focus:ring-purple-500/20" />
                    <input type="time" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)} className="px-3 py-2 rounded-lg border border-purple-200 text-sm w-32 outline-none focus:ring-2 focus:ring-purple-500/20" />
                  </div>
                  <input type="text" placeholder="Note (e.g. Call regarding Canada Masters options)" value={followUpNote} onChange={e => setFollowUpNote(e.target.value)} className="px-3 py-2 rounded-lg border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-500/20" />
                  <button onClick={scheduleFollowUp} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 self-end">Set Follow-up</button>
                </div>
              </div>

              {/* Timeline / Notes */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><History size={14}/> Activity Timeline</h3>
                
                <div className="flex gap-2 mb-6">
                  <input type="text" placeholder="Add an internal note..." value={noteText} onChange={e => setNoteText(e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  <button onClick={addNote} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">Add Note</button>
                </div>

                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {selectedContact.ContactNotes?.map(note => (
                    <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-blue-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg bg-slate-50 border border-slate-100 shadow-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-slate-700 text-xs">{note.addedBy}</span>
                          <span className="text-slate-400 text-[10px]">{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-600 text-sm">{note.note}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Base Submission Event */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-blue-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg bg-slate-50 border border-slate-100 shadow-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700 text-xs">System</span>
                        <span className="text-slate-400 text-[10px]">{new Date(selectedContact.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 text-sm">Contact form submitted via {selectedContact.source || 'Website'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
