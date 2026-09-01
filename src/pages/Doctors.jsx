import { Phone, Mail, Users } from 'lucide-react';
import { doctors } from '../data/doctors';

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

export default function Doctors() {
  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Doctors & Staff</h1>
        <p className="page-subtitle">Medical team at Shree Swami Samarth Hospital</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {doctors.map(doc => {
          const colorClass = colorMap[doc.color] || 'bg-slate-100 text-slate-800';
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

      {/* Hospital Info */}
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
    </div>
  );
}
