import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, ChevronRight } from 'lucide-react';
import { currentDoctor } from '../../data/doctors';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/patients/new': 'Add Patient',
  '/prescriptions': 'Prescriptions',
  '/prescriptions/new': 'New Prescription',
  '/medicines': 'Medicines',
  '/templates': 'Templates',
  '/doctors': 'Doctors & Staff',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Header({ onMobileMenuOpen }) {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  const pageName = pageNames[location.pathname]
    || (location.pathname.includes('/prescriptions/') && location.pathname.includes('/preview') ? 'Prescription Preview'
      : location.pathname.includes('/prescriptions/') ? 'Prescription Details'
      : location.pathname.includes('/patients/') ? 'Patient Profile'
      : 'Dashboard');

  const notifications = [
    { id: 1, text: 'New patient registered — Anjali Chandrakar', time: '9:30 AM', unread: true },
    { id: 2, text: 'Prescription RX-00128 finalized', time: '11:42 AM', unread: true },
    { id: 3, text: 'Follow-up reminder: Vijay Deshmukh', time: 'Yesterday', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white  px-4 md:px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page Title */}
      <div className="flex-1 min-w-0">
        {/* <h1 className="text-lg font-semibold text-slate-900 truncate">{pageName}</h1> */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Doctor Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-900 text-xs font-bold">{currentDoctor.initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{currentDoctor.name}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{currentDoctor.designation}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
