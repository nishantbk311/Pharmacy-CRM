import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Trash2,
  Edit2,
  UserPlus,
  MapPin,
  Save,
  RotateCcw,
  SlidersHorizontal,
  User,
  ClipboardList,
  Tag,
  DollarSign,
  Wallet,
  FileText,
  Pill,
  Stethoscope,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Patient } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

interface PatientsPageProps {
  registerModalOpen: boolean;
  setRegisterModalOpen: (open: boolean) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({
  registerModalOpen,
  setRegisterModalOpen,
}) => {
  const { patients, doctors, addPatient, updatePatient, deletePatient } = useData();

  const [searchParams] = useSearchParams();

  // Search/Filter states matching design
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [fullNameQuery, setFullNameQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [filterTreatmentStatus, setFilterTreatmentStatus] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setFullNameQuery(q);
    }
  }, [searchParams]);

  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Check if any filter is active
  const hasActiveFilters =
    patientIdQuery.trim() !== '' ||
    fullNameQuery.trim() !== '' ||
    emailQuery.trim() !== '' ||
    filterTreatmentStatus !== 'All' ||
    filterStatus !== 'All';

  // Clear all filters handler
  const handleClearFilters = () => {
    setPatientIdQuery('');
    setFullNameQuery('');
    setEmailQuery('');
    setFilterTreatmentStatus('All');
    setFilterStatus('All');
  };

  // New Patient Form State
  const [fullName, setFullName] = useState('patient');
  const [dob, setDob] = useState('2083-04-06');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O');
  const [phone, setPhone] = useState('9829010709');
  const [email, setEmail] = useState('patient@gmail.com');
  const [address, setAddress] = useState('Bhbairahawa , Rupandehi');
  const [city, setCity] = useState('Bhbairahawa');
  const [stateName, setStateName] = useState('bhw');
  const [doctor, setDoctor] = useState('Dr. Ajay Yadav');
  const [medicalCondition, setMedicalCondition] = useState('Normal');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [treatmentStatus, setTreatmentStatus] = useState<'Not Started' | 'In Progress' | 'Completed' | 'On Hold'>('Not Started');

  // Edit Patient Form State
  const [editFullName, setEditFullName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editStateName, setEditStateName] = useState('');
  const [editDoctor, setEditDoctor] = useState('');
  const [editMedicalCondition, setEditMedicalCondition] = useState('');
  const [editInsuranceProvider, setEditInsuranceProvider] = useState('');
  const [editInsurancePolicyNumber, setEditInsurancePolicyNumber] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editTreatmentStatus, setEditTreatmentStatus] = useState<'Not Started' | 'In Progress' | 'Completed' | 'On Hold'>('Not Started');

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setEditFullName(patient.fullName || `${patient.firstName} ${patient.lastName}`);
    setEditDob(patient.dob || '');
    setEditGender(patient.gender || 'Male');
    setEditBloodGroup(patient.bloodGroup || '');
    setEditPhone(patient.phone || '');
    setEditEmail(patient.email || '');
    setEditAddress(patient.address || '');
    setEditCity(patient.city || '');
    setEditStateName(patient.state || '');
    setEditDoctor(patient.doctor || '');
    setEditMedicalCondition(patient.medicalCondition || '');
    setEditInsuranceProvider(patient.insuranceProvider || '');
    setEditInsurancePolicyNumber(patient.insurancePolicyNumber || '');
    setEditStatus(patient.status || 'Active');
    setEditTreatmentStatus(patient.treatmentStatus || 'Not Started');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient || !editFullName.trim()) return;

    const parts = editFullName.trim().split(' ');
    const firstName = parts[0] || 'Patient';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : 'Patient';

    const updatedData: Partial<Patient> = {
      fullName: editFullName.trim(),
      firstName,
      lastName,
      dob: editDob,
      gender: editGender,
      bloodGroup: editBloodGroup,
      phone: editPhone,
      email: editEmail,
      address: editAddress,
      city: editCity,
      state: editStateName,
      doctor: editDoctor,
      medicalCondition: editMedicalCondition,
      insuranceProvider: editInsuranceProvider,
      insurancePolicyNumber: editInsurancePolicyNumber,
      status: editStatus,
      treatmentStatus: editTreatmentStatus,
    };

    updatePatient(editingPatient.id, updatedData);
    setEditingPatient(null);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const pName = (p.fullName || `${p.firstName} ${p.lastName}`).toLowerCase();
      const pMrn = (p.mrn || '').toLowerCase();
      const pEmail = (p.email || '').toLowerCase();

      const matchId = !patientIdQuery.trim() || pMrn.includes(patientIdQuery.trim().toLowerCase());
      const matchName = !fullNameQuery.trim() || pName.includes(fullNameQuery.trim().toLowerCase());
      const matchEmail = !emailQuery.trim() || pEmail.includes(emailQuery.trim().toLowerCase());

      const matchTreatment =
        filterTreatmentStatus === 'All' || p.treatmentStatus === filterTreatmentStatus;

      const matchStatus = filterStatus === 'All' || p.status === filterStatus;

      return matchId && matchName && matchEmail && matchTreatment && matchStatus;
    });
  }, [patients, patientIdQuery, fullNameQuery, emailQuery, filterTreatmentStatus, filterStatus]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || 'Patient';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : 'Patient';

    addPatient({
      firstName,
      lastName,
      fullName: fullName.trim(),
      dob,
      gender,
      bloodGroup,
      phone,
      email: email || `${firstName.toLowerCase()}@gmail.com`,
      address,
      city,
      state: stateName,
      doctor,
      medicalCondition,
      insuranceProvider: insuranceProvider || 'N/A',
      insurancePolicyNumber: insurancePolicyNumber || 'N/A',
      status,
      treatmentStatus,
      allergies: [],
      conditions: medicalCondition ? [medicalCondition] : [],
      activePrescriptionsCount: 0,
      prescriptions: [],
    });

    setRegisterModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-[#1b2a4a] rounded-2xl p-5 shadow-xs">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Patients
          </h1>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#13203c] dark:hover:bg-[#1a2b50] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#22355c] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer animate-in fade-in duration-150"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Clear Filter</span>
              </button>
            )}
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          {/* Patient Id */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Patient Id
            </label>
            <input
              type="text"
              placeholder="Enter Patient Id"
              value={patientIdQuery}
              onChange={e => setPatientIdQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131f38] border border-slate-200 dark:border-[#203154] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter Full Name"
              value={fullNameQuery}
              onChange={e => setFullNameQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131f38] border border-slate-200 dark:border-[#203154] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              Email
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              value={emailQuery}
              onChange={e => setEmailQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131f38] border border-slate-200 dark:border-[#203154] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Treatment Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <ClipboardList className="w-3 h-3 text-slate-400" />
              Treatment Status
            </label>
            <select
              value={filterTreatmentStatus}
              onChange={e => setFilterTreatmentStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131f38] border border-slate-200 dark:border-[#203154] text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131f38] border border-slate-200 dark:border-[#203154] text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table Card */}
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-[#1b2a4a] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1d2d4f] bg-slate-50/80 dark:bg-[#0d162e] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">S.N</th>
                <th className="py-3.5 px-4">PATIENT</th>
                <th className="py-3.5 px-4">CONTACT</th>
                <th className="py-3.5 px-4">DOCTOR</th>
                <th className="py-3.5 px-4">LAST VISIT</th>
                <th className="py-3.5 px-4">BILLING</th>
                <th className="py-3.5 px-4">CARE</th>
                <th className="py-3.5 px-4">TREATMENT</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#192744] text-xs">
              {filteredPatients.map((patient, index) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#121d36] transition-colors group"
                >
                  {/* S.N */}
                  <td className="py-4 px-4 text-center font-medium text-slate-500 dark:text-slate-400">
                    {index + 1}
                  </td>

                  {/* PATIENT */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {patient.fullName || `${patient.firstName} ${patient.lastName}`}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      {patient.mrn}
                    </p>
                  </td>

                  {/* CONTACT */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {patient.phone || 'N/A'}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {patient.email || 'N/A'}
                    </p>
                  </td>

                  {/* DOCTOR */}
                  <td className="py-4 px-4">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {patient.doctor || 'doctor'}
                    </p>
                  </td>

                  {/* LAST VISIT */}
                  <td className="py-4 px-4">
                    <p className="text-slate-500 dark:text-slate-400 font-mono">
                      —
                    </p>
                  </td>

                  {/* BILLING */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-[#073828] dark:text-[#38d39f] dark:border dark:border-[#0e5c42] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Bill</span>
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-[#3d2b07] dark:text-[#f3ba42] dark:border dark:border-[#63470b] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Pay</span>
                      </button>
                    </div>
                  </td>

                  {/* CARE */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-[#2b1842] dark:text-[#ba8fff] dark:border dark:border-[#422663] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-[#0d2a4d] dark:text-[#52a5ff] dark:border dark:border-[#143e70] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Pill className="w-3.5 h-3.5" />
                        <span>Rx</span>
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-[#06333a] dark:text-[#2dd4bf] dark:border dark:border-[#0d535e] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </button>
                    </div>
                  </td>

                  {/* TREATMENT */}
                  <td className="py-4 px-4">
                    <select
                      value={patient.treatmentStatus || 'Not Started'}
                      onChange={e =>
                        updatePatient(patient.id, {
                          treatmentStatus: e.target.value as any,
                        })
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 cursor-pointer transition-colors ${
                        patient.treatmentStatus === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-[#0d2a4d] dark:text-[#52a5ff] dark:border dark:border-[#143e70]'
                          : patient.treatmentStatus === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-[#073828] dark:text-[#38d39f] dark:border dark:border-[#0e5c42]'
                          : patient.treatmentStatus === 'On Hold'
                          ? 'bg-amber-100 text-amber-800 dark:bg-[#3d2b07] dark:text-[#f3ba42] dark:border dark:border-[#63470b]'
                          : 'bg-slate-100 text-slate-700 dark:bg-[#13223f] dark:text-slate-300 dark:border dark:border-[#1e335b]'
                      }`}
                    >
                      <option value="Not Started" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">Not Started</option>
                      <option value="In Progress" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">In Progress</option>
                      <option value="Completed" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">Completed</option>
                      <option value="On Hold" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">On Hold</option>
                    </select>
                  </td>

                  {/* STATUS */}
                  <td className="py-4 px-4">
                    <select
                      value={patient.status || 'Active'}
                      onChange={e =>
                        updatePatient(patient.id, {
                          status: e.target.value as any,
                        })
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 cursor-pointer transition-colors ${
                        patient.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-[#073828] dark:text-[#38d39f] dark:border dark:border-[#0e5c42]'
                          : 'bg-rose-100 text-rose-800 dark:bg-[#3d0f19] dark:text-[#ff6b81] dark:border dark:border-[#5c1827]'
                      }`}
                    >
                      <option value="Active" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">Active</option>
                      <option value="Inactive" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">Inactive</option>
                    </select>
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          openEditModal(patient);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Edit Patient Information"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setDeletingPatient(patient);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Patient Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No patients match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Patient Modal */}
      {editingPatient && (
        <Modal
          isOpen={!!editingPatient}
          onClose={() => setEditingPatient(null)}
          title={`Edit Patient Info: ${editingPatient.fullName || `${editingPatient.firstName} ${editingPatient.lastName}`}`}
          subtitle={`MRN: ${editingPatient.mrn}`}
          icon={<Edit2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
          maxWidth="4xl"
        >
          <form onSubmit={handleEditSubmit} className="space-y-5 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
              {/* Full Name */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Full Name <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={e => setEditFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Date Of Birth */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Date Of Birth <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editDob}
                    onChange={e => setEditDob(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded uppercase tracking-wider">
                    BS
                  </span>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Gender <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <select
                  required
                  value={editGender}
                  onChange={e => setEditGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Blood Group
                </label>
                <input
                  type="text"
                  value={editBloodGroup}
                  onChange={e => setEditBloodGroup(e.target.value)}
                  placeholder="O+"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Phone
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Address
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={e => setEditAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* City */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  City
                </label>
                <input
                  type="text"
                  value={editCity}
                  onChange={e => setEditCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* State */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  State
                </label>
                <input
                  type="text"
                  value={editStateName}
                  onChange={e => setEditStateName(e.target.value)}
                  placeholder="State"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Doctor */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Doctor
                </label>
                <select
                  value={editDoctor}
                  onChange={e => setEditDoctor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => {
                    const docName = `Dr. ${doc.firstName} ${doc.lastName}`;
                    return (
                      <option key={doc.id} value={docName}>
                        {docName} ({doc.specialty})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Medical Condition */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Medical Condition
                </label>
                <input
                  type="text"
                  value={editMedicalCondition}
                  onChange={e => setEditMedicalCondition(e.target.value)}
                  placeholder="Medical Condition"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Insurance Provider */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={editInsuranceProvider}
                  onChange={e => setEditInsuranceProvider(e.target.value)}
                  placeholder="Insurance Provider"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Insurance Policy Number */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Insurance Policy Number
                </label>
                <input
                  type="text"
                  value={editInsurancePolicyNumber}
                  onChange={e => setEditInsurancePolicyNumber(e.target.value)}
                  placeholder="Policy Number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Status <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <select
                  required
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Treatment Status */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                  Treatment Status <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <select
                  required
                  value={editTreatmentStatus}
                  onChange={e => setEditTreatmentStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-5 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingPatient(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Update Patient</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Register New Patient Modal */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Add New Patient"
        subtitle="Enter patient details, contact info, and treatment status."
        icon={<UserPlus className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
        maxWidth="4xl"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
            {/* 1. Full Name * */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Full Name <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="patient"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 2. Date Of Birth * */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Date Of Birth <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  placeholder="2083-04-06"
                  className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded uppercase tracking-wider">
                  BS
                </span>
              </div>
            </div>

            {/* 3. Gender * */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Gender <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <select
                required
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 4. Blood Group */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Blood Group
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                placeholder="O"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 5. Phone */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="9829010709"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 6. Email */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="patient@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 7. Address */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Bhbairahawa , Rupandehi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 8. City */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Bhbairahawa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 9. State */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                State
              </label>
              <input
                type="text"
                value={stateName}
                onChange={e => setStateName(e.target.value)}
                placeholder="bhw"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 10. Doctor */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Doctor
              </label>
              <select
                value={doctor}
                onChange={e => setDoctor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">Select Doctor</option>
                {doctors.map(doc => {
                  const docName = `Dr. ${doc.firstName} ${doc.lastName}`;
                  return (
                    <option key={doc.id} value={docName}>
                      {docName} ({doc.specialty})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 11. Medical Condition */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Medical Conidtion
              </label>
              <input
                type="text"
                value={medicalCondition}
                onChange={e => setMedicalCondition(e.target.value)}
                placeholder="Normal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 12. Insurance Provider */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Insurance Provider
              </label>
              <input
                type="text"
                value={insuranceProvider}
                onChange={e => setInsuranceProvider(e.target.value)}
                placeholder="Enter Insurance Provider"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 13. Insurance Policy Number */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Insurance Policy Number
              </label>
              <input
                type="text"
                value={insurancePolicyNumber}
                onChange={e => setInsurancePolicyNumber(e.target.value)}
                placeholder="Enter Insurance Policy Number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 14. Status * */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Status <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <select
                required
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* 15. Treatment Status * */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Treatment Status <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <select
                required
                value={treatmentStatus}
                onChange={e => setTreatmentStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-blue-500 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-5 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Patient Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingPatient}
        onClose={() => setDeletingPatient(null)}
        onConfirm={() => {
          if (deletingPatient) {
            deletePatient(deletingPatient.id);
          }
        }}
        title="Delete Patient Medical Record"
        itemName={deletingPatient ? `${deletingPatient.firstName} ${deletingPatient.lastName}` : ''}
        description="Are you sure you want to delete this patient record? MRN: "
      />
    </div>
  );
};
