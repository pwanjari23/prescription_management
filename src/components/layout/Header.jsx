import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, User, FileText, Pill, X, ChevronRight } from 'lucide-react';
import { currentDoctor } from '../../data/doctors';
import { mockPatients, mockPrescriptions, mockMedicines } from '../../data/mockData';

export default function Header({ onMobileMenuOpen }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search matching
  const q = query.trim().toLowerCase();

  const matchedPatients = q ? mockPatients.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.id.toLowerCase().includes(q) ||
    p.phone.includes(q)
  ).slice(0, 4) : [];

  const matchedPrescriptions = q ? mockPrescriptions.filter(rx =>
    rx.id.toLowerCase().includes(q) ||
    rx.patientName.toLowerCase().includes(q) ||
    (rx.diagnosis && rx.diagnosis.toLowerCase().includes(q))
  ).slice(0, 4) : [];

  const matchedMedicines = q ? mockMedicines.filter(m =>
    m.medicineName.toLowerCase().includes(q) ||
    m.name.toLowerCase().includes(q) ||
    (m.category && m.category.toLowerCase().includes(q))
  ).slice(0, 4) : [];

  const hasResults = matchedPatients.length > 0 || matchedPrescriptions.length > 0 || matchedMedicines.length > 0;

  const handleSelectPatient = (id) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/patients/${id}`);
  };

  const handleSelectPrescription = (id) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/prescriptions/${id}`);
  };

  const handleSelectMedicine = () => {
    setIsOpen(false);
    setQuery('');
    navigate('/medicines');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Mobile menu toggle */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Global Search Bar */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-lg">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2 text-xs text-slate-900 bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-700 focus:bg-white transition-all placeholder:text-slate-400"
            placeholder="Global Search (Patients, Prescriptions, Medicines)..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && query.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
            {!hasResults ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching patients, prescriptions, or medicines found for "{query}"
              </div>
            ) : (
              <>
                {/* Matched Patients Category */}
                {matchedPatients.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <User size={12} className="text-blue-600" /> Patients
                    </div>
                    {matchedPatients.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatient(p.id)}
                        className="flex items-center justify-between px-2.5 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                            {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.id} · {p.gender}, Age {p.age}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Matched Prescriptions Category */}
                {matchedPrescriptions.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FileText size={12} className="text-purple-600" /> Prescriptions
                    </div>
                    {matchedPrescriptions.map(rx => (
                      <div
                        key={rx.id}
                        onClick={() => handleSelectPrescription(rx.id)}
                        className="flex items-center justify-between px-2.5 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                            Rx
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 font-mono">{rx.id} — {rx.patientName}</p>
                            <p className="text-[10px] text-slate-400">{rx.date} · {rx.diagnosis || 'Cardiology Consult'}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Matched Medicines Category */}
                {matchedMedicines.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Pill size={12} className="text-emerald-600" /> Medicines Catalog
                    </div>
                    {matchedMedicines.map(m => (
                      <div
                        key={m.id}
                        onClick={handleSelectMedicine}
                        className="flex items-center justify-between px-2.5 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                            💊
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{m.medicineName || m.name}</p>
                            <p className="text-[10px] text-slate-400">{m.category || 'General'} · {m.dosage || '1 tablet'}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Doctor Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center border border-primary-200">
            <span className="text-primary-900 text-xs font-bold">{currentDoctor.initials}</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{currentDoctor.name}</p>
            <p className="text-[10px] text-slate-500 leading-tight">{currentDoctor.designation}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
