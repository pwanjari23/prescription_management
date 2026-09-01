import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Filter, ChevronDown, User } from 'lucide-react';
import { patients } from '../data/patients';
import { doctors } from '../data/doctors';

export default function Patients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = patients.filter(p => {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage and access patient information — {patients.length} total records</p>
        </div>
        <button
          onClick={() => navigate('/patients/new')}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={16} />
          Add Patient
        </button>
      </div>

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
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {patients.length} patients</span>
          <span className="text-slate-400">Demo data only</span>
        </div>
      </div>
    </div>
  );
}
