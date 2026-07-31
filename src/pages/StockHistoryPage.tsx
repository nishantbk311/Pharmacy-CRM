import {
    AlertOctagon,
    ArrowDownLeft,
    ArrowUpRight,
    Clock,
    Edit2,
    Filter,
    History,
    Plus,
    RotateCcw,
    Search,
    ShieldCheck,
    X
} from 'lucide-react';
import { type FC, type FormEvent, useState } from 'react';
import { useData } from '../context/DataContext';
import { StockTransaction } from '../types';

export const StockHistoryPage: FC = () => {
  const { stockTransactions, medicines, addStockTransaction, updateStockTransaction } = useData();

const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<StockTransaction | null>(null);

  // Form State
  const [drugName, setDrugName] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [type, setType] = useState<StockTransaction['type']>('Inbound Restock');
  const [quantity, setQuantity] = useState('100');
  const [performedBy, setPerformedBy] = useState('Dr. Sarah Jenkins, PharmD');
  const [referenceNo, setReferenceNo] = useState('PO-99210');

  const openAddModal = () => {
    setEditingTx(null);
    setDrugName('');
    setBatchNo('');
    setType('Inbound Restock');
    setQuantity('100');
    setPerformedBy('Dr. Sarah Jenkins, PharmD');
    setReferenceNo('PO-99210');
    setIsModalOpen(true);
  };

  const openEditModal = (tx: StockTransaction) => {
    setEditingTx(tx);
    setDrugName(tx.drugName);
    setBatchNo(tx.batchNo);
    setType(tx.type);
    setQuantity(Math.abs(tx.quantity).toString());
    setPerformedBy(tx.performedBy);
    setReferenceNo(tx.referenceNo);
    setIsModalOpen(true);
  };

  const filteredTransactions = stockTransactions.filter(tx => {
    const matchesSearch =
      tx.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.transactionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.performedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'All' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || tx.verificationStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleLogStockSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!drugName || !batchNo) return;

    const qty = parseInt(quantity, 10) || 0;
    const signedQty = type === 'Inbound Restock' || type === 'Customer Return' ? Math.abs(qty) : -Math.abs(qty);

    if (editingTx) {
      updateStockTransaction(editingTx.id, {
        drugName,
        batchNo,
        type,
        quantity: signedQty,
        newStock: editingTx.previousStock + signedQty,
        performedBy,
        referenceNo,
      });
    } else {
      addStockTransaction({
        drugName,
        batchNo,
        type,
        quantity: signedQty,
        previousStock: 450,
        newStock: 450 + signedQty,
        performedBy,
        referenceNo,
        verificationStatus: 'Verified',
      });
    }

    setDrugName('');
    setBatchNo('');
    setEditingTx(null);
    setIsModalOpen(false);
  };

  const totalLogs = stockTransactions.length;
  const inboundCount = stockTransactions.filter(t => t.type === 'Inbound Restock').length;
  const dispensedCount = stockTransactions.filter(t => t.type === 'Prescription Dispensed').length;
  const wasteCount = stockTransactions.filter(t => t.type === 'Expired Waste').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-1">
            <span>Medicine</span>
            <span>/</span>
            <span>Stock History & Audit</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Inventory Movement & Stock History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable audit trial of inbound supplier receipts, prescription dispensations, waste write-offs, and batch lot tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Log Stock Adjustment
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Audit Records</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
              <History className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalLogs}</p>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Complete audit trail</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Inbound Restocks</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{inboundCount}</p>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Supplier deliveries</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Prescriptions Dispensed</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{dispensedCount}</p>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Patient fills</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Waste & Expired Logs</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{wasteCount}</p>
          <span className="text-xs font-medium text-rose-600 dark:text-rose-400">Damage/expiry disposals</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transaction #, batch lot, drug..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Filter className="w-4 h-4" />
            <span>Filters:</span>
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Movement Types</option>
            <option value="Inbound Restock">Inbound Restock</option>
            <option value="Prescription Dispensed">Prescription Dispensed</option>
            <option value="Expired Waste">Expired Waste</option>
            <option value="Customer Return">Customer Return</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Audit Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Audit">Pending Audit</option>
          </select>
        </div>
      </div>

      {/* Stock Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Transaction # & Time</th>
                <th className="py-3.5 px-6">Drug Name & Batch Lot</th>
                <th className="py-3.5 px-6">Movement Type</th>
                <th className="py-3.5 px-6">Qty Change</th>
                <th className="py-3.5 px-6">Stock Delta</th>
                <th className="py-3.5 px-6">Performed By / Ref</th>
                <th className="py-3.5 px-6 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No stock transaction records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                        {tx.transactionNo}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{tx.timestamp}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">
                        {tx.drugName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Batch: {tx.batchNo}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          tx.type === 'Inbound Restock'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : tx.type === 'Prescription Dispensed'
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 border border-blue-500/20'
                            : tx.type === 'Customer Return'
                            ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type === 'Inbound Restock' && <ArrowDownLeft className="w-3.5 h-3.5" />}
                        {tx.type === 'Prescription Dispensed' && <ArrowUpRight className="w-3.5 h-3.5" />}
                        {tx.type === 'Customer Return' && <RotateCcw className="w-3.5 h-3.5" />}
                        {tx.type === 'Expired Waste' && <AlertOctagon className="w-3.5 h-3.5" />}
                        {tx.type}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`font-mono font-extrabold text-sm ${
                          tx.quantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity} units
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {tx.previousStock} → <span className="font-bold">{tx.newStock}</span>
                    </td>

                    <td className="py-4 px-6 text-xs">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {tx.performedBy}
                      </div>
                      <div className="text-slate-400 font-mono mt-0.5">Ref: {tx.referenceNo}</div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            tx.verificationStatus === 'Verified'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {tx.verificationStatus}
                        </span>
                        <button
                          onClick={() => openEditModal(tx)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Stock Adjustment Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingTx ? 'Edit Stock Record' : 'Log Stock Movement'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogStockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Drug Formulation *
                </label>
                <select
                  value={drugName}
                  onChange={e => setDrugName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white"
                >
                  <option value="">-- Select Drug --</option>
                  {medicines.map(m => (
                    <option key={m.id} value={`${m.drugName} ${m.strength}`}>
                      {m.drugName} ({m.strength}) - {m.ndcCode}
                    </option>
                  ))}
                  <option value="Atorvastatin Calcium 20mg">Atorvastatin Calcium 20mg</option>
                  <option value="Metformin HCl ER 500mg">Metformin HCl ER 500mg</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Movement Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as StockTransaction['type'])}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Inbound Restock">Inbound Restock (+)</option>
                    <option value="Prescription Dispensed">Prescription Dispensed (-)</option>
                    <option value="Expired Waste">Expired Waste (-)</option>
                    <option value="Customer Return">Customer Return (+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Batch Lot # *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="LOT-99210A"
                    value={batchNo}
                    onChange={e => setBatchNo(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Quantity Units
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Reference Order / Rx #
                  </label>
                  <input
                    type="text"
                    placeholder="PO-99210 or RX-774901"
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Logged By (Pharmacist / Tech)
                </label>
                <input
                  type="text"
                  value={performedBy}
                  onChange={e => setPerformedBy(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {editingTx ? 'Save Changes' : 'Log Movement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
