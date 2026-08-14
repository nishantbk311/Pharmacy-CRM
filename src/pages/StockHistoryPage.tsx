

import React, { useState } from 'react';
import { SlidersHorizontal, Pill, Tag, X, History } from 'lucide-react';
import { useData } from '../context/DataContext';
import { StockTransaction } from '../types';
import { NepaliDatePicker } from '../components/common/NepaliDatePicker';
import { Pagination } from '../components/common/Pagination';
import { usePagination } from '../hooks/usePagination';

export const StockHistoryPage: React.FC = () => {
  const { stockTransactions, medicines, addStockTransaction } = useData();

  // Filter States
  const [selectedMedicine, setSelectedMedicine] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for logging stock
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drugName, setDrugName] = useState('');
  const [batchNo] = useState('Ws23');
  const [type, setType] = useState<StockTransaction['type']>('Purchase / Restock');
  const [quantity, setQuantity] = useState('1000');
  const [performedBy, setPerformedBy] = useState('Super Admin');
  const [remark, setRemark] = useState('Manual stock update');

  const handleClearFilter = () => {
    setSelectedMedicine('All');
    setSelectedType('All');
    setFromDate('');
    setToDate('');
    setSearchQuery('');
  };

  const hasFilter = Boolean(
    selectedMedicine !== 'All' ||
    selectedType !== 'All' ||
    fromDate ||
    toDate ||
    searchQuery
  );

  const filteredTransactions = stockTransactions.filter(tx => {
    if (selectedMedicine !== 'All' && !tx.drugName.toLowerCase().includes(selectedMedicine.toLowerCase())) {
      return false;
    }

    if (selectedType !== 'All' && tx.type !== selectedType) {
      return false;
    }

    if (fromDate && tx.timestamp) {
      const txDate = tx.timestamp.split(' ')[0];
      if (txDate < fromDate) return false;
    }

    if (toDate && tx.timestamp) {
      const txDate = tx.timestamp.split(' ')[0];
      if (txDate > toDate) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        tx.drugName.toLowerCase().includes(q) ||
        tx.type.toLowerCase().includes(q) ||
        tx.performedBy.toLowerCase().includes(q) ||
        (tx.remark || '').toLowerCase().includes(q) ||
        (tx.patientName || '').toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedTransactions,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(filteredTransactions, { initialItemsPerPage: 10 });

  const handleLogStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName) return;

    const qty = parseInt(quantity, 10) || 0;
    const signedQty = type.includes('Purchase') || type.includes('Restock') || type.includes('Return') ? Math.abs(qty) : -Math.abs(qty);

    addStockTransaction({
      drugName,
      batchNo: batchNo || 'Ws23',
      type,
      quantity: signedQty,
      previousStock: 0,
      newStock: Math.abs(signedQty),
      balance: Math.abs(signedQty),
      patientName: '—',
      performedBy: performedBy || 'Super Admin',
      referenceNo: `STK-${Date.now().toString().slice(-6)}`,
      remark: remark || 'Initial stock entry',
      verificationStatus: 'Verified',
      bsDate: '2083-04-17 BS',
    });

    setIsModalOpen(false);
    setDrugName('');
  };

  return (
    <div className="space-y-6">
      {/* Main Card Container */}
      <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
        
        {/* Top Header Row: Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Stock History
          </h1>
        </div>

        {/* Filter Bar Row */}
        <div className="flex flex-wrap items-end gap-3.5">
          {/* Medicine Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" />
              <span>Medicine</span>
            </label>
            <select
              value={selectedMedicine}
              onChange={e => setSelectedMedicine(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs w-44 sm:w-48 cursor-pointer"
            >
              <option value="All">All medicines</option>
              {medicines.map(m => (
                <option key={m.id} value={m.drugName}>
                  {m.drugName}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Type</span>
            </label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs w-44 sm:w-48 cursor-pointer"
            >
              <option value="All">All types</option>
              <option value="Purchase / Restock">Purchase / Restock</option>
              <option value="Dispensations / Sales">Dispensations / Sales</option>
              <option value="Customer Return">Customer Return</option>
              <option value="Expired / Waste">Expired / Waste</option>
            </select>
          </div>

          {/* From (BS) Filter */}
          <NepaliDatePicker
            label="From (BS)"
            value={fromDate}
            onChange={setFromDate}
            placeholder="Select BS date"
            className="w-44 sm:w-52"
          />

          {/* To (BS) Filter */}
          <NepaliDatePicker
            label="To (BS)"
            value={toDate}
            onChange={setToDate}
            placeholder="Select BS date"
            className="w-44 sm:w-52"
          />

          {/* Clear Filter Button */}
          {hasFilter && (
            <div>
              <button
                type="button"
                onClick={handleClearFilter}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#101b2d] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap h-[34px]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Clear Filter</span>
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#081120] border-b border-slate-200/90 dark:border-slate-800/90 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">WHEN</th>
                  <th className="py-3.5 px-4">MEDICINE</th>
                  <th className="py-3.5 px-4">TYPE</th>
                  <th className="py-3.5 px-4">QTY</th>
                  <th className="py-3.5 px-4">BALANCE</th>
                  <th className="py-3.5 px-4">PATIENT</th>
                  <th className="py-3.5 px-4">BY</th>
                  <th className="py-3.5 px-4">REMARK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 bg-white dark:bg-[#0c1626]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                      No stock history records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* WHEN */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {tx.bsDate || '2083-04-17 BS'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {tx.timestamp}
                        </div>
                      </td>

                      {/* MEDICINE */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {tx.drugName}
                      </td>

                      {/* TYPE */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {tx.type}
                      </td>

                      {/* QTY */}
                      <td className="py-3.5 px-4 font-bold">
                        <span className={tx.quantity >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}>
                          {tx.quantity >= 0 ? `+${tx.quantity}` : tx.quantity}
                        </span>
                      </td>

                      {/* BALANCE */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {tx.balance ?? tx.newStock}
                      </td>

                      {/* PATIENT */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {tx.patientName || '—'}
                      </td>

                      {/* BY */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {tx.performedBy}
                      </td>

                      {/* REMARK */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {tx.remark || tx.referenceNo || 'Initial stock on medicine create'}
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

      {/* Log Stock Movement Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Log Stock Movement
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogStockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Medicine *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. paracetamol"
                  value={drugName}
                  onChange={e => setDrugName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Movement Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as StockTransaction['type'])}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  >
                    <option value="Purchase / Restock">Purchase / Restock</option>
                    <option value="Dispensations / Sales">Dispensations / Sales</option>
                    <option value="Customer Return">Customer Return</option>
                    <option value="Expired / Waste">Expired / Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Performed By
                </label>
                <input
                  type="text"
                  value={performedBy}
                  onChange={e => setPerformedBy(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Remark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Initial stock on medicine create"
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs shadow-blue-500/20 cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
