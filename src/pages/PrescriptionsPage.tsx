

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Search,
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
  Stethoscope,
  Pill,
  Calendar,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Prescription, RxStatus } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';
import { Pagination } from '../components/common/Pagination';
import { usePagination } from '../hooks/usePagination';

export const PrescriptionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    const p = searchParams.get('patient') || searchParams.get('q');
    if (p) {
      setSearchQuery(p);
      setAppliedSearch(p);
    }
  }, [searchParams]);

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

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedPrescriptions,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(filteredPrescriptions, { initialItemsPerPage: 10 });

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
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* Main Table Container with Integrated Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {/* Top Control Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 space-y-3.5">
          {/* Top Row: Search input, Patient select, Doctor select, & New Prescription button */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search medicine, patient, doctor, Rx#..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 transition-all"
                />
              </div>

              {/* Patient Select */}
              <div className="relative min-w-[140px]">
                <select
                  value={selectedPatient}
                  onChange={e => setSelectedPatient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Patients</option>
                  {Array.from(
                    new Set([
                      ...prescriptions.map(p => p.patientName).filter(Boolean),
                      ...patients.map(p => `${p.firstName} ${p.lastName}`),
                    ])
                  ).map(name => (
                    <option key={name} value={name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-left">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Select */}
              <div className="relative min-w-[140px]">
                <select
                  value={selectedDoctor}
                  onChange={e => setSelectedDoctor(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Doctors</option>
                  {Array.from(
                    new Set([
                      ...prescriptions.map(d => d.doctorName).filter(Boolean),
                      ...doctors.map(d => `Dr. ${d.firstName} ${d.lastName}`),
                    ])
                  ).map(name => (
                    <option key={name} value={name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-left">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            {/* Primary Action Button */}
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Prescription</span>
            </button>
          </div>

          {/* Bottom Row: Status Tabs Bar & Clear Filters Button */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Prescriptions
              </button>

              <button
                onClick={() => setActiveTab('Confirmed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'Confirmed'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Confirmed</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    activeTab === 'Confirmed'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {countConfirmed}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('Completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'Completed'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Completed</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    activeTab === 'Completed'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {countCompleted}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('Cancelled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'Cancelled'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Cancelled</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    activeTab === 'Cancelled'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {countCancelled}
                </span>
              </button>
            </div>

            {/* Clear Filters Button placed beside the status tabs */}
            {isFilterApplied && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200/80 dark:border-rose-900/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[980px]">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">PATIENT</th>
                <th className="py-3 px-4">PRESCRIBER</th>
                <th className="py-3 px-4">MEDICINE & DOSAGE</th>
                <th className="py-3 px-4">FREQUENCY</th>
                <th className="py-3 px-4">ROUTE</th>
                <th className="py-3 px-4">DURATION</th>
                <th className="py-3 px-4">DATE RANGE</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-200">
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                      <p className="text-sm font-semibold">No prescriptions match criteria</p>
                      <p className="text-xs text-slate-500">
                        Try clearing active filters or searching for another query.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPrescriptions.map((rx, idx) => {
                  const isCompleted =
                    rx.status === 'Completed' || rx.status === 'Filled';
                  const isCancelled =
                    rx.status === 'Cancelled' || rx.status === 'Out of Stock';

                  return (
                    <tr
                      key={rx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* S.N */}
                      <td className="py-3.5 px-4 text-center text-slate-400 dark:text-slate-500 text-[11px] font-semibold whitespace-nowrap">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>

                      {/* PATIENT */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {rx.patientName}
                      </td>

                      {/* DOCTOR */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rx.doctorName}</span>
                        </div>
                      </td>

                      {/* MEDICINE & DOSAGE */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {rx.drugName}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700/60">
                            {rx.dosage || rx.strength || '500mg'}
                          </span>
                        </div>
                      </td>

                      {/* FREQUENCY */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {rx.frequency || rx.directions || '2 times daily'}
                      </td>

                      {/* ROUTE */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px]">
                          {rx.route || 'Oral'}
                        </span>
                      </td>

                      {/* DURATION */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {rx.duration || '7 days'}
                      </td>

                      {/* DATE RANGE */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{rx.startDate || rx.prescribedDate}</span>
                          <span className="text-slate-300 dark:text-slate-600">&rarr;</span>
                          <span>{rx.endDate || rx.fillDueDate || '2026-08-11'}</span>
                        </div>
                      </td>

                      {/* STATUS BADGE / DROPDOWN */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
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
                          className={`px-3 py-1 rounded-xl font-bold text-[11px] border cursor-pointer focus:outline-hidden transition-all shadow-2xs text-center ${
                            isCompleted
                              ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                              : isCancelled
                              ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <option value="Confirmed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-normal text-left">Confirmed</option>
                          <option value="Completed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-normal text-left">Completed</option>
                          <option value="Cancelled" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-normal text-left">Cancelled</option>
                        </select>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(rx)}
                            title="Edit Prescription"
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingRx(rx)}
                            title="Delete Prescription"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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

      {/* Modal for Adding or Editing Prescriptions */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRx ? 'Edit Prescription' : 'New Prescription'}
          subtitle={editingRx ? `Rx#: ${editingRx.rxNumber}` : 'Issue a new clinical drug prescription'}
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
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Prescribing Physician <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.doctorName}
                  onChange={e =>
                    setFormData({ ...formData, doctorName: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => {
                    const docName = `Dr. ${doc.firstName} ${doc.lastName}`;
                    return (
                      <option key={doc.id} value={docName} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-left">
                        {docName} ({doc.specialty})
                      </option>
                    );
                  })}
                </select>
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
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                  Dosage / Strength <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.dosage}
                  onChange={e =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  placeholder="e.g. 500mg"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
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
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
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
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
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
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
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
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
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
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                Fulfillment Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value as RxStatus })
                }
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="Confirmed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Confirmed</option>
                <option value="Completed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Completed</option>
                <option value="Cancelled" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Cancelled</option>
              </select>
            </div>

            {/* Form Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
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

