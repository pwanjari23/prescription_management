import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Eye, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { mockFollowUps } from '../data/mockData';

export default function FollowUps() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredFollowUps = mockFollowUps.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || item.patientName.toLowerCase().includes(q) || item.patientId.toLowerCase().includes(q) || item.reason.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={12} className="text-emerald-500" />
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle size={12} className="text-amber-500" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} className="text-blue-500" />
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Follow-Up Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track patient follow-up schedules, reviews, and clinical status</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-600">
          <Calendar size={14} className="text-primary-900" />
          <span>Total Follow-ups Due: <strong className="text-slate-900">{mockFollowUps.length}</strong></span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="form-input pl-9 text-xs"
              placeholder="Search by patient name, ID, or reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['All', 'Upcoming', 'Pending', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-primary-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-up Table */}
      <div className="card overflow-hidden">
        {filteredFollowUps.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Calendar size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium text-slate-600">No follow-ups found</p>
            <p className="text-xs mt-1">Try clearing filters or search terms</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Patient ID</th>
                  <th>Follow-up Date</th>
                  <th>Reason for Follow-up</th>
                  <th>Assigned Doctor</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFollowUps.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-900 text-xs font-bold">
                            {item.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{item.patientName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-slate-600">{item.patientId}</span>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-slate-700">{item.displayDate}</span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600">{item.reason}</span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500">{item.doctor}</span>
                    </td>
                    <td>
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/patients/${item.patientId}`)}
                          className="btn-secondary btn-sm flex items-center gap-1"
                        >
                          <User size={13} /> View Patient
                        </button>
                        <button
                          onClick={() => navigate(`/prescriptions/new?patient=${item.patientId}`)}
                          className="btn-primary btn-sm flex items-center gap-1"
                        >
                          Start Consult <ArrowRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
