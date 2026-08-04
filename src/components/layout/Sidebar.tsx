import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, UserCheck, CalendarCheck, Calendar, MessageSquareWarning, Pill, Settings, ShieldCheck, LogOut, Cross, User, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { inquiries, prescriptions } = useData();

  const isConfigRoute =
    location.pathname === '/menu' ||
    location.pathname === '/roles' ||
    location.pathname === '/users' ||
    location.pathname === '/settings';

  const isExtraEventsRoute = location.pathname.startsWith('/extra-events');

  const [isPatientsOpen, setIsPatientsOpen] = useState<boolean>(
    location.pathname.startsWith('/patients')
  );
  const [isDoctorOpen, setIsDoctorOpen] = useState<boolean>(
    location.pathname.startsWith('/doctors') || location.pathname.startsWith('/doctor')
  );
  const [isStaffManageOpen, setIsStaffManageOpen] = useState<boolean>(
    location.pathname.startsWith('/staff') || location.pathname.startsWith('/staff-salary')
  );
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isMedicineOpen, setIsMedicineOpen] = useState<boolean>(false);
  const [isExtraEventsOpen, setIsExtraEventsOpen] = useState<boolean>(false);
  const [activeMedSubmenu, setActiveMedSubmenu] = useState<string>('');

  const openInquiriesCount = inquiries.filter(i => i.status === 'Open' || i.status === 'In Progress').length;
  const pendingRefillsCount = prescriptions.filter(r => r.status === 'Pending Review' || r.status === 'Requires Review' || r.status === 'Processing').length;

  const mainNavItems = [
    { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', path: '/appointments', label: 'Appointments', icon: CalendarCheck },
    {
      id: 'inquiries',
      path: '/inquiries',
      label: 'Open Inquiries',
      icon: MessageSquareWarning,
      badge: openInquiriesCount > 0 ? openInquiriesCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'prescriptions',
      path: '/prescriptions',
      label: 'Prescriptions',
      icon: Pill,
      badge: pendingRefillsCount > 0 ? pendingRefillsCount : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
  ];

  const handleSelect = (path: string) => {
    setActiveMedSubmenu('');
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleMedSubmenuSelect = (medSubmenuKey: string, path: string) => {
    setActiveMedSubmenu(medSubmenuKey);
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex flex-col h-screen border-r border-slate-200 dark:border-slate-800 transition-colors duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-18 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <Cross className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Pharmacy CRM
            </h1>
            <p className="text-[11px] font-medium text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              2FA Verified Portal
            </p>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Core CRM Modules
            </div>
            {/* Dashboard Link */}
            <button
              id="nav-item-dashboard"
              onClick={() => handleSelect('/')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                location.pathname === '/'
                  ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 font-semibold border border-blue-500/20 dark:border-blue-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${location.pathname === '/' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>Dashboard</span>
              </div>
            </button>

            {/* Patients Collapsible Parent Menu */}
            <div className="pt-0.5">
              <button
                onClick={() => setIsPatientsOpen(!isPatientsOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  location.pathname.startsWith('/patients')
                    ? 'text-blue-600 dark:text-sky-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-semibold">Patients</span>
                </div>
                {isPatientsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Patients Submenu Items */}
              {isPatientsOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1">
                  <button
                    onClick={() => handleSelect('/patients')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/patients'
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Patient Info
                  </button>
                  <button
                    onClick={() => handleSelect('/patients/bill')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname.startsWith('/patients/bill')
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Patient Bill
                  </button>
                  <button
                    onClick={() => handleSelect('/patients/payments')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname.startsWith('/patients/payments')
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Patient Payments
                  </button>
                </div>
              )}
            </div>

            {/* Doctor Collapsible Parent Menu */}
            <div className="pt-0.5">
              <button
                onClick={() => setIsDoctorOpen(!isDoctorOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  location.pathname.startsWith('/doctors') || location.pathname.startsWith('/doctor')
                    ? 'text-blue-600 dark:text-sky-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-semibold">Doctor</span>
                </div>
                {isDoctorOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Doctor Submenu Items */}
              {isDoctorOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1">
                  <button
                    onClick={() => handleSelect('/doctors')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/doctors'
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Doctor List
                  </button>
                  <button
                    onClick={() => handleSelect('/doctors/payments')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname.startsWith('/doctors/payments') || location.pathname.startsWith('/doctor/payments')
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Doctor Payments
                  </button>
                </div>
              )}
            </div>

            {mainNavItems.map(item => {
              if (item.id === 'dashboard') return null;
              const Icon = item.icon;
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
              return (
                <React.Fragment key={item.id}>
                  <button
                    id={`nav-item-${item.id}`}
                    onClick={() => handleSelect(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 font-semibold border border-blue-500/20 dark:border-blue-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}

            {/* Staff Manage Collapsible Parent Menu */}
            <div className="pt-0.5">
              <button
                onClick={() => setIsStaffManageOpen(!isStaffManageOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  location.pathname.startsWith('/staff') || location.pathname.startsWith('/staff-salary')
                    ? 'text-blue-600 dark:text-sky-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-semibold">Staff Manage</span>
                </div>
                {isStaffManageOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isStaffManageOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1">
                  <button
                    onClick={() => handleSelect('/staff')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/staff'
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Staff
                  </button>
                  <button
                    onClick={() => handleSelect('/staff/salary')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname.startsWith('/staff/salary') || location.pathname === '/staff-salary'
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Staff Salary
                  </button>
                </div>
              )}
            </div>

            {/* Medicine Parent Menu with Submenu (Supplier, Manufacturer, Medicine, Stock History) */}
            <div className="pt-1">
              <button
                onClick={() => setIsMedicineOpen(!isMedicineOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <Pill className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-semibold">Medicine</span>
                </div>
                {isMedicineOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Medicine Submenu Links */}
              {isMedicineOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1">
                  <button
                    onClick={() => handleMedSubmenuSelect('supplier', '/medicine/suppliers')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/medicine/suppliers' || (activeMedSubmenu === 'supplier' && location.pathname.startsWith('/medicine'))
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Supplier
                  </button>
                  <button
                    onClick={() => handleMedSubmenuSelect('manufacturer', '/medicine/manufacturers')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/medicine/manufacturers' || (activeMedSubmenu === 'manufacturer' && location.pathname.startsWith('/medicine'))
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Manufacturer
                  </button>
                  <button
                    onClick={() => handleMedSubmenuSelect('medicine', '/medicine/items')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/medicine/items' || (activeMedSubmenu === 'medicine' && location.pathname.startsWith('/medicine'))
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Medicine
                  </button>
                  <button
                    onClick={() => handleMedSubmenuSelect('stock_history', '/medicine/stock-history')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/medicine/stock-history' || (activeMedSubmenu === 'stock_history' && location.pathname.startsWith('/medicine'))
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Stock History
                  </button>
                </div>
              )}
            </div>

            {/* Extra Events Parent Menu with Submenu (Activity Category, Activity, Blog) */}
            <div className="pt-1">
              <button
                onClick={() => setIsExtraEventsOpen(!isExtraEventsOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isExtraEventsRoute
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-semibold">Extra Events</span>
                </div>
                {isExtraEventsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Extra Events Submenu Links */}
              {isExtraEventsOpen && (
                <div className="pl-11 pr-2 py-1 space-y-1">
                  <button
                    onClick={() => handleSelect('/extra-events/activity-category')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/extra-events/activity-category'
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Activity Category
                  </button>
                  <button
                    onClick={() => handleSelect('/extra-events/activity')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/extra-events/activity'
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Activity
                  </button>
                  <button
                    onClick={() => handleSelect('/extra-events/blog')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      location.pathname === '/extra-events/blog'
                        ? 'text-blue-600 dark:text-sky-400 font-semibold bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Blog
                  </button>
                </div>
              )}
            </div>

            {/* Configuration Parent Menu with Submenu (Menu, Roles, User, Security & 2FA) */}
            <div className="pt-2">
              <button
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isConfigRoute
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="text-base font-semibold">Configuration</span>
                </div>
                {isConfigOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Submenu links */}
              {isConfigOpen && (
                <div className="pl-11 pr-2 py-1.5 space-y-1.5">
                  {/* Menu Submenu Item */}
                  <button
                    onClick={() => handleSelect('/menu')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      location.pathname === '/menu' || location.pathname === '/configuration/menu'
                        ? 'text-blue-600 dark:text-sky-400 bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/40 dark:border-blue-500/50 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Menu
                  </button>

                  {/* Roles Submenu Item */}
                  <button
                    onClick={() => handleSelect('/roles')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      location.pathname === '/roles'
                        ? 'text-blue-600 dark:text-sky-400 bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/40 dark:border-blue-500/50 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Roles
                  </button>

                  {/* User Submenu Item */}
                  <button
                    onClick={() => handleSelect('/users')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      location.pathname === '/users'
                        ? 'text-blue-600 dark:text-sky-400 bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/40 dark:border-blue-500/50 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    User
                  </button>

                  {/* Security & 2FA */}
                  <button
                    onClick={() => handleSelect('/settings')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      location.pathname === '/settings'
                        ? 'text-blue-600 dark:text-sky-400 bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/40 dark:border-blue-500/50 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    Security & 2FA
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 shadow-xs dark:shadow-none">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border border-teal-500/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 truncate">
                  {user?.role}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
