import { useNavigate } from 'react-router-dom';
import {
  Users, FileText, Calendar, TrendingUp, TrendingDown,
  Plus, Search, Eye, Clock, UserPlus, FilePlus, ArrowRight,
  Activity
} from 'lucide-react';
import { currentDoctor } from '../data/doctors';
import { patients } from '../data/patients';
import { prescriptions } from '../data/prescriptions';

const getHour = () => new Date().getHours();
const getGreeting = () => {
  const h = getHour();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const StatusBadge = ({ status }) => {
  const variants = {
    Finalized: 'badge-finalized',
    Draft: 'badge-draft',
    Cancelled: 'badge-cancelled',
  };
  const dots = { Finalized: 'bg-emerald-500', Draft: 'bg-slate-400', Cancelled: 'bg-red-500' };
  return (
    <span className={`badge ${variants[status] || 'badge-draft'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const recentPatients = patients.slice(0, 5);
  const recentPrescriptions = prescriptions.slice(0, 4);
  const todayPrescriptions = prescriptions.filter(p => p.date === '2026-09-01').length;

  const stats = [
    { label: "Today's Patients", value: 24, trend: '+12%', positive: true, icon: Users, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
    { label: 'Prescriptions Today', value: todayPrescriptions, trend: '+8%', positive: true, icon: FileText, color: 'bg-emerald-50 text-emerald-700', iconBg: 'bg-emerald-100' },
    { label: 'Total Patients', value: '1,248', trend: '+3.2%', positive: true, icon: Users, color: 'bg-purple-50 text-purple-700', iconBg: 'bg-purple-100' },
    { label: 'Appointments', value: 32, trend: '-2', positive: false, icon: Calendar, color: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-100' },
  ];

  const quickActions = [
    { label: 'New Patient', icon: UserPlus, color: 'bg-primary-900 text-white hover:bg-primary-800', path: '/patients' },
    { label: 'New Prescription', icon: FilePlus, color: 'bg-teal-700 text-white hover:bg-teal-800', path: '/prescriptions/new' },
    { label: 'Search Patient', icon: Search, color: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200', path: '/patients' },
    { label: 'View Appointments', icon: Calendar, color: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200', path: '/patients' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {getGreeting()}, {currentDoctor.name.replace('Dr. ', 'Dr.\u00A0')} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Here's what's happening at your clinic today — <span className="font-medium text-slate-700">Tuesday, 01 September 2026</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg">
          <Activity size={13} className="text-emerald-500" />
          <span className="text-emerald-700 font-medium">Clinic is Open</span>
          <span className="text-slate-300">·</span>
          <span>09:00 AM – 06:00 PM</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4 hover:shadow-card-hover transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color.split(' ')[1]} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.positive ? 'text-emerald-700' : 'text-red-600'}`}>
                {stat.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, color, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl text-sm font-medium transition-all duration-150 ${color}`}
            >
              <Icon size={22} />
              <span className="text-xs text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Patients</h2>
            <button
              onClick={() => navigate('/patients')}
              className="text-xs text-primary-900 font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Patient ID</th>
                  <th className="hidden sm:table-cell">Age</th>
                  <th className="hidden md:table-cell">Last Visit</th>
                  <th className="hidden lg:table-cell">Doctor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-900 text-xs font-bold">
                            {p.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{p.name}</p>
                          <p className="text-xs text-slate-400 sm:hidden">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="font-mono text-xs text-slate-600">{p.id}</span>
                    </td>
                    <td className="hidden sm:table-cell text-slate-600">{p.age}</td>
                    <td className="hidden md:table-cell text-slate-600">
                      {p.lastVisit === '2026-09-01' ? (
                        <span className="text-emerald-700 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded-full">Today</span>
                      ) : p.lastVisit === '2026-08-31' ? (
                        <span className="text-slate-600 text-xs">Yesterday</span>
                      ) : (
                        <span className="text-xs text-slate-500">{new Date(p.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="text-xs text-slate-600">{p.doctor}</span>
                    </td>
                    <td>
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
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Recent Prescriptions */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Recent Prescriptions</h2>
              <button
                onClick={() => navigate('/prescriptions')}
                className="text-xs text-primary-900 font-medium hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentPrescriptions.map((rx) => (
                <div key={rx.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary-900 font-mono">{rx.id}</p>
                      <p className="text-sm font-medium text-slate-800 truncate">{rx.patientName}</p>
                      <p className="text-xs text-slate-400">{rx.date === '2026-09-01' ? `Today, ${rx.time}` : rx.date}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{rx.medicines.length} medicines</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <StatusBadge status={rx.status} />
                      <button
                        onClick={() => navigate(`/prescriptions/${rx.id}`)}
                        className="text-xs text-primary-900 font-medium hover:underline"
                      >
                        View
                      </button>
                    </div>
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
