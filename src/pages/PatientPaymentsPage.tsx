import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Plus,
    Search
} from 'lucide-react';
import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export const PatientPaymentsPage: FC = () => {
  const navigate = useNavigate();
  const { patientBills } = useData();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredBills = patientBills.filter(
    b =>
      b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.billNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollected = patientBills.reduce((acc, b) => acc + b.paidAmount, 0);
  const totalOutstanding = patientBills.reduce((acc, b) => acc + b.dueAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 dark:hover:text-sky-400">
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button onClick={() => navigate('/patients')} className="hover:text-blue-600 dark:hover:text-sky-400">
              Patients
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Patient Payments</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Patient Payments & Transactions
          </h1>
        </div>

        <button
          onClick={() => navigate('/patients/bill/create')}
          className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Collect New Payment
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue Collected</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">${totalCollected.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified transactions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Dues</p>
          <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">${totalOutstanding.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Pending patient balances
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transactions</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{patientBills.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">Billed invoices count</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payments by patient name or bill number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Bill No</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Billed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredBills.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-bold text-blue-600 dark:text-sky-400">{b.billNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{b.patientName}</td>
                    <td className="py-3 px-4">{b.billDate}</td>
                    <td className="py-3 px-4 text-right font-bold">${b.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">${b.paidAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-rose-600 dark:text-rose-400 font-bold">${b.dueAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">{b.billedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
