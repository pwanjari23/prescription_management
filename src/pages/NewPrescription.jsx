import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, CheckCircle, Save, Eye,
  User, Stethoscope, Pill, FileText, Activity, Check, X, Edit2,
  ChevronDown, Search, RotateCcw
} from 'lucide-react';
import { mockPatients, mockMedicines, mockPrescriptions } from '../data/mockData';
import { durationUnits } from '../data/medicines';
import { currentDoctor } from '../data/doctors';

function MedicineSearchDropdown({ selectedCatalogId, currentMedicineName, onSelectMedicine }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMedicines = mockMedicines.filter(m =>
    (m.medicineName || m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.strength || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectedMed = mockMedicines.find(m => m.id === selectedCatalogId);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-primary-900/30 rounded-lg shadow-2xs hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-left transition-all"
      >
        <span className="truncate">
          {selectedCatalogId === 'custom' ? (
            <span className="text-amber-700 font-bold">✏ Custom Medicine</span>
          ) : selectedMed ? (
            <span className="font-bold text-slate-900">{selectedMed.medicineName || selectedMed.name} ({selectedMed.category})</span>
          ) : currentMedicineName ? (
            <span className="font-bold text-slate-900">{currentMedicineName}</span>
          ) : (
            <span className="text-slate-400 font-normal">-- Search & Select Medicine --</span>
          )}
        </span>
        <ChevronDown size={14} className="text-slate-400 flex-shrink-0 ml-1" />
      </button>

      {/* Floating Dropdown with Live Search */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in divide-y divide-slate-100 min-w-[280px]">
          {/* Live Search Input Header */}
          <div className="p-2 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                className="w-full pl-8 pr-7 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900/20 placeholder:text-slate-400 font-normal"
                placeholder="Search medicine or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Medicines List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
            {filteredMedicines.length === 0 ? (
              <div className="py-4 px-3 text-center text-xs text-slate-400 font-medium">
                No catalog medicines found for &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredMedicines.map(med => {
                const isSelected = selectedCatalogId === med.id;
                return (
                  <div
                    key={med.id}
                    onClick={() => {
                      onSelectMedicine(med);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`px-3 py-2 text-xs cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                      isSelected ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 truncate">{med.medicineName || med.name}</span>
                        {med.strength && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono flex-shrink-0">
                            {med.strength}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {med.category || 'General'} • {med.dosage || '1 tablet'} ({med.frequency || '1-0-1'})
                      </p>
                    </div>
                    {isSelected && <Check size={14} className="text-blue-600 flex-shrink-0" />}
                  </div>
                );
              })
            )}

            {/* Custom Medicine Trigger */}
            <div
              onClick={() => {
                onSelectMedicine('custom');
                setIsOpen(false);
                setSearch('');
              }}
              className="px-3 py-2.5 text-xs text-amber-700 bg-amber-50/60 hover:bg-amber-100/70 font-semibold cursor-pointer flex items-center gap-2 transition-colors border-t border-slate-100"
            >
              <Pill size={14} className="text-amber-600 flex-shrink-0" />
              <span>✏ Custom Medicine...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const dosageOptions = [
  '1 tablet',
  '2 tablets',
  '1/2 tablet',
  '1 capsule',
  '2 capsules',
  '5 ml',
  '10 ml',
  '1 puff',
  '2 puffs',
  '1 sachet',
  '1 drop'
];

const frequencyOptions = [
  '1-0-1',
  '1-0-0',
  '0-0-1',
  '1-1-1',
  '1-1-1-1',
  '0-1-0',
  '1-0-1-0',
  'SOS',
  'Once Daily',
  'Twice Daily',
  'Three Times Daily',
  'Four Times Daily',
  'At Bedtime (HS)',
];

const durationOptions = [
  '3 Days',
  '5 Days',
  '7 Days',
  '10 Days',
  '14 Days',
  '15 Days',
  '30 Days',
  '1 Month',
  '3 Months',
];

const foodTimingOptions = [
  'After food',
  'Before food',
  'With food',
  'On empty stomach',
  'At bedtime',
  'As directed'
];

const instructionOptions = [
  'Take with water',
  'Take with warm milk',
  'Take 30 min before breakfast',
  'Chew thoroughly before swallowing',
  'Avoid alcohol & dairy',
  'Dissolve in half glass of water'
];

function SingleCustomSelect({
  label,
  options,
  value = '',
  isCustom = false,
  placeholder = '',
  onChangeValue,
  onChangeMode,
  className = ""
}) {
  if (isCustom) {
    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <input
          type="text"
          className="form-input text-xs py-1.5 pl-2 pr-7 font-semibold text-amber-950 bg-amber-50/90 border-amber-300 rounded-lg w-full placeholder:text-amber-700/60 shadow-2xs focus:border-amber-500 focus:ring-amber-500/20 transition-all"
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          value={value}
          onChange={e => onChangeValue(e.target.value)}
          autoFocus
        />
        <button
          type="button"
          onClick={() => {
            onChangeMode(false);
            onChangeValue(options[0] || '');
          }}
          className="absolute right-1.5 p-0.5 text-amber-700 hover:text-amber-900 hover:bg-amber-200/60 rounded transition-colors"
          title="Switch back to standard dropdown list"
        >
          <RotateCcw size={12} />
        </button>
      </div>
    );
  }

  return (
    <select
      className="form-select text-xs py-1.5 px-2 font-semibold text-slate-900 border-slate-300 rounded-lg cursor-pointer bg-white w-full focus:ring-2 focus:ring-primary-900/20"
      value={options.includes(value) ? value : 'custom'}
      onChange={e => {
        const val = e.target.value;
        if (val === 'custom') {
          onChangeMode(true);
          onChangeValue(options.includes(value) ? '' : value);
        } else {
          onChangeMode(false);
          onChangeValue(val);
        }
      }}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
      <option value="custom">✏ Custom {label}...</option>
    </select>
  );
}


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

  const rawRepeatId = repeatParamId ? decodeURIComponent(repeatParamId).trim() : '';
  const cleanRepeatId = rawRepeatId.replace(/[\s_]/g, '-');
  const repeatRx = mockPrescriptions.find(r => r && (r.id === rawRepeatId || r.id === cleanRepeatId || (r.id && r.id.replace(/[\s_]/g, '-') === cleanRepeatId)));

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
      isCustomName: false,
      strength: defaultMed.strength,
      dosage: defaultMed.dosage || '1 tablet',
      isCustomDosage: false,
      frequency: defaultMed.frequency || '1-0-1',
      isCustomFrequency: false,
      duration: defaultMed.duration ? `${defaultMed.duration} ${defaultMed.durationUnit || 'Days'}` : '5 Days',
      isCustomDuration: false,
      route: defaultMed.route || 'Oral',
      foodTiming: defaultMed.foodTiming || 'After food',
      isCustomFoodTiming: false,
      instructions: defaultMed.instructions || 'Take with water',
      isCustomInstructions: false,
    };
    setMedicines(prev => [...prev, newRow]);
    setEditingRowIndex(newIdx);
    setRowDraft(newRow);
    setSelectedCatalogId(defaultMed.id || '');
  };

  const handleStartEditRow = (index) => {
    setEditingRowIndex(index);
    const med = medicines[index];
    const matched = mockMedicines.find(m => (m.medicineName || m.name || '').toLowerCase() === (med.name || '').toLowerCase());
    
    const isCustomName = med.isCustomName ?? (!matched && med.name !== '');
    const isCustomDosage = med.isCustomDosage ?? (!dosageOptions.includes(med.dosage));
    const isCustomFrequency = med.isCustomFrequency ?? (!frequencyOptions.includes(med.frequency));
    const isCustomDuration = med.isCustomDuration ?? (!durationOptions.includes(med.duration));
    const isCustomFoodTiming = med.isCustomFoodTiming ?? (!foodTimingOptions.includes(med.foodTiming));
    const isCustomInstructions = med.isCustomInstructions ?? (!instructionOptions.includes(med.instructions));

    setRowDraft({
      ...med,
      isCustomName,
      isCustomDosage,
      isCustomFrequency,
      isCustomDuration,
      isCustomFoodTiming,
      isCustomInstructions,
    });
    setSelectedCatalogId(matched ? matched.id : 'custom');
  };

  const handleDropdownSelectMedicine = (medItem) => {
    if (medItem === 'custom') {
      setSelectedCatalogId('custom');
      setRowDraft(rd => ({
        ...rd,
        name: '',
        isCustomName: true,
        strength: '',
      }));
      return;
    }

    if (medItem) {
      setSelectedCatalogId(medItem.id);
      setRowDraft(rd => ({
        ...rd,
        name: medItem.medicineName || medItem.name,
        isCustomName: false,
        strength: medItem.strength || '',
        dosage: medItem.dosage || '1 tablet',
        isCustomDosage: false,
        frequency: medItem.frequency || '1-0-1',
        isCustomFrequency: false,
        duration: medItem.duration ? `${medItem.duration} ${medItem.durationUnit || 'Days'}` : '5 Days',
        isCustomDuration: false,
        foodTiming: medItem.foodTiming || 'After food',
        isCustomFoodTiming: false,
        instructions: medItem.instructions || 'Take with water',
        isCustomInstructions: false,
      }));
    }
  };

  const handleSaveRow = (index) => {
    if (!rowDraft.name || !rowDraft.name.trim()) {
      alert("Medicine name is required. Please enter a valid medicine name.");
      return;
    }
    if (!rowDraft.dosage || !rowDraft.dosage.trim()) {
      alert("Dosage is required. Please enter a valid dosage.");
      return;
    }
    if (!rowDraft.frequency || !rowDraft.frequency.trim()) {
      alert("Frequency is required. Please enter a valid frequency.");
      return;
    }
    if (!rowDraft.duration || !rowDraft.duration.toString().trim()) {
      alert("Duration is required. Please enter a valid duration.");
      return;
    }
    if (!rowDraft.foodTiming || !rowDraft.foodTiming.trim()) {
      alert("Food timing is required. Please enter valid food timing.");
      return;
    }
    if (!rowDraft.instructions || !rowDraft.instructions.trim()) {
      alert("Instructions field is required. Please enter valid instructions.");
      return;
    }

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

  const handleFinalize = () => {
    setShowConfirm(false);
    
    const targetId = repeatRx?.id || 'RX-2026-00128';
    const newRx = {
      id: targetId,
      prescriptionId: targetId,
      patientId: selectedPatient?.id || 'PT-00124',
      patientName: selectedPatient?.name || 'Rahul Sharma',
      doctorId: currentDoctor.id || 'D001',
      doctor: currentDoctor.name,
      doctorName: currentDoctor.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Finalized',
      chiefComplaint: form.chiefComplaint,
      diagnosis: form.diagnosis,
      vitals: { bp: form.bp, pulse: form.pulse, spo2: form.spo2, temp: form.temp },
      medicines: medicines,
      advice: form.advice,
      followUp: form.followUp,
      followUpUnit: form.followUpUnit,
    };

    const existingIdx = mockPrescriptions.findIndex(p => p && p.id === targetId);
    if (existingIdx >= 0) {
      mockPrescriptions[existingIdx] = newRx;
    } else {
      mockPrescriptions.unshift(newRx);
    }

    navigate(`/prescriptions/${targetId}/preview`);
  };

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
          <button onClick={() => navigate(`/prescriptions/${repeatRx?.id || 'RX-2026-00128'}/preview`)} className="btn-secondary btn-sm">
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
        <div className={`transition-all duration-200 ${editingRowIndex !== null ? 'pb-64 min-h-[380px] overflow-visible' : 'overflow-x-auto'}`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2 px-2.5 w-8">#</th>
                <th className="py-2 px-2.5 min-w-[260px]">Select Medicine / Custom Name</th>
                <th className="py-2 px-2.5 min-w-[130px]">Dosage</th>
                <th className="py-2 px-2.5 min-w-[130px]">Frequency</th>
                <th className="py-2 px-2.5 min-w-[150px]">Duration</th>
                <th className="py-2 px-2.5 min-w-[140px]">Food Timing</th>
                <th className="py-2 px-2.5 min-w-[160px]">Instructions</th>
                <th className="py-2 px-2.5 w-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((m, i) => {
                const isEditing = editingRowIndex === i;

                if (isEditing) {
                  return (
                    <tr key={i} className="bg-amber-50/60 border-y-2 border-amber-300 relative z-30">
                      <td className="py-1.5 px-2.5 font-bold text-slate-700 align-middle">{i + 1}</td>
                      
                      {/* Medicine Selection Field: Single Input when Custom, Dropdown when Standard */}
                      <td className="py-1.5 px-2.5 align-top space-y-1.5 min-w-[260px] relative z-40">
                        {rowDraft.isCustomName ? (
                          <div className="relative flex items-center w-full">
                            <input
                              type="text"
                              className="form-input text-xs py-1.5 pl-2 pr-7 font-semibold text-amber-950 bg-amber-50/90 border-amber-300 rounded-lg w-full placeholder:text-amber-700/60 shadow-2xs focus:border-amber-500 focus:ring-amber-500/20"
                              placeholder="Enter medicine name"
                              value={rowDraft.name}
                              onChange={e => setRowDraft(rd => ({ ...rd, name: e.target.value }))}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const defaultMed = mockMedicines[0];
                                setRowDraft(rd => ({
                                  ...rd,
                                  name: defaultMed.medicineName || defaultMed.name,
                                  isCustomName: false,
                                }));
                                setSelectedCatalogId(defaultMed.id);
                              }}
                              className="absolute right-1.5 p-0.5 text-amber-700 hover:text-amber-900 hover:bg-amber-200/60 rounded transition-colors"
                              title="Switch back to medicine catalog search"
                            >
                              <RotateCcw size={12} />
                            </button>
                          </div>
                        ) : (
                          <MedicineSearchDropdown
                            selectedCatalogId={selectedCatalogId}
                            currentMedicineName={rowDraft.name}
                            onSelectMedicine={handleDropdownSelectMedicine}
                          />
                        )}
                      </td>

                      {/* Dosage Field with SingleCustomSelect */}
                      <td className="py-1.5 px-2.5 align-top min-w-[130px]">
                        <SingleCustomSelect
                          label="Dosage"
                          options={dosageOptions}
                          value={rowDraft.dosage}
                          isCustom={rowDraft.isCustomDosage}
                          placeholder="Enter dosage"
                          onChangeValue={val => setRowDraft(rd => ({ ...rd, dosage: val }))}
                          onChangeMode={custom => setRowDraft(rd => ({ ...rd, isCustomDosage: custom }))}
                        />
                      </td>

                      {/* Frequency Field with SingleCustomSelect */}
                      <td className="py-1.5 px-2.5 align-top min-w-[130px]">
                        <SingleCustomSelect
                          label="Frequency"
                          options={frequencyOptions}
                          value={rowDraft.frequency}
                          isCustom={rowDraft.isCustomFrequency}
                          placeholder="Enter frequency"
                          onChangeValue={val => setRowDraft(rd => ({ ...rd, frequency: val }))}
                          onChangeMode={custom => setRowDraft(rd => ({ ...rd, isCustomFrequency: custom }))}
                        />
                      </td>

                      {/* Duration Field with SingleCustomSelect */}
                      <td className="py-1.5 px-2.5 align-top min-w-[140px]">
                        <SingleCustomSelect
                          label="Duration"
                          options={durationOptions}
                          value={rowDraft.duration}
                          isCustom={rowDraft.isCustomDuration}
                          placeholder="Enter duration"
                          onChangeValue={val => setRowDraft(rd => ({ ...rd, duration: val }))}
                          onChangeMode={custom => setRowDraft(rd => ({ ...rd, isCustomDuration: custom }))}
                        />
                      </td>

                      {/* Food Timing Field with SingleCustomSelect */}
                      <td className="py-1.5 px-2.5 align-top min-w-[140px]">
                        <SingleCustomSelect
                          label="Food Timing"
                          options={foodTimingOptions}
                          value={rowDraft.foodTiming}
                          isCustom={rowDraft.isCustomFoodTiming}
                          placeholder="Enter food timing"
                          onChangeValue={val => setRowDraft(rd => ({ ...rd, foodTiming: val }))}
                          onChangeMode={custom => setRowDraft(rd => ({ ...rd, isCustomFoodTiming: custom }))}
                        />
                      </td>

                      {/* Instructions Field with SingleCustomSelect */}
                      <td className="py-1.5 px-2.5 align-top min-w-[160px]">
                        <SingleCustomSelect
                          label="Instructions"
                          options={instructionOptions}
                          value={rowDraft.instructions}
                          isCustom={rowDraft.isCustomInstructions}
                          placeholder="Enter instructions"
                          onChangeValue={val => setRowDraft(rd => ({ ...rd, instructions: val }))}
                          onChangeMode={custom => setRowDraft(rd => ({ ...rd, isCustomInstructions: custom }))}
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-1.5 px-2.5 text-right align-top">
                        <div className="flex items-center justify-end gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveRow(i)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 shadow-2xs"
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
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-2.5 font-semibold text-slate-400 align-middle">{i + 1}</td>
                    
                    {/* Medicine Name */}
                    <td className="py-2.5 px-2.5 align-middle">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs">{m.name} {m.strength ? `(${m.strength})` : ''}</span>
                        {m.isCustomName && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Dosage */}
                    <td className="py-2.5 px-2.5 text-slate-700 align-middle">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs">{m.dosage}</span>
                        {m.isCustomDosage && (
                          <span className="px-1 py-0.2 text-[8px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Frequency */}
                    <td className="py-2.5 px-2.5 align-middle">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-mono font-semibold text-[10px]">
                          {m.frequency}
                        </span>
                        {m.isCustomFrequency && (
                          <span className="px-1 py-0.2 text-[8px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-2.5 px-2.5 text-slate-700 font-semibold align-middle">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs">{m.duration} {m.durationUnit && !m.duration.includes(m.durationUnit) ? m.durationUnit : ''}</span>
                        {m.isCustomDuration && (
                          <span className="px-1 py-0.2 text-[8px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Food Timing */}
                    <td className="py-2.5 px-2.5 text-slate-600 text-[11px] align-middle">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span>{m.foodTiming || 'After food'}</span>
                        {m.isCustomFoodTiming && (
                          <span className="px-1 py-0.2 text-[8px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Instructions */}
                    <td className="py-2.5 px-2.5 text-slate-600 italic text-[11px] align-middle">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span>{m.instructions || 'Take with water'}</span>
                        {m.isCustomInstructions && (
                          <span className="px-1 py-0.2 text-[8px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-2.5 text-right align-middle">
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
