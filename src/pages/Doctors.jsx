import { useState } from 'react';
import { Phone, Mail, Users, Plus, X, UserPlus, CheckCircle } from 'lucide-react';
import { doctors as initialDoctors } from '../data/doctors';

const colorMap = {
  '#0F2D5E': 'bg-blue-100 text-blue-900',
  '#0B7285': 'bg-cyan-100 text-cyan-900',
  '#2D6A4F': 'bg-emerald-100 text-emerald-900',
  '#7C3AED': 'bg-purple-100 text-purple-900',
  '#B45309': 'bg-amber-100 text-amber-900',
  '#DB2777': 'bg-pink-100 text-pink-900',
  '#0891B2': 'bg-sky-100 text-sky-900',
  '#059669': 'bg-green-100 text-green-900',
};

const defaultColor = 'bg-primary-100 text-primary-900';

export default function Doctors() {
  const [doctorList, setDoctorList] = useState(initialDoctors);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: 'Doctor',
    specialization: '',
    qualification: '',
    regNumber: '',
    experience: '',
    phone: '',
    email: '',
    available: true,
  });

  const getInitials = (name) => {
    if (!name) return 'DR';
    return name
      .replace(/^Dr\.\s*/i, '')
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const formattedName = formData.name.startsWith('Dr.') || formData.name.startsWith('dr.')
      ? formData.name
      : `Dr. ${formData.name}`;

    const newDoctor = {
      id: `DOC-00${doctorList.length + 1}`,
      name: formattedName,
      initials: getInitials(formattedName),
      designation: formData.designation || 'Doctor',
      specialization: formData.specialization || 'Cardiology',
      qualification: formData.qualification || 'MBBS',
      regNumber: formData.regNumber || 'MH-NEW',
      experience: formData.experience ? `${formData.experience} yrs` : '5 yrs',
      phone: formData.phone || '7083493268',
      email: formData.email || 'doctor@sssh.com',
      available: formData.available,
      patientsToday: 0,
      color: '#0F2D5E',
    };

    setDoctorList(prev => [newDoctor, ...prev]);
    setShowModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    // Reset form
    setFormData({
      name: '',
      designation: 'Doctor',
      specialization: '',
      qualification: '',
      regNumber: '',
      experience: '',
      phone: '',
      email: '',
      available: true,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Doctors &amp; Staff</h1>
          <p className="page-subtitle">
            Medical team at Shree Swami Samarth Hospital ({doctorList.length} members)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={16} />
          Add Doctor / Staff
        </button>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium animate-fade-in shadow-sm">
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          <span>New doctor / staff member added successfully!</span>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {doctorList.map(doc => {
          const colorClass = colorMap[doc.color] || defaultColor;
          return (
            <div key={doc.id} className="card p-5 hover:shadow-card-hover transition-all duration-200">
              <div className="flex flex-col items-center text-center mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mb-3 ${colorClass}`}>
                  {doc.initials}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 text-sm">{doc.name}</h3>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${doc.available ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                </div>
                <p className="text-xs text-slate-500">{doc.designation}</p>
                <p className="text-xs text-primary-900 font-medium mt-0.5">{doc.specialization}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-20 text-slate-400 flex-shrink-0">Qualification</span>
                  <span className="font-medium truncate">{doc.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-slate-400 flex-shrink-0">Experience</span>
                  <span className="font-medium">{doc.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-slate-400 flex-shrink-0">Today</span>
                  <span className={`font-medium ${doc.available ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {doc.available ? `${doc.patientsToday} patients` : 'Not available'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-3">
                <a href={`tel:${doc.phone}`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                  <Phone size={14} />
                </a>
                <a href={`mailto:${doc.email}`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                  <Mail size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital Info Card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">About Shree Swami Samarth Hospital</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-400 text-xs mb-1">Specialization</p>
            <p className="font-medium text-slate-800">Non-Surgical Cardiac Care · Advanced EECP</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Collaboration</p>
            <p className="font-medium text-slate-800">Vasomeditech USA · Heal Your Heart Centre</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Technology</p>
            <p className="font-medium text-slate-800">US-FDA approved TS-3 EECP Machine</p>
          </div>
        </div>
      </div>

      {/* Add Doctor / Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-fade-in overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UserPlus size={16} className="text-primary-900" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">Add New Doctor / Staff Member</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddDoctor} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="form-label">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Dr. Anjali Patil"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Designation / Role</label>
                  <input
                    type="text"
                    name="designation"
                    className="form-input"
                    placeholder="e.g. Senior Consultant"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    className="form-input"
                    placeholder="e.g. Non-Surgical Cardiology"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    className="form-input"
                    placeholder="e.g. MBBS, MD (Cardiology)"
                    value={formData.qualification}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="form-label">Registration Number</label>
                  <input
                    type="text"
                    name="regNumber"
                    className="form-input"
                    placeholder="e.g. MH-67890"
                    value={formData.regNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    className="form-input"
                    placeholder="e.g. 10"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div>
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="e.g. 7083493268"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="e.g. doctor@sssh.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-primary-900 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">Currently Available / On Duty</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus size={15} />
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
