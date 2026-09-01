import { useParams, useNavigate } from 'react';
import { ArrowLeft, Plus, Eye, User, Stethoscope, Activity, FileText, Repeat, Share2, AlertTriangle } from 'lucide-react';
import { mockPrescriptions, mockPatients, currentDoctor } from '../data/mockData';

const StatusBadge = ({ status }) => {
  const cfg = {
    Finalized: 'badge-finalized', Draft: 'badge-draft', Cancelled: 'badge-cancelled',
  };
  const dots = { Finalized: 'bg-emerald-500', Draft: 'bg-slate-400', Cancelled: 'bg-red-500' };
  return (
    <span className={`badge ${cfg[status] || 'badge-draft'} text-xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      {status || 'Draft'}
    </span>
  );
};

export default function PrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const rawId = id ? decodeURIComponent(id).trim() : '';
  const cleanId = rawId.replace(/[\s_]/g, '-');
  
  const rx = mockPrescriptions.find(p => p && (p.id === rawId || p.id === cleanId || (p.id && p.id.replace(/[\s_]/g, '-') === cleanId))) || mockPrescriptions[0] || {};
  const patient = mockPatients.find(p => p && p.id === rx.patientId) || mockPatients[0] || {};

  const rxId = rx.id || 'RX-2026-00128';
  const patientName = patient.name || rx.patientName || 'Rahul Sharma';
  const patientId = patient.id || rx.patientId || 'PT-00124';
  const patientAge = patient.age || 56;
  const patientGender = patient.gender || 'Male';
  const patientBloodGroup = patient.bloodGroup || 'O+';
  const patientAllergies = Array.isArray(patient.allergies) ? patient.allergies : [];
  const medicinesList = Array.isArray(rx.medicines) ? rx.medicines : [];
  const vitals = rx.vitals || {};

  const initials = patientName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PT';

  const handleShareWhatsApp = () => {
    const text = `Dear ${patientName}, your prescription (${rxId}) from Shree Swami Samarth Hospital by ${currentDoctor.name} is ready. Follow-up: ${rx.followUp || 30} days. Preview: https://prescription-management-zeta.vercel.app/prescriptions/${rxId}/preview`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4 w-full">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{rxId}</h1>
              <StatusBadge status={rx.status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prescribed on {rx.date || '2026-09-01'} at {rx.time || '11:42 AM'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Share */}
          <button
            onClick={handleShareWhatsApp}
            className="btn-secondary btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 flex items-center gap-1.5"
            title="Share Prescription link via WhatsApp"
          >
            <Share2 size={14} /> WhatsApp Share
          </button>

          {/* Repeat Rx */}
          <button
            onClick={() => navigate(`/prescriptions/new?patient=${patientId}&repeat=${rxId}`)}
            className="btn-secondary btn-sm flex items-center gap-1.5"
            title="Pre-fill form with this prescription to repeat/renew"
          >
            <Repeat size={14} /> Repeat Rx
          </button>

          {/* Preview Sheet */}
          <button
            onClick={() => navigate(`/prescriptions/${rxId}/preview`)}
            className="btn-primary btn-sm flex items-center gap-1.5"
          >
            <Eye size={14} /> Preview Sheet
          </button>
        </div>
      </div>

      {/* High Risk Vitals & Allergy Warnings */}
      {(patientAllergies.length > 0 || (vitals.bp && (parseInt(vitals.bp) >= 140))) && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3.5 flex items-center gap-3 text-xs">
          <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="flex-1 space-y-0.5">
            {patientAllergies.length > 0 && (
              <p className="font-bold text-amber-900 dark:text-amber-300">
                ⚠ Patient Drug Allergy: {patientAllergies.join(', ')}
              </p>
            )}
            {vitals.bp && (parseInt(vitals.bp) >= 140) && (
              <p className="text-amber-800 dark:text-amber-400 font-semibold">
                ⚠ High Blood Pressure Warning: {vitals.bp} mmHg (Stage 1/2 Hypertension)
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3-Column Top Grid: Patient, Doctor, & Clinical Details Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Patient Summary Card */}
        <div className="card p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <User size={13} className="text-blue-600" /> Patient Details
            </span>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-900 dark:text-primary-200 text-xs font-bold">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">{patientName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{patientId}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400 dark:text-slate-500">Age / Gender</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{patientAge} Yrs · {patientGender}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400 dark:text-slate-500">Blood Group</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{patientBloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Allergies</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">{patientAllergies.length ? patientAllergies.join(', ') : 'None'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/patients/${patientId}`)}
            className="mt-3 w-full btn-secondary btn-sm justify-center py-1 text-xs"
          >
            View Patient Profile
          </button>
        </div>

        {/* Doctor Summary Card */}
        <div className="card p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Stethoscope size={13} className="text-emerald-600" /> Prescribing Doctor
            </span>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-900 dark:text-primary-200 text-xs font-bold">{currentDoctor.initials}</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{rx.doctorName || currentDoctor.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentDoctor.qualification}</p>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-2">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Shree Swami Samarth Hospital</p>
              <p className="text-slate-500 dark:text-slate-400">Manewada Ring Road, Nagpur</p>
              <p className="text-slate-500 dark:text-slate-400">Reg No: {currentDoctor.regNumber}</p>
            </div>
          </div>
        </div>

        {/* Clinical Summary Card */}
        <div className="card p-4">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Activity size={13} className="text-amber-600" /> Clinical Details
          </span>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase block">Complaint</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold">{rx.chiefComplaint || 'Chest discomfort on exertion'}</p>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase block">Diagnosis</span>
              <p className="text-slate-900 dark:text-slate-100 font-bold">{rx.diagnosis || 'Stable Angina, Hypertension'}</p>
            </div>
            {vitals && (
              <div className="grid grid-cols-4 gap-1 pt-1">
                {[
                  { label: 'BP', val: vitals.bp },
                  { label: 'Pulse', val: vitals.pulse },
                  { label: 'SpO₂', val: vitals.spo2 },
                  { label: 'Temp', val: vitals.temp },
                ].filter(v => v.val).map(v => (
                  <div key={v.label} className="bg-slate-50 dark:bg-slate-800 p-1 rounded text-center border border-slate-100 dark:border-slate-700">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block">{v.label}</span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{v.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescribed Medicines Section */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <FileText size={14} className="text-purple-600" /> Medicines ({medicinesList.length})
          </span>
          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">Rx Sheet</span>
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
              {medicinesList.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="text-slate-400 font-mono text-xs py-2 px-3">{i + 1}</td>
                  <td className="py-2 px-3">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.strength}</p>
                  </td>
                  <td className="text-slate-700 dark:text-slate-300 text-xs py-2 px-3 font-semibold">{m.dosage}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded font-mono font-semibold text-[10px]">
                      {m.frequency}
                    </span>
                  </td>
                  <td className="text-slate-700 dark:text-slate-300 text-xs py-2 px-3 font-semibold">{m.duration} {m.durationUnit || 'Days'}</td>
                  <td className="text-slate-600 dark:text-slate-400 text-xs italic py-2 px-3">{m.instructions || 'After food'}</td>
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
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Doctor's Advice</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{rx.advice}</p>
            </div>
          )}
          {rx.followUp && (
            <div className="card p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-900 dark:text-primary-200 font-bold text-base">{rx.followUp}</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">Follow-up: {rx.followUp} {rx.followUpUnit || 'Days'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">From consultation date</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
