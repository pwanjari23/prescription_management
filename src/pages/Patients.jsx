import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Filter, ChevronDown, User, UserPlus, X, CheckCircle } from 'lucide-react';
import { patients as initialPatients } from '../data/patients';
import { doctors } from '../data/doctors';

export default function Patients() {
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    age: '',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+',
    allergies: '',
    existingConditions: '',
    doctorId: 'DOC-001',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newId = `PT-00${124 + patientList.length + 1}`;
    const selectedDoctor = doctors.find(d => d.id === formData.doctorId) || doctors[0];

    const newPatient = {
      id: newId,
      name: formData.name,
      gender: formData.gender,
      age: parseInt(formData.age) || 45,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      address: formData.address || 'Nagpur, Maharashtra',
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
      existingConditions: formData.existingConditions ? formData.existingConditions.split(',').map(c => c.trim()) : ['Hypertension'],
      doctor: selectedDoctor.name,
      doctorId: selectedDoctor.id,
      registeredDate: new Date().toISOString().split('T')[0],
      lastVisit: '2026-09-01',
      prescriptionsCount: 0,
      vitalsHistory: [
        { date: '2026-09-01', bp: '120/80', pulse: '72', temp: '98.6', weight: '68' },
      ],
      medicalHistory: 'New patient registered via clinic portal.',
    };

    setPatientList(prev => [newPatient, ...prev]);
    setShowModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    // Reset form
    setFormData({
      name: '',
      gender: 'Male',
      age: '',
      phone: '',
      email: '',
      address: '',
      bloodGroup: 'O+',
      allergies: '',
      existingConditions: '',
      doctorId: 'DOC-001',
    });
  };

  const filtered = patientList.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q);
    const matchDoctor = !filterDoctor || p.doctorId === filterDoctor;
    const matchGender = !filterGender || p.gender === filterGender;
    return matchSearch && matchDoctor && matchGender;
  });

  const formatDate = (d) => {
    if (!d) return '—';
    if (d === '2026-09-01') return 'Today';
    if (d === '2026-08-31') return 'Yesterday';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
  };

  return (
    <div className="space-y-5">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage and access patient information — {patientList.length} total records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={16} />
          Add Patient
        </button>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium animate-fade-in shadow-sm">
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          <span>New patient record added successfully!</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="patient-search"
              type="text"
              className="form-input pl-9"
              placeholder="Search by patient name, ID or mobile number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex-shrink-0"
          >
            <Filter size={15} />
            Filters
            <ChevronDown size={13} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
            <div>
              <label className="form-label">Doctor</label>
              <select
                className="form-select"
                value={filterDoctor}
                onChange={e => setFilterDoctor(e.target.value)}
              >
                <option value="">All Doctors</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={filterGender}
                onChange={e => setFilterGender(e.target.value)}
              >
                <option value="">All</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setFilterDoctor(''); setFilterGender(''); setSearchQuery(''); }}
                className="btn-secondary text-xs"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <User size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No patients found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>ID</th>
                  <th className="hidden sm:table-cell">Age</th>
                  <th className="hidden md:table-cell">Gender</th>
                  <th className="hidden lg:table-cell">Conditions</th>
                  <th className="hidden sm:table-cell">Last Visit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="cursor-pointer" onClick={() => navigate(`/patients/${p.id}`)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-900 text-xs font-bold">
                            {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{p.name}</p>
                          <p className="text-xs text-slate-400 sm:hidden">{p.id} · {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono text-xs text-slate-600">{p.id}</span></td>
                    <td className="hidden sm:table-cell text-slate-600">{p.age} yrs</td>
                    <td className="hidden md:table-cell text-slate-600">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                        {p.gender}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.existingConditions.slice(0, 2).map(c => (
                          <span key={c} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {c}
                          </span>
                        ))}
                        {p.existingConditions.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                            +{p.existingConditions.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="text-xs text-slate-600">{formatDate(p.lastVisit)}</span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/patients/${p.id}`)}
                        className="flex items-center gap-1 text-xs font-medium text-primary-900 hover:underline"
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Patient Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-fade-in overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UserPlus size={16} className="text-primary-900" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">Add New Patient</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddPatient} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="form-label">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Gender <span className="text-red-500">*</span></label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Age (Years) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="age"
                    className="form-input"
                    placeholder="e.g. 52"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="form-label">Blood Group</label>
                  <select
                    name="bloodGroup"
                    className="form-select"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="e.g. 9823012345"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="e.g. ramesh@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Address / Area</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="e.g. Dharampeth, Nagpur"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="form-label">Attending Doctor</label>
                <select
                  name="doctorId"
                  className="form-select"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Drug Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    className="form-input"
                    placeholder="e.g. Penicillin, Sulfa"
                    value={formData.allergies}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="form-label">Known Conditions</label>
                  <input
                    type="text"
                    name="existingConditions"
                    className="form-input"
                    placeholder="e.g. Stable Angina, Diabetes"
                    value={formData.existingConditions}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Modal Actions */}
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
                  Add Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
