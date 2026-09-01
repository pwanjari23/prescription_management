import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, CheckCircle, Save, Eye,
  User, Stethoscope, Pill, FileText, Activity, Check, X, Edit2
} from 'lucide-react';
import { mockPatients, mockMedicines } from '../data/mockData';
import { durationUnits } from '../data/medicines';
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
  const repeatParamId = searchParams.get('repeat');

  const repeatRx = mockPrescriptions.find(r => r.id === repeatParamId);

  const [selectedPatient, setSelectedPatient] = useState(
    mockPatients.find(p => p.id === (repeatRx?.patientId || patientParamId)) || mockPatients[0]
  );
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');

  const [form, setForm] = useState({
    chiefComplaint: repeatRx?.chiefComplaint || 'Fever, headache, and mild body ache for 2 days',
    diagnosis: repeatRx?.diagnosis || 'Viral Fever, Mild Dehydration',
    bp: repeatRx?.vitals?.bp || '120/80',
    pulse: repeatRx?.vitals?.pulse || '78',
    spo2: repeatRx?.vitals?.spo2 || '98',
    temp: repeatRx?.vitals?.temp || '100.2',
    advice: repeatRx?.advice || 'Take rest, drink plenty of warm water, avoid cold items. Review if fever persists after 3 days.',
    followUp: repeatRx?.followUp || '5',
    followUpUnit: repeatRx?.followUpUnit || 'Days',
  });

  const [medicines, setMedicines] = useState(
    repeatRx?.medicines ? repeatRx.medicines.map(m => ({
      name: m.name,
      strength: m.strength || '',
      dosage: m.dosage || '1 tablet',
      frequency: m.frequency || '1-0-1',
      duration: m.duration || '5',
      durationUnit: m.durationUnit || 'Days',
      route: m.route || 'Oral',
      foodTiming: m.foodTiming || 'After food',
      instructions: m.instructions || 'Take with water',
    })) : [
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
    ]
  );

  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [rowDraft, setRowDraft] = useState({ ...emptyRowDefault });
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const filteredPatients = mockPatients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

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
    setSelectedCatalogId(defaultMed.id || '');
  };

  const handleStartEditRow = (index) => {
    setEditingRowIndex(index);
    setRowDraft({ ...medicines[index] });
    const matched = mockMedicines.find(m => m.name.toLowerCase() === medicines[index].name.toLowerCase());
    setSelectedCatalogId(matched ? matched.id : 'custom');
  };

  const handleDropdownSelectMedicine = (e) => {
    const val = e.target.value;
    setSelectedCatalogId(val);
    if (val === 'custom') {
      setRowDraft(rd => ({
        ...rd,
        name: '',
        strength: '',
        dosage: '1 tablet',
        frequency: '1-0-1',
        duration: '5',
        durationUnit: 'Days',
        foodTiming: 'After food',
        instructions: 'Take with water',
      }));
      return;
    }

    const med = mockMedicines.find(m => m.id === val);
    if (med) {
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
    }
  };

  const handleSaveRow = (index) => {
    if (!rowDraft.name) return;
    setMedicines(prev => prev.map((m, idx) => (idx === index ? { ...rowDraft } : m)));
    setEditingRowIndex(null);
  };

  const handleRemoveRow = (index) => {
    setMedicines(prev => prev.filter((_, idx) => idx !== index));
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
    }
  };

  const handleCancelRowEdit = (index) => {
    if (!medicines[index]?.name) {
      setMedicines(prev => prev.filter((_, idx) => idx !== index));
    }
    setEditingRowIndex(null);
  };

  const handleFinalize = async () => {
    setShowConfirm(false);
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => navigate('/prescriptions'), 1800);
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Prescription Finalized!</h2>
        <p className="text-slate-500 text-xs">Saving to patient history and redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Create Prescription</h1>
            <p className="text-xs text-slate-500">Select medicine from dropdown or type custom medicine name</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/prescriptions/RX-2026-00128/preview')} className="btn-secondary btn-sm">
            <Eye size={14} /> Preview
          </button>
          <button onClick={() => setShowConfirm(true)} className="btn-success btn-sm">
            <Save size={14} /> Finalize Rx
          </button>
        </div>
      </div>

      {/* Compact Top Grid: Patient & Doctor Info + Clinical Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Card: Patient Selector */}
        <div className="card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User size={14} className="text-blue-600" /> Patient Info
              </span>
              {selectedPatient && (
                <button onClick={() => setSelectedPatient(null)} className="text-xs text-primary-900 font-bold hover:underline">
                  Change
                </button>
              )}
            </div>

            {selectedPatient ? (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-900 text-xs font-bold">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-xs truncate">{selectedPatient.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {selectedPatient.id} · {selectedPatient.gender}, {selectedPatient.age} Yrs · {selectedPatient.phone}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  className="form-input text-xs py-1.5"
                  placeholder="Search patient by name or ID..."
                  value={patientSearch}
                  onChange={e => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
                  onFocus={() => setShowPatientDropdown(true)}
                />
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                    {filteredPatients.slice(0, 6).map(p => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                        onClick={() => { setSelectedPatient(p); setShowPatientDropdown(false); setPatientSearch(''); }}
                      >
                        <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-900 text-[10px] font-bold">{p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.id} · Age {p.age}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
            <Stethoscope size={13} className="text-emerald-600 flex-shrink-0" />
            <span className="truncate"><strong>{currentDoctor.name}</strong> ({currentDoctor.qualification}) · Reg: {currentDoctor.regNumber}</span>
          </div>
        </div>

        {/* Right Card: Clinical Details & Vitals */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center gap-1.5">
            <Activity size={14} className="text-amber-600" />
            <h2 className="text-xs font-bold text-slate-700">Clinical Details &amp; Vitals</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Complaint</label>
              <input
                type="text"
                className="form-input text-xs py-1.5"
                placeholder="Fever, cough, chest tightness..."
                value={form.chiefComplaint}
                onChange={e => setForm(f => ({ ...f, chiefComplaint: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Diagnosis</label>
              <input
                type="text"
                className="form-input text-xs py-1.5"
                placeholder="Viral Fever, Hypertension..."
                value={form.diagnosis}
                onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
              />
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { key: 'bp', label: 'BP', placeholder: '120/80' },
              { key: 'pulse', label: 'Pulse', placeholder: '72 bpm' },
              { key: 'spo2', label: 'SpO₂', placeholder: '98%' },
              { key: 'temp', label: 'Temp', placeholder: '98.6°F' },
            ].map(v => (
              <div key={v.key}>
                <span className="text-[9px] font-bold text-slate-400 block">{v.label}</span>
                <input
                  type="text"
                  className="form-input text-xs py-1 px-2 text-center"
                  placeholder={v.placeholder}
                  value={form[v.key]}
                  onChange={e => setForm(f => ({ ...f, [v.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prescribed Medicines Section */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Pill size={15} className="text-purple-600" />
            <h2 className="text-xs font-bold text-slate-900">Prescribed Medicines ({medicines.length})</h2>
          </div>
          <button onClick={handleAddNewRow} className="btn-primary btn-sm py-1">
            <Plus size={13} /> Add Medicine
          </button>
        </div>

        {/* Medicines Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2 px-2.5 w-8">#</th>
                <th className="py-2 px-2.5 min-w-[240px]">Select Medicine / Custom Name</th>
                <th className="py-2 px-2.5 w-24">Dosage</th>
                <th className="py-2 px-2.5 w-24">Frequency</th>
                <th className="py-2 px-2.5 w-28">Duration</th>
                <th className="py-2 px-2.5 w-28">Food Timing</th>
                <th className="py-2 px-2.5 min-w-[120px]">Instructions</th>
                <th className="py-2 px-2.5 w-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((m, i) => {
                const isEditing = editingRowIndex === i;

                if (isEditing) {
                  return (
                    <tr key={i} className="bg-amber-50/60 border-y-2 border-amber-300">
                      <td className="py-1.5 px-2.5 font-bold text-slate-700 align-middle">{i + 1}</td>
                      
                      {/* Medicine Selection: Dropdown List + Custom Name Input */}
                      <td className="py-1.5 px-2.5 align-top space-y-1.5">
                        {/* Dropdown list of catalog medicines */}
                        <select
                          className="form-select text-xs py-1 font-bold text-slate-900 border-primary-900/30"
                          value={selectedCatalogId}
                          onChange={handleDropdownSelectMedicine}
                        >
                          <option value="">-- Select from Medicine Dropdown --</option>
                          {mockMedicines.map(med => (
                            <option key={med.id} value={med.id}>
                              {med.medicineName} ({med.category})
                            </option>
                          ))}
                          <option value="custom">✏ Custom Medicine (Type Below)</option>
                        </select>

                        {/* Editable Custom Medicine Name Input */}
                        <input
                          type="text"
                          className="form-input text-xs py-1 bg-white font-semibold"
                          placeholder="Medicine name (or type custom)..."
                          value={rowDraft.name}
                          onChange={e => setRowDraft(rd => ({ ...rd, name: e.target.value }))}
                        />
                      </td>

                      <td className="py-1.5 px-2.5 align-top">
                        <input
                          type="text"
                          className="form-input text-xs py-1"
                          placeholder="1 tablet"
                          value={rowDraft.dosage}
                          onChange={e => setRowDraft(rd => ({ ...rd, dosage: e.target.value }))}
                        />
                      </td>
                      <td className="py-1.5 px-2.5 align-top">
                        <input
                          type="text"
                          className="form-input text-xs py-1"
                          placeholder="1-0-1"
                          value={rowDraft.frequency}
                          onChange={e => setRowDraft(rd => ({ ...rd, frequency: e.target.value }))}
                        />
                      </td>
                      <td className="py-1.5 px-2.5 align-top">
                        <div className="flex gap-1">
                          <input
                            type="number"
                            className="form-input text-xs py-1 w-10 text-center"
                            min="1"
                            value={rowDraft.duration}
                            onChange={e => setRowDraft(rd => ({ ...rd, duration: e.target.value }))}
                          />
                          <select
                            className="form-select text-xs py-1 px-1"
                            value={rowDraft.durationUnit}
                            onChange={e => setRowDraft(rd => ({ ...rd, durationUnit: e.target.value }))}
                          >
                            {durationUnits.map(u => <option key={u}>{u}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="py-1.5 px-2.5 align-top">
                        <select
                          className="form-select text-xs py-1"
                          value={rowDraft.foodTiming || 'After food'}
                          onChange={e => setRowDraft(rd => ({ ...rd, foodTiming: e.target.value }))}
                        >
                          <option>After food</option>
                          <option>Before food</option>
                          <option>With food</option>
                        </select>
                      </td>
                      <td className="py-1.5 px-2.5 align-top">
                        <input
                          type="text"
                          className="form-input text-xs py-1"
                          placeholder="Instructions"
                          value={rowDraft.instructions}
                          onChange={e => setRowDraft(rd => ({ ...rd, instructions: e.target.value }))}
                        />
                      </td>
                      <td className="py-1.5 px-2.5 text-right align-top">
                        <div className="flex items-center justify-end gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveRow(i)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            title="Save Medicine Row"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelRowEdit(i)}
                            className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                            title="Cancel"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-2.5 font-semibold text-slate-400">{i + 1}</td>
                    <td className="py-2.5 px-2.5">
                      <p className="font-bold text-slate-900 text-xs">{m.name} {m.strength ? `(${m.strength})` : ''}</p>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-700">{m.dosage}</td>
                    <td className="py-2.5 px-2.5">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-mono font-semibold text-[10px]">
                        {m.frequency}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-700 font-semibold">{m.duration} {m.durationUnit}</td>
                    <td className="py-2.5 px-2.5 text-slate-600 text-[11px]">{m.foodTiming || 'After food'}</td>
                    <td className="py-2.5 px-2.5 text-slate-600 italic text-[11px]">{m.instructions || 'Take with water'}</td>
                    <td className="py-2.5 px-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditRow(i)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                          title="Edit Row"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(i)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
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
      </div>

      {/* Advice & Follow-Up Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 card p-4">
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Doctor's Advice</label>
          <input
            type="text"
            className="form-input text-xs py-1.5"
            placeholder="Lifestyle guidance, warnings, dietary advice..."
            value={form.advice}
            onChange={e => setForm(f => ({ ...f, advice: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Follow-up After</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="form-input text-xs py-1.5 w-16 text-center"
              value={form.followUp}
              onChange={e => setForm(f => ({ ...f, followUp: e.target.value }))}
              min="1"
            />
            <select
              className="form-select text-xs py-1.5 flex-1"
              value={form.followUpUnit}
              onChange={e => setForm(f => ({ ...f, followUpUnit: e.target.value }))}
            >
              {durationUnits.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Confirm Finalize Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5 animate-fade-in">
            <h3 className="font-bold text-slate-900 mb-1">Finalize Prescription?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Save prescription to patient medical history.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary btn-sm">Cancel</button>
              <button onClick={handleFinalize} className="btn-success btn-sm">Yes, Finalize</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
