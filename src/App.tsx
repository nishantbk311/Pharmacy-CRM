import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { StaffPage } from './pages/StaffPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UsersPage } from './pages/UsersPage';

function AnimatedPageWrapper({ children }: { children: React.ReactNode; key?: React.Key }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function MainAppContent() {
  const { isAuthenticated, step } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Global Quick Action Modal Trigger States
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);

  const handleQuickAction = (
    action: 'add_patient' | 'add_appointment' | 'add_inquiry' | 'add_doctor'
  ) => {
    if (action === 'add_patient') {
      navigate('/patients');
      setPatientModalOpen(true);
    } else if (action === 'add_appointment') {
      navigate('/appointments');
      setAppointmentModalOpen(true);
    } else if (action === 'add_inquiry') {
      navigate('/inquiries');
      setInquiryModalOpen(true);
    } else if (action === 'add_doctor') {
      navigate('/doctors');
      setDoctorModalOpen(true);
    }
  };

  // Reset URL to root path when logged out or unauthenticated
  useEffect(() => {
    if ((!isAuthenticated || step !== 'authenticated') && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, step, location.pathname, navigate]);

  // If not authenticated or on login step, show 2FA Login Page
  if (!isAuthenticated || step !== 'authenticated') {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Right Content Panel */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Header
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          onQuickAction={handleQuickAction}
        />

        {/* Page Views Container with Motion Page Transitions */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <AnimatedPageWrapper key="dashboard">
                    <DashboardPage onQuickAction={handleQuickAction} />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/patients"
                element={
                  <AnimatedPageWrapper key="patients">
                    <PatientsPage
                      registerModalOpen={patientModalOpen}
                      setRegisterModalOpen={setPatientModalOpen}
                    />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/doctors"
                element={
                  <AnimatedPageWrapper key="doctors">
                    <DoctorsPage
                      doctorModalOpen={doctorModalOpen}
                      setDoctorModalOpen={setDoctorModalOpen}
                    />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/staff"
                element={
                  <AnimatedPageWrapper key="staff">
                    <StaffPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/appointments"
                element={
                  <AnimatedPageWrapper key="appointments">
                    <AppointmentsPage
                      bookingModalOpen={appointmentModalOpen}
                      setBookingModalOpen={setAppointmentModalOpen}
                    />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/inquiries"
                element={
                  <AnimatedPageWrapper key="inquiries">
                    <InquiriesPage
                      inquiryModalOpen={inquiryModalOpen}
                      setInquiryModalOpen={setInquiryModalOpen}
                    />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/prescriptions"
                element={
                  <AnimatedPageWrapper key="prescriptions">
                    <PrescriptionsPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/users"
                element={
                  <AnimatedPageWrapper key="users">
                    <UsersPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/settings"
                element={
                  <AnimatedPageWrapper key="settings">
                    <SettingsPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Sonner Toast Feedback */}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <MainAppContent />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
