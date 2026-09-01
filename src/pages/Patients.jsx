import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, User, UserPlus, X, CheckCircle, CalendarClock, Filter } from 'lucide-react';
import { mockPatients } from '../data/mockData';

export default function Patients() {
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newId = `PT-00${124 + patientList.length + 1}`;
    const newPatient = {
      id: newId,
      name: formData.name,
      gender: formData.gender,
      age: parseInt(formData.age) || 45,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      address: formData.address || 'Nagpur, Maharashtra',
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
      existingConditions: formData.existingConditions ? formData.existingConditions.split(',').map(c => c.trim()) : ['Hypertension'],
      currentMedications: [],
      medicalHistory: 'New patient record added.',
      lastVisit: '2026-09-01',
      nextFollowUp: '2026-09-15',
      doctor: 'Dr. Pradeep Patil',
      doctorId: 'D001',
      prescriptionCount: 0,
      status: 'Active',
      patientType: 'New Patient',
      registeredOn: new Date().toISOString().split('T')[0],
      notes: 'Initial clinical registration.',
    };

    setPatientList(prev => [newPatient, ...prev]);
    setShowModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

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
    });
  };

  // Filter & Search Logic (Frontend Only)
  const filteredPatients = patientList.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.phone.includes(q);

    let matchesFilter = true;
    if (activeFilter === 'New Patients') {
      matchesFilter = p.patientType === 'New Patient';
    } else if (activeFilter === 'Returning Patients') {
      matchesFilter = p.patientType === 'Returning Patient';
    } else if (activeFilter === 'Follow-up Due') {
      matchesFilter = p.patientType === 'Follow-up Due';
    }

    return matchesSearch && matchesFilter;
  });

  const getPatientTypeBadge = (type) => {
    switch (type) {
      case 'New Patient':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">New Patient</span>;
      case 'Follow-up Due':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Follow-up Due</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Returning Patient</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage records, medical histories, and clinical profiles — {patientList.length} total records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={16} />
          Add Patient
        </button>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium shadow-xs">
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          <span>New patient record added successfully!</span>
        </div>
      )}

      {/* Search & Category Filter Controls */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="patient-search-input"
              type="text"
              className="form-input pl-9 text-xs"
              placeholder="Search by patient name, ID, or phone number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1 hidden sm:flex">
              <Filter size={13} /> Filter:
            </span>
            {['All', 'New Patients', 'Returning Patients', 'Follow-up Due'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-primary-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="card overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <User size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-semibold text-slate-700">No patients found</p>
            <p className="text-xs mt-1 text-slate-400">Try adjusting your search criteria or clear active filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age / Gender</th>
                  <th>Phone</th>
                  <th>Last Visit</th>
                  <th>Next Follow-up</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/patients/${p.id}`)}
                  >
                    <td>
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {p.id}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-900 text-xs font-bold">
                            {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-600 text-xs">
                      {p.age} yrs · {p.gender}
                    </td>
                    <td className="text-slate-600 text-xs font-mono">
                      {p.phone}
                    </td>
                    <td className="text-slate-600 text-xs font-medium">
                      {p.lastVisit || '—'}
                    </td>
                    <td className="text-slate-600 text-xs font-medium">
                      {p.nextFollowUp ? (
                        <span className="flex items-center gap-1 text-slate-700">
                          <CalendarClock size={12} className="text-amber-500" />
                          {p.nextFollowUp}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      {getPatientTypeBadge(p.patientType)}
                    </td>
                    <td className="text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/patients/${p.id}`)}
                        className="btn-secondary btn-sm flex items-center gap-1 ml-auto"
                      >
                        <Eye size={13} /> View Patient
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-fade-in overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UserPlus size={16} className="text-primary-900" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Add New Patient</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

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
