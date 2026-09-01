import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, User, FileText, Pill, X, ChevronRight, Bell, ChevronDown } from 'lucide-react';
import { currentDoctor } from '../../data/doctors';
import { mockPatients, mockPrescriptions, mockMedicines } from '../../data/mockData';

export default function Header({ onMobileMenuOpen }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  // Keyboard shortcut (⌘K or Ctrl+K) handler to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        searchInputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors flex items-center justify-center flex-shrink-0"
        title="Open Navigation"
      >
        <Menu size={20} strokeWidth={1.75} />
      </button>

      {/* Enterprise Global Search Command Bar */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-xl">
        <div className="relative flex items-center w-full">
          <Search size={16} strokeWidth={1.75} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            className="w-full pl-9 pr-12 py-2 text-xs font-medium text-slate-900 bg-slate-100/80 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
            placeholder="Search patients, prescriptions, medicines…"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          {query ? (
            <button
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors flex items-center justify-center"
            >
              <X size={14} strokeWidth={1.75} />
            </button>
          ) : (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-200/80 border border-slate-300/60 rounded select-none">
                ⌘K
              </kbd>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && query.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
            {!hasResults ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No matching patients, prescriptions, or medicines found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <>
                {/* Matched Patients Category */}
                {matchedPatients.length > 0 && (
                  <div className="p-2">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User size={12} strokeWidth={2} className="text-blue-600" /> Patients
                    </div>
                    {matchedPatients.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatient(p.id)}
                        className="flex items-center justify-between px-2.5 py-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0 truncate">
                            <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.id} · {p.gender}, Age {p.age}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} strokeWidth={1.75} className="text-slate-300 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Matched Prescriptions Category */}
                {matchedPrescriptions.length > 0 && (
                  <div className="p-2">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={12} strokeWidth={2} className="text-purple-600" /> Prescriptions
                    </div>
                    {matchedPrescriptions.map(rx => (
                      <div
                        key={rx.id}
                        onClick={() => handleSelectPrescription(rx.id)}
                        className="flex items-center justify-between px-2.5 py-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            Rx
                          </div>
                          <div className="min-w-0 truncate">
                            <p className="text-xs font-semibold text-slate-900 font-mono truncate">{rx.id} — {rx.patientName}</p>
                            <p className="text-[10px] text-slate-400 truncate">{rx.date} · {rx.diagnosis || 'Cardiology Consult'}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} strokeWidth={1.75} className="text-slate-300 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Matched Medicines Category */}
                {matchedMedicines.length > 0 && (
                  <div className="p-2">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Pill size={12} strokeWidth={2} className="text-emerald-600" /> Medicines Catalog
                    </div>
                    {matchedMedicines.map(m => (
                      <div
                        key={m.id}
                        onClick={handleSelectMedicine}
                        className="flex items-center justify-between px-2.5 py-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            💊
                          </div>
                          <div className="min-w-0 truncate">
                            <p className="text-xs font-semibold text-slate-900 truncate">{m.medicineName || m.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{m.category || 'General'} · {m.dosage || '1 tablet'}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} strokeWidth={1.75} className="text-slate-300 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Doctor Identity & Notifications Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Notifications Button */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center"
          title="Notifications"
        >
          <Bell size={18} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        </button>

        <div className="hidden sm:block w-px h-5 bg-slate-200 mx-0.5" />

        {/* Doctor Identity Area */}
        <div className="flex items-center gap-2.5 py-1 px-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-slate-700/20 flex-shrink-0">
            <span>{currentDoctor.initials}</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight tracking-tight whitespace-nowrap">{currentDoctor.name}</p>
            <p className="text-[11px] text-slate-500 leading-tight font-medium whitespace-nowrap">{currentDoctor.designation}</p>
          </div>
          <ChevronDown size={14} strokeWidth={1.75} className="text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block flex-shrink-0" />
        </div>
      </div>
    </header>
  );
}
