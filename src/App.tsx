import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { lazyNamed } from './helper/lazyNamed';

// Lazy Loaded Page Components using lazyNamed
const LoginPage = lazyNamed(() => import('./pages/LoginPage'), 'LoginPage');
const DashboardPage = lazyNamed(() => import('./pages/DashboardPage'), 'DashboardPage');
const PatientsPage = lazyNamed(() => import('./pages/PatientsPage'), 'PatientsPage');
const DoctorsPage = lazyNamed(() => import('./pages/DoctorsPage'), 'DoctorsPage');
const StaffPage = lazyNamed(() => import('./pages/StaffPage'), 'StaffPage');
const StaffSalaryPage = lazyNamed(() => import('./pages/StaffSalaryPage'), 'StaffSalaryPage');
const AppointmentsPage = lazyNamed(() => import('./pages/AppointmentsPage'), 'AppointmentsPage');
const InquiriesPage = lazyNamed(() => import('./pages/InquiriesPage'), 'InquiriesPage');
const PrescriptionsPage = lazyNamed(() => import('./pages/PrescriptionsPage'), 'PrescriptionsPage');
const SettingsPage = lazyNamed(() => import('./pages/SettingsPage'), 'SettingsPage');
const UsersPage = lazyNamed(() => import('./pages/UsersPage'), 'UsersPage');
const RolesPage = lazyNamed(() => import('./pages/RolesPage'), 'RolesPage');
const MenuPage = lazyNamed(() => import('./pages/MenuPage'), 'MenuPage');
const SupplierPage = lazyNamed(() => import('./pages/SupplierPage'), 'SupplierPage');
const ManufacturerPage = lazyNamed(() => import('./pages/ManufacturerPage'), 'ManufacturerPage');
const MedicinePage = lazyNamed(() => import('./pages/MedicinePage'), 'MedicinePage');
const StockHistoryPage = lazyNamed(() => import('./pages/StockHistoryPage'), 'StockHistoryPage');
const ActivityCategoryPage = lazyNamed(() => import('./pages/ActivityCategoryPage'), 'ActivityCategoryPage');
const ActivityPage = lazyNamed(() => import('./pages/ActivityPage'), 'ActivityPage');
const BlogPage = lazyNamed(() => import('./pages/BlogPage'), 'BlogPage');
const PatientBillPage = lazyNamed(() => import('./pages/PatientBillPage'), 'PatientBillPage');
const PatientReportPage = lazyNamed(() => import('./pages/PatientReportPage'), 'PatientReportPage');
const PatientPaymentsPage = lazyNamed(() => import('./pages/PatientPaymentsPage'), 'PatientPaymentsPage');
const DoctorPaymentsPage = lazyNamed(() => import('./pages/DoctorPaymentsPage'), 'DoctorPaymentsPage');

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
    </div>
  );
}

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
    return (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    );
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
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
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
                path="/patients/bill"
                element={
                  <AnimatedPageWrapper key="patients_bill">
                    <PatientBillPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/patients/bill/create"
                element={
                  <AnimatedPageWrapper key="patients_bill_create">
                    <PatientBillPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/patients/reports"
                element={
                  <AnimatedPageWrapper key="patients_reports">
                    <PatientReportPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/patients/payments"
                element={
                  <AnimatedPageWrapper key="patients_payments">
                    <PatientPaymentsPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route path="/patients/appointments" element={<Navigate to="/appointments" replace />} />
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
                path="/doctors/payments"
                element={
                  <AnimatedPageWrapper key="doctors_payments">
                    <DoctorPaymentsPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route path="/doctor/payments" element={<Navigate to="/doctors/payments" replace />} />
              <Route
                path="/staff"
                element={
                  <AnimatedPageWrapper key="staff">
                    <StaffPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/staff/salary"
                element={
                  <AnimatedPageWrapper key="staff-salary">
                    <StaffSalaryPage />
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
                path="/medicine/suppliers"
                element={
                  <AnimatedPageWrapper key="suppliers">
                    <SupplierPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/medicine/manufacturers"
                element={
                  <AnimatedPageWrapper key="manufacturers">
                    <ManufacturerPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/medicine/items"
                element={
                  <AnimatedPageWrapper key="medicine_items">
                    <MedicinePage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/medicine/stock-history"
                element={
                  <AnimatedPageWrapper key="stock_history">
                    <StockHistoryPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/extra-events/activity-category"
                element={
                  <AnimatedPageWrapper key="activity_category">
                    <ActivityCategoryPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/extra-events/activity"
                element={
                  <AnimatedPageWrapper key="activity">
                    <ActivityPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/extra-events/blog"
                element={
                  <AnimatedPageWrapper key="blog">
                    <BlogPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route
                path="/menu"
                element={
                  <AnimatedPageWrapper key="menu">
                    <MenuPage />
                  </AnimatedPageWrapper>
                }
              />
              <Route path="/configuration/menu" element={<Navigate to="/menu" replace />} />
              <Route
                path="/roles"
                element={
                  <AnimatedPageWrapper key="roles">
                    <RolesPage />
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
        </Suspense>
      </ErrorBoundary>
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
