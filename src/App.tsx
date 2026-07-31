import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext";

import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";

import { lazyNamed } from "./helper/lazyNamed";

// --------------------
// Lazy Loaded Pages
// --------------------
const LoginPage = lazyNamed(() => import("./pages/LoginPage"), "LoginPage");

const DashboardPage = lazyNamed(
  () => import("./pages/DashboardPage"),
  "DashboardPage",
);

const PatientsPage = lazyNamed(
  () => import("./pages/PatientsPage"),
  "PatientsPage",
);

const DoctorsPage = lazyNamed(
  () => import("./pages/DoctorsPage"),
  "DoctorsPage",
);

const StaffPage = lazyNamed(() => import("./pages/StaffPage"), "StaffPage");
const StaffSalaryPage = lazyNamed(() => import("./pages/StaffSalaryPage"), "StaffSalaryPage");

const AppointmentsPage = lazyNamed(
  () => import("./pages/AppointmentsPage"),
  "AppointmentsPage",
);

const InquiriesPage = lazyNamed(
  () => import("./pages/InquiriesPage"),
  "InquiriesPage",
);

const PrescriptionsPage = lazyNamed(
  () => import("./pages/PrescriptionsPage"),
  "PrescriptionsPage",
);

const SettingsPage = lazyNamed(
  () => import("./pages/SettingsPage"),
  "SettingsPage",
);

const UsersPage = lazyNamed(() => import("./pages/UsersPage"), "UsersPage");

const RolesPage = lazyNamed(() => import("./pages/RolesPage"), "RolesPage");

const MenuPage = lazyNamed(() => import("./pages/MenuPage"), "MenuPage");

const SupplierPage = lazyNamed(
  () => import("./pages/SupplierPage"),
  "SupplierPage",
);

const ManufacturerPage = lazyNamed(
  () => import("./pages/ManufacturerPage"),
  "ManufacturerPage",
);

const MedicinePage = lazyNamed(
  () => import("./pages/MedicinePage"),
  "MedicinePage",
);

const StockHistoryPage = lazyNamed(
  () => import("./pages/StockHistoryPage"),
  "StockHistoryPage",
);

const ActivityCategoryPage = lazyNamed(
  () => import("./pages/ActivityCategoryPage"),
  "ActivityCategoryPage",
);

const ActivityPage = lazyNamed(
  () => import("./pages/ActivityPage"),
  "ActivityPage",
);

const BlogPage = lazyNamed(() => import("./pages/BlogPage"), "BlogPage");

const PatientBillPage = lazyNamed(
  () => import("./pages/PatientBillPage"),
  "PatientBillPage",
);

const PatientReportPage = lazyNamed(
  () => import("./pages/PatientReportPage"),
  "PatientReportPage",
);

const PatientPaymentsPage = lazyNamed(
  () => import("./pages/PatientPaymentsPage"),
  "PatientPaymentsPage",
);

// --------------------
// Loading Component
// --------------------

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
    </div>
  );
}

function AnimatedPageWrapper({ children }: { children: ReactNode }) {
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

  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);

  const handleQuickAction = (
    action: "add_patient" | "add_appointment" | "add_inquiry" | "add_doctor",
  ) => {
    switch (action) {
      case "add_patient":
        navigate("/patients");
        setPatientModalOpen(true);
        break;

      case "add_appointment":
        navigate("/appointments");
        setAppointmentModalOpen(true);
        break;

      case "add_inquiry":
        navigate("/inquiries");
        setInquiryModalOpen(true);
        break;

      case "add_doctor":
        navigate("/doctors");
        setDoctorModalOpen(true);
        break;
    }
  };

  useEffect(() => {
    if (
      (!isAuthenticated || step !== "authenticated") &&
      location.pathname !== "/"
    ) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, step, location.pathname, navigate]);

  if (!isAuthenticated || step !== "authenticated") {
    return (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="lg:pl-64 flex flex-1 min-w-0 flex-col">
        <Header
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          onQuickAction={handleQuickAction}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <AnimatedPageWrapper>
                      <DashboardPage onQuickAction={handleQuickAction} />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/patients"
                  element={
                    <AnimatedPageWrapper>
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
                    <AnimatedPageWrapper>
                      <PatientBillPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/patients/bill/create"
                  element={
                    <AnimatedPageWrapper>
                      <PatientBillPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/patients/reports"
                  element={
                    <AnimatedPageWrapper>
                      <PatientReportPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/patients/payments"
                  element={
                    <AnimatedPageWrapper>
                      <PatientPaymentsPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/patients/appointments"
                  element={<Navigate to="/appointments" replace />}
                />

                <Route
                  path="/doctors"
                  element={
                    <AnimatedPageWrapper>
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
                    <AnimatedPageWrapper>
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
                    <AnimatedPageWrapper>
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
                    <AnimatedPageWrapper>
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
                    <AnimatedPageWrapper>
                      <PrescriptionsPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/medicine/suppliers"
                  element={
                    <AnimatedPageWrapper>
                      <SupplierPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/medicine/manufacturers"
                  element={
                    <AnimatedPageWrapper>
                      <ManufacturerPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/medicine/items"
                  element={
                    <AnimatedPageWrapper>
                      <MedicinePage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/medicine/stock-history"
                  element={
                    <AnimatedPageWrapper>
                      <StockHistoryPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/extra-events/activity-category"
                  element={
                    <AnimatedPageWrapper>
                      <ActivityCategoryPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/extra-events/activity"
                  element={
                    <AnimatedPageWrapper>
                      <ActivityPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/extra-events/blog"
                  element={
                    <AnimatedPageWrapper>
                      <BlogPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/menu"
                  element={
                    <AnimatedPageWrapper>
                      <MenuPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/configuration/menu"
                  element={<Navigate to="/menu" replace />}
                />

                <Route
                  path="/roles"
                  element={
                    <AnimatedPageWrapper>
                      <RolesPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <AnimatedPageWrapper>
                      <UsersPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <AnimatedPageWrapper>
                      <SettingsPage />
                    </AnimatedPageWrapper>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>

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
