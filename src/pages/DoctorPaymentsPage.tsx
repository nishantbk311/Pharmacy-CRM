import { CheckCircle2, Clock, HandCoins, Landmark, SlidersHorizontal, Trash2, UserCheck, Wallet, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';
import { NepaliDatePicker } from '../components/common/NepaliDatePicker';
import { useData } from '../context/DataContext';
import { DoctorPayment } from '../types';

export const DoctorPaymentsPage: React.FC = () => {
  const { doctors, doctorPayments, addDoctorPayment, deleteDoctorPayment } = useData();
  const [searchParams] = useSearchParams();
  const doctorParam = searchParams.get('doctorId') || searchParams.get('doctor');

  // Filter States
  const [selectedDoctor, setSelectedDoctor] = useState<string>(() => doctorParam || 'All');
  const [fromBsDate, setFromBsDate] = useState<string>('');
  const [toBsDate, setToBsDate] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTodayFilterActive, setIsTodayFilterActive] = useState<boolean>(false);

  // Sync url param if navigated with doctorId
  useEffect(() => {
    if (doctorParam) {
      setSelectedDoctor(doctorParam);
      setModalDoctorId(doctorParam);
    }
  }, [doctorParam]);

  // Modal State for Collect Fee
  const [isCollectModalOpen, setIsCollectModalOpen] = useState<boolean>(false);
  const [modalDoctorId, setModalDoctorId] = useState<string>(() => doctorParam || (doctors.length > 0 ? doctors[0].id : ''));
  const [modalAmount, setModalAmount] = useState<string>('0');
  const [modalType, setModalType] = useState<string>('Fee Collection');
  const [modalDateBs, setModalDateBs] = useState<string>('2083-04-17');
  const [modalDetails, setModalDetails] = useState<string>('');
  const [modalRecordedBy, setModalRecordedBy] = useState<string>('Admin');

  // Delete confirmation state
  const [deleteTx, setDeleteTx] = useState<DoctorPayment | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTx) {
      deleteDoctorPayment(deleteTx.id);
      setDeleteTx(null);
    }
  };

  // Active filters calculation
  const filteredTransactions = useMemo(() => {
    return doctorPayments.filter(tx => {
      // Doctor filter
      let matchesDoctor = true;
      if (selectedDoctor && selectedDoctor !== 'All') {
        const docObj = doctors.find(d => d.id === selectedDoctor);
        const selName = docObj ? (docObj.fullName || `Dr. ${docObj.firstName} ${docObj.lastName}`) : selectedDoctor;
        const txDocNameLower = tx.doctorName.toLowerCase();
        const selLower = selName.toLowerCase();
        const idLower = selectedDoctor.toLowerCase();

        matchesDoctor =
          tx.doctorId === selectedDoctor ||
          txDocNameLower.includes(selLower) ||
          selLower.includes(txDocNameLower) ||
          txDocNameLower.includes(idLower);
      }

      // Type filter
      let matchesType = true;
      if (selectedType && selectedType !== 'All') {
        matchesType = tx.type.toLowerCase() === selectedType.toLowerCase();
      }

      // Date BS filter
      let matchesDate = true;
      if (isTodayFilterActive) {
        matchesDate = tx.dateBS === '2083-04-17';
      } else if (fromBsDate && toBsDate) {
        matchesDate = tx.dateBS >= fromBsDate && tx.dateBS <= toBsDate;
      } else if (fromBsDate) {
        matchesDate = tx.dateBS >= fromBsDate;
      } else if (toBsDate) {
        matchesDate = tx.dateBS <= toBsDate;
      }

      // Search term filter
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          tx.doctorName.toLowerCase().includes(q) ||
          tx.type.toLowerCase().includes(q) ||
          tx.details.toLowerCase().includes(q) ||
          tx.recordedBy.toLowerCase().includes(q);
      }

      return matchesDoctor && matchesType && matchesDate && matchesSearch;
    });
  }, [doctorPayments, selectedDoctor, selectedType, fromBsDate, toBsDate, searchQuery, isTodayFilterActive]);

  // Aggregated KPI Stats
  const previousDayAmount = useMemo(() => {
    return doctorPayments
      .filter(tx => tx.dateBS === '2083-04-16')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [doctorPayments]);

  const periodReceivedAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  const lifetimeReceivedAmount = useMemo(() => {
    return doctorPayments.reduce((sum, tx) => sum + tx.amount, 0);
  }, [doctorPayments]);

  const availableToCollectAmount = useMemo(() => {
    // Calculated uncollected balance or fee buffer
    return 0;
  }, []);

  const handleOpenCollectModal = () => {
    if (selectedDoctor && selectedDoctor !== 'All') {
      setModalDoctorId(selectedDoctor);
    } else if (doctors.length > 0) {
      setModalDoctorId(doctors[0].id);
    }
    setIsCollectModalOpen(true);
  };

  const handleSaveCollectFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAmount || parseFloat(modalAmount) <= 0) return;

    const matchedDoc = doctors.find(d => d.id === modalDoctorId);
    const doctorName = matchedDoc ? (matchedDoc.fullName || `${matchedDoc.firstName} ${matchedDoc.lastName}`) : 'Dr. Doctor';

    addDoctorPayment({
      doctorId: modalDoctorId || 'doc-1',
      doctorName: doctorName,
      type: modalType,
      dateBS: modalDateBs || '2083-04-17',
      dateAD: new Date().toISOString().split('T')[0],
      amount: parseFloat(modalAmount),
      details: modalDetails || 'Doctor fee collected',
      recordedBy: modalRecordedBy || 'Admin',
    });

    setIsCollectModalOpen(false);
  };

  const handleResetSearch = () => {
    setIsTodayFilterActive(false);
    setFromBsDate('');
    setToBsDate('');
    setSelectedDoctor('All');
    setSelectedType('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Outer Card Container */}
      <div className="bg-white dark:bg-[#0b1322] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 space-y-6 shadow-xs dark:shadow-xl">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Doctor Payments
          </h1>
        </div>

        {/* Top KPI Metrics Banner */}
        <div className="bg-slate-50/70 dark:bg-[#0f1b2e] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Previous Day */}
            <div className="bg-white dark:bg-[#132238] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  PREVIOUS DAY
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {previousDayAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* KPI 2: Period Received */}
            <div className="bg-white dark:bg-[#132238] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  PERIOD RECEIVED
                </p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {periodReceivedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* KPI 3: Lifetime Received */}
            <div className="bg-white dark:bg-[#132238] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  LIFETIME RECEIVED
                </p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {lifetimeReceivedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* KPI 4: Available to Collect */}
            <div className="bg-white dark:bg-[#132238] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  AVAILABLE TO COLLECT
                </p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {availableToCollectAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Sub-summary text outside KPI container */}
        <div className="px-1 text-xs font-medium text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-6 gap-y-1">
          <span>
            Fees received: <strong className="text-slate-900 dark:text-slate-200">0.00</strong>
          </span>
          <span>
            Fees collected: <strong className="text-slate-900 dark:text-slate-200">0.00</strong>
          </span>
          <span>
            Lifetime collected: <strong className="text-slate-900 dark:text-slate-200">{lifetimeReceivedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </span>
          <span>
            Entries: <strong className="text-slate-900 dark:text-slate-200">{filteredTransactions.length}</strong>
          </span>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-3 pt-1">
          {/* Left Inputs Group */}
          <div className="flex flex-wrap items-end gap-2.5 flex-1">
            
            {/* Doctor Select */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                className="bg-white dark:bg-[#121f35] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px] shadow-xs"
              >
                <option value="All">All Doctors</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.fullName || `Dr. ${doc.firstName} ${doc.lastName}`}
                  </option>
                ))}
              </select>
            </div>

            {/* From (BS) Date Input */}
            <NepaliDatePicker
              label="From (BS)"
              value={fromBsDate}
              onChange={val => {
                setFromBsDate(val);
                setIsTodayFilterActive(false);
              }}
              className="min-w-[130px]"
              inputClassName="h-[34px]"
            />

            {/* To (BS) Date Input */}
            <NepaliDatePicker
              label="To (BS)"
              value={toBsDate}
              onChange={val => {
                setToBsDate(val);
                setIsTodayFilterActive(false);
              }}
              className="min-w-[130px]"
              inputClassName="h-[34px]"
            />

            {/* Type Select */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Type
              </label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="bg-white dark:bg-[#121f35] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px] shadow-xs"
              >
                <option value="All">All</option>
                <option value="Consultation Fee">Consultation Fee</option>
                <option value="Fee Collection">Fee Collection</option>
                <option value="Payout">Payout</option>
                <option value="Adjustment">Adjustment</option>
              </select>
            </div>

          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 self-end lg:self-end shrink-0 mt-2 lg:mt-0">
            {/* Today Filter Button */}
            <button
              type="button"
              onClick={() => {
                if (isTodayFilterActive) {
                  setIsTodayFilterActive(false);
                  setFromBsDate('');
                  setToBsDate('');
                } else {
                  setIsTodayFilterActive(true);
                  setFromBsDate('2083-04-17');
                  setToBsDate('2083-04-17');
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer h-[34px] ${
                isTodayFilterActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-[#121f35] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-current" />
              <span>Today</span>
            </button>

            {/* Collect Fee Primary Button */}
            <button
              type="button"
              onClick={handleOpenCollectModal}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer h-[34px]"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Collect Fee</span>
            </button>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="border border-slate-200 dark:border-slate-800/90 rounded-xl overflow-hidden bg-white dark:bg-[#0a1220]">
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#101b2d] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-4 py-3.5 w-12 text-center">#</th>
                    <th className="px-4 py-3.5">Doctor</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5 text-right">Amount</th>
                    <th className="px-4 py-3.5">Details</th>
                    <th className="px-4 py-3.5">Recorded By</th>
                    <th className="px-4 py-3.5 text-center w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {filteredTransactions.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#122036]/60 transition-colors"
                    >
                      <td className="px-4 py-3 text-center font-medium text-slate-500 dark:text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {tx.doctorName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {tx.dateBS} BS
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        Rs. {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {tx.details}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {tx.recordedBy}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setDeleteTx(tx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State Container */
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#122036] border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Wallet className="w-7 h-7 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  No doctor transactions found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try another date range, or clear filters back to today.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetSearch}
                className="mt-2 px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f1b2d] border border-slate-200 dark:border-slate-700/60 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800/80">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Collect Doctor Fee
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                  Pay out available consultation fees as cash
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCollectModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCollectFee}>
              <div className="p-6 space-y-5">
                {/* Row 1: Doctor & Available Balance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Doctor <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={modalDoctorId}
                      onChange={e => setModalDoctorId(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-[#132238] border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none cursor-pointer h-[40px] shadow-xs"
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.fullName || `Dr. ${d.firstName} ${d.lastName}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Available Balance
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="0"
                      className="w-full bg-slate-100 dark:bg-[#132238] border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-300 focus:outline-none cursor-not-allowed h-[40px]"
                    />
                  </div>
                </div>

                {/* Row 2: Collect Amount & Remark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Collect Amount <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={modalAmount}
                      onChange={e => setModalAmount(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-[#132238] border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none h-[40px] shadow-xs placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Remark
                    </label>
                    <input
                      type="text"
                      value={modalDetails}
                      onChange={e => setModalDetails(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#132238] border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none h-[40px] shadow-xs placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder="Optional note"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer with right-aligned Collect Fee and Cancel buttons */}
              <div className="bg-slate-50 dark:bg-[#0b1322] px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800/80">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
                >
                  <HandCoins className="w-4 h-4 text-white dark:text-slate-800" />
                  <span>Collect Fee</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTx}
        onClose={() => setDeleteTx(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor Payment"
        itemName={deleteTx ? `${deleteTx.doctorName} - ${deleteTx.type} (Rs. ${deleteTx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })})` : undefined}
        description="Are you sure you want to delete this doctor payment transaction record? This action cannot be undone."
        confirmText="Delete Payment"
      />
    </div>
  );
};
