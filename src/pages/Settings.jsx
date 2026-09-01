import { useState } from 'react';
import { User, Building2, FileText, Shield, CheckCircle } from 'lucide-react';
import { currentDoctor } from '../data/doctors';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'clinic', label: 'Clinic', icon: Building2 },
  { id: 'prescription', label: 'Prescription', icon: FileText },
  { id: 'account', label: 'Account & Security', icon: Shield },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your profile, clinic details, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-100 text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-900 text-xl font-bold">{currentDoctor.initials}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{currentDoctor.name}</p>
              <p className="text-xs text-slate-500">{currentDoctor.designation}</p>
            </div>
            <nav className="p-2">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                    activeSection === id ? 'bg-primary-50 text-primary-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 card p-6 space-y-5">
          {saved && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm animate-fade-in">
              <CheckCircle size={16} />
              Settings saved successfully!
            </div>
          )}

          {activeSection === 'profile' && (
            <>
              <h2 className="text-base font-semibold text-slate-900">Doctor Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" defaultValue={currentDoctor.name} />
                </div>
                <div>
                  <label className="form-label">Designation</label>
                  <input className="form-input" defaultValue={currentDoctor.designation} />
                </div>
                <div>
                  <label className="form-label">Qualification</label>
                  <input className="form-input" defaultValue={currentDoctor.qualification} />
                </div>
                <div>
                  <label className="form-label">Registration Number</label>
                  <input className="form-input" defaultValue={currentDoctor.regNumber} placeholder="MH-XXXXX" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" defaultValue={currentDoctor.phone} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" defaultValue={currentDoctor.email} />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Specialization</label>
                  <input className="form-input" defaultValue={currentDoctor.specialization} />
                </div>
              </div>
            </>
          )}

          {activeSection === 'clinic' && (
            <>
              <h2 className="text-base font-semibold text-slate-900">Clinic Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Hospital Name</label>
                  <input className="form-input" defaultValue="Shree Swami Samarth Hospital" />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Address</label>
                  <textarea className="form-textarea" rows={2} defaultValue="Shop No. 57, B, behind Gajanan Maharaj Mandir, Trimurtee Nagar, Nagpur, Maharashtra 440022" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" defaultValue="7083493268" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" defaultValue="drpradip_patil@yahoo.com" />
                </div>
                <div>
                  <label className="form-label">Website</label>
                  <input className="form-input" defaultValue="eecpsssh.com" />
                </div>
              </div>
            </>
          )}

          {activeSection === 'prescription' && (
            <>
              <h2 className="text-base font-semibold text-slate-900">Prescription Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Prescription Header</label>
                  <textarea className="form-textarea" rows={2} defaultValue="Shree Swami Samarth Hospital — Non-Surgical Cardiac Care" />
                </div>
                <div>
                  <label className="form-label">Default Footer</label>
                  <textarea className="form-textarea" rows={2} defaultValue="Phone: 7083493268 | Address: Trimurtee Nagar, Nagpur – 440022" />
                </div>
                <div>
                  <label className="form-label">Default Follow-up Duration</label>
                  <div className="flex gap-2 max-w-xs">
                    <input type="number" className="form-input w-20" defaultValue="30" />
                    <select className="form-select"><option>Days</option><option>Weeks</option><option>Months</option></select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Default Advice (appended to all prescriptions)</label>
                  <textarea className="form-textarea" rows={3} defaultValue="Take medicines regularly as prescribed. Return immediately if symptoms worsen." />
                </div>
              </div>
            </>
          )}

          {activeSection === 'account' && (
            <>
              <h2 className="text-base font-semibold text-slate-900">Account & Security</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Change Password</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-input" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-input" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Two-Factor Authentication</h3>
                  <p className="text-xs text-slate-500 mb-3">Add an extra layer of security to your account</p>
                  <button className="btn-secondary btn-sm">Enable 2FA</button>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Active Sessions</h3>
                  <div className="space-y-2">
                    {[
                      { device: 'Chrome on Windows 11', location: 'Nagpur, India', time: 'Active now', current: true },
                      { device: 'Safari on iPhone', location: 'Nagpur, India', time: '2 hours ago', current: false },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="text-xs font-medium text-slate-800">{s.device}</p>
                          <p className="text-[11px] text-slate-400">{s.location} · {s.time}</p>
                        </div>
                        {s.current ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">Current</span>
                        ) : (
                          <button className="text-[11px] text-red-600 hover:underline">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button onClick={handleSave} className="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
