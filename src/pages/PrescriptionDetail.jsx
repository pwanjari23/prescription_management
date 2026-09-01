import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, Plus, Eye } from 'lucide-react';
import { prescriptions } from '../data/prescriptions';
import { patients } from '../data/patients';
import { currentDoctor } from '../data/doctors';

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

  const rx = prescriptions.find(p => p.id === id);
  if (!rx) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="text-lg font-medium text-slate-600">Prescription not found</p>
        <button onClick={() => navigate('/prescriptions')} className="btn-secondary mt-4">
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    );
  }

  const patient = patients.find(p => p.id === rx.patientId);

  return (
    <div className="space-y-5 max-w-4xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 font-mono">{rx.id}</h1>
              <StatusBadge status={rx.status} />
            </div>
            <p className="text-slate-500 text-sm mt-1">
              {new Date(rx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} at {rx.time}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/prescriptions/${rx.id}/preview`)}
              className="btn-primary"
            >
              <Eye size={15} />
              Preview
            </button>
            <button className="btn-secondary">
              <Download size={15} />
              Download PDF
            </button>
            <button className="btn-secondary">
              <Printer size={15} />
              Print
            </button>
            <button className="btn-secondary">
              <Share2 size={15} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Patient Info */}
        <div className="card p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Patient</h2>
          {patient && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-900 text-sm font-bold">
                    {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{patient.name}</p>
                  <p className="text-xs text-slate-500">{patient.id}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Age', value: `${patient.age} years` },
                  { label: 'Gender', value: patient.gender },
                  { label: 'Blood Group', value: patient.bloodGroup },
                  { label: 'Allergies', value: patient.allergies.length ? patient.allergies.join(', ') : 'None' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-slate-400 w-24 flex-shrink-0 text-xs">{label}</span>
                    <span className="text-slate-800 text-xs font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="mt-4 w-full btn-secondary btn-sm justify-center"
              >
                View Profile
              </button>
            </div>
          )}
        </div>

        {/* Doctor Info */}
        <div className="card p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Doctor</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-900 text-sm font-bold">{currentDoctor.initials}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{rx.doctorName}</p>
              <p className="text-xs text-slate-500">Senior Doctor</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <p>Shree Swami Samarth Hospital</p>
            <p>Trimurtee Nagar, Nagpur – 440022</p>
            <p>Phone: 7083493268</p>
          </div>
        </div>

        {/* Clinical Info */}
        <div className="card p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Clinical Details</h2>
          <div className="space-y-3">
            {rx.chiefComplaint && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Complaint</p>
                <p className="text-sm text-slate-700 mt-0.5">{rx.chiefComplaint}</p>
              </div>
            )}
            {rx.diagnosis && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Diagnosis</p>
                <p className="text-sm text-slate-700 mt-0.5 font-medium">{rx.diagnosis}</p>
              </div>
            )}
            {rx.vitals && Object.values(rx.vitals).some(v => v) && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Vitals</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'BP', value: rx.vitals.bp },
                    { label: 'Pulse', value: rx.vitals.pulse },
                    { label: 'SpO₂', value: rx.vitals.spo2 },
                    { label: 'Temp', value: rx.vitals.temp },
                  ].filter(v => v.value).map(({ label, value }) => (
                    <div key={label} className="text-center p-1.5 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400">{label}</p>
                      <p className="text-xs font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Medicines ({rx.medicines.length})</h2>
          <span className="text-xs text-slate-400">Rx</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th className="hidden sm:table-cell">Frequency</th>
                <th className="hidden md:table-cell">Duration</th>
                <th className="hidden lg:table-cell">Route</th>
                <th className="hidden lg:table-cell">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {rx.medicines.map((m, i) => (
                <tr key={i}>
                  <td className="text-slate-400 font-mono text-xs">{i + 1}</td>
                  <td>
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.strength}</p>
                  </td>
                  <td className="text-slate-700">{m.dosage}</td>
                  <td className="hidden sm:table-cell text-slate-600 text-sm">{m.frequency}</td>
                  <td className="hidden md:table-cell text-slate-600 text-sm">{m.duration} {m.durationUnit}</td>
                  <td className="hidden lg:table-cell text-slate-600 text-sm">{m.route}</td>
                  <td className="hidden lg:table-cell text-slate-500 text-sm">{m.instructions || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice & Follow-up */}
      {(rx.advice || rx.followUp) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {rx.advice && (
            <div className="card p-5">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Doctor's Advice</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{rx.advice}</p>
            </div>
          )}
          {rx.followUp && (
            <div className="card p-5">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Follow-up</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <span className="text-primary-900 font-bold text-lg">{rx.followUp}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{rx.followUp} {rx.followUpUnit}</p>
                  <p className="text-xs text-slate-500">from prescription date</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action: New Prescription for same patient */}
      <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">Need to create a new prescription for this patient?</p>
          <p className="text-xs text-slate-500">All patient details will be pre-filled</p>
        </div>
        <button
          onClick={() => navigate(`/prescriptions/new?patient=${rx.patientId}`)}
          className="btn-primary"
        >
          <Plus size={14} />
          New Prescription
        </button>
      </div>
    </div>
  );
}
