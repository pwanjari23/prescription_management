import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, CheckCircle, Save, Eye,
  User, Stethoscope, Pill, FileText, Activity, Check, X, Edit2, Search
} from 'lucide-react';
import { mockPatients, mockMedicines } from '../data/mockData';
import { frequencyOptions, routeOptions, durationUnits } from '../data/medicines';
import { currentDoctor } from '../data/doctors';

const emptyRowDefault = {
  name: 'Paracetamol',
  strength: '500mg',
  dosage: '1 tablet',
  frequency: '1-0-1',
  duration: '5',
  durationUnit: 'Days',
  route: 'Oral',
  foodTiming: 'After food',
  instructions: 'Take with water',
};

export default function NewPrescription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientParamId = searchParams.get('patient');

  const [selectedPatient, setSelectedPatient] = useState(
    mockPatients.find(p => p.id === patientParamId) || mockPatients[0]
  );
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');

  const [form, setForm] = useState({
    chiefComplaint: 'Fever, headache, and mild body ache for 2 days',
    diagnosis: 'Viral Fever, Mild Dehydration',
    bp: '120/80',
    pulse: '78',
    spo2: '98',
    temp: '100.2',
    advice: 'Take rest, drink plenty of warm water, avoid cold items. Review if fever persists after 3 days.',
    followUp: '5',
    followUpUnit: 'Days',
  });

  /* ── Prescribed Medicines State ── */
  const [medicines, setMedicines] = useState([
    {
      name: 'Paracetamol',
      strength: '500mg',
      dosage: '1 tablet',
      frequency: '1-0-1',
      duration: '5',
      durationUnit: 'Days',
      route: 'Oral',
      foodTiming: 'After food',
      instructions: 'Take with water after meals',
    },
    {
      name: 'Pantoprazole',
      strength: '40mg',
      dosage: '1 tablet',
      frequency: '1-0-0',
      duration: '7',
      durationUnit: 'Days',
      route: 'Oral',
      foodTiming: 'Before food',
      instructions: 'Take 30 minutes before breakfast',
    },
  ]);

  // Index of row currently being edited inline
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [rowDraft, setRowDraft] = useState({ ...emptyRowDefault });
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const filteredPatients = mockPatients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredMedicineList = mockMedicines.filter(m =>
    m.medicineName.toLowerCase().includes(medicineSearchQuery.toLowerCase()) ||
    m.name.toLowerCase().includes(medicineSearchQuery.toLowerCase())
  );

  /* ── Add new row ── */
  const handleAddNewRow = () => {
    const newIdx = medicines.length;
    const defaultMed = mockMedicines[0] || emptyRowDefault;
    const newRow = {
      name: defaultMed.name,
      strength: defaultMed.strength,
      dosage: defaultMed.dosage || '1 tablet',
      frequency: defaultMed.frequency || '1-0-1',
      duration: defaultMed.duration || '5',
      durationUnit: defaultMed.durationUnit || 'Days',
      route: defaultMed.route || 'Oral',
      foodTiming: defaultMed.foodTiming || 'After food',
      instructions: defaultMed.instructions || 'Take with water',
    };
    setMedicines(prev => [...prev, newRow]);
    setEditingRowIndex(newIdx);
    setRowDraft(newRow);
    setMedicineSearchQuery('');
  };

  /* ── Edit existing row ── */
  const handleStartEditRow = (index) => {
    setEditingRowIndex(index);
    setRowDraft({ ...medicines[index] });
    setMedicineSearchQuery('');
  };

  /* ── Select medicine from dropdown (Auto-populates fields) ── */
  const handleSelectMedicineFromSuggest = (med) => {
    setRowDraft(rd => ({
      ...rd,
      name: med.name,
      strength: med.strength,
      dosage: med.dosage || '1 tablet',
      frequency: med.frequency || '1-0-1',
      duration: med.duration || '5',
      durationUnit: med.durationUnit || 'Days',
      foodTiming: med.foodTiming || 'After food',
      instructions: med.instructions || 'Take with water',
    }));
    setMedicineSearchQuery('');
  };

  /* ── Save inline row ── */
  const handleSaveRow = (index) => {
    if (!rowDraft.name) return;
    setMedicines(prev => prev.map((m, idx) => (idx === index ? { ...rowDraft } : m)));
    setEditingRowIndex(null);
    setMedicineSearchQuery('');
  };

  /* ── Remove row ── */
  const handleRemoveRow = (index) => {
    setMedicines(prev => prev.filter((_, idx) => idx !== index));
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
    }
  };

  /* ── Cancel row edit ── */
  const handleCancelRowEdit = (index) => {
    if (!medicines[index]?.name) {
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
        <p className="text-slate-500 text-sm">Saving to patient history and redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="page-header mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Create New Prescription</h1>
          <p className="page-subtitle">Select patient, add clinical complaints, and search medicines with auto-filled dosages</p>
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

      {/* Patient Selector Card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
            <User size={14} className="text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Patient Details</h2>
        </div>

        {selectedPatient ? (
          <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-900 text-sm font-bold">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedPatient.name}</p>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedPatient.id} · {selectedPatient.gender}, {selectedPatient.age} Yrs · {selectedPatient.phone}
                </p>
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                  <p className="text-xs text-amber-700 font-semibold mt-0.5">
                    ⚠ Allergies: {selectedPatient.allergies.join(', ')}
                  </p>
                )}
              </div>
            </div>
            <button onClick={() => setSelectedPatient(null)} className="text-xs text-primary-900 font-bold hover:underline">
              Change Patient
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              className="form-input text-xs"
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
                      <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.id} · Age {p.age} · {p.gender}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Doctor Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-900 text-xs font-bold">{currentDoctor.initials}</span>
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-xs">{currentDoctor.name} ({currentDoctor.qualification})</p>
            <p className="text-[11px] text-slate-500">Reg No: {currentDoctor.regNumber} · Specialization: {currentDoctor.specialization}</p>
          </div>
        </div>
      </div>

      {/* Clinical Information Card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
            <Activity size={14} className="text-amber-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Clinical Diagnosis &amp; Vitals</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="form-label">Chief Complaint</label>
            <textarea
              className="form-textarea text-xs"
              rows={2}
              placeholder="e.g. Fever, body ache, cough..."
              value={form.chiefComplaint}
              onChange={e => setForm(f => ({ ...f, chiefComplaint: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Diagnosis</label>
            <input
              type="text"
              className="form-input text-xs"
              placeholder="e.g. Viral Fever, Common Cold"
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
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">{v.label}</p>
                  <input
                    type="text"
                    className="form-input text-xs"
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

      {/* Medicines Selection & Search Section */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
              <Pill size={14} className="text-purple-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Prescribed Medicines</h2>
            {medicines.length > 0 && (
              <span className="px-2 py-0.5 bg-primary-100 text-primary-900 rounded-full text-xs font-bold">
                {medicines.length} Medicines
              </span>
            )}
          </div>
          <button
            onClick={handleAddNewRow}
            className="btn-primary btn-sm flex items-center gap-1"
          >
            <Plus size={14} /> Add Medicine
          </button>
        </div>

        {/* Medicines Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3 w-10">#</th>
                <th className="py-2.5 px-3 min-w-[220px]">Medicine Search &amp; Selection</th>
                <th className="py-2.5 px-3 w-28">Dosage</th>
                <th className="py-2.5 px-3 w-28">Frequency</th>
                <th className="py-2.5 px-3 w-32">Duration</th>
                <th className="py-2.5 px-3 w-32">Food Timing</th>
                <th className="py-2.5 px-3 min-w-[140px]">Instructions</th>
                <th className="py-2.5 px-3 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((m, i) => {
                const isEditing = editingRowIndex === i;

                if (isEditing) {
                  return (
                    <tr key={i} className="bg-amber-50/50 border-2 border-amber-300 animate-fade-in">
                      <td className="py-2 px-3 font-bold text-slate-700 align-top pt-3">{i + 1}</td>

                      {/* Medicine Search & Auto-fill */}
                      <td className="py-2 px-3 align-top">
                        <div className="relative">
                          <input
                            type="text"
                            className="form-input text-xs font-bold"
                            placeholder="Type medicine (e.g. Para, Azi)..."
                            value={rowDraft.name}
                            onChange={e => {
                              const val = e.target.value;
                              setRowDraft(rd => ({ ...rd, name: val }));
                              setMedicineSearchQuery(val);
                            }}
                          />
                          {/* Autocomplete Dropdown */}
                          {medicineSearchQuery && filteredMedicineList.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-44 overflow-y-auto">
                              {filteredMedicineList.map(item => (
                                <div
                                  key={item.id}
                                  className="px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                                  onClick={() => handleSelectMedicineFromSuggest(item)}
                                >
                                  <p className="font-bold text-slate-900 text-xs">{item.medicineName}</p>
                                  <p className="text-[10px] text-slate-500">
                                    {item.category} · {item.dosage} · {item.frequency} ({item.foodTiming})
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          className="form-input text-[11px] mt-1 text-slate-500"
                          placeholder="Strength (e.g. 500mg)"
                          value={rowDraft.strength}
                          onChange={e => setRowDraft(rd => ({ ...rd, strength: e.target.value }))}
                        />
                      </td>

                      {/* Dosage */}
                      <td className="py-2 px-3 align-top">
                        <input
                          type="text"
                          className="form-input text-xs"
                          placeholder="1 tablet"
                          value={rowDraft.dosage}
                          onChange={e => setRowDraft(rd => ({ ...rd, dosage: e.target.value }))}
                        />
                      </td>

                      {/* Frequency */}
                      <td className="py-2 px-3 align-top">
                        <input
                          type="text"
                          className="form-input text-xs"
                          placeholder="1-0-1"
                          value={rowDraft.frequency}
                          onChange={e => setRowDraft(rd => ({ ...rd, frequency: e.target.value }))}
                        />
                      </td>

                      {/* Duration */}
                      <td className="py-2 px-3 align-top">
                        <div className="flex gap-1">
                          <input
                            type="number"
                            className="form-input text-xs w-12"
                            min="1"
                            value={rowDraft.duration}
                            onChange={e => setRowDraft(rd => ({ ...rd, duration: e.target.value }))}
                          />
                          <select
                            className="form-select text-xs p-1"
                            value={rowDraft.durationUnit}
                            onChange={e => setRowDraft(rd => ({ ...rd, durationUnit: e.target.value }))}
                          >
                            {durationUnits.map(u => <option key={u}>{u}</option>)}
                          </select>
                        </div>
                      </td>

                      {/* Food Timing */}
                      <td className="py-2 px-3 align-top">
                        <select
                          className="form-select text-xs"
                          value={rowDraft.foodTiming || 'After food'}
                          onChange={e => setRowDraft(rd => ({ ...rd, foodTiming: e.target.value }))}
                        >
                          <option>After food</option>
                          <option>Before food</option>
                          <option>With food</option>
                        </select>
                      </td>

                      {/* Instructions */}
                      <td className="py-2 px-3 align-top">
                        <input
                          type="text"
                          className="form-input text-xs"
                          placeholder="Take with water"
                          value={rowDraft.instructions}
                          onChange={e => setRowDraft(rd => ({ ...rd, instructions: e.target.value }))}
                        />
                      </td>

                      {/* Actions */}
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
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-400">{i + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 text-xs">{m.name}</p>
                      <p className="text-[11px] text-slate-500">{m.strength || '500mg'}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{m.dosage}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-mono font-semibold text-[11px]">
                        {m.frequency}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-semibold">{m.duration} {m.durationUnit}</td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">{m.foodTiming || 'After food'}</td>
                    <td className="py-3 px-3 text-slate-600 italic text-[11px]">{m.instructions || 'Take with water'}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditRow(i)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-md transition-colors"
                          title="Edit Row"
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
            <p className="text-xs text-slate-500">No medicines added to prescription</p>
            <button
              onClick={handleAddNewRow}
              className="mt-2 text-xs font-bold text-primary-900 hover:underline"
            >
              + Add First Medicine Row
            </button>
          </div>
        )}
      </div>

      {/* Advice & Follow-Up Card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-slate-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Doctor's Advice &amp; Follow-Up Schedule</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="form-label">Doctor's Advice</label>
            <textarea
              className="form-textarea text-xs"
              rows={3}
              placeholder="Lifestyle guidance, warnings, dietary instructions..."
              value={form.advice}
              onChange={e => setForm(f => ({ ...f, advice: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Follow-up After</label>
            <div className="flex gap-2 max-w-xs">
              <input
                type="number"
                className="form-input text-xs w-20"
                value={form.followUp}
                onChange={e => setForm(f => ({ ...f, followUp: e.target.value }))}
                min="1"
              />
              <select
                className="form-select text-xs flex-1"
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
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 animate-fade-in">
            <h3 className="font-bold text-slate-900 mb-2">Finalize Prescription?</h3>
            <p className="text-xs text-slate-500 mb-5">
              This prescription will be saved to the patient profile history. Confirm to finalize.
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
