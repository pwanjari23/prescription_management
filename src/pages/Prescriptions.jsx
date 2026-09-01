import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Filter, FileText } from 'lucide-react';
import { prescriptions } from '../data/prescriptions';

const StatusBadge = ({ status }) => {
  const cfg = {
    Finalized: { cls: 'badge-finalized', dot: 'bg-emerald-500' },
    Draft: { cls: 'badge-draft', dot: 'bg-slate-400' },
    Cancelled: { cls: 'badge-cancelled', dot: 'bg-red-500' },
  };
  const { cls, dot } = cfg[status] || cfg.Draft;
  return (
    <span className={`badge ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

export default function Prescriptions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = prescriptions.filter(rx => {
    const q = search.toLowerCase();
    const matchSearch = !q || rx.id.toLowerCase().includes(q) || rx.patientName.toLowerCase().includes(q);
    const matchStatus = !statusFilter || rx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Prescriptions</h1>
          <p className="page-subtitle">{prescriptions.length} total prescriptions on record</p>
        </div>
        <button onClick={() => navigate('/prescriptions/new')} className="btn-primary flex-shrink-0">
          <Plus size={16} /> New Prescription
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="form-input pl-9"
              placeholder="Search by prescription ID or patient name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['', 'Finalized', 'Draft', 'Cancelled'].map(s => (
              <button
                key={s || 'all'}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  statusFilter === s
                    ? 'bg-primary-900 text-white border-primary-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prescription Cards (Mobile) / Table (Desktop) */}
      <div className="block lg:hidden space-y-3">
        {filtered.map(rx => (
          <div key={rx.id} className="card p-4 hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate(`/prescriptions/${rx.id}`)}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold text-primary-900">{rx.id}</span>
                  <StatusBadge status={rx.status} />
                </div>
                <p className="font-semibold text-slate-900 text-sm">{rx.patientName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{rx.date} · {rx.time}</p>
                <p className="text-xs text-slate-600 mt-1">{rx.medicines.length} medicines · {rx.doctorName}</p>
              </div>
              <Eye size={16} className="text-slate-400 flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Table (Desktop) */}
      <div className="card overflow-hidden hidden lg:block">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FileText size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No prescriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Prescription ID</th>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Doctor</th>
                  <th>Medicines</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rx => (
                  <tr key={rx.id} className="cursor-pointer" onClick={() => navigate(`/prescriptions/${rx.id}`)}>
                    <td>
                      <span className="font-mono text-xs font-semibold text-primary-900">{rx.id}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-900 text-[10px] font-bold">
                            {rx.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{rx.patientName}</span>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm text-slate-700">{rx.date}</p>
                      <p className="text-xs text-slate-400">{rx.time}</p>
                    </td>
                    <td className="text-sm text-slate-600">{rx.doctorName}</td>
                    <td>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {rx.medicines.length} medicines
                      </span>
                    </td>
                    <td><StatusBadge status={rx.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/prescriptions/${rx.id}`)}
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
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
          Showing {filtered.length} of {prescriptions.length} prescriptions
        </div>
      </div>
    </div>
  );
}
