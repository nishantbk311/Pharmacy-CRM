import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import {
  INITIAL_ACTIVITIES,
  INITIAL_ACTIVITY_CATEGORIES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_APPOINTMENTS,
  INITIAL_BLOG_POSTS,
  INITIAL_DOCTORS,
  INITIAL_INQUIRIES,
  INITIAL_MANUFACTURERS,
  INITIAL_MEDICINES,
  INITIAL_PATIENT_BILLS,
  INITIAL_PATIENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ROLES,
  INITIAL_STAFF,
  INITIAL_STAFF_SALARIES,
  INITIAL_STOCK_TRANSACTIONS,
  INITIAL_SUPPLIERS,
  INITIAL_SYSTEM_USERS,
  MOCK_NOTIFICATIONS,
} from '../mock/data';
import {
  Activity,
  ActivityCategory,
  ActivityLog,
  Appointment,
  BlogPost,
  Doctor,
  Inquiry,
  Manufacturer,
  MedicineItem,
  NotificationItem,
  Patient,
  PatientBill,
  Prescription,
  Staff,
  StaffSalary,
  StockTransaction,
  Supplier,
  SystemRole,
  SystemUser,
} from '../types';

const createId = (prefix: string) => `${prefix}-${Date.now().toString().slice(-4)}`;

const formatDate = () => new Date().toISOString().split('T')[0];

