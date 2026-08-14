

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Calendar, SlidersHorizontal, User, FileText, Clock, Check, Layers, Receipt } from 'lucide-react';
import { useData } from '../context/DataContext';
import { NepaliDatePicker } from '../components/common/NepaliDatePicker';
import { Pagination } from '../components/common/Pagination';
import { usePagination } from '../hooks/usePagination';

export const PatientPaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { patientBills, patients } = useData();

  // Filter States
  const [dateMode, setDateMode] = useState<'today' | 'all'>('all');
  const [selectedPatient, setSelectedPatient] = useState<string>('All');
  const [fromBsDate, setFromBsDate] = useState<string>('2083-04-17');
  const [toBsDate, setToBsDate] = useState<string>('2083-04-17');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [searchTerm] = useState<string>('');

  // Sync selected patient from URL search parameter
  useEffect(() => {
    const patientParam = searchParams.get('patient') || searchParams.get('patientId') || searchParams.get('q');
    if (patientParam) {
      const matched = patients.find(
        p =>
          p.id === patientParam ||
          (p.fullName && p.fullName.toLowerCase() === patientParam.toLowerCase()) ||
          `${p.firstName} ${p.lastName}`.toLowerCase() === patientParam.toLowerCase() ||
          p.firstName.toLowerCase() === patientParam.toLowerCase()
      );
      if (matched) {
        setSelectedPatient(matched.fullName || `${matched.firstName} ${matched.lastName}`);
      } else {
        setSelectedPatient(patientParam);
      }
    }
  }, [searchParams, patients]);

  // Filtered Bills logic
  const filteredBills = useMemo(() => {
    return patientBills.filter(b => {
      // Patient Filter
      const matchesPatient =
        selectedPatient === 'All' ||
        b.patientName.toLowerCase().includes(selectedPatient.toLowerCase()) ||
        selectedPatient.toLowerCase().includes(b.patientName.toLowerCase());

      // Source Filter
      const matchesSource =
        selectedSource === 'All' ||
        (b.source && b.source.toLowerCase() === selectedSource.toLowerCase());

      // Search Term Filter
      const matchesSearch =
        !searchTerm.trim() ||
        b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.billNo.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesPatient && matchesSource && matchesSearch;
    });
  }, [patientBills, selectedPatient, selectedSource, searchTerm]);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedBills,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(filteredBills, { initialItemsPerPage: 10 });

  // Aggregated KPIs
  const totalLifetimeReceived = useMemo(() => {
    return patientBills.reduce((acc, b) => acc + (b.paidAmount || 0), 0);
  }, [patientBills]);

  const totalOutstandingDue = useMemo(() => {
    return patientBills.reduce((acc, b) => acc + (b.dueAmount || 0), 0);
  }, [patientBills]);

  const medicineBillsTotal = useMemo(() => {
    return patientBills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  }, [patientBills]);

  return (
    <div className="space-y-5">
      {/* Main White Section Container */}
      <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Patient Payments
          </h1>

          {/* Date Filter Quick Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setDateMode('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                dateMode === 'today'
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-[#121f35] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>
            <button
              onClick={() => setDateMode('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                dateMode === 'all'
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-[#121f35] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>All Dates</span>
            </button>
          </div>
        </div>
        {/* KPI Cards Row Block */}
        <div className="bg-slate-50/70 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800/80">
            {/* Card 1: PREVIOUS DAY */}
            <div className="flex items-center gap-3.5 sm:pr-4 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  PREVIOUS DAY
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                  0.00
                </span>
              </div>
            </div>

            {/* Card 2: CURRENT PERIOD */}
            <div className="flex items-center gap-3.5 sm:px-4 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 dark:bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <span className="font-extrabold text-base">₹</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  CURRENT PERIOD
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                  0.00
                </span>
              </div>
            </div>

            {/* Card 3: LIFETIME RECEIVED */}
            <div className="flex items-center gap-3.5 sm:px-4 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  LIFETIME RECEIVED
                </span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {totalLifetimeReceived.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Card 4: OUTSTANDING DUE */}
            <div className="flex items-center gap-3.5 sm:pl-4 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  OUTSTANDING DUE
                </span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-500 font-mono">
                  {totalOutstandingDue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Metrics Info Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300 px-1">
          <div>
            Medicine bills:{' '}
            <span className="text-slate-900 dark:text-white font-mono font-bold">
              {medicineBillsTotal.toFixed(2)}
            </span>
          </div>
          <div>
            Doctor fees:{' '}
            <span className="text-slate-900 dark:text-white font-mono font-bold">0.00</span>
          </div>
          <div>
            Entries:{' '}
            <span className="text-slate-900 dark:text-white font-mono font-bold">
              {filteredBills.length}
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          {/* Patient Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </label>
            <select
              value={selectedPatient}
              onChange={e => {
                setSelectedPatient(e.target.value);
                if (e.target.value === 'All') {
                  setSearchParams({});
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="All">All patients</option>
              {patients.map(p => {
                const name = p.fullName || `${p.firstName} ${p.lastName}`;
                return (
                  <option key={p.id} value={name}>
                    {name} ({p.mrn})
                  </option>
                );
              })}
            </select>
          </div>

          {/* From BS Date */}
          <NepaliDatePicker
            label="From (BS)"
            value={fromBsDate}
            onChange={setFromBsDate}
          />

          {/* To BS Date */}
          <NepaliDatePicker
            label="To (BS)"
            value={toBsDate}
            onChange={setToBsDate}
          />

          {/* Source Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Source</span>
            </label>
            <select
              value={selectedSource}
              onChange={e => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="All">All</option>
              <option value="OPD">OPD Pharmacy</option>
              <option value="IPD">IPD</option>
              <option value="Emergency">Emergency</option>
              <option value="Lab">Laboratory</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#111d33] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-4">PATIENT</th>
                  <th className="py-3 px-4">SOURCE</th>
                  <th className="py-3 px-4">DATE & TIME</th>
                  <th className="py-3 px-4 text-right">TOTAL</th>
                  <th className="py-3 px-4 text-right">PAID</th>
                  <th className="py-3 px-4 text-right">DUE</th>
                  <th className="py-3 px-4">DETAILS</th>
                  <th className="py-3 px-4">RECORDED BY</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 font-medium bg-white dark:bg-[#0c1626]">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center text-slate-400">
                          <Receipt className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            No payments found
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Try another date range, All Dates, or clear back to today.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedBills.map((b, idx) => (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#121f36] transition-colors"
                    >
                      <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {b.patientName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
                          {b.source || 'OPD Pharmacy'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {b.billDate}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                        {b.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {b.paidAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-600 dark:text-amber-400 font-mono">
                        {b.dueAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
                        {b.medicines && b.medicines.length > 0 ? `${b.medicines.length} items` : '1 bill'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {b.billedBy || 'Admin'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate(`/patients/bill?billId=${b.id}`)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          title="View Bill Details"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
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
      </div>
    </div>
  );
};

