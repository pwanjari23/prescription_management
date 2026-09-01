import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FileText, Calendar, TrendingUp, TrendingDown,
  Search, Eye, Clock, UserPlus, FilePlus, ArrowRight,
  Activity, CalendarClock, Stethoscope, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { currentDoctor } from '../data/doctors';
import { mockPatients, mockAppointments, mockFollowUps, mockPrescriptions } from '../data/mockData';

const getHour = () => new Date().getHours();
const getGreeting = () => {
  const h = getHour();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const AppointmentStatusBadge = ({ status }) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={11} className="text-emerald-500" />
          Completed
        </span>
      );
    case 'In Consultation':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 animate-pulse">
          <Stethoscope size={11} className="text-purple-500" />
          In Consultation
        </span>
      );
    case 'Waiting':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock size={11} className="text-amber-500" />
          Waiting
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Calendar size={11} className="text-blue-500" />
          Upcoming
        </span>
      );
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(mockAppointments.length / itemsPerPage);
  const paginatedAppointments = mockAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = [
    { label: "Total Patients", value: "128", trend: "+3.2%", positive: true, icon: Users, color: "text-purple-700", iconBg: "bg-purple-50" },
    { label: "Today's Patients", value: "12", trend: "+12%", positive: true, icon: Users, color: "text-blue-700", iconBg: "bg-blue-50" },
    { label: "Follow-ups Due", value: "5", trend: "-2", positive: false, icon: CalendarClock, color: "text-amber-700", iconBg: "bg-amber-50" },
    { label: "Upcoming Appointments", value: "8", trend: "+5%", positive: true, icon: Calendar, color: "text-emerald-700", iconBg: "bg-emerald-50" },
  ];

  const quickActions = [
    { label: 'New Patient', icon: UserPlus, color: 'bg-primary-900 text-white hover:bg-primary-800', path: '/patients' },
    { label: 'New Prescription', icon: FilePlus, color: 'bg-teal-700 text-white hover:bg-teal-800', path: '/prescriptions/new' },
    { label: 'Search Patient', icon: Search, color: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200', path: '/patients' },
    { label: 'Follow-ups List', icon: CalendarClock, color: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200', path: '/follow-ups' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {getGreeting()}, {currentDoctor.name} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Here's your clinic overview for today — <span className="font-medium text-slate-700">Tuesday, 01 September 2026</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-xs">
          <Activity size={14} className="text-emerald-500" />
          <span className="text-emerald-700 font-semibold">Clinic Active</span>
          <span className="text-slate-300">·</span>
          <span>OPD Hours: 09:00 AM – 06:00 PM</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4 hover:shadow-card-hover transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${stat.positive ? 'text-emerald-700' : 'text-amber-600'}`}>
                {stat.positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, color, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center justify-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all duration-150 shadow-xs ${color}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Today's Patients & Follow-ups */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Patients Section */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Patients</h2>
              <p className="text-xs text-slate-500">Live consultation queue and appointment list</p>
            </div>
            <button
              onClick={() => navigate('/patients')}
              className="text-xs font-semibold text-primary-900 hover:underline flex items-center gap-1"
            >
              All Patients <ArrowRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Appt Time</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-900 text-xs font-bold">
                            {apt.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{apt.patientName}</p>
                          <p className="text-xs text-slate-400 font-mono">{apt.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono">
                        {apt.appointmentTime}
                      </span>
                    </td>
                    <td>
                      <AppointmentStatusBadge status={apt.status} />
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/patients/${apt.patientId}`)}
                          className="btn-secondary btn-sm"
                          title="View Patient Profile"
                        >
                          <Eye size={12} />
                          <span className="hidden md:inline">View Patient</span>
                        </button>
                        <button
                          onClick={() => navigate(`/prescriptions/RX-2026-00128/preview`)}
                          className="btn-secondary btn-sm"
                          title="View Prescription"
                        >
                          <FileText size={12} />
                          <span className="hidden md:inline">Prescription</span>
                        </button>
                        <button
                          onClick={() => navigate(`/prescriptions/new?patient=${apt.patientId}`)}
                          className="btn-primary btn-sm"
                          title="Start Consultation"
                        >
                          <Stethoscope size={12} />
                          <span>Consult</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {mockAppointments.length > itemsPerPage && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <span>
                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong>{Math.min(currentPage * itemsPerPage, mockAppointments.length)}</strong> of{' '}
                <strong>{mockAppointments.length}</strong> patients
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 font-semibold transition-all shadow-2xs"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="font-semibold text-slate-700 px-2.5 py-1 bg-white border border-slate-200 rounded-md">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 font-semibold transition-all shadow-2xs"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Follow-ups Due & Recent Prescriptions */}
        <div className="space-y-5">
          {/* Follow-ups Due Widget */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock size={16} className="text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">Follow-ups Due</h2>
              </div>
              <button
                onClick={() => navigate('/follow-ups')}
                className="text-xs text-primary-900 font-semibold hover:underline"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {mockFollowUps.slice(0, 4).map((f) => (
                <div key={f.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{f.patientName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{f.reason}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Due: {f.displayDate}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/patients/${f.patientId}`)}
                      className="text-xs font-medium text-primary-900 hover:underline flex-shrink-0"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Recent Prescriptions</h2>
              <button
                onClick={() => navigate('/prescriptions')}
                className="text-xs text-primary-900 font-semibold hover:underline"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {mockPrescriptions.map((rx) => (
                <div key={rx.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-mono font-bold text-primary-900">{rx.id}</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{rx.patientName}</p>
                      <p className="text-[11px] text-slate-500">{rx.diagnosis}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/prescriptions/${rx.id}/preview`)}
                      className="btn-secondary btn-sm text-[11px]"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
