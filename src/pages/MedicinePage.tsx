import {
  AlertTriangle,
  DollarSign,
  Edit2,
  Filter,
  PackageX,
  Pill,
  Plus,
  Search,
  Thermometer,
  Trash2,
  X
} from 'lucide-react';
import { type FC, type FormEvent, useState } from 'react';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';
import { useData } from '../context/DataContext';
import { MedicineItem } from '../types';

export const MedicinePage: FC = () => {
  const { medicines, suppliers, manufacturers, addMedicine, updateMedicine, deleteMedicine } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicineItem | null>(null);
  const [deletingMed, setDeletingMed] = useState<MedicineItem | null>(null);

  // Form State
  const [ndcCode, setNdcCode] = useState('');
  const [drugName, setDrugName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('');
  const [form, setForm] = useState<MedicineItem['form']>('Tablet');
  const [schedule, setSchedule] = useState<MedicineItem['schedule']>('Rx Only');
  const [manufacturerName, setManufacturerName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [stockOnHand, setStockOnHand] = useState('100');
  const [minThreshold, setMinThreshold] = useState('20');
  const [unitCost, setUnitCost] = useState('0.50');
  const [retailPrice, setRetailPrice] = useState('1.50');
  const [storage, setStorage] = useState<MedicineItem['storage']>('Room Temp');
  const [expiryDate, setExpiryDate] = useState('2028-06-30');

  const openAddModal = () => {
    setEditingMed(null);
    setNdcCode('');
    setDrugName('');
    setGenericName('');
    setStrength('');
    setForm('Tablet');
    setSchedule('Rx Only');
    setManufacturerName(manufacturers[0]?.name || '');
    setSupplierName(suppliers[0]?.name || '');
    setStockOnHand('100');
    setMinThreshold('20');
    setUnitCost('0.50');
    setRetailPrice('1.50');
    setStorage('Room Temp');
    setExpiryDate('2028-06-30');
    setIsModalOpen(true);
  };

  const openEditModal = (med: MedicineItem) => {
    setEditingMed(med);
    setNdcCode(med.ndcCode);
    setDrugName(med.drugName);
    setGenericName(med.genericName);
    setStrength(med.strength);
    setForm(med.form);
    setSchedule(med.schedule);
    setManufacturerName(med.manufacturerName);
    setSupplierName(med.supplierName);
    setStockOnHand(med.stockOnHand.toString());
    setMinThreshold(med.minThreshold.toString());
    setUnitCost(med.unitCost.toString());
    setRetailPrice(med.retailPrice.toString());
    setStorage(med.storage);
    setExpiryDate(med.expiryDate);
    setIsModalOpen(true);
  };

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch =
      med.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.ndcCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSchedule = scheduleFilter === 'All' || med.schedule === scheduleFilter;
    const matchesStatus = statusFilter === 'All' || med.status === statusFilter;

    return matchesSearch && matchesSchedule && matchesStatus;
  });

  const handleAddMedicineSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!ndcCode || !drugName || !genericName) return;

    const stock = parseInt(stockOnHand, 10) || 0;
    const min = parseInt(minThreshold, 10) || 10;
    let computedStatus: MedicineItem['status'] = 'In Stock';
    if (stock === 0) {
      computedStatus = 'Out of Stock';
    } else if (stock <= min) {
      computedStatus = 'Low Stock';
    }

    if (editingMed) {
      updateMedicine(editingMed.id, {
        ndcCode,
        drugName,
        genericName,
        strength: strength || '10 mg',
        form,
        schedule,
        manufacturerName: manufacturerName || manufacturers[0]?.name || 'Generic Corp',
        supplierName: supplierName || suppliers[0]?.name || 'AmerisourceBergen',
        stockOnHand: stock,
        minThreshold: min,
        unitCost: parseFloat(unitCost) || 0.5,
        retailPrice: parseFloat(retailPrice) || 1.5,
        storage,
        expiryDate,
        status: computedStatus,
      });
    } else {
      addMedicine({
        ndcCode,
        drugName,
        genericName,
        strength: strength || '10 mg',
        form,
        schedule,
        manufacturerName: manufacturerName || manufacturers[0]?.name || 'Generic Corp',
        supplierName: supplierName || suppliers[0]?.name || 'AmerisourceBergen',
        stockOnHand: stock,
        minThreshold: min,
        unitCost: parseFloat(unitCost) || 0.5,
        retailPrice: parseFloat(retailPrice) || 1.5,
        storage,
        expiryDate,
        status: computedStatus,
      });
    }

    // Reset
    setNdcCode('');
    setDrugName('');
    setGenericName('');
    setStrength('');
    setEditingMed(null);
    setIsModalOpen(false);
  };

  const totalSKUs = medicines.length;
  const lowStockCount = medicines.filter(m => m.status === 'Low Stock').length;
  const outOfStockCount = medicines.filter(m => m.status === 'Out of Stock').length;
  const totalValue = medicines
    .reduce((sum, m) => sum + m.stockOnHand * m.unitCost, 0)
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-1">
            <span>Medicine</span>
            <span>/</span>
            <span>Catalog & Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Medicine Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage NDC codes, dosage strengths, controlled schedules, pricing tiers, and real-time inventory counts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add New Medicine
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Catalog SKUs</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalSKUs}</p>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Unique formulations</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Warning</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{lowStockCount}</p>
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Below min threshold</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <PackageX className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{outOfStockCount}</p>
          <span className="text-xs font-medium text-rose-600 dark:text-rose-400">Reorder required</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory Asset Value</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalValue}</p>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">At wholesale cost</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search drug, NDC, generic name..."
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
            value={scheduleFilter}
            onChange={e => setScheduleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Schedules</option>
            <option value="Rx Only">Rx Only</option>
            <option value="Schedule II">Schedule II</option>
            <option value="Schedule IV">Schedule IV</option>
            <option value="OTC">OTC</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Medicine Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">NDC Code & Drug Name</th>
                <th className="py-3.5 px-6">Generic & Schedule</th>
                <th className="py-3.5 px-6">Manufacturer</th>
                <th className="py-3.5 px-6">Stock Level</th>
                <th className="py-3.5 px-6">Unit Cost / Price</th>
                <th className="py-3.5 px-6">Storage & Expiry</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No medicine items match your search or filters.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map(med => (
                  <tr
                    key={med.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{med.drugName}</span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                              {med.strength}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            NDC: {med.ndcCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                        {med.genericName}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            med.schedule.includes('Schedule')
                              ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {med.schedule}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-xs font-medium">
                      {med.manufacturerName}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {med.stockOnHand}
                        </span>
                        <span className="text-xs text-slate-400">/ min {med.minThreshold}</span>
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            med.status === 'In Stock'
                              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                              : med.status === 'Low Stock'
                              ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {med.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs">
                      <div className="text-slate-800 dark:text-slate-200 font-semibold">
                        ${med.retailPrice.toFixed(2)} retail
                      </div>
                      <div className="text-slate-400 font-medium">
                        ${med.unitCost.toFixed(2)} cost
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                        <span>{med.storage}</span>
                      </div>
                      <div className="text-slate-400">Exp: {med.expiryDate}</div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(med)}
                          className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Edit Medicine"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingMed(med)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Delete Medicine"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add Medicine Modal */}
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
                  <Pill className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingMed ? 'Edit Medicine Item' : 'Add New Medicine Item'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicineSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    NDC Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="00093-3147-01"
                    value={ndcCode}
                    onChange={e => setNdcCode(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Drug Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atorvastatin"
                    value={drugName}
                    onChange={e => setDrugName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Brand / Generic Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lipitor"
                    value={genericName}
                    onChange={e => setGenericName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Strength
                  </label>
                  <input
                    type="text"
                    placeholder="20 mg"
                    value={strength}
                    onChange={e => setStrength(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Dosage Form
                  </label>
                  <select
                    value={form}
                    onChange={e => setForm(e.target.value as MedicineItem['form'])}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Liquid Injectable">Liquid Injectable</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Schedule Classification
                  </label>
                  <select
                    value={schedule}
                    onChange={e => setSchedule(e.target.value as MedicineItem['schedule'])}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Rx Only">Rx Only</option>
                    <option value="Schedule II">Schedule II</option>
                    <option value="Schedule IV">Schedule IV</option>
                    <option value="OTC">OTC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Stock On Hand
                  </label>
                  <input
                    type="number"
                    value={stockOnHand}
                    onChange={e => setStockOnHand(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Min Threshold
                  </label>
                  <input
                    type="number"
                    value={minThreshold}
                    onChange={e => setMinThreshold(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitCost}
                    onChange={e => setUnitCost(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={retailPrice}
                    onChange={e => setRetailPrice(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Storage Requirement
                  </label>
                  <select
                    value={storage}
                    onChange={e => setStorage(e.target.value as MedicineItem['storage'])}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Room Temp">Room Temp</option>
                    <option value="Refrigerated (2-8°C)">Refrigerated (2-8°C)</option>
                    <option value="Controlled Room">Controlled Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
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
                  {editingMed ? 'Save Changes' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Medicine Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingMed}
        onClose={() => setDeletingMed(null)}
        onConfirm={() => {
          if (deletingMed) {
            deleteMedicine(deletingMed.id);
          }
        }}
        title="Delete Medicine Item"
        itemName={deletingMed?.drugName}
        description="Are you sure you want to remove this medication from the inventory catalog? NDC code: "
      />
    </div>
  );
};
