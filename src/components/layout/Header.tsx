import React, { useState, useMemo } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ShieldCheck,
  UserPlus,
  Calendar,
  HelpCircle,
  Pill,
  Sun,
  Moon,
  Users,
  UserCheck,
  X,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  onQuickAction: (action: 'add_patient' | 'add_appointment' | 'add_inquiry' | 'add_doctor') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMobileMenuToggle,
  onQuickAction,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    patients,
    doctors,
    prescriptions,
    appointments,
    inquiries,
    staff,
  } = useData();
  const { theme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const activeKey = location.pathname.replace('/', '') || 'dashboard';

  const titleMap: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Pharmacy Overview Dashboard',
      subtitle: 'Real-time metrics for patients, doctors, staff, and active prescriptions',
    },
    patients: {
      title: 'Patients Management',
      subtitle: 'Central patient directory, medical histories, allergies, and Rx profiles',
    },
    doctors: {
      title: 'Prescribers & Doctors Directory',
      subtitle: 'Track prescribing physicians, NPI identifiers, and doctor inquiries',
    },
    staff: {
      title: 'Pharmacy Staff Directory',
      subtitle: 'Manage duty schedules, roles, pharmacist licenses, and shifts',
    },
    appointments: {
      title: 'Consultations & Med Sync',
      subtitle: 'Pharmacist MTM reviews, vaccination schedules, and health consultations',
    },
    inquiries: {
      title: 'Open Inquiries & Tickets',
      subtitle: 'Drug interaction flags, prior authorizations, and clinical clarifications',
    },
    prescriptions: {
      title: 'Prescriptions & Refills',
      subtitle: 'Dispensing queues, interaction safety checks, and insurance processing',
    },
    settings: {
      title: 'Pharmacy Settings & Security',
      subtitle: 'Two-factor authentication preferences, license details, and notifications',
    },
  };

  const currentInfo = titleMap[activeKey] || {
    title: 'Pharmacy CRM Portal',
    subtitle: 'Manage pharmacy operations and patient care',
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Cross-entity Global Search filtering
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return null;

    const matchedPatients = (patients || []).filter(
      p =>
        `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase().includes(q) ||
        (p.mrn || '').toLowerCase().includes(q) ||
        (p.phone || '').includes(q) ||
        (p.email || '').toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedDoctors = (doctors || []).filter(
      d =>
        `${d.firstName || ''} ${d.lastName || ''}`.toLowerCase().includes(q) ||
        (d.npiNumber || '').toLowerCase().includes(q) ||
        (d.specialty || '').toLowerCase().includes(q) ||
        (d.clinicName || '').toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedPrescriptions = (prescriptions || []).filter(
      rx =>
        (rx.rxNumber || '').toLowerCase().includes(q) ||
        (rx.drugName || '').toLowerCase().includes(q) ||
        (rx.patientName || '').toLowerCase().includes(q) ||
        (rx.doctorName || '').toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAppointments = (appointments || []).filter(
      app =>
        (app.patientName || '').toLowerCase().includes(q) ||
        (app.pharmacistName || '').toLowerCase().includes(q) ||
        (app.type || '').toLowerCase().includes(q) ||
        (app.date || '').includes(q)
    ).slice(0, 3);

    const matchedInquiries = (inquiries || []).filter(
      inq =>
        (inq.ticketNumber || '').toLowerCase().includes(q) ||
        (inq.subject || '').toLowerCase().includes(q) ||
        (inq.patientName || '').toLowerCase().includes(q) ||
        (inq.relatedDoctorName || '').toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedStaff = (staff || []).filter(
      s =>
        `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase().includes(q) ||
        (s.role || '').toLowerCase().includes(q) ||
        (s.licenseNumber || '').toLowerCase().includes(q)
    ).slice(0, 3);

    const totalCount =
      matchedPatients.length +
      matchedDoctors.length +
      matchedPrescriptions.length +
      matchedAppointments.length +
      matchedInquiries.length +
      matchedStaff.length;

    return {
      patients: matchedPatients,
      doctors: matchedDoctors,
      prescriptions: matchedPrescriptions,
      appointments: matchedAppointments,
      inquiries: matchedInquiries,
      staff: matchedStaff,
      totalCount,
    };
  }, [globalSearch, patients, doctors, prescriptions, appointments, inquiries, staff]);

  const handleSelectResult = (path: string, term?: string) => {
    const queryTerm = term || globalSearch.trim();
    if (queryTerm) {
      navigate(`${path}?q=${encodeURIComponent(queryTerm)}`);
    } else {
      navigate(path);
    }
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {currentInfo.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Global Search, Theme Switcher, Quick Actions, Notifications, User Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Navbar Global Search Box */}
          <div className="relative hidden md:block w-64 lg:w-80">
            <form
              onSubmit={e => {
                e.preventDefault();
                const term = globalSearch.trim();
                if (!term) return;
                if (searchResults?.patients.length) handleSelectResult('/patients', term);
                else if (searchResults?.doctors.length) handleSelectResult('/doctors', term);
                else if (searchResults?.prescriptions.length) handleSelectResult('/prescriptions', term);
                else if (searchResults?.appointments.length) handleSelectResult('/appointments', term);
                else if (searchResults?.inquiries.length) handleSelectResult('/inquiries', term);
                else if (searchResults?.staff.length) handleSelectResult('/staff', term);
                else handleSelectResult('/patients', term);
              }}
              className="relative w-full"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Global Search (All pages & records)..."
                value={globalSearch}
                onFocus={() => setIsSearchFocused(true)}
                onChange={e => {
                  setGlobalSearch(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400"
              />

              {globalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setGlobalSearch('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Global Search Results Dropdown Popover */}
            {isSearchFocused && globalSearch.trim() !== '' && (
              <>
                <div
                  onClick={() => setIsSearchFocused(false)}
                  className="fixed inset-0 z-40"
                />
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 max-h-96 overflow-y-auto text-xs">
                  <div className="px-3 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                      Global Search Results
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {searchResults?.totalCount || 0} Matches
                    </span>
                  </div>

                  {!searchResults || searchResults.totalCount === 0 ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                      No matching records found across all pages.
                    </div>
                  ) : (
                    <div className="space-y-3 px-2">
                      {/* Patients */}
                      {searchResults.patients.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>Patients ({searchResults.patients.length})</span>
                          </div>
                          <div className="space-y-0.5">
                            {searchResults.patients.map(p => (
                              <button
                                key={p.id}
                                onClick={() => handleSelectResult('/patients', `${p.firstName} ${p.lastName}`)}
                                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                              >
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {p.firstName} {p.lastName}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    MRN: {p.mrn} • {p.phone}
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Doctors */}
                      {searchResults.doctors.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5" />
                            <span>Prescribers / Doctors ({searchResults.doctors.length})</span>
                          </div>
                          <div className="space-y-0.5">
                            {searchResults.doctors.map(d => (
                              <button
                                key={d.id}
                                onClick={() => handleSelectResult('/doctors', `${d.firstName} ${d.lastName}`)}
                                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                              >
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    Dr. {d.firstName} {d.lastName}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {d.specialty} • NPI: {d.npiNumber}
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prescriptions */}
                      {searchResults.prescriptions.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Prescriptions ({searchResults.prescriptions.length})</span>
                          </div>
                          <div className="space-y-0.5">
                            {searchResults.prescriptions.map(rx => (
                              <button
                                key={rx.id}
                                onClick={() => handleSelectResult('/prescriptions', rx.rxNumber)}
                                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                              >
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {rx.rxNumber} - {rx.drugName}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    Patient: {rx.patientName} • Status: {rx.status}
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Appointments */}
                      {searchResults.appointments.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Consultations ({searchResults.appointments.length})</span>
                          </div>
                          <div className="space-y-0.5">
                            {searchResults.appointments.map(app => (
                              <button
                                key={app.id}
                                onClick={() => handleSelectResult('/appointments', app.patientName)}
                                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                              >
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {app.patientName} ({app.type})
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {app.date} {app.time} • {app.pharmacistName}
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Inquiries */}
                      {searchResults.inquiries.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Inquiries ({searchResults.inquiries.length})</span>
                          </div>
                          <div className="space-y-0.5">
                            {searchResults.inquiries.map(inq => (
                              <button
                                key={inq.id}
                                onClick={() => handleSelectResult('/inquiries', inq.ticketNumber)}
                                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                              >
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {inq.ticketNumber}: {inq.subject}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    Patient: {inq.patientName} • Priority: {inq.priority}
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Staff */}
                      {searchResults.staff.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Pharmacy Staff ({searchResults.staff.length})</span>
                          </div>
                          <div className="space-y-0.5">
                            {searchResults.staff.map(s => (
                              <button
                                key={s.id}
                                onClick={() => handleSelectResult('/staff', `${s.firstName} ${s.lastName}`)}
                                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                              >
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {s.firstName} {s.lastName}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {s.role} • License: {s.licenseNumber}
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Quick Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Entry</span>
            </button>

            {showQuickMenu && (
              <div
                onClick={() => setShowQuickMenu(false)}
                className="fixed inset-0 z-40"
              />
            )}

            {showQuickMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs text-slate-700 dark:text-slate-200">
                <button
                  onClick={() => {
                    onQuickAction('add_patient');
                    setShowQuickMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Register New Patient</span>
                </button>
                <button
                  onClick={() => {
                    onQuickAction('add_appointment');
                    setShowQuickMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Book Consultation</span>
                </button>
                <button
                  onClick={() => {
                    onQuickAction('add_inquiry');
                    setShowQuickMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Log Doctor/Clinical Inquiry</span>
                </button>
                <button
                  onClick={() => {
                    onQuickAction('add_doctor');
                    setShowQuickMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Pill className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Add Prescribing Physician</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40"
              />
            )}

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Pharmacy Alerts
                  </h4>
                  <span className="text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full">
                    {unreadCount} Unread
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs ${n.read ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/60'}`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2FA Verified Badge Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>2FA Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
