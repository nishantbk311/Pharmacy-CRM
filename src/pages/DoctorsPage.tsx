

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, SlidersHorizontal, Mail, Pencil, Trash2, Eye, User, IndianRupee } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Doctor } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';
import { Pagination } from '../components/common/Pagination';
import { usePagination } from '../hooks/usePagination';

interface DoctorsPageProps {
  doctorModalOpen?: boolean;
  setDoctorModalOpen?: (open: boolean) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  doctorModalOpen = false,
  setDoctorModalOpen,
}) => {
  const navigate = useNavigate();
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useData();

  // Internal modal states
  const [internalAddModalOpen, setInternalAddModalOpen] = useState(false);
  const isAddModalOpen = doctorModalOpen || internalAddModalOpen;

  const closeAddModal = () => {
    if (setDoctorModalOpen) setDoctorModalOpen(false);
    setInternalAddModalOpen(false);
  };

  const openAddModal = () => {
    if (setDoctorModalOpen) setDoctorModalOpen(true);
    setInternalAddModalOpen(true);
  };

  // Filter States
  const [fullNameInput, setFullNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  // Modals for actions
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [feeDoctor, setFeeDoctor] = useState<Doctor | null>(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState<string | null>(null);

  // Form State for Adding Doctor
  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    specialty: 'Brain Speciality',
    department: 'Urologist',
    experience: '10 yrs',
    consultationFee: '1000.00',
    clinicName: 'Medical Center',
    npiNumber: '1982736451',
    address: 'Kathmandu, Nepal',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active' as const,
  });

  // Form State for Editing Doctor
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    specialty: '',
    department: '',
    experience: '',
    consultationFee: '',
    clinicName: '',
    npiNumber: '',
    address: '',
    avatarUrl: '',
    status: 'Active' as const,
  });

  const handleClearFilter = () => {
    setFullNameInput('');
    setEmailInput('');
  };

  const hasFilter = Boolean(fullNameInput.trim() || emailInput.trim());

  const filteredDoctors = doctors.filter((doc) => {
    const docFullName = (
      doc.fullName ||
      `${doc.firstName || ''} ${doc.lastName || ''}`
    ).toLowerCase();

    if (
      fullNameInput.trim() &&
      !docFullName.includes(fullNameInput.trim().toLowerCase())
    ) {
      return false;
    }

    if (
      emailInput.trim() &&
      !doc.email.toLowerCase().includes(emailInput.trim().toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedDoctors,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(filteredDoctors, { initialItemsPerPage: 10 });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName =
      addForm.fullName.trim() ||
      `${addForm.firstName} ${addForm.lastName}`.trim() ||
      'Doctor';

    addDoctor({
      firstName: addForm.firstName || displayName,
      lastName: addForm.lastName || '',
      fullName: displayName,
      email: addForm.email || `${displayName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: addForm.phone || '9800000000',
      specialty: addForm.specialty || 'General Physician',
      department: addForm.department || 'OPD',
      experience: addForm.experience || '5 yrs',
      consultationFee: parseFloat(addForm.consultationFee) || 1000,
      clinicName: addForm.clinicName || 'General Clinic',
      npiNumber: addForm.npiNumber || '1000000000',
      fax: '000-000-0000',
      address: addForm.address || 'Kathmandu, Nepal',
      avatarUrl: addForm.avatarUrl,
      rating: 4.9,
      status: addForm.status,
    });

    closeAddModal();
    setAddForm({
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      phone: '',
      specialty: 'Brain Speciality',
      department: 'Urologist',
      experience: '10 yrs',
      consultationFee: '1000.00',
      clinicName: 'Medical Center',
      npiNumber: '1982736451',
      address: 'Kathmandu, Nepal',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
    });
  };

  const handleOpenEdit = (doc: Doctor) => {
    setEditDoctor(doc);
    setEditForm({
      firstName: doc.firstName || '',
      lastName: doc.lastName || '',
      fullName: doc.fullName || `${doc.firstName} ${doc.lastName}`.trim(),
      email: doc.email || '',
      phone: doc.phone || '',
      specialty: doc.specialty || '',
      department: doc.department || '',
      experience: doc.experience || '',
      consultationFee: doc.consultationFee ? String(doc.consultationFee) : '1000.00',
      clinicName: doc.clinicName || '',
      npiNumber: doc.npiNumber || '',
      address: doc.address || '',
      avatarUrl: doc.avatarUrl || '',
      status: (doc.status as any) || 'Active',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoctor) return;

    updateDoctor(editDoctor.id, {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      fullName: editForm.fullName,
      email: editForm.email,
      phone: editForm.phone,
      specialty: editForm.specialty,
      department: editForm.department,
      experience: editForm.experience,
      consultationFee: parseFloat(editForm.consultationFee) || 1000,
      clinicName: editForm.clinicName,
      npiNumber: editForm.npiNumber,
      address: editForm.address,
      avatarUrl: editForm.avatarUrl,
      status: editForm.status as any,
    });

    setEditDoctor(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteDoctorId) {
      deleteDoctor(deleteDoctorId);
      setDeleteDoctorId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Card Container */}
      <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Doctor List
          </h1>
        </div>

        {/* Filter Controls & Action Buttons Row (All in same line) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pt-1">
          {/* Inputs Group */}
          <div className="flex flex-wrap items-end gap-3 sm:gap-4 flex-1">
            {/* Full Name Filter */}
            <div className="w-full sm:w-60">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter Full Name"
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs h-[38px]"
              />
            </div>

            {/* Email Filter */}
            <div className="w-full sm:w-60">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email</span>
              </label>
              <input
                type="text"
                placeholder="Enter Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs h-[38px]"
              />
            </div>

            {/* Clear Filter button placed alongside inputs */}
            {hasFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#101b2d] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap h-[38px]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Clear Filter</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-end shrink-0">
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer whitespace-nowrap h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">S.N</th>
                <th className="py-3.5 px-4 font-semibold">FULL NAME</th>
                <th className="py-3.5 px-4 font-semibold">PROFILE</th>
                <th className="py-3.5 px-4 font-semibold">EMAIL</th>
                <th className="py-3.5 px-4 font-semibold">PHONE NO</th>
                <th className="py-3.5 px-4 font-semibold">SPECIALITY</th>
                <th className="py-3.5 px-4 font-semibold">DEPARTMENT</th>
                <th className="py-3.5 px-4 font-semibold">EXPERIENCE</th>
                <th className="py-3.5 px-4 font-semibold">CONSULTATION FEE</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200 font-medium">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-medium"
                  >
                    No doctor records found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedDoctors.map((doc, idx) => {
                  const feeValue = doc.consultationFee
                    ? Number(doc.consultationFee).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '1,000.00';

                  const nameDisplay =
                    doc.fullName ||
                    `${doc.firstName || ''} ${doc.lastName || ''}`.trim() ||
                    'doctor';

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-xs">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {nameDisplay}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0">
                          <img
                            src={
                              doc.avatarUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                            }
                            alt={nameDisplay}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">
                        {doc.email}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">
                        {doc.phone}
                      </td>

                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">
                        {doc.specialty || 'Brain Speciality'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {doc.department || 'Urologist'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {doc.experience || '22 yrs'}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {feeValue}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={doc.status === 'Active Prescriber' ? 'Active' : doc.status || 'Active'}
                          onChange={(e) =>
                            updateDoctor(doc.id, {
                              status: e.target.value as any,
                            })
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 cursor-pointer transition-colors border ${
                            doc.status === 'Inactive'
                              ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#13223f] dark:text-slate-300 dark:border-[#1e335b]'
                              : doc.status === 'Flagged'
                              ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-[#3d0f19] dark:text-[#f87171] dark:border-[#631828]'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200/80 dark:bg-[#073828] dark:text-[#38d39f] dark:border-[#0e5c42]'
                          }`}
                        >
                          <option value="Active" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">Active</option>
                          <option value="Inactive" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">Inactive</option>
                          <option value="Flagged" className="bg-white dark:bg-[#0d162e] text-slate-800 dark:text-slate-200">Flagged</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View button */}
                          <button
                            type="button"
                            onClick={() => setViewDoctor(doc)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="View Doctor Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Fees button */}
                          <button
                            type="button"
                            onClick={() => navigate(`/doctors/payments?doctorId=${doc.id}`)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                            title="View Doctor Payments & Fees"
                          >
                            <span>₹ Fees</span>
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(doc)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="Edit Doctor"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => setDeleteDoctorId(doc.id)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="Add New Doctor"
        subtitle="Enter doctor profile details, specialty, and consultation fee"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Robert Chen or doctor"
              value={addForm.fullName}
              onChange={(e) =>
                setAddForm({ ...addForm, fullName: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="doctor@gmail.com"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({ ...addForm, email: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="98073737373"
                value={addForm.phone}
                onChange={(e) =>
                  setAddForm({ ...addForm, phone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Speciality
              </label>
              <input
                type="text"
                placeholder="Brain Speciality"
                value={addForm.specialty}
                onChange={(e) =>
                  setAddForm({ ...addForm, specialty: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                placeholder="Urologist"
                value={addForm.department}
                onChange={(e) =>
                  setAddForm({ ...addForm, department: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Experience
              </label>
              <input
                type="text"
                placeholder="22 yrs"
                value={addForm.experience}
                onChange={(e) =>
                  setAddForm({ ...addForm, experience: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Fee (Rs / ₹)
              </label>
              <input
                type="number"
                placeholder="1000.00"
                value={addForm.consultationFee}
                onChange={(e) =>
                  setAddForm({ ...addForm, consultationFee: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Profile Photo URL
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={addForm.avatarUrl}
              onChange={(e) =>
                setAddForm({ ...addForm, avatarUrl: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-all shadow-md shadow-blue-500/20"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Doctor Modal */}
      {editDoctor && (
        <Modal
          isOpen={!!editDoctor}
          onClose={() => setEditDoctor(null)}
          title={`Edit Doctor - ${editDoctor.fullName || editDoctor.firstName}`}
          subtitle="Update profile details, contact information, and fees"
        >
          <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Speciality
                </label>
                <input
                  type="text"
                  value={editForm.specialty}
                  onChange={(e) =>
                    setEditForm({ ...editForm, specialty: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) =>
                    setEditForm({ ...editForm, department: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={editForm.experience}
                  onChange={(e) =>
                    setEditForm({ ...editForm, experience: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  value={editForm.consultationFee}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      consultationFee: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profile Image URL
              </label>
              <input
                type="text"
                value={editForm.avatarUrl}
                onChange={(e) =>
                  setEditForm({ ...editForm, avatarUrl: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditDoctor(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-all shadow-md shadow-blue-500/20"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Doctor Details Modal */}
      {viewDoctor && (
        <Modal
          isOpen={!!viewDoctor}
          onClose={() => setViewDoctor(null)}
          title={`Doctor Profile - ${viewDoctor.fullName || viewDoctor.firstName}`}
          subtitle={`Department: ${viewDoctor.department || 'Urologist'} | Experience: ${viewDoctor.experience || '22 yrs'}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30 shrink-0">
                <img
                  src={
                    viewDoctor.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt="Doctor avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {viewDoctor.fullName || `${viewDoctor.firstName} ${viewDoctor.lastName}`.trim()}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  {viewDoctor.specialty || 'Brain Speciality'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                  {viewDoctor.clinicName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Email
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                  {viewDoctor.email}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Phone
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                  {viewDoctor.phone}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Department
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {viewDoctor.department || 'Urologist'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Experience
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {viewDoctor.experience || '22 yrs'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Consultation Fee
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                  Rs.{' '}
                  {viewDoctor.consultationFee
                    ? Number(viewDoctor.consultationFee).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })
                    : '1,000.00'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Status
                </span>
                <span
                  className={`font-semibold ${
                    viewDoctor.status === 'Inactive'
                      ? 'text-slate-600 dark:text-slate-400'
                      : viewDoctor.status === 'Flagged'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {viewDoctor.status === 'Active Prescriber' ? 'Active' : viewDoctor.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDoctor(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Consultation Fee Details Modal */}
      {feeDoctor && (
        <Modal
          isOpen={!!feeDoctor}
          onClose={() => setFeeDoctor(null)}
          title={`Consultation Fee - ${feeDoctor.fullName || feeDoctor.firstName}`}
          subtitle={`Department: ${feeDoctor.department || 'Urologist'}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-wider block">
                  Standard Consultation Fee
                </span>
                <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 block">
                  Rs.{' '}
                  {feeDoctor.consultationFee
                    ? Number(feeDoctor.consultationFee).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })
                    : '1,000.00'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <p className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                <span>Follow-up Fee (within 7 days):</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  Rs. 500.00
                </span>
              </p>
              <p className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                <span>Emergency Consultation:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  Rs. 1,500.00
                </span>
              </p>
              <p className="flex justify-between py-1">
                <span>Payment Methods Accepted:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Cash, eSewa, Khalti, Card
                </span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setFeeDoctor(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteDoctorId}
        onClose={() => setDeleteDoctorId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor Record"
        description="Are you sure you want to delete this doctor from the directory? This action cannot be undone."
        confirmText="Delete Doctor"
      />
    </div>
  );
};
