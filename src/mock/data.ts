import { Patient, Doctor, Staff, Appointment, Inquiry, Prescription, ActivityLog, User, NotificationItem, SystemUser } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Dr. Sarah Jenkins, PharmD',
    email: 'sarah.jenkins@pharmacycrm.com',
    role: 'Lead Pharmacist',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    phone: '(555) 234-5678',
    licenseNumber: 'RPH-894021',
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
  },
  {
    id: 'u-2',
    name: 'Marcus Vance, CPhT',
    email: 'marcus.vance@pharmacycrm.com',
    role: 'Pharmacy Technician',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    phone: '(555) 876-5432',
    licenseNumber: 'CPT-443910',
    twoFactorEnabled: true,
    twoFactorMethod: 'email',
  },
  {
    id: 'u-3',
    name: 'Elena Rostova, PharmD',
    email: 'elena.rostova@pharmacycrm.com',
    role: 'Staff Pharmacist',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?w=150&auto=format&fit=crop&q=80',
    phone: '(555) 345-6789',
    licenseNumber: 'RPH-991204',
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
  },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-101',
    mrn: 'MRN-88210',
    firstName: 'Eleanor',
    lastName: 'Vance',
    dob: '1964-05-14',
    gender: 'Female',
    phone: '(555) 432-8811',
    email: 'eleanor.vance@example.com',
    address: '742 Evergreen Terrace, Springfield',
    insuranceProvider: 'BlueCross BlueShield',
    insurancePolicyNumber: 'BCBS-9021-X',
    allergies: [
      { id: 'al-1', substance: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis / Hives' },
      { id: 'al-2', substance: 'Sulfa Drugs', severity: 'Moderate', reaction: 'Skin Rash' }
    ],
    conditions: ['Hypertension', 'Type 2 Diabetes', 'Osteoarthritis'],
    activePrescriptionsCount: 4,
    registeredDate: '2023-02-15',
    status: 'Active',
    prescriptions: [
      {
        id: 'rx-501',
        rxNumber: 'RX-774901',
        medicationName: 'Atorvastatin (Lipitor)',
        dosage: '20 mg',
        frequency: 'Once daily at bedtime',
        prescribingDoctorName: 'Dr. Robert Chen',
        refillsRemaining: 3,
        lastFilledDate: '2026-06-20',
        nextRefillDue: '2026-07-28',
        status: 'Active'
      },
      {
        id: 'rx-502',
        rxNumber: 'RX-774902',
        medicationName: 'Metformin HCl ER',
        dosage: '500 mg',
        frequency: 'Twice daily with meals',
        prescribingDoctorName: 'Dr. Robert Chen',
        refillsRemaining: 1,
        lastFilledDate: '2026-06-15',
        nextRefillDue: '2026-07-26',
        status: 'Pending Refill'
      },
      {
        id: 'rx-503',
        rxNumber: 'RX-774903',
        medicationName: 'Lisinopril',
        dosage: '10 mg',
        frequency: 'Once daily in the morning',
        prescribingDoctorName: 'Dr. Maria Santos',
        refillsRemaining: 5,
        lastFilledDate: '2026-07-01',
        nextRefillDue: '2026-08-01',
        status: 'Active'
      }
    ]
  },
  {
    id: 'p-102',
    mrn: 'MRN-88211',
    firstName: 'James',
    lastName: 'Kovacs',
    dob: '1978-11-03',
    gender: 'Male',
    phone: '(555) 901-2244',
    email: 'j.kovacs@example.com',
    address: '104 Metro Parkway, Suite 4B',
    insuranceProvider: 'Aetna Health Care',
    insurancePolicyNumber: 'AET-4432-88',
    allergies: [
      { id: 'al-3', substance: 'Aspirin', severity: 'Moderate', reaction: 'Gastric Distress' }
    ],
    conditions: ['Asthma', 'Hyperlipidemia'],
    activePrescriptionsCount: 2,
    registeredDate: '2023-08-20',
    status: 'Active',
    prescriptions: [
      {
        id: 'rx-504',
        rxNumber: 'RX-883011',
        medicationName: 'Advair Diskus 250/50',
        dosage: '1 puff',
        frequency: 'Twice daily',
        prescribingDoctorName: 'Dr. Aris Thorne',
        refillsRemaining: 2,
        lastFilledDate: '2026-06-30',
        nextRefillDue: '2026-07-30',
        status: 'Active'
      },
      {
        id: 'rx-505',
        rxNumber: 'RX-883012',
        medicationName: 'Ventolin HFA (Albuterol)',
        dosage: '90 mcg',
        frequency: 'As needed for shortness of breath',
        prescribingDoctorName: 'Dr. Aris Thorne',
        refillsRemaining: 4,
        lastFilledDate: '2026-05-10',
        nextRefillDue: '2026-08-10',
        status: 'Active'
      }
    ]
  },
  {
    id: 'p-103',
    mrn: 'MRN-88212',
    firstName: 'Sophia',
    lastName: 'Martinez',
    dob: '1992-03-22',
    gender: 'Female',
    phone: '(555) 772-1002',
    email: 'sophia.m@example.com',
    address: '88 Oakridge Drive',
    insuranceProvider: 'UnitedHealthcare',
    insurancePolicyNumber: 'UHC-1102-99',
    allergies: [],
    conditions: ['Hypothyroidism'],
    activePrescriptionsCount: 1,
    registeredDate: '2024-01-10',
    status: 'Active',
    prescriptions: [
      {
        id: 'rx-506',
        rxNumber: 'RX-901122',
        medicationName: 'Synthroid (Levothyroxine)',
        dosage: '75 mcg',
        frequency: 'Once daily in the morning on empty stomach',
        prescribingDoctorName: 'Dr. Maria Santos',
        refillsRemaining: 0,
        lastFilledDate: '2026-06-25',
        nextRefillDue: '2026-07-25',
        status: 'Pending Refill'
      }
    ]
  },
  {
    id: 'p-104',
    mrn: 'MRN-88213',
    firstName: 'Arthur',
    lastName: 'Pendelton',
    dob: '1951-09-09',
    gender: 'Male',
    phone: '(555) 321-7890',
    email: 'a.pendelton@example.com',
    address: '12 Harbor View Rd',
    insuranceProvider: 'Humana Medicare',
    insurancePolicyNumber: 'HUM-8832-11',
    allergies: [
      { id: 'al-4', substance: 'Codeine', severity: 'Severe', reaction: 'Respiratory Depression' }
    ],
    conditions: ['Atrial Fibrillation', 'Heart Failure', 'CKD Stage 3'],
    activePrescriptionsCount: 5,
    registeredDate: '2022-11-04',
    status: 'Active',
    prescriptions: [
      {
        id: 'rx-507',
        rxNumber: 'RX-332190',
        medicationName: 'Eliquis (Apixaban)',
        dosage: '5 mg',
        frequency: 'Twice daily',
        prescribingDoctorName: 'Dr. Robert Chen',
        refillsRemaining: 2,
        lastFilledDate: '2026-07-02',
        nextRefillDue: '2026-08-02',
        status: 'Active'
      },
      {
        id: 'rx-508',
        rxNumber: 'RX-332191',
        medicationName: 'Entresto 49/51 mg',
        dosage: '1 tab',
        frequency: 'Twice daily',
        prescribingDoctorName: 'Dr. Robert Chen',
        refillsRemaining: 1,
        lastFilledDate: '2026-07-02',
        nextRefillDue: '2026-08-02',
        status: 'Active'
      }
    ]
  },
  {
    id: 'p-105',
    mrn: 'MRN-88214',
    firstName: 'Amara',
    lastName: 'Okonkwo',
    dob: '1985-07-19',
    gender: 'Female',
    phone: '(555) 654-9870',
    email: 'amara.o@example.com',
    address: '320 Cedar Lane',
    insuranceProvider: 'Cigna Health',
    insurancePolicyNumber: 'CG-5521-00',
    allergies: [
      { id: 'al-5', substance: 'NSAIDs / Ibuprofen', severity: 'Moderate', reaction: 'Urticaria / Swelling' }
    ],
    conditions: ['Rheumatoid Arthritis'],
    activePrescriptionsCount: 2,
    registeredDate: '2024-03-01',
    status: 'Active',
    prescriptions: [
      {
        id: 'rx-509',
        rxNumber: 'RX-661003',
        medicationName: 'Methotrexate',
        dosage: '15 mg',
        frequency: 'Once weekly',
        prescribingDoctorName: 'Dr. Aris Thorne',
        refillsRemaining: 4,
        lastFilledDate: '2026-06-28',
        nextRefillDue: '2026-07-28',
        status: 'Active'
      }
    ]
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    npiNumber: '1982736451',
    firstName: 'Robert',
    lastName: 'Chen',
    specialty: 'Cardiology',
    clinicName: 'St. Jude Heart & Vascular Center',
    phone: '(555) 888-1212',
    fax: '(555) 888-1213',
    email: 'dr.chen@stjudehealth.org',
    address: '500 Medical Center Blvd, Suite 300',
    totalActivePrescriptions: 142,
    rating: 4.9,
    status: 'Active Prescriber'
  },
  {
    id: 'doc-2',
    npiNumber: '1203948572',
    firstName: 'Maria',
    lastName: 'Santos',
    specialty: 'Endocrinology & Internal Med',
    clinicName: 'Metropolitan Health Clinic',
    phone: '(555) 777-3434',
    fax: '(555) 777-3435',
    email: 'm.santos@metroclinic.org',
    address: '120 University Ave',
    totalActivePrescriptions: 98,
    rating: 4.8,
    status: 'Active Prescriber'
  },
  {
    id: 'doc-3',
    npiNumber: '1592837460',
    firstName: 'Aris',
    lastName: 'Thorne',
    specialty: 'Pulmonology & Allergy',
    clinicName: 'Valley Respiratory Associates',
    phone: '(555) 666-9090',
    fax: '(555) 666-9091',
    email: 'athorne@valleyrespiratory.com',
    address: '45 Wellness Way, Building B',
    totalActivePrescriptions: 64,
    rating: 4.7,
    status: 'Active Prescriber'
  },
  {
    id: 'doc-4',
    npiNumber: '1029384756',
    firstName: 'David',
    lastName: 'Kaufman',
    specialty: 'Family Medicine',
    clinicName: 'Springfield Community Health',
    phone: '(555) 444-2323',
    fax: '(555) 444-2324',
    email: 'dkaufman@springfieldhealth.gov',
    address: '890 Main St',
    totalActivePrescriptions: 210,
    rating: 4.6,
    status: 'Active Prescriber'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'st-1',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    role: 'Lead Pharmacist',
    email: 'sarah.jenkins@pharmacycrm.com',
    phone: '(555) 234-5678',
    licenseNumber: 'RPH-894021',
    shift: 'Morning (08:00 - 16:00)',
    status: 'On Duty',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2020-03-15'
  },
  {
    id: 'st-2',
    firstName: 'Marcus',
    lastName: 'Vance',
    role: 'Pharmacy Technician',
    email: 'marcus.vance@pharmacycrm.com',
    phone: '(555) 876-5432',
    licenseNumber: 'CPT-443910',
    shift: 'Morning (08:00 - 16:00)',
    status: 'On Duty',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2021-08-01'
  },
  {
    id: 'st-3',
    firstName: 'Elena',
    lastName: 'Rostova',
    role: 'Staff Pharmacist',
    email: 'elena.rostova@pharmacycrm.com',
    phone: '(555) 345-6789',
    licenseNumber: 'RPH-991204',
    shift: 'Evening (14:00 - 22:00)',
    status: 'On Duty',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2022-05-10'
  },
  {
    id: 'st-4',
    firstName: 'Benjamin',
    lastName: 'Hayes',
    role: 'Store Manager',
    email: 'benjamin.hayes@pharmacycrm.com',
    phone: '(555) 998-1122',
    licenseNumber: 'MGR-102938',
    shift: 'Full Day',
    status: 'On Duty',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2019-11-20'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'p-101',
    patientName: 'Eleanor Vance',
    patientPhone: '(555) 432-8811',
    type: 'MTM Consultation',
    pharmacistId: 'st-1',
    pharmacistName: 'Dr. Sarah Jenkins, PharmD',
    date: '2026-07-26',
    time: '10:30 AM',
    durationMinutes: 30,
    status: 'In Progress',
    notes: 'Comprehensive medication review following dosage change in Metformin.',
    isVirtual: true
  },
  {
    id: 'apt-2',
    patientId: 'p-102',
    patientName: 'James Kovacs',
    patientPhone: '(555) 901-2244',
    type: 'Vaccination',
    pharmacistId: 'st-3',
    pharmacistName: 'Dr. Elena Rostova, PharmD',
    date: '2026-07-26',
    time: '01:15 PM',
    durationMinutes: 15,
    status: 'Scheduled',
    notes: 'Annual Influenza vaccine + Pneumococcal conjugate booster.',
    isVirtual: false
  },
  {
    id: 'apt-3',
    patientId: 'p-104',
    patientName: 'Arthur Pendelton',
    patientPhone: '(555) 321-7890',
    type: 'Med Sync Review',
    pharmacistId: 'st-1',
    pharmacistName: 'Dr. Sarah Jenkins, PharmD',
    date: '2026-07-26',
    time: '03:00 PM',
    durationMinutes: 20,
    status: 'Scheduled',
    notes: 'Aligning Eliquis and Entresto refill dates to a single monthly pickup.',
    isVirtual: false
  },
  {
    id: 'apt-4',
    patientId: 'p-103',
    patientName: 'Sophia Martinez',
    patientPhone: '(555) 772-1002',
    type: 'Diabetes Management',
    pharmacistId: 'st-3',
    pharmacistName: 'Dr. Elena Rostova, PharmD',
    date: '2026-07-27',
    time: '11:00 AM',
    durationMinutes: 30,
    status: 'Scheduled',
    notes: 'CGM Sensor placement setup and glucose log evaluation.',
    isVirtual: false
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    ticketNumber: 'TKT-9021',
    type: 'Drug Interaction',
    patientName: 'Eleanor Vance',
    patientPhone: '(555) 432-8811',
    relatedDoctorName: 'Dr. Robert Chen',
    rxNumber: 'RX-774902',
    priority: 'Urgent',
    status: 'Open',
    assignedStaffName: 'Dr. Sarah Jenkins, PharmD',
    createdAt: '2026-07-26 08:30 AM',
    updatedAt: '2026-07-26 09:15 AM',
    subject: 'Potential interaction flagged between Warfarin and newly prescribed Ciprofloxacin',
    description: 'Patient presented new prescription for Ciprofloxacin 500mg from urgent care while currently maintained on Warfarin therapy. High risk of INR elevation and major bleeding.',
    notes: [
      {
        id: 'n-1',
        authorName: 'Marcus Vance, CPhT',
        authorRole: 'Pharmacy Tech',
        timestamp: '2026-07-26 08:32 AM',
        text: 'Flagged by dispensing engine during entry. Placed on pharmacist hold.'
      },
      {
        id: 'n-2',
        authorName: 'Dr. Sarah Jenkins, PharmD',
        authorRole: 'Lead Pharmacist',
        timestamp: '2026-07-26 09:15 AM',
        text: 'Called Dr. Chen’s clinic to recommend alternative antibiotic (Nitrofurantoin) or schedule close INR monitoring.'
      }
    ]
  },
  {
    id: 'inq-2',
    ticketNumber: 'TKT-9022',
    type: 'Prior Authorization',
    patientName: 'Arthur Pendelton',
    patientPhone: '(555) 321-7890',
    relatedDoctorName: 'Dr. Robert Chen',
    rxNumber: 'RX-332191',
    priority: 'High',
    status: 'In Progress',
    assignedStaffName: 'Marcus Vance, CPhT',
    createdAt: '2026-07-25 02:00 PM',
    updatedAt: '2026-07-26 08:00 AM',
    subject: 'Humana Medicare Prior Auth form required for Entresto 49/51 mg',
    description: 'Insurance claim rejected stating step therapy requirement with ACE/ARB prior to Entresto coverage.',
    notes: [
      {
        id: 'n-3',
        authorName: 'Marcus Vance, CPhT',
        authorRole: 'Pharmacy Tech',
        timestamp: '2026-07-25 02:15 PM',
        text: 'Sent CoverMyMeds PA request to Dr. Chen’s office with clinical notes.'
      }
    ]
  },
  {
    id: 'inq-3',
    ticketNumber: 'TKT-9023',
    type: 'Prescription Transfer',
    patientName: 'Sophia Martinez',
    patientPhone: '(555) 772-1002',
    rxNumber: 'RX-901122',
    priority: 'Medium',
    status: 'Open',
    assignedStaffName: 'Dr. Elena Rostova, PharmD',
    createdAt: '2026-07-26 09:00 AM',
    updatedAt: '2026-07-26 09:00 AM',
    subject: 'Inbound Rx Transfer request from CVS Pharmacy #4402',
    description: 'Patient requested transfer of 3 maintenance prescriptions (Synthroid, Vitamin D3, Montelukast) to our pharmacy.',
    notes: []
  },
  {
    id: 'inq-4',
    ticketNumber: 'TKT-9024',
    type: 'Doctor Clarification',
    patientName: 'Amara Okonkwo',
    patientPhone: '(555) 654-9870',
    relatedDoctorName: 'Dr. Aris Thorne',
    rxNumber: 'RX-661003',
    priority: 'Low',
    status: 'Resolved',
    assignedStaffName: 'Dr. Sarah Jenkins, PharmD',
    createdAt: '2026-07-24 11:30 AM',
    updatedAt: '2026-07-25 04:20 PM',
    subject: 'Illegal/Ambiguous sig on Methotrexate prescription',
    description: 'Sig specified "Take 1 tab daily" instead of standard weekly dosing. Clarified with Dr. Thorne office.',
    notes: [
      {
        id: 'n-4',
        authorName: 'Dr. Sarah Jenkins, PharmD',
        authorRole: 'Lead Pharmacist',
        timestamp: '2026-07-25 04:20 PM',
        text: 'Dr. Thorne confirmed 15mg ONCE WEEKLY on Mondays. Corrected in pharmacy system.'
      }
    ]
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-0',
    rxNumber: 'RX-100281',
    patientId: 'p-100',
    patientName: 'Ronald Koeman',
    patientDob: '1988-03-12',
    doctorName: 'Dr. Minash Diop',
    doctorNpi: '1849201833',
    drugName: 'Paracetamol',
    strength: '500 mg',
    dosage: '500mg',
    frequency: '2 times daily',
    route: 'Oral',
    duration: '7 days',
    startDate: '2026-07-28',
    endDate: '2026-08-04',
    quantity: 14,
    refillsTotal: 2,
    refillsRemaining: 2,
    directions: 'Take 1 tablet twice daily after meals as needed for fever or pain',
    status: 'Pending Review',
    prescribedDate: '2026-07-28',
    fillDueDate: '2026-08-04',
  },
  {
    id: 'rx-1',
    rxNumber: 'RX-774902',
    patientId: 'p-101',
    patientName: 'Eleanor Vance',
    patientDob: '1964-05-14',
    doctorName: 'Dr. Robert Chen',
    doctorNpi: '1982736451',
    drugName: 'Metformin HCl ER',
    strength: '500 mg',
    dosage: '500mg',
    frequency: '2 times daily',
    route: 'Oral',
    duration: '30 days',
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    quantity: 60,
    refillsTotal: 5,
    refillsRemaining: 1,
    directions: 'Take 1 tablet twice daily with meals',
    status: 'Pending Review',
    prescribedDate: '2026-06-15',
    fillDueDate: '2026-07-26',
    copayAmount: 12.50,
    insuranceStatus: 'Approved',
    interactionFlags: [
      {
        drugName: 'Metformin HCl ER',
        interactingDrug: 'Contrast Dye Procedure scheduled',
        severity: 'Moderate',
        description: 'Verify patient renal function prior to contrast procedure.'
      }
    ]
  },
  {
    id: 'rx-2',
    rxNumber: 'RX-883011',
    patientId: 'p-102',
    patientName: 'James Kovacs',
    patientDob: '1978-11-03',
    doctorName: 'Dr. Aris Thorne',
    doctorNpi: '1592837460',
    drugName: 'Advair Diskus',
    strength: '250/50 mcg',
    dosage: '250/50 mcg',
    frequency: '1 puff 2x daily',
    route: 'Inhalation',
    duration: '30 days',
    startDate: '2026-07-01',
    endDate: '2026-07-30',
    quantity: 1,
    refillsTotal: 3,
    refillsRemaining: 2,
    directions: 'Inhale 1 puff twice daily. Rinse mouth after use.',
    status: 'Confirmed',
    prescribedDate: '2026-06-30',
    fillDueDate: '2026-07-26',
    copayAmount: 25.00,
    insuranceStatus: 'Approved'
  },
  {
    id: 'rx-3',
    rxNumber: 'RX-901122',
    patientId: 'p-103',
    patientName: 'Sophia Martinez',
    patientDob: '1992-03-22',
    doctorName: 'Dr. Maria Santos',
    doctorNpi: '1203948572',
    drugName: 'Synthroid (Levothyroxine)',
    strength: '75 mcg',
    dosage: '75 mcg',
    frequency: 'Once daily',
    route: 'Oral',
    duration: '90 days',
    startDate: '2026-06-25',
    endDate: '2026-09-25',
    quantity: 90,
    refillsTotal: 4,
    refillsRemaining: 0,
    directions: 'Take 1 tablet every morning on empty stomach 30 mins before food',
    status: 'Completed',
    prescribedDate: '2026-06-25',
    fillDueDate: '2026-07-25',
    copayAmount: 15.00,
    insuranceStatus: 'Approved'
  },
  {
    id: 'rx-4',
    rxNumber: 'RX-332191',
    patientId: 'p-104',
    patientName: 'Arthur Pendelton',
    patientDob: '1951-09-09',
    doctorName: 'Dr. Robert Chen',
    doctorNpi: '1982736451',
    drugName: 'Entresto',
    strength: '49/51 mg',
    dosage: '49/51 mg',
    frequency: 'Twice daily',
    route: 'Oral',
    duration: '30 days',
    startDate: '2026-07-02',
    endDate: '2026-08-02',
    quantity: 60,
    refillsTotal: 3,
    refillsRemaining: 1,
    directions: 'Take 1 tablet twice daily',
    status: 'Cancelled',
    prescribedDate: '2026-07-02',
    fillDueDate: '2026-08-02',
    copayAmount: 45.00,
    insuranceStatus: 'Pending Prior Auth'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '2026-07-26 09:42 AM',
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Lead Pharmacist',
    action: 'Opened Inquiry',
    category: 'Inquiry',
    details: 'Logged drug interaction flag TKT-9021 for Eleanor Vance (Warfarin vs Ciprofloxacin).'
  },
  {
    id: 'act-2',
    timestamp: '2026-07-26 09:10 AM',
    userName: 'Marcus Vance',
    userRole: 'Pharmacy Tech',
    action: 'Updated Prescription',
    category: 'Prescription',
    details: 'Status changed to Ready for Pickup for RX-883011 (James Kovacs).'
  },
  {
    id: 'act-3',
    timestamp: '2026-07-26 08:30 AM',
    userName: 'Elena Rostova',
    userRole: 'Staff Pharmacist',
    action: 'Booked Appointment',
    category: 'Appointment',
    details: 'Scheduled Med Sync Review for Arthur Pendelton on 2026-07-26 at 03:00 PM.'
  },
  {
    id: 'act-4',
    timestamp: '2026-07-25 04:15 PM',
    userName: 'System Admin',
    userRole: 'System',
    action: 'User 2FA Auth Verified',
    category: 'System',
    details: 'Google Authenticator 2FA login verified for sarah.jenkins@pharmacycrm.com.'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent Drug Interaction Alert',
    message: 'Warfarin vs Ciprofloxacin flag for patient Eleanor Vance requires pharmacist signoff.',
    timestamp: '10m ago',
    type: 'urgent',
    read: false
  },
  {
    id: 'notif-2',
    title: 'New Prior Authorization Request',
    message: 'Entresto 49/51mg submitted for Arthur Pendelton pending insurance approval.',
    timestamp: '1h ago',
    type: 'info',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Vaccination Appointment Soon',
    message: 'James Kovacs flu shot scheduled for 01:15 PM today.',
    timestamp: '2h ago',
    type: 'success',
    read: true
  }
];

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'sys-1',
    userId: 'M10000',
    name: 'Super Admin',
    username: 'superadmin',
    email: 'appsytech@gmail.com',
    phone: '9999999999',
    role: 'Super Admin',
    status: 'Active',
    salary: 'This is your account',
    joinedDate: '2023-01-10',
    lastLoginAt: '2026-07-28 01:00:04',
  },
  {
    id: 'sys-2',
    userId: 'M10003',
    name: 'Pharmacist',
    username: 'pharmacist',
    email: 'raj@gmail.com',
    phone: '9805400000',
    role: 'Lead Pharmacist',
    status: 'Active',
    salary: '$125,000 / yr',
    joinedDate: '2023-04-12',
    lastLoginAt: '2026-07-27 18:42:10',
  },
];
