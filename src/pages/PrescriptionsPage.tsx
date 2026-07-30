import React, { useState } from 'react';
import {
  Search,
  Plus,
  SlidersHorizontal,
  User,
  Stethoscope,
  ArrowRight,
  Pencil,
  Trash2,
  X,
  Check,
  Ban,
  FileText,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Prescription, RxStatus } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

export const PrescriptionsPage: React.FC = () => {
  const {
    prescriptions,
    patients,
    doctors,
    addPrescription,
    updatePrescription,
    deletePrescription,
    updatePrescriptionStatus,
  } = useData();

  // Tab Filter ('all', 'Pending Review', 'Confirmed', 'Completed', 'Cancelled')
  const [activeTab, setActiveTab] = useState<string>('all');

  // Toolbar dropdown filters & search query
  const [selectedPatient, setSelectedPatient] = useState<string>('All');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRx, setEditingRx] = useState<Prescription | null>(null);

  // Modal State for Delete Confirmation
  const [deletingRx, setDeletingRx] = useState<Prescription | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    drugName: '',
    dosage: '',
    frequency: '',
    route: 'Oral',
    duration: '7 days',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'Confirmed' as RxStatus,
  });

  // Calculate badge counts
  const countPending = prescriptions.filter(
    rx => rx.status === 'Pending Review' || rx.status === 'Requires Review'
  ).length;
  const countConfirmed = prescriptions.filter(
    rx => rx.status === 'Confirmed' || rx.status === 'Ready for Pickup' || rx.status === 'Processing'
  ).length;
  const countCompleted = prescriptions.filter(
    rx => rx.status === 'Completed' || rx.status === 'Filled'
  ).length;
  const countCancelled = prescriptions.filter(
    rx => rx.status === 'Cancelled' || rx.status === 'Out of Stock'
  ).length;

  const isFilterApplied =
    selectedPatient !== 'All' ||
    selectedDoctor !== 'All' ||
    activeTab !== 'all' ||
    searchQuery !== '' ||
    appliedSearch !== '';

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedSearch(searchQuery);
  };

  const handleClearFilter = () => {
    setSelectedPatient('All');
    setSelectedDoctor('All');
    setSearchQuery('');
    setAppliedSearch('');
    setActiveTab('all');
  };

  // Filtered prescriptions
  const filteredPrescriptions = prescriptions.filter(rx => {
    // Tab status filter
    if (activeTab === 'Pending Review') {
      if (rx.status !== 'Pending Review' && rx.status !== 'Requires Review') return false;
    } else if (activeTab === 'Confirmed') {
      if (rx.status !== 'Confirmed' && rx.status !== 'Ready for Pickup' && rx.status !== 'Processing') return false;
    } else if (activeTab === 'Completed') {
      if (rx.status !== 'Completed' && rx.status !== 'Filled') return false;
    } else if (activeTab === 'Cancelled') {
      if (rx.status !== 'Cancelled' && rx.status !== 'Out of Stock') return false;
    }

    // Patient filter dropdown
    if (selectedPatient !== 'All' && rx.patientName.toLowerCase() !== selectedPatient.toLowerCase()) {
      return false;
    }

    // Doctor filter dropdown
    if (selectedDoctor !== 'All' && rx.doctorName.toLowerCase() !== selectedDoctor.toLowerCase()) {
      return false;
    }

    // Search query filter
    const searchVal = (searchQuery || appliedSearch).trim().toLowerCase();
    if (searchVal !== '') {
      const matches =
        rx.patientName.toLowerCase().includes(searchVal) ||
        rx.doctorName.toLowerCase().includes(searchVal) ||
        rx.drugName.toLowerCase().includes(searchVal) ||
        rx.rxNumber.toLowerCase().includes(searchVal) ||
        (rx.dosage && rx.dosage.toLowerCase().includes(searchVal));
      if (!matches) return false;
    }

    return true;
  });

  const handleOpenAddModal = () => {
    setEditingRx(null);
    setFormData({
      patientName: 'Krishna BK',
      doctorName: 'Dr. Ajay Yadav',
      drugName: 'Paracetamol',
      dosage: '500mg',
      frequency: '2 times daily',
      route: 'Oral',
      duration: '7 days',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Confirmed',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rx: Prescription) => {
    setEditingRx(rx);
    setFormData({
      patientName: rx.patientName || '',
      doctorName: rx.doctorName || '',
      drugName: rx.drugName || '',
      dosage: rx.dosage || rx.strength || '',
      frequency: rx.frequency || rx.directions || '',
      route: rx.route || 'Oral',
      duration: rx.duration || '7 days',
      startDate: rx.startDate || rx.prescribedDate || new Date().toISOString().split('T')[0],
      endDate: rx.endDate || rx.fillDueDate || new Date().toISOString().split('T')[0],
      status: rx.status,
    });
    setIsModalOpen(true);
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRx) {
      updatePrescription(editingRx.id, {
        patientName: formData.patientName,
        doctorName: formData.doctorName,
        drugName: formData.drugName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        route: formData.route,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      });
    } else {
      addPrescription({
        patientId: 'p-custom',
        patientName: formData.patientName,
        doctorName: formData.doctorName,
        drugName: formData.drugName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        route: formData.route,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      {/* Prescription Workflow Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Prescription workflow
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Doctor submits &rarr; Pharmacy checks stock &rarr; Confirm or cancel
          </p>
        </div>

        {/* 3 Workflow Step Cards */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Step 1 */}
          <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-[#1e293b]/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Doctor writes</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Prescription starts as Pending Review
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-400 dark:text-slate-600 shrink-0 px-1">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 2 */}
          <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-[#1e293b]/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Admin reviews</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Check if medicines are available
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-400 dark:text-slate-600 shrink-0 px-1">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 3 */}
          <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-[#1e293b]/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Confirm or Cancel</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Confirm if in stock &middot; Cancel if unavailable
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-[#1e293b]/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveTab('Confirmed')}
          className={`px-3.5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'Confirmed'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-[#1e293b]/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>Confirmed</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold">
            {countConfirmed}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Completed')}
          className={`px-3.5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'Completed'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-[#1e293b]/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>Completed</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold">
            {countCompleted}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Cancelled')}
          className={`px-3.5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'Cancelled'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-[#1e293b]/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>Cancelled</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold">
            {countCancelled}
          </span>
        </button>
      </div>

      {/* Main Table Container with Integrated Filter Toolbar */}
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs dark:shadow-2xl transition-colors">
        {/* Toolbar Bar */}
        <div className="p-4 bg-slate-50 dark:bg-[#0f172a]/90 border-b border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Dropdowns & Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-end gap-3 flex-1">
            {/* Search Input */}
            <div className="flex flex-col flex-1 min-w-[180px] sm:min-w-[220px]">
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Search className="w-3 h-3" />
                Search Prescriptions
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search medicine, patient, doctor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700/80 rounded-xl pl-9 pr-3 h-[34px] text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-400 transition-colors"
                />
              </div>
            </div>

            {/* Patient Select */}
            <div className="flex flex-col min-w-[130px]">
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" />
                Patient
              </label>
              <select
                value={selectedPatient}
                onChange={e => setSelectedPatient(e.target.value)}
                className="bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 h-[34px] text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Patients</option>
                {Array.from(
                  new Set([
                    ...prescriptions.map(p => p.patientName).filter(Boolean),
                    ...patients.map(p => `${p.firstName} ${p.lastName}`),
                  ])
                ).map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Select */}
            <div className="flex flex-col min-w-[130px]">
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Stethoscope className="w-3 h-3" />
                Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                className="bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 h-[34px] text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Doctors</option>
                {Array.from(
                  new Set([
                    ...prescriptions.map(d => d.doctorName).filter(Boolean),
                    ...doctors.map(d => `Dr. ${d.firstName} ${d.lastName}`),
                  ])
                ).map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-end">
            {isFilterApplied && (
              <button
                onClick={handleClearFilter}
                className="px-3.5 h-[34px] rounded-xl bg-white dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Clear Filter</span>
              </button>
            )}

            <button
              onClick={handleOpenAddModal}
              className="px-4 h-[34px] rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prescription</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-[#0c1328] text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                <th className="py-3.5 px-4">S.N</th>
                <th className="py-3.5 px-4">PATIENT</th>
                <th className="py-3.5 px-4">DOCTOR</th>
                <th className="py-3.5 px-4">MEDICINE NAME</th>
                <th className="py-3.5 px-4">DOSAGE</th>
                <th className="py-3.5 px-4">FREQUENCY</th>
                <th className="py-3.5 px-4">ROUTE</th>
                <th className="py-3.5 px-4">DURATION</th>
                <th className="py-3.5 px-4">START DATE</th>
                <th className="py-3.5 px-4">END DATE</th>
                <th className="py-3.5 px-4 text-center">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-200">
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                      <p className="text-sm font-semibold">No prescriptions found</p>
                      <p className="text-xs text-slate-500">
                        Try adjusting your search criteria or clearing filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((rx, idx) => {
                  const isPending =
                    rx.status === 'Pending Review' || rx.status === 'Requires Review';
                  const isConfirmed =
                    rx.status === 'Confirmed' ||
                    rx.status === 'Ready for Pickup' ||
                    rx.status === 'Processing';
                  const isCompleted =
                    rx.status === 'Completed' || rx.status === 'Filled';
                  const isCancelled =
                    rx.status === 'Cancelled' || rx.status === 'Out of Stock';

                  return (
                    <tr
                      key={rx.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* S.N */}
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{idx + 1}</td>

                      {/* PATIENT */}
                      <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {rx.patientName}
                      </td>

                      {/* DOCTOR */}
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {rx.doctorName}
                      </td>

                      {/* MEDICINE NAME */}
                      <td className="py-4 px-4 text-slate-800 dark:text-slate-200 font-semibold whitespace-nowrap">
                        {rx.drugName}
                      </td>

                      {/* DOSAGE */}
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {rx.dosage || rx.strength || '500mg'}
                      </td>

                      {/* FREQUENCY */}
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {rx.frequency || rx.directions || '2 times'}
                      </td>

                      {/* ROUTE */}
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {rx.route || 'Oral / 32'}
                      </td>

                      {/* DURATION */}
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {rx.duration || '7 days'}
                      </td>

                      {/* START DATE */}
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {rx.startDate || rx.prescribedDate}
                      </td>

                      {/* END DATE */}
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {rx.endDate || rx.fillDueDate || '2026-08-11'}
                      </td>

                      {/* STATUS BADGE / DROPDOWN */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <select
                          value={
                            isCompleted
                              ? 'Completed'
                              : isCancelled
                              ? 'Cancelled'
                              : 'Confirmed'
                          }
                          onChange={e => {
                            const newStatus = e.target.value as 'Confirmed' | 'Completed' | 'Cancelled';
                            updatePrescriptionStatus(rx.id, newStatus);
                          }}
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] border cursor-pointer focus:outline-none transition-colors shadow-2xs w-auto min-w-[88px] max-w-[105px] text-center ${
                            isCompleted
                              ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700/60'
                              : isCancelled
                              ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60'
                              : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60'
                          }`}
                        >
                          <option value="Confirmed" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">Confirmed</option>
                          <option value="Completed" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">Completed</option>
                          <option value="Cancelled" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">Cancelled</option>
                        </select>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">

                          <button
                            onClick={() => handleOpenEditModal(rx)}
                            title="Edit Prescription"
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingRx(rx)}
                            title="Delete Prescription"
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding or Editing Prescriptions */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRx ? 'Edit Prescription' : 'Add New Prescription'}
          subtitle={editingRx ? `Rx#: ${editingRx.rxNumber}` : 'Create a new medical prescription record'}
          icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          maxWidth="2xl"
        >
          <form onSubmit={handleSavePrescription} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Patient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={e =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                  placeholder="Patient Full Name"
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Doctor Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.doctorName}
                  onChange={e =>
                    setFormData({ ...formData, doctorName: e.target.value })
                  }
                  placeholder="Prescribing Doctor"
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Medicine Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.drugName}
                  onChange={e =>
                    setFormData({ ...formData, drugName: e.target.value })
                  }
                  placeholder="e.g. Paracetamol"
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Dosage <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.dosage}
                  onChange={e =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  placeholder="e.g. 500mg"
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Frequency <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.frequency}
                  onChange={e =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  placeholder="e.g. 2 times daily"
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Route <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.route}
                  onChange={e =>
                    setFormData({ ...formData, route: e.target.value })
                  }
                  placeholder="e.g. Oral"
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Duration <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={e =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g. 7 days"
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={e =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={e =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value as RxStatus })
                }
                className="w-full bg-slate-50 dark:bg-[#182238] border border-slate-200 dark:border-[#283552] text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Form Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md shadow-blue-500/20 transition-colors"
              >
                {editingRx ? 'Update Prescription' : 'Save Prescription'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deletingRx !== null}
        onClose={() => setDeletingRx(null)}
        onConfirm={() => {
          if (deletingRx) {
            deletePrescription(deletingRx.id);
            setDeletingRx(null);
          }
        }}
        title="Delete Prescription"
        itemName={deletingRx ? `Rx #${deletingRx.rxNumber} (${deletingRx.patientName})` : ''}
        description="Are you sure you want to delete this prescription? This action cannot be undone."
      />
    </div>
  );
};
