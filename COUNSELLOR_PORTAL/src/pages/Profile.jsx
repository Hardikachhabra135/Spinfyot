import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase } from 'lucide-react';
import { useAuth } from '../App';

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/counsellor/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-center">Profile not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <User className="text-blue-500" /> My Profile
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              <Briefcase size={16} /> {profile.counsellorId}
            </p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="text-slate-400" size={20} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="text-slate-400" size={20} />
                <span>{profile.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Professional Details</h3>
            <div className="space-y-4">
              <div>
                <span className="block text-sm text-slate-500">Specialization</span>
                <span className="font-medium text-slate-900">{profile.specialization || '-'}</span>
              </div>
              <div>
                <span className="block text-sm text-slate-500">Account Status</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">
                  {profile.status}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Biography</h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {profile.bio || 'No biography provided.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
