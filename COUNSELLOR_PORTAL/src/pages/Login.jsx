import React, { useState } from 'react';
import { useAuth } from '../App';
import { API_BASE_URL } from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function Login() {
  const [counsellorId, setCounsellorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/counsellor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counsellorId, password })
      });
      const data = await res.json();
      
      if (data.success) {
        login(data.token, data.counsellor);
        navigate(`/c/${data.counsellor.slug}`);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Pane - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/90">
            <span className="font-black text-2xl tracking-wider">SPINFYOT</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-medium">EDU</span>
          </div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Empower Students to Reach Their Global Dreams.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Welcome back to the Counsellor Portal. Access your CRM, track enrollments, and manage call-back requests seamlessly.
          </p>
        </div>
        
        <div className="relative z-10 text-white/50 text-sm">
          &copy; {new Date().getFullYear()} SpinFyot. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
        <div className="max-w-md w-full">
          <div className="mb-10 lg:hidden">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">SPINFYOT</h1>
          </div>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in to your Counsellor account to continue.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Counsellor ID or Email</label>
              <input
                type="text"
                required
                value={counsellorId}
                onChange={(e) => setCounsellorId(e.target.value)}
                className="w-full px-5 py-4 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 shadow-sm"
                placeholder="e.g. COUN001 or name@spinfyot.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5"
            >
              Access Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
