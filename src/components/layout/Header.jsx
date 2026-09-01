import { useEffect } from 'react';
import { Menu } from 'lucide-react';
import { currentDoctor } from '../../data/doctors';

export default function Header({ onMobileMenuOpen }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm md:text-base font-bold text-slate-800 truncate">
      
        </h1>
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
