import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UserCheck,
  CalendarCheck,
  MessageSquareWarning,
  Pill,
  Settings,
  ShieldCheck,
  LogOut,
  Cross,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { inquiries, prescriptions } = useData();

  const openInquiriesCount = inquiries.filter(i => i.status === 'Open' || i.status === 'In Progress').length;
  const pendingRefillsCount = prescriptions.filter(r => r.status === 'Requires Review' || r.status === 'Processing').length;

  const navItems = [
    { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', path: '/patients', label: 'Patients', icon: Users },
    { id: 'doctors', path: '/doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'staff', path: '/staff', label: 'Pharmacy Staff', icon: UserCheck },
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
      badgeColor: 'bg-emerald-600 text-white',
    },
    { id: 'settings', path: '/settings', label: 'Settings & 2FA', icon: Settings },
  ];

  const handleSelect = (path: string) => {
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
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-6 h-18 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-slate-950 shadow-md">
              <Cross className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                Pharmacy CRM
              </h1>
              <p className="text-[11px] font-medium text-sky-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                2FA Verified Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-3">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Core CRM Modules
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleSelect(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
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
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border border-teal-500/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-teal-400 truncate">
                  {user?.role}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
