import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, CheckCircle, Save, Eye,
  User, Stethoscope, Pill, FileText, Activity, Check, X, Edit2
} from 'lucide-react';
import { patients } from '../data/patients';
import { medicines as medicineList, frequencyOptions, routeOptions, durationUnits } from '../data/medicines';
import { currentDoctor } from '../data/doctors';

const emptyRowDefault = {
  name: '',
  strength: '',
  dosage: '1 tablet',
  frequency: 'Once Daily',
  duration: '30',
  durationUnit: 'Days',
  route: 'Oral',
  instructions: 'After food',
};

export default function NewPrescription() {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');

  const [form, setForm] = useState({
    chiefComplaint: 'Chest discomfort on exertion since 2 weeks',
    diagnosis: 'Stable Angina, Hypertension',
    bp: '132/86',
    pulse: '74',
    spo2: '97',
    temp: '98.6',
    advice: 'Avoid oily and spicy food. Walk daily for 30 minutes. Take medicines regularly.',
    followUp: '30',
    followUpUnit: 'Days',
  });

  /* ── Medicines state with inline table row editing ── */
  const [medicines, setMedicines] = useState([
    { name: 'Aspirin', strength: '75 mg', dosage: '1 tablet', frequency: 'Once Daily', duration: '30', durationUnit: 'Days', route: 'Oral', instructions: 'After food' },
    { name: 'Atorvastatin', strength: '20 mg', dosage: '1 tablet', frequency: 'At Bedtime', duration: '30', durationUnit: 'Days', route: 'Oral', instructions: 'At bedtime' },
  ]);

  // Index of row currently being edited inline, or 'new' for a newly added row
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [rowDraft, setRowDraft] = useState({ ...emptyRowDefault });
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredMedicineList = medicineList.filter(m =>
    m.name.toLowerCase().includes(medicineSearchQuery.toLowerCase())
  );

  /* ── Add new inline row ── */
  const handleAddNewRow = () => {
    const newIdx = medicines.length;
    setMedicines(prev => [...prev, { ...emptyRowDefault }]);
    setEditingRowIndex(newIdx);
    setRowDraft({ ...emptyRowDefault });
    setMedicineSearchQuery('');
  };

  /* ── Edit existing inline row ── */
  const handleStartEditRow = (index) => {
    setEditingRowIndex(index);
    setRowDraft({ ...medicines[index] });
    setMedicineSearchQuery('');
  };

  /* ── Save inline row changes ── */
  const handleSaveRow = (index) => {
    if (!rowDraft.name) return;
    setMedicines(prev => prev.map((m, idx) => (idx === index ? { ...rowDraft } : m)));
    setEditingRowIndex(null);
    setMedicineSearchQuery('');
  };

  /* ── Delete row ── */
  const handleRemoveRow = (index) => {
    setMedicines(prev => prev.filter((_, idx) => idx !== index));
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
    }
  };

  /* ── Cancel row editing ── */
  const handleCancelRowEdit = (index) => {
    if (!medicines[index].name) {
      // If it was a newly added empty row, remove it
      setMedicines(prev => prev.filter((_, idx) => idx !== index));
    }
    setEditingRowIndex(null);
    setMedicineSearchQuery('');
  };

  const handleFinalize = async () => {
    setShowConfirm(false);
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => navigate('/prescriptions'), 1800);
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
    <div className="space-y-5 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="page-header mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Create New Prescription</h1>
          <p className="page-subtitle">Fill in clinical details and add medicines directly in the table</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/prescriptions/RX-2026-00128/preview')} className="btn-secondary">
            <Eye size={15} /> Preview Sheet
          </button>
          <button onClick={() => setShowConfirm(true)} className="btn-success">
            <Save size={15} /> Finalize Rx
          </button>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
            <User size={14} className="text-blue-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Patient Details</h2>
        </div>

        {selectedPatient ? (
          <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-900 text-sm font-bold">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{selectedPatient.name}</p>
                <p className="text-xs text-slate-500 font-mono">{selectedPatient.id} · {selectedPatient.gender}, {selectedPatient.age} Yrs · {selectedPatient.phone}</p>
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                  <p className="text-xs text-amber-700 font-medium mt-0.5">⚠ Allergies: {selectedPatient.allergies.join(', ')}</p>
                )}
              </div>
            </div>
            <button onClick={() => setSelectedPatient(null)} className="text-xs text-primary-900 font-medium hover:underline">
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

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* ── MEDICINES TABLE WITH DIRECT INLINE ENTRY (NO MODAL POPUP) ──────────── */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
              <Pill size={14} className="text-purple-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Medicines Prescribed</h2>
            {medicines.length > 0 && (
              <span className="px-2 py-0.5 bg-primary-100 text-primary-900 rounded-full text-xs font-semibold">
                {medicines.length}
              </span>
            )}
          </div>
          <button
            onClick={handleAddNewRow}
            className="btn-primary btn-sm"
          >
            <Plus size={14} /> Add Medicine
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3 w-10">#</th>
                <th className="py-2.5 px-3 min-w-[200px]">Medicine Name &amp; Strength</th>
                <th className="py-2.5 px-3 w-28">Dosage</th>
                <th className="py-2.5 px-3 w-36">Frequency</th>
                <th className="py-2.5 px-3 w-36">Duration</th>
                <th className="py-2.5 px-3 min-w-[140px]">Instructions</th>
                <th className="py-2.5 px-3 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((m, i) => {
                const isEditing = editingRowIndex === i;

                if (isEditing) {
                  return (
                    <tr key={i} className="bg-amber-50/50 border-2 border-amber-300 animate-fade-in">
                      <td className="py-2 px-3 font-semibold text-slate-700 align-top pt-3">{i + 1}</td>

                      {/* Inline Medicine Name + Auto-suggest */}
                      <td className="py-2 px-3 align-top">
                        <div className="relative">
                          <input
                            type="text"
                            className="form-input text-xs font-semibold"
                            placeholder="Type or select medicine..."
                            value={rowDraft.name}
                            onChange={e => {
                              const val = e.target.value;
                              setRowDraft(rd => ({ ...rd, name: val }));
                              setMedicineSearchQuery(val);
                            }}
                          />
                          {medicineSearchQuery && filteredMedicineList.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto">
                              {filteredMedicineList.slice(0, 6).map(item => (
                                <div
                                  key={item.id}
                                  className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer"
                                  onClick={() => {
                                    setRowDraft(rd => ({ ...rd, name: item.name, strength: item.strength }));
                                    setMedicineSearchQuery('');
                                  }}
                                >
                                  <p className="font-semibold text-slate-900 text-xs">{item.name}</p>
                                  <p className="text-[10px] text-slate-400">{item.strength} · {item.form}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          className="form-input text-[11px] mt-1 text-slate-500"
                          placeholder="Strength (e.g. 75 MG)"
                          value={rowDraft.strength}
                          onChange={e => setRowDraft(rd => ({ ...rd, strength: e.target.value }))}
                        />
                      </td>

                      {/* Dosage */}
                      <td className="py-2 px-3 align-top">
                        <input
                          type="text"
                          className="form-input text-xs"
                          placeholder="e.g. 1 tablet"
                          value={rowDraft.dosage}
                          onChange={e => setRowDraft(rd => ({ ...rd, dosage: e.target.value }))}
                        />
                      </td>

                      {/* Frequency */}
                      <td className="py-2 px-3 align-top">
                        <select
                          className="form-select text-xs"
                          value={rowDraft.frequency}
                          onChange={e => setRowDraft(rd => ({ ...rd, frequency: e.target.value }))}
                        >
                          {frequencyOptions.map(f => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </td>

                      {/* Duration */}
                      <td className="py-2 px-3 align-top">
                        <div className="flex gap-1">
                          <input
                            type="number"
                            className="form-input text-xs w-14"
                            min="1"
                            value={rowDraft.duration}
                            onChange={e => setRowDraft(rd => ({ ...rd, duration: e.target.value }))}
                          />
                          <select
                            className="form-select text-xs"
                            value={rowDraft.durationUnit}
                            onChange={e => setRowDraft(rd => ({ ...rd, durationUnit: e.target.value }))}
                          >
                            {durationUnits.map(u => (
                              <option key={u}>{u}</option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Instructions */}
                      <td className="py-2 px-3 align-top">
                        <input
                          type="text"
                          className="form-input text-xs"
                          placeholder="e.g. After food"
                          value={rowDraft.instructions}
                          onChange={e => setRowDraft(rd => ({ ...rd, instructions: e.target.value }))}
                        />
                      </td>

                      {/* Action buttons */}
                      <td className="py-2 px-3 align-top text-right">
                        <div className="flex items-center justify-end gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveRow(i)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                            title="Save Row"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelRowEdit(i)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-md transition-colors"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // Normal Display Row
                return (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-400">{i + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900 text-xs">{m.name}</p>
                      <p className="text-[11px] text-slate-500">{m.strength || 'Standard'}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{m.dosage}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-medium text-[11px]">
                        {m.frequency}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{m.duration} {m.durationUnit}</td>
                    <td className="py-3 px-3 text-slate-600 italic text-[11px]">{m.instructions || 'After food'}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditRow(i)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-md transition-colors"
                          title="Edit Row Inline"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(i)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                          title="Remove Row"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {medicines.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center mt-3">
            <Pill size={24} className="mx-auto text-slate-300 mb-1" />
            <p className="text-xs text-slate-500">No medicines in table</p>
            <button
              onClick={handleAddNewRow}
              className="mt-2 text-xs font-semibold text-primary-900 hover:underline"
            >
              + Add First Medicine Row
            </button>
          </div>
        )}
      </div>

      {/* Doctor's Advice & Follow-up */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-slate-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Doctor's Advice &amp; Follow-up</h2>
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

      {/* Confirm Finalize Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-fade-in p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Finalize Prescription?</h3>
            <p className="text-sm text-slate-500 mb-5">
              Once finalized, this prescription will be saved to patient history. Confirm to proceed.
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
