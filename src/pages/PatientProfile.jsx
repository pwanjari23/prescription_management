import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Eye, Share2, Repeat, Stethoscope, Activity,
  Heart, FileText, Calendar, AlertTriangle, Phone, Mail, MapPin,
  Download, Droplets, Clock, Pill, CheckCircle2, ChevronRight
} from 'lucide-react';
import { mockPatients, mockConsultations, mockPrescriptions, currentDoctor } from '../data/mockData';

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState('All');

  const rawId = id ? decodeURIComponent(id).trim() : '';
  const cleanId = rawId.replace(/[\s_]/g, '-');

  const patient = mockPatients.find(p => p && (p.id === rawId || p.id === cleanId || (p.id && p.id.replace(/[\s_]/g, '-') === cleanId))) || mockPatients[0] || {};
  const patientPrescriptions = mockPrescriptions.filter(rx => rx.patientId === patient.id);
  const patientConsultations = mockConsultations.filter(c => c.patientId === patient.id);

  // Expanded clinical timeline entries
  const timelineEntries = [
    {
      id: 'RX-2026-00128',
      date: '01 Sep 2026',
      time: '11:42 AM',
      type: 'OPD Consultation',
      doctor: patient.doctor || 'Dr. Pradeep Patil',
      complaint: 'Chest discomfort on exertion, mild breathlessness',
      diagnosis: 'Stable Angina, Stage 1 Hypertension',
      vitals: { bp: '132/86', pulse: '74', spo2: '97%', temp: '98.6°F' },
      medicines: [
        { name: 'Aspirin 75mg', dosage: '1 tablet', frequency: '1-0-0', duration: '30 Days', instructions: 'After food' },
        { name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: '0-0-1', duration: '30 Days', instructions: 'At bedtime' },
        { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: '1-0-0', duration: '30 Days', instructions: 'Morning' },
      ],
      advice: 'Avoid strenuous exertion. Low salt and low lipid diet. Walk 30 minutes daily.',
      followUp: '30 Days (30 Sep 2026)',
      status: 'Finalized',
    },
    {
      id: 'RX-2026-00115',
      date: '15 Aug 2026',
      time: '10:15 AM',
      type: 'Follow-up Visit',
      doctor: patient.doctor || 'Dr. Pradeep Patil',
      complaint: 'Routine blood pressure review & medication refill',
      diagnosis: 'Essential Hypertension (Controlled)',
      vitals: { bp: '124/80', pulse: '72', spo2: '98%', temp: '98.4°F' },
      medicines: [
        { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: '1-0-0', duration: '30 Days', instructions: 'Morning' },
        { name: 'Telmisartan 40mg', dosage: '1 tablet', frequency: '1-0-0', duration: '30 Days', instructions: 'Morning' },
      ],
      advice: 'Continue regular exercise and BP logging twice weekly.',
      followUp: '15 Days (31 Aug 2026)',
      status: 'Finalized',
    },
    {
      id: 'RX-2026-00098',
      date: '02 Jun 2026',
      time: '04:30 PM',
      type: 'Emergency Consultation',
      doctor: 'Dr. Rahul Sharma',
      complaint: 'Acute viral fever, headache, body pain',
      diagnosis: 'Acute Viral Pyrexia & Dehydration',
      vitals: { bp: '118/76', pulse: '88', spo2: '98%', temp: '101.2°F' },
      medicines: [
        { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: '1-0-1', duration: '5 Days', instructions: 'After food' },
        { name: 'Pantoprazole 40mg', dosage: '1 tablet', frequency: '1-0-0', duration: '7 Days', instructions: 'Before breakfast' },
      ],
      advice: 'Drink warm fluids, rest for 3 days.',
      followUp: '7 Days',
      status: 'Finalized',
    },
  ];

  const filteredTimeline = timelineEntries.filter(item => {
    if (filterTab === 'Prescriptions') return item.medicines && item.medicines.length > 0;
    if (filterTab === 'Follow-ups') return item.followUp;
    return true;
  });

  const patientName = patient.name || 'Rahul Sharma';
  const patientId = patient.id || 'PT-00124';
  const initials = patientName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PT';
  const patientAllergies = Array.isArray(patient.allergies) ? patient.allergies : [];

  return (
    <div className="space-y-5 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Patients List
        </button>
        <button
          onClick={() => navigate(`/prescriptions/new?patient=${patientId}`)}
          className="btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> Create Prescription
        </button>
      </div>

      {/* Patient Header Card (Includes Blood Group, Allergies & Status Tags) */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary-200">
              <span className="text-primary-900 text-lg font-bold">{initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{patientName}</h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${patient.gender === 'Female' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  {patient.gender || 'Male'}
                </span>
                <span className="font-mono text-xs text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {patientId}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                  <Droplets size={11} /> {patient.bloodGroup || 'O+'}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1">
                Age {patient.age || 56} Yrs · DOB: {patient.dob || '15 Mar 1970'} · Registered: {patient.registeredOn || '15 Jan 2024'}
              </p>

              {/* Contact Info Pills */}
              <div className="flex flex-wrap gap-4 mt-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700">
                  <Phone size={13} className="text-slate-400" />
                  <span>{patient.phone || '9823012345'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                  <Mail size={13} className="text-slate-400" />
                  <span>{patient.email || 'rahul.sharma@email.com'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{patient.address || 'Plot 12, Dharampeth, Nagpur'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drug Allergy Warning Alert */}
        {patientAllergies.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />
            <span>Drug Allergy Warning: {patientAllergies.join(', ')} (Avoid Penicillin group antibiotics)</span>
          </div>
        )}
      </div>

      {/* Main Layout Grid: Clinical Summary Sidebar + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Patient Clinical Profile */}
        <div className="space-y-4">
          {/* Chronic Conditions */}
          <div className="card p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Heart size={14} className="text-red-500" /> Existing Medical Conditions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {patient.existingConditions && patient.existingConditions.length > 0 ? (
                patient.existingConditions.map(c => (
                  <span key={c} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Hypertension, Coronary Artery Disease</span>
              )}
            </div>
          </div>

          {/* Current Active Medications */}
          <div className="card p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Pill size={14} className="text-teal-600" /> Active Medications
            </h3>
            <div className="space-y-2">
              {(patient.currentMedications && patient.currentMedications.length > 0 ? patient.currentMedications : ['Aspirin 75mg', 'Atorvastatin 20mg', 'Amlodipine 5mg']).map(m => (
                <div key={m} className="flex items-center gap-2 text-xs font-semibold text-slate-800 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Doctor & Notes */}
          <div className="card p-4 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Primary Doctor</span>
              <div className="flex items-center gap-2">
                <Stethoscope size={14} className="text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">{patient.doctor || 'Dr. Pradeep Patil'}</span>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Consultation Notes</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed italic">
                "{patient.notes || 'Advised low-sodium diet, regular 30 min walks, and daily BP monitoring.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Medical History Timeline */}
        <div className="lg:col-span-2 card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Medical History &amp; Consultations</h2>
              <p className="text-xs text-slate-500">Timeline of clinical visits, diagnoses, and past prescriptions</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
              {['All', 'Prescriptions', 'Follow-ups'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    filterTab === tab
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Clinical Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredTimeline.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-primary-900 border-2 border-white ring-4 ring-slate-50 flex items-center justify-center text-white">
                  <Stethoscope size={10} />
                </div>

                {/* Timeline Card */}
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 hover:border-primary-300 transition-all space-y-3">
                  {/* Top Visit Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono bg-white px-2.5 py-0.5 rounded border border-slate-200 text-slate-900">
                        {item.date} · {item.time}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-50 text-primary-900 border border-primary-100">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                      <Stethoscope size={12} className="text-emerald-600" /> {item.doctor}
                    </span>
                  </div>

                  {/* Diagnosis & Chief Complaint */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Chief Complaint</span>
                      <p className="text-slate-800 font-semibold mt-0.5">{item.complaint}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Diagnosis</span>
                      <p className="text-slate-900 font-bold mt-0.5">{item.diagnosis}</p>
                    </div>
                  </div>

                  {/* Vitals Badges */}
                  {item.vitals && (
                    <div className="flex flex-wrap gap-2 items-center text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Vitals:</span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[11px] font-semibold text-slate-800">
                        BP: {item.vitals.bp}
                      </span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[11px] font-semibold text-slate-800">
                        Pulse: {item.vitals.pulse}
                      </span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[11px] font-semibold text-slate-800">
                        SpO₂: {item.vitals.spo2}
                      </span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[11px] font-semibold text-slate-800">
                        Temp: {item.vitals.temp}
                      </span>
                    </div>
                  )}

                  {/* Prescribed Medicines Grid */}
                  {item.medicines && item.medicines.length > 0 && (
                    <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Pill size={12} className="text-purple-600" /> Prescribed Medicines ({item.medicines.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {item.medicines.map((m, mIdx) => (
                          <div key={mIdx} className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900">{m.name}</p>
                              <p className="text-[10px] text-slate-500">{m.dosage} · {m.instructions}</p>
                            </div>
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 font-mono font-bold text-[10px] rounded">
                              {m.frequency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                    <span className="text-xs text-slate-500">
                      Follow-up: <strong className="text-slate-800">{item.followUp}</strong>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/prescriptions/new?patient=${patientId}&repeat=${item.id}`)}
                        className="btn-secondary btn-sm py-1 flex items-center gap-1"
                        title="Repeat this prescription"
                      >
                        <Repeat size={13} /> Repeat Rx
                      </button>
                      <button
                        onClick={() => navigate(`/prescriptions/${item.id}/preview`)}
                        className="btn-primary btn-sm py-1 flex items-center gap-1"
                      >
                        <Eye size={13} /> View Sheet
                      </button>
                    </div>
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
