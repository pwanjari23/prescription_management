import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle } from 'lucide-react';

export default function AddPatient() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: '', dob: '', age: '', gender: '', phone: '', email: '', address: '',
    bloodGroup: '', allergies: '', existingConditions: '', medicalHistory: '', currentMedications: '', notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'dob' && value) {
      const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
      setForm(f => ({ ...f, dob: value, age: String(age) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 700));
    setSaved(true);
    setTimeout(() => navigate('/patients'), 1800);
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Patient Saved!</h2>
        <p className="text-slate-500 text-sm">Redirecting to patient list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full">
      <button onClick={() => navigate('/patients')} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back to Patients
      </button>

      <div className="page-header mb-0">
        <h1 className="page-title">Add New Patient</h1>
        <p className="page-subtitle">Fill in the patient's personal and medical information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
            <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
              <User size={14} className="text-primary-900" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="form-label">Full Name <span className="text-red-500">*</span></label>
              <input name="fullName" type="text" className="form-input" placeholder="e.g. Rahul Sharma" value={form.fullName} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Date of Birth</label>
              <input name="dob" type="date" className="form-input" value={form.dob} onChange={handleChange} max="2026-09-01" />
            </div>
            <div>
              <label className="form-label">Age (Years)</label>
              <input name="age" type="number" className="form-input" placeholder="Auto-calculated from DOB" value={form.age} onChange={handleChange} min="0" max="130" />
            </div>
            <div>
              <label className="form-label">Gender <span className="text-red-500">*</span></label>
              <select name="gender" className="form-select" value={form.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Blood Group</label>
              <select name="bloodGroup" className="form-select" value={form.bloodGroup} onChange={handleChange}>
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Mobile Number <span className="text-red-500">*</span></label>
              <input name="phone" type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" placeholder="patient@email.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Address</label>
              <input name="address" type="text" className="form-input" placeholder="Street, Area, Nagpur" value={form.address} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
            <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xs font-bold">Rx</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Medical Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="form-label">Known Allergies</label>
              <input name="allergies" type="text" className="form-input" placeholder="e.g. Penicillin, Sulfa drugs (comma-separated)" value={form.allergies} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Existing Medical Conditions</label>
              <input name="existingConditions" type="text" className="form-input" placeholder="e.g. Hypertension, Diabetes (comma-separated)" value={form.existingConditions} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Current Medications</label>
              <input name="currentMedications" type="text" className="form-input" placeholder="e.g. Aspirin 75mg, Metformin 500mg" value={form.currentMedications} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Medical History</label>
              <textarea name="medicalHistory" className="form-textarea" rows={4} placeholder="Describe relevant medical history, past surgeries, hospitalizations..." value={form.medicalHistory} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Doctor's Notes</label>
              <textarea name="notes" className="form-textarea" rows={3} placeholder="Internal notes (not shown to patient)..." value={form.notes} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button type="button" onClick={() => navigate('/patients')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <CheckCircle size={15} />
            Save Patient
          </button>
        </div>
      </form>
    </div>
  );
}
