export type UserRole = 'Lead Pharmacist' | 'Staff Pharmacist' | 'Pharmacy Technician' | 'Store Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone: string;
  licenseNumber: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'authenticator' | 'email';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  step: 'credentials' | '2fa' | 'authenticated';
  pendingEmail?: string;
  pendingMethod?: 'authenticator' | 'email';
  twoFactorCodeSent?: boolean;
}

export interface Allergy {
  id: string;
  substance: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening';
  reaction: string;
}

export interface PatientRx {
  id: string;
  rxNumber: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribingDoctorName: string;
  refillsRemaining: number;
  lastFilledDate: string;
  nextRefillDue: string;
  status: 'Active' | 'Pending Refill' | 'Completed' | 'On Hold';
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: Allergy[];
  conditions: string[];
  activePrescriptionsCount: number;
  prescriptions: PatientRx[];
  registeredDate: string;
  status: 'Active' | 'Inactive';
}

export interface Doctor {
  id: string;
  npiNumber: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinicName: string;
  phone: string;
  fax: string;
  email: string;
  address: string;
  totalActivePrescriptions: number;
  rating: number;
  status: 'Active Prescriber' | 'Flagged' | 'Inactive';
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  phone: string;
  licenseNumber: string;
  shift: 'Morning (08:00 - 16:00)' | 'Evening (14:00 - 22:00)' | 'Night (22:00 - 06:00)' | 'Full Day';
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  avatarUrl: string;
  joinedDate: string;
}

export type AppointmentType = 'MTM Consultation' | 'Med Sync Review' | 'Vaccination' | 'Diabetes Management' | 'General Health Consultation';
export type AppointmentStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  type: AppointmentType;
  pharmacistId: string;
  pharmacistName: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes: string;
  isVirtual: boolean;
}

export type InquiryType = 'Drug Interaction' | 'Prior Authorization' | 'Refill Delay' | 'Prescription Transfer' | 'Doctor Clarification' | 'Insurance Claim';
export type InquiryPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type InquiryStatus = 'Open' | 'In Progress' | 'Pending Doctor' | 'Resolved';

export interface InquiryNote {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  text: string;
}

export interface Inquiry {
  id: string;
  ticketNumber: string;
  type: InquiryType;
  patientName: string;
  patientPhone: string;
  relatedDoctorName?: string;
  rxNumber?: string;
  priority: InquiryPriority;
  status: InquiryStatus;
  assignedStaffName: string;
  createdAt: string;
  updatedAt: string;
  subject: string;
  description: string;
  notes: InquiryNote[];
}

export type RxStatus = 'Ready for Pickup' | 'Processing' | 'Requires Review' | 'Out of Stock' | 'Filled';

export interface InteractionFlag {
  drugName: string;
  interactingDrug: string;
  severity: 'Major' | 'Moderate' | 'Minor';
  description: string;
}

export interface Prescription {
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  patientDob: string;
  doctorName: string;
  doctorNpi: string;
  drugName: string;
  strength: string;
  quantity: number;
  refillsTotal: number;
  refillsRemaining: number;
  directions: string;
  status: RxStatus;
  prescribedDate: string;
  fillDueDate: string;
  copayAmount: number;
  interactionFlags?: InteractionFlag[];
  insuranceStatus: 'Approved' | 'Pending Prior Auth' | 'Rejected';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  category: 'Patient' | 'Prescription' | 'Inquiry' | 'Appointment' | 'System';
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'info' | 'success';
  read: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  iconName: string;
  badgeCount?: number;
}
