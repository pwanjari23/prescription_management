import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Edit, Droplets, AlertTriangle, Calendar, FileText,
  Phone, Mail, MapPin, Activity, Download, Eye, User, ClipboardList, Heart
} from 'lucide-react';
import { patients } from '../data/patients';
import { prescriptions } from '../data/prescriptions';
import { useState } from 'react';

const tabs = ['Overview', 'Medical History', 'Prescriptions', 'Visits', 'Notes'];

const StatusBadge = ({ status }) => {
  const variants = { Finalized: 'badge-finalized', Draft: 'badge-draft', Cancelled: 'badge-cancelled' };
  const dots = { Finalized: 'bg-emerald-500', Draft: 'bg-slate-400', Cancelled: 'bg-red-500' };
  return (
    <span className={`badge ${variants[status] || 'badge-draft'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  );
};

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const patient = patients.find(p => p.id === id);
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <User size={48} className="mb-3 opacity-30" />
        <p className="text-lg font-medium text-slate-600">Patient not found</p>
        <button onClick={() => navigate('/patients')} className="btn-secondary mt-4">
          <ArrowLeft size={14} /> Back to Patients
        </button>
      </div>
    );
  }

  const patientPrescriptions = prescriptions.filter(rx => rx.patientId === id);

  const summaryCards = [
    { label: 'Blood Group', value: patient.bloodGroup || '—', icon: Droplets, color: 'text-red-600 bg-red-50' },
    { label: 'Allergies', value: patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
    { label: 'Last Visit', value: patient.lastVisit === '2026-09-01' ? 'Today' : new Date(patient.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: 'Prescriptions', value: patientPrescriptions.length, icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Patients
      </button>

      {/* Patient Header */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-primary-900 text-xl font-bold">
                {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${patient.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                  {patient.gender}
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">
                Patient ID: <span className="font-mono font-semibold text-slate-700">{patient.id}</span>
                <span className="mx-2 text-slate-300">·</span>
                Age {patient.age} years
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                {patient.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone size={12} />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={12} />
                    <span>{patient.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/prescriptions/new?patient=${patient.id}`)}
              className="btn-primary"
            >
              <Plus size={15} />
              New Prescription
            </button>
            <button className="btn-secondary">
              <Edit size={15} />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4">
            <div className={`w-8 h-8 rounded-lg ${color.split(' ')[1]} flex items-center justify-center mb-3`}>
              <Icon size={16} className={color.split(' ')[0]} />
            </div>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 overflow-x-auto">
          <div className="flex gap-0 min-w-max px-5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-all duration-150 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary-900 text-primary-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 animate-fade-in">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <User size={15} className="text-slate-500" />
                  Personal Information
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Full Name', value: patient.name },
                    { label: 'Date of Birth', value: new Date(patient.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
                    { label: 'Age', value: `${patient.age} years` },
                    { label: 'Gender', value: patient.gender },
                    { label: 'Mobile Number', value: patient.phone || '—' },
                    { label: 'Email', value: patient.email || '—' },
                    { label: 'Address', value: patient.address || '—' },
                    { label: 'Registered On', value: new Date(patient.registeredOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 text-sm">
                      <span className="text-slate-400 w-32 flex-shrink-0">{label}</span>
                      <span className="text-slate-800 font-medium flex-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor & Conditions */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Activity size={15} className="text-slate-500" />
                    Assigned Doctor
                  </h3>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-900 text-xs font-bold">
                        {patient.doctor.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{patient.doctor}</p>
                      <p className="text-xs text-slate-500">Shree Swami Samarth Hospital</p>
                    </div>
                  </div>
                </div>

                {patient.existingConditions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Heart size={15} className="text-slate-500" />
                      Existing Conditions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.existingConditions.map(c => (
                        <span key={c} className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-full text-xs font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patient.currentMedications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Current Medications</h3>
                    <div className="space-y-1.5">
                      {patient.currentMedications.map(m => (
                        <div key={m} className="flex items-center gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-900 flex-shrink-0" />
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Medical History' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <ClipboardList size={15} className="text-slate-500" />
                  Medical History
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed">
                  {patient.medicalHistory}
                </div>
              </div>
              {patient.allergies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-500" />
                    Known Allergies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map(a => (
                      <span key={a} className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm font-medium flex items-center gap-1.5">
                        <AlertTriangle size={12} />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Prescriptions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600">{patientPrescriptions.length} prescriptions on record</p>
                <button
                  onClick={() => navigate(`/prescriptions/new?patient=${patient.id}`)}
                  className="btn-primary btn-sm"
                >
                  <Plus size={13} /> New Prescription
                </button>
              </div>
              {patientPrescriptions.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <FileText size={36} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No prescriptions yet</p>
                </div>
              ) : (
                patientPrescriptions.map(rx => (
                  <div key={rx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-primary-900" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-900 font-mono">{rx.id}</p>
                        <p className="text-xs text-slate-500">{new Date(rx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} · {rx.doctorName}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{rx.medicines.length} medicines · {rx.diagnosis}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={rx.status} />
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/prescriptions/${rx.id}`)}
                          className="flex items-center gap-1 text-xs text-primary-900 font-medium hover:underline"
                        >
                          <Eye size={12} /> View
                        </button>
                        <button className="flex items-center gap-1 text-xs text-slate-500 font-medium hover:text-slate-700 hover:underline">
                          <Download size={12} /> PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Notes' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Doctor's Notes</h3>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 leading-relaxed">
                {patient.notes || 'No notes recorded.'}
              </div>
            </div>
          )}

          {activeTab === 'Visits' && (
            <div className="text-center py-10 text-slate-400">
              <Calendar size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Visit history will be available in the full system</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
