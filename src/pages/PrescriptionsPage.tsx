import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Pill,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  FileText,
  DollarSign,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Prescription, RxStatus } from '../types';
import { Badge } from '../components/common/Badge';

export const PrescriptionsPage: React.FC = () => {
  const { prescriptions, updatePrescriptionStatus, processRefill } = useData();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesSearch =
      rx.rxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Rx#, patient name, drug name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-semibold overflow-x-auto">
          {[
            'all',
            'Requires Review',
            'Processing',
            'Ready for Pickup',
            'Out of Stock',
            'Filled',
          ].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st === 'all' ? 'All Prescriptions' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Prescription Dispensing Queue */}
      <div className="space-y-4">
        {filteredPrescriptions.map(rx => (
          <div
            key={rx.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                  {rx.rxNumber}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {rx.drugName} ({rx.strength})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient: <strong className="text-slate-800">{rx.patientName}</strong> &bull; DOB: {rx.patientDob}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    rx.status === 'Ready for Pickup'
                      ? 'emerald'
                      : rx.status === 'Requires Review'
                      ? 'amber'
                      : rx.status === 'Out of Stock'
                      ? 'rose'
                      : 'indigo'
                  }
                  size="md"
                  dot
                >
                  {rx.status}
                </Badge>

                <Badge
                  variant={
                    rx.insuranceStatus === 'Approved'
                      ? 'emerald'
                      : rx.insuranceStatus === 'Pending Prior Auth'
                      ? 'amber'
                      : 'rose'
                  }
                  size="sm"
                >
                  {rx.insuranceStatus}
                </Badge>
              </div>
            </div>

            {/* Interaction Flags Callout */}
            {rx.interactionFlags && rx.interactionFlags.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Clinical Safety Flag: {rx.interactionFlags[0].drugName}</span>
                </div>
                <p className="text-rose-700">{rx.interactionFlags[0].description}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              <div>
                <span className="text-slate-400 block font-medium">Directions (Sig)</span>
                <span className="font-bold text-slate-900">{rx.directions}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Qty / Refills</span>
                <span className="font-bold text-slate-900">
                  Qty: {rx.quantity} &bull; {rx.refillsRemaining} Refills Left
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Prescriber</span>
                <span className="font-bold text-slate-900">{rx.doctorName}</span>
              </div>
                <div>
                <span className="text-slate-400 block font-medium">Estimated Copay</span>
                <span className="font-bold text-emerald-700">${rx.copayAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Change Status:</span>
                <select
                  value={rx.status}
                  onChange={e => updatePrescriptionStatus(rx.id, e.target.value as RxStatus)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-800 text-xs"
                >
                  <option value="Processing">Processing</option>
                  <option value="Requires Review">Requires Review</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Filled">Filled</option>
                </select>
              </div>

              <button
                onClick={() => processRefill(rx.rxNumber)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Process & Dispense Refill</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
