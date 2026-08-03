export interface SystemRole {
  id: string;
  sn: number;
  displayName: string;
  keyName: string;
  description: string;
  status: 'Active' | 'Inactive';
  permissions: string[];
}

export interface SystemUser {
  id: string;
  userId: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  salary: string;
  avatarUrl?: string;
  joinedDate: string;
  lastLoginAt?: string;
}

export type UserRole = 'Lead Pharmacist' | 'Staff Pharmacist' | 'Pharmacy Technician' | 'Store Manager' | 'Super Admin' | 'Supplier' | 'Admin' | 'User';

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
  fullName?: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  doctor?: string;
  medicalCondition?: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  status: 'Active' | 'Inactive';
  treatmentStatus?: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  allergies: Allergy[];
  conditions: string[];
  activePrescriptionsCount: number;
  prescriptions: PatientRx[];
  registeredDate: string;
}

export interface DoctorPayment {
  id: string;
  sn: number;
  doctorId: string;
  doctorName: string;
  type: string;
  dateBS: string;
  dateAD?: string;
  amount: number;
  details: string;
  recordedBy: string;
}

export interface Doctor {
  id: string;
  sn?: number;
  npiNumber: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatarUrl?: string;
  specialty: string;
  department?: string;
  experience?: string;
  consultationFee?: number | string;
  clinicName: string;
  phone: string;
  fax: string;
  email: string;
  address: string;
  totalActivePrescriptions: number;
  rating: number;
  status: 'Active Prescriber' | 'Active' | 'Flagged' | 'Inactive';
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

export type SalaryStatus = 'Paid' | 'Partially paid' | 'Unpaid';

export interface StaffSalary {
  id: string;
  sn: number;
  staffId: string;
  staffName: string;
  year: string;
  month: string;
  baseSalary: number;
  bonus: number;
  taxPercentage: number;
  taxAmount: number;
  advance: number;
  totalSalary: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate: string;
  status: SalaryStatus;
  createdAt: string;
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

export type RxStatus =
  | 'Pending Review'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Ready for Pickup'
  | 'Processing'
  | 'Requires Review'
  | 'Out of Stock'
  | 'Filled';

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
  patientDob?: string;
  doctorName: string;
  doctorNpi?: string;
  drugName: string;
  strength?: string;
  quantity?: number;
  refillsTotal?: number;
  refillsRemaining?: number;
  directions?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  status: RxStatus;
  prescribedDate: string;
  fillDueDate?: string;
  copayAmount?: number;
  interactionFlags?: InteractionFlag[];
  insuranceStatus?: 'Approved' | 'Pending Prior Auth' | 'Rejected';
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

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  categories: string[];
  paymentTerms: string;
  leadTimeDays: number;
  rating: number;
  status: 'Active' | 'Under Review' | 'Preferred' | 'Inactive';
  address: string;
  supplierBusinessNumber?: string;
}

export interface Manufacturer {
  id: string;
  code: string;
  name: string;
  country: string;
  fdaRegistrationNo: string;
  licenseNumber?: string;
  qualityStatus: 'FDA Approved' | 'EU GMP' | 'ISO 9001' | 'Under Audit';
  activeDrugLines: number;
  contactPerson?: string;
  contactEmail: string;
  contactPhone: string;
  status: 'Active' | 'Flagged' | 'Inactive';
}

export interface MedicineItem {
  id: string;
  ndcCode: string;
  drugName: string;
  genericName: string;
  strength: string;
  form: 'Tablet' | 'Capsule' | 'Liquid Injectable' | 'Ointment' | 'Inhaler' | string;
  dosageForm?: string;
  schedule: 'Rx Only' | 'Schedule II' | 'Schedule IV' | 'OTC' | string;
  manufacturerName: string;
  supplierName: string;
  batchNo?: string;
  stockOnHand: number;
  minThreshold: number;
  unitCost: number;
  retailPrice: number;
  shelf?: string;
  rack?: string;
  storage: 'Room Temp' | 'Refrigerated (2-8°C)' | 'Controlled Room' | string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface StockTransaction {
  id: string;
  transactionNo: string;
  timestamp: string;
  bsDate?: string;
  drugName: string;
  batchNo: string;
  type: 'Inbound Restock' | 'Prescription Dispensed' | 'Expired Waste' | 'Customer Return' | string;
  quantity: number;
  previousStock: number;
  newStock: number;
  balance?: number;
  patientName?: string;
  performedBy: string;
  referenceNo: string;
  remark?: string;
  verificationStatus: 'Verified' | 'Pending Audit' | string;
}

export interface ActivityCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  totalActivitiesCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  activityCategory: string;
  eventDate: string;
  time: string;
  location: string;
  organizer: string;
  maxParticipants: number;
  registeredParticipants: number;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  authorName: string;
  authorRole: string;
  publishDate: string;
  readTime: string;
  status: 'Published' | 'Draft' | 'Archived';
  excerpt: string;
  content: string;
  tags: string[];
  viewsCount: number;
  coverImageUrl?: string;
}

export interface PatientBillMedicineItem {
  id: string;
  medicineId?: string;
  medicineName: string;
  price: number;
  qty: number;
  subtotal: number;
  discPercent: number;
  discount: number;
  vatPercent: number;
  vat: number;
  lineTotal: number;
}

export interface PatientBill {
  id: string;
  sn: number;
  billNo: string;
  patientId: string;
  patientName: string;
  billDate: string;
  subTotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Due';
  billedBy: string;
  medicines: PatientBillMedicineItem[];
  source?: string;
  notes?: string;
  createdAt: string;
}

