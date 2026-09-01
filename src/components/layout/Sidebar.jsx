import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Pill,
  Stethoscope, BarChart3, Settings, ChevronLeft, ChevronRight,
  X, LogOut, CalendarClock
} from 'lucide-react';
import { currentDoctor } from '../../data/doctors';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/patients', icon: Users, label: 'Patients' },
  { path: '/follow-ups', icon: CalendarClock, label: 'Follow-ups' },
  { path: '/prescriptions', icon: FileText, label: 'Prescriptions' },
  { path: '/medicines', icon: Pill, label: 'Medicines' },
  { path: '/doctors', icon: Stethoscope, label: 'Doctors & Staff' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#091527] text-slate-200 select-none">
      {/* Brand Header */}
      <div className={`relative flex items-center justify-center border-b border-white/[0.07] ${collapsed ? 'px-2 py-4' : 'px-4 py-4.5'}`}>
        <div className="flex items-center justify-center min-w-0">
          <div className="bg-white p-2 rounded-xl shadow-xs flex items-center justify-center border border-white/20">
            <img
              src="https://eecpsssh.com/assets/images/logo.png"
              alt="Shree Swami Samarth Hospital Logo"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
            <div className="hidden flex-shrink-0 px-2.5 py-1 bg-[#0B1E3D] rounded-lg items-center justify-center">
              <span className="text-white text-xs font-bold tracking-wider">SSSH</span>
            </div>
          </div>
        </div>
        {!collapsed && (
          <button
            onClick={onCollapse}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors hidden lg:flex"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} strokeWidth={1.75} />
          </button>
        )}
      </div>


      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
          return (
            <NavLink
              key={path}
              to={path}
              onClick={onMobileClose}
              className={`relative group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#132847] text-white font-semibold border border-blue-500/30 shadow-xs'
                  : 'text-slate-400 font-medium hover:bg-white/[0.05] hover:text-slate-100'
              } ${collapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
              title={collapsed ? label : ''}
            >
              {/* Slim Vertical Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
              <Icon
                size={19}
                strokeWidth={1.8}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && <span className="truncate tracking-tight">{label}</span>}
            </NavLink>
          );
        })}
      </nav>


      {/* Compact Doctor Profile Identity Footer */}
      <div className="border-t border-white/[0.07] p-3 bg-black/20">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-9 h-9 bg-[#132847] text-blue-400 font-bold border border-blue-500/30 rounded-full flex items-center justify-center text-xs shadow-xs" title={`${currentDoctor.name} (${currentDoctor.designation})`}>
              <span>{currentDoctor.initials}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#132847] text-blue-400 font-bold border border-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
              <span>{currentDoctor.initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-100 truncate tracking-tight">{currentDoctor.name}</p>
              <p className="text-[11px] font-medium text-slate-400 truncate">{currentDoctor.designation}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#091527] border-r border-white/[0.07] h-screen sticky top-0 transition-all duration-300 flex-shrink-0 relative z-30 ${collapsed ? 'w-16' : 'w-64'
          }`}
      >
        {collapsed && (
          <button
            onClick={onCollapse}
            className="absolute -right-3 top-16 z-40 w-6 h-6 bg-[#0B1E3D] border border-white/20 text-slate-200 rounded-full flex items-center justify-center shadow-md hover:bg-[#0F2D5E] hover:text-white transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight size={12} strokeWidth={2} />
          </button>
        )}
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="relative w-64 bg-[#091527] h-full z-50 shadow-2xl flex flex-col border-r border-white/[0.07]">
            <button
              onClick={onMobileClose}
              className="absolute right-3 top-3.5 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10"
              title="Close Navigation"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}


