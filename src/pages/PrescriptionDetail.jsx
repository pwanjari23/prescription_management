import { useParams, useNavigate } from 'react';
import { ArrowLeft, Plus, Eye, User, Stethoscope, Activity, FileText } from 'lucide-react';
import { mockPrescriptions, mockPatients, currentDoctor } from '../data/mockData';

const StatusBadge = ({ status }) => {
  const cfg = {
    Finalized: 'badge-finalized', Draft: 'badge-draft', Cancelled: 'badge-cancelled',
  };
  const dots = { Finalized: 'bg-emerald-500', Draft: 'bg-slate-400', Cancelled: 'bg-red-500' };
  return (
    <span className={`badge ${cfg[status] || 'badge-draft'} text-xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  );
};

export default function PrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const cleanId = id ? decodeURIComponent(id).trim().replace(/[\s_]/g, '-') : '';
  const rx = mockPrescriptions.find(p => p.id === id || p.id === cleanId || p.id.replace(/[\s_]/g, '-') === cleanId) || mockPrescriptions[0];
  const patient = mockPatients.find(p => p.id === rx.patientId) || mockPatients[0];

  return (
    <div className="space-y-4 w-full">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 font-mono">{rx.id}</h1>
              <StatusBadge status={rx.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prescribed on {rx.date} at {rx.time || '11:42 AM'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/prescriptions/${rx.id}/preview`)}
            className="btn-primary btn-sm flex items-center gap-1.5"
          >
            <Eye size={14} /> Preview Printable Sheet
          </button>
          <button
            onClick={() => navigate(`/prescriptions/new?patient=${rx.patientId}`)}
            className="btn-secondary btn-sm flex items-center gap-1"
          >
            <Plus size={14} /> New Rx
          </button>
        </div>
      </div>

      {/* 3-Column Top Grid: Patient, Doctor, & Clinical Details Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Patient Summary Card */}
        <div className="card p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <User size={13} className="text-blue-600" /> Patient Details
            </span>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-900 text-xs font-bold">
                  {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-xs truncate">{patient.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{patient.id}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Age / Gender</span>
                <span className="font-semibold text-slate-800">{patient.age} Yrs · {patient.gender}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Blood Group</span>
                <span className="font-semibold text-slate-800">{patient.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Allergies</span>
                <span className="font-semibold text-amber-700">{patient.allergies.length ? patient.allergies.join(', ') : 'None'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/patients/${patient.id}`)}
            className="mt-3 w-full btn-secondary btn-sm justify-center py-1 text-xs"
          >
            View Patient Profile
          </button>
        </div>

        {/* Doctor Summary Card */}
        <div className="card p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Stethoscope size={13} className="text-emerald-600" /> Prescribing Doctor
            </span>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-900 text-xs font-bold">{currentDoctor.initials}</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">{rx.doctorName || currentDoctor.name}</p>
                <p className="text-[11px] text-slate-500">{currentDoctor.qualification}</p>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
              <p className="font-semibold text-slate-800">Shree Swami Samarth Hospital</p>
              <p className="text-slate-500">Manewada Ring Road, Nagpur</p>
              <p className="text-slate-500">Reg No: {currentDoctor.regNumber}</p>
            </div>
          </div>
        </div>

        {/* Clinical Summary Card */}
        <div className="card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Activity size={13} className="text-amber-600" /> Clinical Details
          </span>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Complaint</span>
              <p className="text-slate-800 font-semibold">{rx.chiefComplaint || 'Chest discomfort on exertion'}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Diagnosis</span>
              <p className="text-slate-900 font-bold">{rx.diagnosis || 'Stable Angina, Hypertension'}</p>
            </div>
            {rx.vitals && (
              <div className="grid grid-cols-4 gap-1 pt-1">
                {[
                  { label: 'BP', val: rx.vitals.bp },
                  { label: 'Pulse', val: rx.vitals.pulse },
                  { label: 'SpO₂', val: rx.vitals.spo2 },
                  { label: 'Temp', val: rx.vitals.temp },
                ].filter(v => v.val).map(v => (
                  <div key={v.label} className="bg-slate-50 p-1 rounded text-center border border-slate-100">
                    <span className="text-[9px] text-slate-400 block">{v.label}</span>
                    <span className="text-[11px] font-bold text-slate-800">{v.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescribed Medicines Section */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <FileText size={14} className="text-purple-600" /> Medicines ({rx.medicines.length})
          </span>
          <span className="text-xs font-mono font-semibold text-slate-500">Rx Sheet</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="text-[11px]">
                <th>#</th>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              {rx.medicines.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="text-slate-400 font-mono text-xs py-2 px-3">{i + 1}</td>
                  <td className="py-2 px-3">
                    <p className="font-bold text-slate-900 text-xs">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.strength}</p>
                  </td>
                  <td className="text-slate-700 text-xs py-2 px-3 font-semibold">{m.dosage}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-mono font-semibold text-[10px]">
                      {m.frequency}
                    </span>
                  </td>
                  <td className="text-slate-700 text-xs py-2 px-3 font-semibold">{m.duration} {m.durationUnit || 'Days'}</td>
                  <td className="text-slate-600 text-xs italic py-2 px-3">{m.instructions || 'After food'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice & Follow-up Row */}
      {(rx.advice || rx.followUp) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {rx.advice && (
            <div className="sm:col-span-2 card p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Doctor's Advice</span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{rx.advice}</p>
            </div>
          )}
          {rx.followUp && (
            <div className="card p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-900 font-bold text-base">{rx.followUp}</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">Follow-up: {rx.followUp} {rx.followUpUnit || 'Days'}</p>
                <p className="text-[11px] text-slate-500">From consultation date</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
