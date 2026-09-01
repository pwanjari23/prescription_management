import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Edit, Droplets, AlertTriangle, Calendar, FileText,
  Phone, Mail, MapPin, Activity, Download, Eye, User, Heart, Stethoscope, Clock
} from 'lucide-react';
import { mockPatients, mockConsultations, mockPrescriptions } from '../data/mockData';

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Timeline');

  const patient = mockPatients.find(p => p.id === id) || mockPatients[0];
  const patientPrescriptions = mockPrescriptions.filter(rx => rx.patientId === patient.id);
  const patientConsultations = mockConsultations.filter(c => c.patientId === patient.id);

  // Default timeline entries if none in mockConsultations
  const displayConsultations = patientConsultations.length > 0 ? patientConsultations : [
    {
      id: 'CONS-DEMO-1',
      patientId: patient.id,
      date: '01 Sep 2026',
      diagnosis: 'Viral Fever & Body Ache',
      prescriptionCount: 2,
      doctor: patient.doctor || 'Dr. Pradeep Patil',
      vitals: 'BP 120/80 · Pulse 78 · Temp 100°F',
      notes: 'Patient reported fever, headache, and body ache for 2 days. Prescribed Paracetamol 500mg and Pantoprazole 40mg.',
    },
    {
      id: 'CONS-DEMO-2',
      patientId: patient.id,
      date: '15 Aug 2026',
      diagnosis: 'Common Cold & Sore Throat',
      prescriptionCount: 1,
      doctor: patient.doctor || 'Dr. Pradeep Patil',
      vitals: 'BP 118/76 · Pulse 72 · Temp 98.6°F',
      notes: 'Mild upper respiratory symptoms. Advised warm water gargles and Cetirizine 10mg.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Patients List
      </button>

      {/* Patient Header Card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-primary-900 text-xl font-bold">
                {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${patient.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                  {patient.gender}
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  {patient.id}
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Age {patient.age} years · DOB: {patient.dob}
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                  <Phone size={13} className="text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Mail size={13} className="text-slate-400" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{patient.address}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/prescriptions/new?patient=${patient.id}`)}
              className="btn-primary flex items-center gap-1.5"
            >
              <Plus size={16} />
              Create Prescription
            </button>
          </div>
        </div>
      </div>

      {/* Medical Information Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-2">
            <Droplets size={16} />
          </div>
          <p className="text-xs text-slate-400 font-medium">Blood Group</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{patient.bloodGroup || 'O+'}</p>
        </div>

        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <AlertTriangle size={16} />
          </div>
          <p className="text-xs text-slate-400 font-medium">Drug Allergies</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">
            {patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None Reported'}
          </p>
        </div>

        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Calendar size={16} />
          </div>
          <p className="text-xs text-slate-400 font-medium">Last Visit</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{patient.lastVisit || 'Today'}</p>
        </div>

        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Clock size={16} />
          </div>
          <p className="text-xs text-slate-400 font-medium">Next Follow-up</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{patient.nextFollowUp || '15 Sep 2026'}</p>
        </div>
      </div>

      {/* Main Grid: Conditions, Medications, & Medical History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Clinical Summary */}
        <div className="space-y-5">
          {/* Existing Conditions */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              Existing Medical Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.existingConditions && patient.existingConditions.length > 0 ? (
                patient.existingConditions.map(c => (
                  <span key={c} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
                    {c}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">No chronic conditions recorded</p>
              )}
            </div>
          </div>

          {/* Current Medications */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" />
              Current Medications
            </h3>
            <div className="space-y-2">
              {patient.currentMedications && patient.currentMedications.length > 0 ? (
                patient.currentMedications.map(m => (
                  <div key={m} className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                    <span>{m}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No active medications recorded</p>
              )}
            </div>
          </div>

          {/* Doctor Notes */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Doctor Notes</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-100">
              {patient.notes || 'Routine follow-ups and regular vitals monitoring recommended.'}
            </p>
          </div>
        </div>

        {/* Right Column: Medical History Timeline */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Medical History Timeline</h2>
              <p className="text-xs text-slate-500">Historical consultations, diagnoses, and past prescriptions</p>
            </div>
            <span className="px-2.5 py-1 bg-primary-100 text-primary-900 rounded-full text-xs font-bold">
              {displayConsultations.length} Visits
            </span>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {displayConsultations.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Node indicator dot */}
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-primary-900 border-2 border-white ring-4 ring-slate-50 flex items-center justify-center" />

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-primary-200 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                        {item.date}
                      </span>
                      <span className="text-xs font-semibold text-primary-900 flex items-center gap-1">
                        <Stethoscope size={13} /> Consultation
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{item.doctor}</span>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div className="text-xs">
                      <span className="font-bold text-slate-700">Diagnosis: </span>
                      <span className="font-semibold text-slate-900">{item.diagnosis}</span>
                    </div>

                    <div className="text-xs">
                      <span className="font-bold text-slate-700">Prescription: </span>
                      <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                        {typeof item.prescriptionCount === 'number' ? `${item.prescriptionCount} Medicines` : item.prescriptionSummary}
                      </span>
                    </div>

                    {item.vitals && (
                      <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-100 font-mono">
                        <strong className="font-semibold text-slate-700">Vitals: </strong>{item.vitals}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-slate-500 italic mt-1">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
