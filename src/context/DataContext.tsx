import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import {
  Patient,
  Doctor,
  Staff,
  Appointment,
  Inquiry,
  Prescription,
  ActivityLog,
  NotificationItem,
  SystemUser,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_STAFF,
  INITIAL_APPOINTMENTS,
  INITIAL_INQUIRIES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ACTIVITY_LOGS,
  MOCK_NOTIFICATIONS,
  INITIAL_SYSTEM_USERS,
} from '../mock/data';

interface DataContextType {
  patients: Patient[];
  doctors: Doctor[];
  staff: Staff[];
  systemUsers: SystemUser[];
  appointments: Appointment[];
  inquiries: Inquiry[];
  prescriptions: Prescription[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  
  // Patient actions
  addPatient: (patient: Omit<Patient, 'id' | 'mrn' | 'registeredDate'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Doctor actions
  addDoctor: (doctor: Omit<Doctor, 'id' | 'totalActivePrescriptions'>) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  
  // Staff actions
  addStaff: (staffMember: Omit<Staff, 'id' | 'joinedDate'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;

  // System User actions
  addSystemUser: (user: Omit<SystemUser, 'id' | 'joinedDate'>) => void;
  updateSystemUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;
  
  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  
  // Inquiry actions
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'notes'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  addInquiryNote: (inquiryId: string, authorName: string, authorRole: string, text: string) => void;
  
  // Prescription actions
  addPrescription: (rx: Omit<Prescription, 'id' | 'rxNumber' | 'prescribedDate'>) => void;
  updatePrescription: (id: string, updates: Partial<Prescription>) => void;
  deletePrescription: (id: string) => void;
  updatePrescriptionStatus: (id: string, status: Prescription['status']) => void;
  processRefill: (rxNumber: string) => void;

  // Toast helper
  showToast: (msg: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const showToast = (msg: string) => {
    toast.success(msg);
  };

  const addLog = (userName: string, role: string, action: string, category: ActivityLog['category'], details: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      userName,
      userRole: role,
      action,
      category,
      details,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Patient handlers
  const addPatient = (newPatientData: Omit<Patient, 'id' | 'mrn' | 'registeredDate'>) => {
    const id = `p-${Date.now().toString().slice(-4)}`;
    const mrn = `MRN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPatient: Patient = {
      ...newPatientData,
      id,
      mrn,
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    setPatients(prev => [newPatient, ...prev]);
    addLog('Dr. Sarah Jenkins', 'Lead Pharmacist', 'Patient Registered', 'Patient', `Added new patient record for ${newPatient.firstName} ${newPatient.lastName} (${mrn}).`);
    showToast(`Patient ${newPatient.firstName} ${newPatient.lastName} registered successfully.`);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Patient profile updated.');
  };

  const deletePatient = (id: string) => {
    const p = patients.find(item => item.id === id);
    setPatients(prev => prev.filter(item => item.id !== id));
    if (p) {
      showToast(`Removed patient ${p.firstName} ${p.lastName}.`);
    }
  };

  // Doctor handlers
  const addDoctor = (doctorData: Omit<Doctor, 'id' | 'totalActivePrescriptions'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now().toString().slice(-4)}`,
      totalActivePrescriptions: 0,
    };
    setDoctors(prev => [...prev, newDoc]);
    addLog('Dr. Sarah Jenkins', 'Lead Pharmacist', 'Doctor Added', 'System', `Registered Dr. ${newDoc.firstName} ${newDoc.lastName} (${newDoc.specialty}).`);
    showToast(`Dr. ${newDoc.lastName} added to prescriber directory.`);
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Prescriber record updated.');
  };

  // Staff handlers
  const addStaff = (staffData: Omit<Staff, 'id' | 'joinedDate'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: `st-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setStaff(prev => [...prev, newStaff]);
    addLog('Benjamin Hayes', 'Store Manager', 'Staff Onboarded', 'System', `Added ${newStaff.firstName} ${newStaff.lastName} as ${newStaff.role}.`);
    showToast(`Staff member ${newStaff.firstName} ${newStaff.lastName} added.`);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Staff schedule / role updated.');
  };

  // System User handlers
  const addSystemUser = (userData: Omit<SystemUser, 'id' | 'joinedDate'>) => {
    const newSysUser: SystemUser = {
      ...userData,
      id: `sys-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setSystemUsers(prev => [newSysUser, ...prev]);
    addLog('Super Admin', 'Admin', 'Created System User', 'System', `Created user ${newSysUser.name} (${newSysUser.userId}) with role ${newSysUser.role}.`);
    showToast(`User ${newSysUser.name} added successfully.`);
  };

  const updateSystemUser = (id: string, updates: Partial<SystemUser>) => {
    setSystemUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    showToast('System user updated.');
  };

  const deleteSystemUser = (id: string) => {
    setSystemUsers(prev => prev.filter(u => u.id !== id));
    showToast('System user deleted.');
  };

  // Appointment handlers
  const addAppointment = (aptData: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now().toString().slice(-4)}`,
    };
    setAppointments(prev => [newApt, ...prev]);
    addLog('Dr. Sarah Jenkins', 'Lead Pharmacist', 'Appointment Scheduled', 'Appointment', `Booked ${newApt.type} with ${newApt.patientName} for ${newApt.date} at ${newApt.time}.`);
    showToast(`Appointment booked for ${newApt.patientName}.`);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    showToast(`Appointment status changed to ${status}.`);
  };

  // Inquiry handlers
  const addInquiry = (inquiryData: Omit<Inquiry, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'notes'>) => {
    const id = `inq-${Date.now().toString().slice(-4)}`;
    const ticketNumber = `TKT-${Math.floor(9000 + Math.random() * 1000)}`;
    const now = new Date().toLocaleString([], { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newInquiry: Inquiry = {
      ...inquiryData,
      id,
      ticketNumber,
      createdAt: now,
      updatedAt: now,
      notes: [],
    };
    setInquiries(prev => [newInquiry, ...prev]);
    addLog('Marcus Vance', 'Pharmacy Tech', 'Inquiry Created', 'Inquiry', `Opened inquiry ticket ${ticketNumber} (${newInquiry.subject}).`);
    showToast(`Inquiry ticket ${ticketNumber} created.`);
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status, updatedAt: new Date().toLocaleString() } : inq)));
    showToast(`Inquiry status updated to ${status}.`);
  };

  const addInquiryNote = (inquiryId: string, authorName: string, authorRole: string, text: string) => {
    const newNote = {
      id: `n-${Date.now()}`,
      authorName,
      authorRole,
      timestamp: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      text,
    };
    setInquiries(prev =>
      prev.map(inq =>
        inq.id === inquiryId
          ? { ...inq, notes: [...inq.notes, newNote], updatedAt: new Date().toLocaleString() }
          : inq
      )
    );
    showToast('Note appended to inquiry ticket.');
  };

  // Prescription handlers
  const addPrescription = (rxData: Omit<Prescription, 'id' | 'rxNumber' | 'prescribedDate'>) => {
    const id = `rx-${Date.now().toString().slice(-4)}`;
    const rxNumber = `RX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRx: Prescription = {
      ...rxData,
      id,
      rxNumber,
      prescribedDate: new Date().toISOString().split('T')[0],
    };
    setPrescriptions(prev => [newRx, ...prev]);
    addLog('Dr. Sarah Jenkins', 'Lead Pharmacist', 'Prescription Created', 'Prescription', `Created prescription ${rxNumber} for ${newRx.patientName}.`);
    showToast(`Prescription ${rxNumber} created for ${newRx.patientName}.`);
  };

  const updatePrescription = (id: string, updates: Partial<Prescription>) => {
    setPrescriptions(prev => prev.map(rx => (rx.id === id ? { ...rx, ...updates } : rx)));
    showToast('Prescription updated successfully.');
  };

  const deletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(rx => rx.id !== id));
    showToast('Prescription deleted.');
  };

  const updatePrescriptionStatus = (id: string, status: Prescription['status']) => {
    setPrescriptions(prev => prev.map(rx => (rx.id === id ? { ...rx, status } : rx)));
    showToast(`Prescription status updated to ${status}.`);
  };

  const processRefill = (rxNumber: string) => {
    setPrescriptions(prev =>
      prev.map(rx => {
        if (rx.rxNumber === rxNumber) {
         const updatedRefills = Math.max(0, (rx.refillsRemaining ?? 0) - 1);
          return {
            ...rx,
            refillsRemaining: updatedRefills,
            status: 'Filled',
            fillDueDate: new Date().toISOString().split('T')[0],
          };
        }
        return rx;
      })
    );
    showToast(`Refill processed for ${rxNumber}.`);
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        doctors,
        staff,
        systemUsers,
        appointments,
        inquiries,
        prescriptions,
        activityLogs,
        notifications,
        addPatient,
        updatePatient,
        deletePatient,
        addDoctor,
        updateDoctor,
        addStaff,
        updateStaff,
        addSystemUser,
        updateSystemUser,
        deleteSystemUser,
        addAppointment,
        updateAppointmentStatus,
        addInquiry,
        updateInquiryStatus,
        addInquiryNote,
        addPrescription,
        updatePrescription,
        deletePrescription,
        updatePrescriptionStatus,
        processRefill,
        showToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
