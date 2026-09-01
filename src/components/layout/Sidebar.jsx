import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Pill, BookTemplate,
  Stethoscope, BarChart3, Settings, ChevronLeft, ChevronRight,
  Menu, X, LogOut, Bell, Shield
} from 'lucide-react';
import { currentDoctor } from '../../data/doctors';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/patients', icon: Users, label: 'Patients' },
  { path: '/prescriptions', icon: FileText, label: 'Prescriptions' },
  { path: '/medicines', icon: Pill, label: 'Medicines' },
  { path: '/templates', icon: BookTemplate, label: 'Templates' },
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center border-b border-slate-100 ${collapsed ? 'px-2 py-4 justify-center' : 'px-4 py-4'}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="https://eecpsssh.com/assets/images/logo.png"
            alt="Shree Swami Samarth Hospital Logo"
            className="h-10 w-auto object-contain flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden flex-shrink-0 w-9 h-9 bg-[#0F2D5E] rounded-xl items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold tracking-tight">SSSH</span>
          </div>
        </div>
        {!collapsed && (
          <button
            onClick={onCollapse}
            className="ml-auto flex-shrink-0 p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors hidden lg:flex"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
          return (
            <NavLink
              key={path}
              to={path}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? label : ''}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Doctor Profile */}
      <div className="border-t border-slate-100 p-3">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-900 text-xs font-bold">{currentDoctor.initials}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-900 text-sm font-bold">{currentDoctor.initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{currentDoctor.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{currentDoctor.designation}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={15} />
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
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {collapsed && (
          <button
            onClick={onCollapse}
            className="absolute -right-3 top-16 z-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ChevronRight size={12} className="text-slate-600" />
          </button>
        )}
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative w-64 bg-white h-full z-50 shadow-xl flex flex-col">
            <button
              onClick={onMobileClose}
              className="absolute right-3 top-3 p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
