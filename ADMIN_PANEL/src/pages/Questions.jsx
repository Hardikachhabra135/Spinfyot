import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../App';
import { Download, Search } from 'lucide-react';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/api/admin/questions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setQuestions(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/questions/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(questions.map(app => app.id === id ? { ...app, status } : app));
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = questions.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.serviceSlug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Ask a Question Submissions</h1>
        <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, service..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold min-w-[300px]">Question</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No questions found.</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4 text-sm">
                      <div className="font-medium text-slate-800">{item.name}</div>
                      <div className="text-slate-600">{item.email}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-500"><span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-medium">{item.serviceSlug}</span></td>
                    <td className="p-4 text-sm text-slate-600 italic whitespace-pre-wrap">"{item.question}"</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <select 
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`text-sm rounded-full px-3 py-1 font-medium border-0 outline-none cursor-pointer
                          ${item.status === 'New' ? 'bg-blue-100 text-blue-700' : ''}
                          ${item.status === 'Answered' ? 'bg-green-100 text-green-700' : ''}
                        `}
                      >
                        <option value="New">New</option>
                        <option value="Answered">Answered</option>
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
