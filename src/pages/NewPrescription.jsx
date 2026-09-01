import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, ChevronDown, X, CheckCircle, Save, Eye,
  User, Stethoscope, Pill, FileText, Activity
} from 'lucide-react';
import { patients } from '../data/patients';
import { medicines as medicineList, frequencyOptions, routeOptions, durationUnits } from '../data/medicines';
import { currentDoctor } from '../data/doctors';
import { templates } from '../data/templates';

const newMedicineDefault = {
  name: '', strength: '', dosage: '', frequency: 'Once Daily',
  duration: '5', durationUnit: 'Days', route: 'Oral', instructions: '',
};

export default function NewPrescription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patient');

  const [selectedPatient, setSelectedPatient] = useState(
    patientIdParam ? patients.find(p => p.id === patientIdParam) : null
  );
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(!patientIdParam);
  const [medicines, setMedicines] = useState([]);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState({ ...newMedicineDefault });
  const [editingIndex, setEditingIndex] = useState(null);
  const [medicineSearch, setMedicineSearch] = useState('');

  const [form, setForm] = useState({
    chiefComplaint: '',
    diagnosis: '',
    bp: '', pulse: '', spo2: '', temp: '',
    advice: '',
    followUp: '30',
    followUpUnit: 'Days',
  });

  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const filteredPatients = patients.filter(p => {
    const q = patientSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  const filteredMedicines = medicineList.filter(m =>
    m.name.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (!currentMedicine.name) return;
    if (editingIndex !== null) {
      setMedicines(prev => prev.map((m, i) => i === editingIndex ? currentMedicine : m));
      setEditingIndex(null);
    } else {
      setMedicines(prev => [...prev, currentMedicine]);
    }
    setCurrentMedicine({ ...newMedicineDefault });
    setMedicineSearch('');
    setShowMedicineModal(false);
  };

  const handleRemoveMedicine = (i) => setMedicines(prev => prev.filter((_, idx) => idx !== i));
  const handleEditMedicine = (i) => { setCurrentMedicine({ ...medicines[i] }); setEditingIndex(i); setShowMedicineModal(true); };

  const handleUseTemplate = (template) => {
    setMedicines(template.medicines.map(m => ({ ...m })));
    setForm(f => ({ ...f, advice: template.advice, followUp: template.followUp, followUpUnit: template.followUpUnit }));
  };

  const handleFinalize = async () => {
    setShowConfirm(false);
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => navigate('/prescriptions'), 2000);
  };

  const handlePreview = () => {
    navigate('/prescriptions/RX-2026-00128/preview');
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Prescription Finalized!</h2>
        <p className="text-slate-500 text-sm">Redirecting to prescriptions list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="page-header mb-0">
        <h1 className="page-title">Create New Prescription</h1>
        <p className="page-subtitle">Fill in the clinical details to generate a prescription</p>
      </div>

      {/* Quick Templates */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Use a Template</p>
        <div className="flex flex-wrap gap-2">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => handleUseTemplate(t)}
              className="px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-900 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
            >
              {t.name} ({t.medicineCount})
            </button>
          ))}
        </div>
      </div>

      {/* Patient Selector */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
            <User size={14} className="text-blue-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Patient</h2>
        </div>

        {selectedPatient ? (
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-900 text-sm font-bold">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{selectedPatient.name}</p>
                <p className="text-xs text-slate-500">
                  ID: <span className="font-mono">{selectedPatient.id}</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  Age {selectedPatient.age}
                  <span className="mx-1.5 text-slate-300">·</span>
                  {selectedPatient.gender}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setSelectedPatient(null); setShowPatientDropdown(true); }}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              className="form-input"
              placeholder="Search patient by name or ID..."
              value={patientSearch}
              onChange={e => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
              onFocus={() => setShowPatientDropdown(true)}
            />
            {showPatientDropdown && filteredPatients.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto">
                {filteredPatients.slice(0, 8).map(p => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                    onClick={() => { setSelectedPatient(p); setShowPatientDropdown(false); setPatientSearch(''); }}
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-900 text-xs font-bold">{p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.id} · Age {p.age} · {p.gender}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Doctor Info */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Stethoscope size={14} className="text-emerald-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Prescribing Doctor</h2>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-900 text-sm font-bold">{currentDoctor.initials}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{currentDoctor.name}</p>
              <p className="text-xs text-slate-500">{currentDoctor.qualification} · Reg: {currentDoctor.regNumber}</p>
              <p className="text-xs text-slate-500">Shree Swami Samarth Hospital, Nagpur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Information */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
            <Activity size={14} className="text-amber-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Clinical Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="form-label">Chief Complaint</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Describe the patient's main complaints..."
              value={form.chiefComplaint}
              onChange={e => setForm(f => ({ ...f, chiefComplaint: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Diagnosis</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stable Angina, Hypertension"
              value={form.diagnosis}
              onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
            />
          </div>

          {/* Vitals */}
          <div>
            <label className="form-label">Vitals</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'bp', label: 'Blood Pressure', placeholder: '120/80 mmHg' },
                { key: 'pulse', label: 'Pulse Rate', placeholder: '72 bpm' },
                { key: 'spo2', label: 'SpO₂', placeholder: '98%' },
                { key: 'temp', label: 'Temperature', placeholder: '98.6°F' },
              ].map(v => (
                <div key={v.key}>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">{v.label}</p>
                  <input
                    type="text"
                    className="form-input text-sm"
                    placeholder={v.placeholder}
                    value={form[v.key]}
                    onChange={e => setForm(f => ({ ...f, [v.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
              <Pill size={14} className="text-purple-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Medicines</h2>
            {medicines.length > 0 && (
              <span className="px-2 py-0.5 bg-primary-100 text-primary-900 rounded-full text-xs font-semibold">
                {medicines.length}
              </span>
            )}
          </div>
          <button
            onClick={() => { setCurrentMedicine({ ...newMedicineDefault }); setEditingIndex(null); setShowMedicineModal(true); }}
            className="btn-primary btn-sm"
          >
            <Plus size={14} /> Add Medicine
          </button>
        </div>

        {medicines.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <Pill size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">No medicines added yet</p>
            <p className="text-xs text-slate-400">Click "Add Medicine" or use a template above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {medicines.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-sm">{m.name}</p>
                    <span className="text-xs px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">{m.strength}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {m.dosage} · {m.frequency} · {m.duration} {m.durationUnit}
                    {m.instructions && <span className="text-slate-400"> · {m.instructions}</span>}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEditMedicine(i)} className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleRemoveMedicine(i)} className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes & Follow-up */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-slate-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Doctor's Advice & Follow-up</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="form-label">Doctor's Advice</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Diet, lifestyle, activity restrictions, warning signs..."
              value={form.advice}
              onChange={e => setForm(f => ({ ...f, advice: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Follow-up After</label>
            <div className="flex gap-2 max-w-xs">
              <input
                type="number"
                className="form-input w-20"
                value={form.followUp}
                onChange={e => setForm(f => ({ ...f, followUp: e.target.value }))}
                min="1"
              />
              <select
                className="form-select flex-1"
                value={form.followUpUnit}
                onChange={e => setForm(f => ({ ...f, followUpUnit: e.target.value }))}
              >
                {durationUnits.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 justify-end pb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button className="btn-secondary">
          <Save size={15} />
          Save Draft
        </button>
        <button
          onClick={handlePreview}
          className="btn-secondary border-primary-200 text-primary-900 hover:bg-primary-50"
        >
          <Eye size={15} />
          Preview Prescription
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="btn-success"
        >
          <CheckCircle size={15} />
          Finalize Prescription
        </button>
      </div>

      {/* Add Medicine Modal */}
      {showMedicineModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">{editingIndex !== null ? 'Edit Medicine' : 'Add Medicine'}</h3>
              <button onClick={() => setShowMedicineModal(false)} className="p-1 hover:bg-slate-100 rounded-md">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="form-label">Medicine Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search or type medicine name..."
                    value={medicineSearch || currentMedicine.name}
                    onChange={e => { setMedicineSearch(e.target.value); setCurrentMedicine(m => ({ ...m, name: e.target.value })); }}
                  />
                  {medicineSearch && filteredMedicines.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
                      {filteredMedicines.slice(0, 6).map(m => (
                        <div
                          key={m.id}
                          className="px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            setCurrentMedicine(prev => ({ ...prev, name: m.name, strength: m.strength }));
                            setMedicineSearch('');
                          }}
                        >
                          <p className="text-sm font-medium text-slate-900">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.strength} · {m.form}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Strength</label>
                  <input type="text" className="form-input" placeholder="e.g. 500 mg" value={currentMedicine.strength}
                    onChange={e => setCurrentMedicine(m => ({ ...m, strength: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Dosage</label>
                  <input type="text" className="form-input" placeholder="e.g. 1 tablet" value={currentMedicine.dosage}
                    onChange={e => setCurrentMedicine(m => ({ ...m, dosage: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Frequency</label>
                  <select className="form-select" value={currentMedicine.frequency}
                    onChange={e => setCurrentMedicine(m => ({ ...m, frequency: e.target.value }))}>
                    {frequencyOptions.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Route</label>
                  <select className="form-select" value={currentMedicine.route}
                    onChange={e => setCurrentMedicine(m => ({ ...m, route: e.target.value }))}>
                    {routeOptions.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Duration</label>
                  <div className="flex gap-2">
                    <input type="number" className="form-input w-16" value={currentMedicine.duration} min="1"
                      onChange={e => setCurrentMedicine(m => ({ ...m, duration: e.target.value }))} />
                    <select className="form-select" value={currentMedicine.durationUnit}
                      onChange={e => setCurrentMedicine(m => ({ ...m, durationUnit: e.target.value }))}>
                      {durationUnits.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Instructions</label>
                  <input type="text" className="form-input" placeholder="e.g. After food" value={currentMedicine.instructions}
                    onChange={e => setCurrentMedicine(m => ({ ...m, instructions: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 pb-5 justify-end">
              <button onClick={() => setShowMedicineModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleAddMedicine} className="btn-primary">
                {editingIndex !== null ? 'Save Changes' : 'Add Medicine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Finalize Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-fade-in p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Finalize Prescription?</h3>
            <p className="text-sm text-slate-500 mb-5">
              Once finalized, this prescription will be saved and cannot be easily edited. Please confirm.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleFinalize} className="btn-success">Yes, Finalize</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
