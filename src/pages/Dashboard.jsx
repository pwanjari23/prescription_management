import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FileText, Calendar, TrendingUp, TrendingDown,
  Search, Eye, Clock, UserPlus, FilePlus, ArrowRight,
  Activity, CalendarClock, Stethoscope, Heart,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { currentDoctor } from '../data/doctors';
import { mockAppointments, mockFollowUps, mockPrescriptions } from '../data/mockData';

const getHour = () => new Date().getHours();
const getGreeting = () => {
  const h = getHour();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const AppointmentStatusBadge = ({ status }) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>
      );
    case 'In Consultation':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          In Consultation
        </span>
      );
    case 'Waiting':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Waiting
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
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
    {
      label: "Total Patients",
      value: "128",
      trend: "+3.2%",
      positive: true,
      period: "vs previous 30 days",
      icon: Users,
      iconBg: "bg-blue-50/80 text-blue-700 border border-blue-100"
    },
    {
      label: "Today's Patients",
      value: "12",
      trend: "+12%",
      positive: true,
      period: "vs yesterday",
      icon: Activity,
      iconBg: "bg-teal-50/80 text-teal-700 border border-teal-100"
    },
    {
      label: "Follow-ups Due",
      value: "5",
      trend: "-2",
      positive: false,
      period: "vs yesterday",
      icon: CalendarClock,
      iconBg: "bg-amber-50/80 text-amber-700 border border-amber-100"
    },
    {
      label: "Upcoming Appointments",
      value: "8",
      trend: "+5%",
      positive: true,
      period: "vs previous period",
      icon: Calendar,
      iconBg: "bg-emerald-50/80 text-emerald-700 border border-emerald-100"
    },
  ];

  const quickActions = [
    { label: 'New Patient', icon: UserPlus, primary: true, color: 'bg-[#0B1E3D] hover:bg-[#091527] text-white shadow-xs', path: '/patients' },
    { label: 'New Prescription', icon: FilePlus, primary: true, color: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs', path: '/prescriptions/new' },
    { label: 'Search Patient', icon: Search, primary: false, color: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80', path: '/patients' },
    { label: 'Follow-ups List', icon: CalendarClock, primary: false, color: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80', path: '/follow-ups' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Clinical Command Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              {getGreeting()}, {currentDoctor.name}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2 flex-wrap">
            <span>Here&apos;s your clinic overview for today</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="font-semibold text-slate-700">Tuesday, 01 September 2026</span>
          </p>
        </div>

        {/* Live OPD Status Control */}
        <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50/80 border border-slate-200/80 px-3.5 py-2 rounded-xl self-start md:self-auto shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-700 font-semibold">OPD Live</span>
          <span className="text-slate-300">•</span>
          <span className="font-medium text-slate-500">09:00 AM – 06:00 PM</span>
        </div>
      </div>

      {/* KPI / Executive Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon size={20} strokeWidth={1.8} />
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                stat.positive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}>
                {stat.positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {stat.trend}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-700 mt-2">{stat.label}</p>
              <p className="text-[11px] text-slate-400 font-normal mt-0.5">{stat.period}</p>
            </div>
          </div>
        ))}
      </div>


      {/* Cardiac Care Specialty Overview Strip */}
      <div className="bg-gradient-to-r from-[#091527] to-[#0D2449] rounded-2xl p-4 text-white shadow-xs border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-teal-400 flex-shrink-0">
              <Heart size={20} strokeWidth={1.8} className="text-teal-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight uppercase">SSSH Cardiac & EECP Care Overview</h2>
              <p className="text-[11px] text-blue-200/80 font-medium">Real-time cardiac rehabilitation and non-invasive therapy metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <p className="text-[10px] text-blue-200/80 font-medium">Active EECP Cases</p>
              <p className="text-base font-bold text-white mt-0.5">18 Patients</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <p className="text-[10px] text-blue-200/80 font-medium">Today&apos;s Sessions</p>
              <p className="text-base font-bold text-teal-300 mt-0.5">6 Scheduled</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <p className="text-[10px] text-blue-200/80 font-medium">Pending Cardiac Reviews</p>
              <p className="text-base font-bold text-amber-300 mt-0.5">3 Cases</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <p className="text-[10px] text-blue-200/80 font-medium">Follow-ups Due Today</p>
              <p className="text-base font-bold text-blue-300 mt-0.5">5 Due</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Actions Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Clinical Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, color, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-150 ${color}`}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Grid: Today's Patients & Follow-ups Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Patients Section (Primary Operational Workspace) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Today&apos;s Patients</h2>
                  <p className="text-xs text-slate-500 font-medium">Live consultation queue and appointment list</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/patients')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 transition-colors"
              >
                All Patients <ArrowRight size={14} strokeWidth={1.75} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Patient Name & ID</th>
                    <th className="py-3 px-4">Appt Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200/80 flex items-center justify-center flex-shrink-0 text-xs shadow-2xs">
                            <span>{apt.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs tracking-tight group-hover:text-blue-700 transition-colors">
                              {apt.patientName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{apt.patientId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60 font-mono inline-block">
                          {apt.appointmentTime}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <AppointmentStatusBadge status={apt.status} />
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/patients/${apt.patientId}`)}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                            title="View Patient Profile"
                          >
                            <Eye size={13} strokeWidth={1.75} />
                            <span className="hidden md:inline">View Patient</span>
                          </button>
                          <button
                            onClick={() => navigate(`/prescriptions/RX-2026-00128/preview`)}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                            title="View Prescription"
                          >
                            <FileText size={13} strokeWidth={1.75} />
                            <span className="hidden md:inline">Prescription</span>
                          </button>
                          <button
                            onClick={() => navigate(`/prescriptions/new?patient=${apt.patientId}`)}
                            className="bg-[#0B1E3D] hover:bg-[#091527] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs inline-flex items-center gap-1.5 transition-colors"
                            title="Start Consultation"
                          >
                            <Stethoscope size={13} strokeWidth={1.75} />
                            <span>Consult</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {mockAppointments.length > itemsPerPage && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
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
                  <ChevronLeft size={14} strokeWidth={1.75} /> Prev
                </button>
                <span className="font-semibold text-slate-700 px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 font-semibold transition-all shadow-2xs"
                >
                  Next <ChevronRight size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panels: Follow-ups Due & Recent Prescriptions */}
        <div className="space-y-5">
          {/* Follow-ups Due Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock size={16} strokeWidth={1.8} className="text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Follow-ups Due</h2>
              </div>
              <button
                onClick={() => navigate('/follow-ups')}
                className="text-xs text-blue-700 font-semibold hover:underline"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {mockFollowUps.slice(0, 4).map((f) => (
                <div key={f.id} className="p-3.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 tracking-tight">{f.patientName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{f.reason}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-slate-600 bg-slate-100/80 border border-slate-200/60 px-2 py-0.5 rounded-md font-mono">
                        Due: {f.displayDate}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/patients/${f.patientId}`)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline flex-shrink-0"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Prescriptions Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Prescriptions</h2>
              <button
                onClick={() => navigate('/prescriptions')}
                className="text-xs text-blue-700 font-semibold hover:underline"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {mockPrescriptions.map((rx) => (
                <div key={rx.id} className="p-3.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-mono font-bold text-blue-700">{rx.id}</p>
                      <p className="text-xs font-semibold text-slate-900 mt-0.5">{rx.patientName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{rx.diagnosis}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/prescriptions/${rx.id}/preview`)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
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