const formatTimestamp = () =>
  new Date().toLocaleString([], {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatLongTimestamp = () => new Date().toLocaleString();

interface DataContextType {
  patients: Patient[];
  patientBills: PatientBill[];
  doctors: Doctor[];
  staff: Staff[];
  staffSalaries: StaffSalary[];
  systemUsers: SystemUser[];
  roles: SystemRole[];
  appointments: Appointment[];
  inquiries: Inquiry[];
  prescriptions: Prescription[];
  suppliers: Supplier[];
  manufacturers: Manufacturer[];
  medicines: MedicineItem[];
  stockTransactions: StockTransaction[];
  activityCategories: ActivityCategory[];
  activities: Activity[];
  blogPosts: BlogPost[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];

  // Patient Bill actions
  addPatientBill: (bill: Omit<PatientBill, 'id' | 'sn' | 'billNo' | 'createdAt'>) => PatientBill;
  updatePatientBill: (id: string, updates: Partial<PatientBill>) => void;
  deletePatientBill: (id: string) => void;

  // Activity Category actions
  addActivityCategory: (category: Omit<ActivityCategory, 'id' | 'code' | 'createdAt' | 'totalActivitiesCount'>) => void;
  updateActivityCategory: (id: string, updates: Partial<ActivityCategory>) => void;
  deleteActivityCategory: (id: string) => void;

  // Activity actions
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;

  // Blog Post actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'slug' | 'publishDate' | 'viewsCount'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  
  // Patient actions
  addPatient: (patient: Omit<Patient, 'id' | 'mrn' | 'registeredDate'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Supplier actions
  addSupplier: (supplier: Omit<Supplier, 'id' | 'code'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Manufacturer actions
  addManufacturer: (mfg: Omit<Manufacturer, 'id' | 'code'>) => void;
  updateManufacturer: (id: string, updates: Partial<Manufacturer>) => void;
  deleteManufacturer: (id: string) => void;

  // Medicine actions
  addMedicine: (med: Omit<MedicineItem, 'id'>) => void;
  updateMedicine: (id: string, updates: Partial<MedicineItem>) => void;
  deleteMedicine: (id: string) => void;

  // Stock Transaction actions
  addStockTransaction: (tx: Omit<StockTransaction, 'id' | 'transactionNo' | 'timestamp'>) => void;
  updateStockTransaction: (id: string, updates: Partial<StockTransaction>) => void;
  
  // Doctor actions
  addDoctor: (doctor: Omit<Doctor, 'id' | 'totalActivePrescriptions'>) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  
  // Staff actions
  addStaff: (staffMember: Omit<Staff, 'id' | 'joinedDate'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;

  // Staff Salary actions
  addStaffSalary: (salary: Omit<StaffSalary, 'id' | 'sn' | 'createdAt'>) => void;
  updateStaffSalary: (id: string, updates: Partial<StaffSalary>) => void;
  deleteStaffSalary: (id: string) => void;

  // System User actions
  addSystemUser: (user: Omit<SystemUser, 'id' | 'joinedDate'>) => void;
  updateSystemUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;

  // Roles actions
  addRole: (role: Omit<SystemRole, 'id' | 'sn'>) => void;
  updateRole: (id: string, updates: Partial<SystemRole>) => void;
  deleteRole: (id: string) => void;
  
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
  const [patientBills, setPatientBills] = useState<PatientBill[]>(INITIAL_PATIENT_BILLS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);
  const [staffSalaries, setStaffSalaries] = useState<StaffSalary[]>(INITIAL_STAFF_SALARIES);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);
  const [roles, setRoles] = useState<SystemRole[]>(INITIAL_ROLES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(INITIAL_MANUFACTURERS);
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>(INITIAL_STOCK_TRANSACTIONS);
  const [activityCategories, setActivityCategories] = useState<ActivityCategory[]>(INITIAL_ACTIVITY_CATEGORIES);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
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

  // Medicine Module Handlers
  const addSupplier = (sData: Omit<Supplier, 'id' | 'code'>) => {
    const id = `sup-${Date.now()}`;
    const code = `SUP-${Math.floor(80000 + Math.random() * 10000)}`;
    const newSup: Supplier = { ...sData, id, code };
    setSuppliers(prev => [newSup, ...prev]);
    addLog('System Admin', 'Lead Pharmacist', 'Created Supplier', 'System', `Added supplier ${newSup.name} (${code})`);
    showToast(`Supplier ${newSup.name} added successfully.`);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    const target = suppliers.find(s => s.id === id);
    if (target) {
      addLog('System Admin', 'Lead Pharmacist', 'Updated Supplier', 'System', `Updated supplier ${target.name}`);
      showToast(`Supplier ${target.name} updated.`);
    }
  };

  const deleteSupplier = (id: string) => {
    const target = suppliers.find(s => s.id === id);
    setSuppliers(prev => prev.filter(s => s.id !== id));
    if (target) {
      addLog('System Admin', 'Lead Pharmacist', 'Deleted Supplier', 'System', `Removed supplier ${target.name}`);
      showToast(`Supplier ${target.name} removed.`);
    }
  };

  const addManufacturer = (mData: Omit<Manufacturer, 'id' | 'code'>) => {
    const id = `mfg-${Date.now()}`;
    const code = `MFG-${Math.floor(9000 + Math.random() * 1000)}`;
    const newMfg: Manufacturer = { ...mData, id, code };
    setManufacturers(prev => [newMfg, ...prev]);
    addLog('System Admin', 'Lead Pharmacist', 'Created Manufacturer', 'System', `Registered manufacturer ${newMfg.name} (${code})`);
    showToast(`Manufacturer ${newMfg.name} registered.`);
  };

  const updateManufacturer = (id: string, updates: Partial<Manufacturer>) => {
    setManufacturers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    const target = manufacturers.find(m => m.id === id);
    if (target) {
      addLog('System Admin', 'Lead Pharmacist', 'Updated Manufacturer', 'System', `Updated manufacturer ${target.name}`);
      showToast(`Manufacturer ${target.name} updated.`);
    }
  };

  const deleteManufacturer = (id: string) => {
    const target = manufacturers.find(m => m.id === id);
    setManufacturers(prev => prev.filter(m => m.id !== id));
    if (target) {
      addLog('System Admin', 'Lead Pharmacist', 'Deleted Manufacturer', 'System', `Removed manufacturer ${target.name}`);
      showToast(`Manufacturer ${target.name} removed.`);
    }
  };

  const addMedicine = (medData: Omit<MedicineItem, 'id'>) => {
    const id = `med-${Date.now()}`;
    const newMed: MedicineItem = { ...medData, id };
    setMedicines(prev => [newMed, ...prev]);
    addLog('System Admin', 'Lead Pharmacist', 'Added Medicine', 'System', `Added drug ${newMed.drugName} (${newMed.ndcCode})`);
    showToast(`Medicine ${newMed.drugName} added to catalog.`);
  };

  const updateMedicine = (id: string, updates: Partial<MedicineItem>) => {
    setMedicines(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    const target = medicines.find(m => m.id === id);
    if (target) {
      addLog('System Admin', 'Lead Pharmacist', 'Updated Medicine', 'System', `Updated drug ${target.drugName}`);
      showToast(`Medicine ${target.drugName} updated.`);
    }
  };

  const deleteMedicine = (id: string) => {
    const target = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    if (target) {
      addLog('System Admin', 'Lead Pharmacist', 'Deleted Medicine', 'System', `Removed drug ${target.drugName}`);
      showToast(`Medicine ${target.drugName} removed from catalog.`);
    }
  };

  const addStockTransaction = (txData: Omit<StockTransaction, 'id' | 'transactionNo' | 'timestamp'>) => {
    const id = `stk-${Date.now()}`;
    const transactionNo = `STK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleString();
    const newTx: StockTransaction = { ...txData, id, transactionNo, timestamp };
    setStockTransactions(prev => [newTx, ...prev]);
    addLog('System Admin', 'Lead Pharmacist', 'Stock Audit Record', 'System', `Stock transaction ${transactionNo} logged for ${newTx.drugName}`);
    showToast(`Stock movement ${transactionNo} logged.`);
  };

  const updateStockTransaction = (id: string, updates: Partial<StockTransaction>) => {
    setStockTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    const target = stockTransactions.find(t => t.id === id);
    if (target) {
      addLog('System Admin', 'Lead Pharmacist', 'Updated Stock Audit Record', 'System', `Updated stock record ${target.transactionNo}`);
      showToast(`Stock transaction ${target.transactionNo} updated.`);
    }
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
      status: newPatientData.status || 'Active',
    };
    const displayName = newPatient.fullName || `${newPatient.firstName || ''} ${newPatient.lastName || ''}`.trim() || 'Patient';
    setPatients(prev => [newPatient, ...prev]);
    addLog('Dr. Sarah Jenkins', 'Lead Pharmacist', 'Patient Registered', 'Patient', `Added new patient record for ${displayName} (${mrn}).`);
    showToast(`Patient ${displayName} registered successfully.`);
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

  // Staff Salary handlers
  const addStaffSalary = (salaryData: Omit<StaffSalary, 'id' | 'sn' | 'createdAt'>) => {
    const newSalary: StaffSalary = {
      ...salaryData,
      id: `sal-${Date.now()}`,
      sn: staffSalaries.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStaffSalaries(prev => [newSalary, ...prev]);
    showToast(`Salary record for ${newSalary.staffName} added successfully.`);
  };

  const updateStaffSalary = (id: string, updates: Partial<StaffSalary>) => {
    setStaffSalaries(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Salary record updated successfully.');
  };

  const deleteStaffSalary = (id: string) => {
    setStaffSalaries(prev => prev.filter(item => item.id !== id));
    showToast('Salary record deleted.');
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

  // Role handlers
  const addRole = (roleData: Omit<SystemRole, 'id' | 'sn'>) => {
    const nextSn = roles.length + 1;
    const newRole: SystemRole = {
      ...roleData,
      id: `role-${Date.now().toString().slice(-4)}`,
      sn: nextSn,
    };
    setRoles(prev => [...prev, newRole]);
    addLog('Super Admin', 'Admin', 'Created System Role', 'System', `Created role ${newRole.displayName} (${newRole.keyName}).`);
    showToast(`Role "${newRole.displayName}" created successfully.`);
  };

  const updateRole = (id: string, updates: Partial<SystemRole>) => {
    const targetRole = roles.find(r => r.id === id);
    if (!targetRole) return;

    setRoles(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));

    // If role display name changed, update corresponding user role fields
    if (updates.displayName && updates.displayName !== targetRole.displayName) {
      setSystemUsers(prev =>
        prev.map(u => (u.role === targetRole.displayName ? { ...u, role: updates.displayName! } : u))
      );
    }

    // If role status changed to Inactive, automatically set associated users to Inactive
    if (updates.status === 'Inactive') {
      const roleName = updates.displayName || targetRole.displayName;
      setSystemUsers(prev =>
        prev.map(u => {
          if (u.role === targetRole.displayName || u.role === roleName) {
            return { ...u, status: 'Inactive' };
          }
          return u;
        })
      );
      addLog(
        'Super Admin',
        'Admin',
        'Inactivated Role & Users',
        'System',
        `Role "${roleName}" set to Inactive. Associated system users were automatically inactivated.`
      );
      showToast(`Role "${roleName}" inactivated. Associated users set to Inactive.`);
    } else {
      showToast('Role updated successfully.');
    }
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
    showToast('Role removed.');
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

  // Activity Category CRUD Actions
  const addActivityCategory = (cat: Omit<ActivityCategory, 'id' | 'code' | 'createdAt' | 'totalActivitiesCount'>) => {
    const newCategory: ActivityCategory = {
      ...cat,
      id: `act-cat-${Date.now()}`,
      code: `CAT-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalActivitiesCount: 0,
    };
    setActivityCategories(prev => [newCategory, ...prev]);
    showToast(`Activity category "${cat.name}" added successfully.`);
  };

  const updateActivityCategory = (id: string, updates: Partial<ActivityCategory>) => {
    setActivityCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Activity category updated successfully.');
  };

  const deleteActivityCategory = (id: string) => {
    setActivityCategories(prev => prev.filter(c => c.id !== id));
    showToast('Activity category deleted successfully.');
  };

  // Activity CRUD Actions
  const addActivity = (act: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...act,
      id: `act-${Date.now()}`,
    };
    setActivities(prev => [newActivity, ...prev]);
    showToast(`Activity "${act.title}" created successfully.`);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
    showToast('Activity updated successfully.');
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('Activity deleted successfully.');
  };

  // Blog Post CRUD Actions
  const addBlogPost = (post: Omit<BlogPost, 'id' | 'slug' | 'publishDate' | 'viewsCount'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      publishDate: new Date().toISOString().split('T')[0],
      viewsCount: 0,
    };
    setBlogPosts(prev => [newPost, ...prev]);
    showToast(`Blog post "${post.title}" published successfully.`);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Blog post updated successfully.');
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
    showToast('Blog post deleted successfully.');
  };

  // Patient Bill handlers
  const addPatientBill = (billData: Omit<PatientBill, 'id' | 'sn' | 'billNo' | 'createdAt'>): PatientBill => {
    const id = `bill-${Date.now()}`;
    const sn = patientBills.length + 1;
    const billNo = `BILL-2083-${String(sn).padStart(3, '0')}`;
    const createdAt = new Date().toISOString().split('T')[0];
    const newBill: PatientBill = {
      ...billData,
      id,
      sn,
      billNo,
      createdAt,
    };
    setPatientBills(prev => [newBill, ...prev]);
    addLog('Super Admin', 'Super Admin', 'Created Patient Bill', 'System', `Created bill ${billNo} for ${newBill.patientName}`);
    showToast(`Patient Bill ${billNo} saved successfully.`);
    return newBill;
  };

  const updatePatientBill = (id: string, updates: Partial<PatientBill>) => {
    setPatientBills(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    showToast('Patient Bill updated successfully.');
  };

  const deletePatientBill = (id: string) => {
    setPatientBills(prev => prev.filter(b => b.id !== id));
    showToast('Patient Bill deleted.');
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        patientBills,
        doctors,
        staff,
        staffSalaries,
        systemUsers,
        roles,
        appointments,
        inquiries,
        prescriptions,
        suppliers,
        manufacturers,
        medicines,
        stockTransactions,
        activityCategories,
        activities,
        blogPosts,
        activityLogs,
        notifications,
        addPatientBill,
        updatePatientBill,
        deletePatientBill,
        addPatient,
        updatePatient,
        deletePatient,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addManufacturer,
        updateManufacturer,
        deleteManufacturer,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addStockTransaction,
        updateStockTransaction,
        addActivityCategory,
        updateActivityCategory,
        deleteActivityCategory,
        addActivity,
        updateActivity,
        deleteActivity,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addDoctor,
        updateDoctor,
        addStaff,
        updateStaff,
        addStaffSalary,
        updateStaffSalary,
        deleteStaffSalary,
        addSystemUser,
        updateSystemUser,
        deleteSystemUser,
        addRole,
        updateRole,
        deleteRole,
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
