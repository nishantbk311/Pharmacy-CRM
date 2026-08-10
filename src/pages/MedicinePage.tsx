

import React, { useState } from 'react';
import { Package, Search, X, SlidersHorizontal, Plus, ChevronsUpDown, Eye, History as HistoryIcon, Edit2, Trash2, Pill } from 'lucide-react';
import { useData } from '../context/DataContext';
import { MedicineItem } from '../types';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

export const MedicinePage: React.FC = () => {
  const { medicines, suppliers, manufacturers, addMedicine, updateMedicine, deleteMedicine, stockTransactions } = useData();

  // Filter State
  const [filterName, setFilterName] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingMed, setViewingMed] = useState<MedicineItem | null>(null);
  const [historyMed, setHistoryMed] = useState<MedicineItem | null>(null);
  const [editingMed, setEditingMed] = useState<MedicineItem | null>(null);
  const [deletingMed, setDeletingMed] = useState<MedicineItem | null>(null);

  // Form State
  const [ndcCode, setNdcCode] = useState('');
  const [drugName, setDrugName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [strength, setStrength] = useState('');
  const [batchNo, setBatchNo] = useState('Ws23');
  const [unitCost, setUnitCost] = useState('12.00');
  const [retailPrice, setRetailPrice] = useState('33.00');
  const [stockOnHand, setStockOnHand] = useState('1000');
  const [minThreshold, setMinThreshold] = useState('100');
  const [shelf, setShelf] = useState('5');
  const [rack, setRack] = useState('b-10');
  const [manufacturerName, setManufacturerName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [storage, setStorage] = useState<MedicineItem['storage']>('Room Temp');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');

  const openAddModal = () => {
    setEditingMed(null);
    setNdcCode('00093-1100-01');
    setDrugName('');
    setGenericName('');
    setDosageForm('Tablet');
    setStrength('500MG');
    setBatchNo('Ws23');
    setUnitCost('12.00');
    setRetailPrice('33.00');
    setStockOnHand('1000');
    setMinThreshold('100');
    setShelf('5');
    setRack('b-10');
    setManufacturerName(manufacturers[0]?.name || 'Nepal Pharmacy Pvt Ltd');
    setSupplierName(suppliers[0]?.name || 'AmerisourceBergen Corp');
    setStorage('Room Temp');
    setExpiryDate('2028-12-31');
    setIsModalOpen(true);
  };

  const openEditModal = (med: MedicineItem) => {
    setEditingMed(med);
    setNdcCode(med.ndcCode);
    setDrugName(med.drugName);
    setGenericName(med.genericName);
    setDosageForm(med.dosageForm || med.form);
    setStrength(med.strength);
    setBatchNo(med.batchNo || 'Ws23');
    setUnitCost(med.unitCost.toString());
    setRetailPrice(med.retailPrice.toString());
    setStockOnHand(med.stockOnHand.toString());
    setMinThreshold(med.minThreshold.toString());
    setShelf(med.shelf || '5');
    setRack(med.rack || 'b-10');
    setManufacturerName(med.manufacturerName);
    setSupplierName(med.supplierName);
    setStorage(med.storage);
    setExpiryDate(med.expiryDate);
    setIsModalOpen(true);
  };

  const handleClearFilter = () => {
    setFilterName('');
  };

  const hasFilter = Boolean(filterName.trim().length > 0);

  // Filtered Medicines List
  const filteredMedicines = medicines.filter(med => {
    const query = filterName.trim().toLowerCase();
    if (!query) return true;
    return (
      med.drugName.toLowerCase().includes(query) ||
      med.genericName.toLowerCase().includes(query) ||
      (med.batchNo || '').toLowerCase().includes(query) ||
      med.ndcCode.toLowerCase().includes(query)
    );
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName) return;

    const stock = parseInt(stockOnHand, 10) || 0;
    const min = parseInt(minThreshold, 10) || 10;
    let computedStatus: MedicineItem['status'] = 'In Stock';
    if (stock === 0) {
      computedStatus = 'Out of Stock';
    } else if (stock <= min) {
      computedStatus = 'Low Stock';
    }

    const payload: Omit<MedicineItem, 'id'> = {
      ndcCode: ndcCode || '00093-1100-01',
      drugName,
      genericName: genericName || 'INN',
      strength: strength || '500MG',
      form: (dosageForm as MedicineItem['form']) || 'Tablet',
      dosageForm: dosageForm || 'Tablet',
      schedule: 'OTC',
      manufacturerName: manufacturerName || manufacturers[0]?.name || 'Nepal Pharmacy Pvt Ltd',
      supplierName: supplierName || suppliers[0]?.name || 'AmerisourceBergen Corp',
      batchNo: batchNo || 'Ws23',
      stockOnHand: stock,
      minThreshold: min,
      unitCost: parseFloat(unitCost) || 12.00,
      retailPrice: parseFloat(retailPrice) || 33.00,
      shelf: shelf || '5',
      rack: rack || 'b-10',
      storage,
      expiryDate,
      status: computedStatus,
    };

    if (editingMed) {
      updateMedicine(editingMed.id, payload);
    } else {
      addMedicine(payload);
    }

    setIsModalOpen(false);
    setEditingMed(null);
  };

  return (
    <div className="space-y-6">
      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
        
        {/* Page Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Medicine
          </h1>
        </div>

        {/* Filter Input & Action Buttons Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>Medicine Name</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative w-72 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, generic, or batch..."
                  value={filterName}
                  onChange={e => setFilterName(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
                {filterName && (
                  <button
                    type="button"
                    onClick={handleClearFilter}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {hasFilter && (
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#101b2d] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap h-[34px]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Clear Filter</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shadow-blue-500/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Medicine</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#081120] border-b border-slate-200/90 dark:border-slate-800/90 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">S.N</th>
                  <th className="py-3 px-4">MEDICINE NAME</th>
                  <th className="py-3 px-4">GENERIC NAME</th>
                  <th className="py-3 px-4">DOSAGE FORM</th>
                  <th className="py-3 px-4">STRENGTH</th>
                  <th className="py-3 px-4">BATCH NO.</th>
                  <th className="py-3 px-4">PURCHASE</th>
                  <th className="py-3 px-4">SELLING</th>
                  <th className="py-3 px-4">STOCK</th>
                  <th className="py-3 px-4">ALERT</th>
                  <th className="py-3 px-4">SHELF</th>
                  <th className="py-3 px-4">RACK</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 bg-white dark:bg-[#0c1626]">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                      No medicine records found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((med, index) => (
                    <tr
                      key={med.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* S.N */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {index + 1}
                      </td>

                      {/* MEDICINE NAME */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                        {med.drugName}
                      </td>

                      {/* GENERIC NAME */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {med.genericName}
                      </td>

                      {/* DOSAGE FORM */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {med.dosageForm || med.form}
                      </td>

                      {/* STRENGTH */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {med.strength}
                      </td>

                      {/* BATCH NO. */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {med.batchNo || 'Ws23'}
                      </td>

                      {/* PURCHASE */}
                      <td className="py-3.5 px-4">
                        <div className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-bold w-20 text-center shadow-2xs">
                          {med.unitCost.toFixed(2)}
                        </div>
                      </td>

                      {/* SELLING */}
                      <td className="py-3.5 px-4">
                        <div className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-bold w-24 flex items-center justify-between shadow-2xs">
                          <span className="flex-1 text-center">{med.retailPrice.toFixed(2)}</span>
                          <div className="flex flex-col text-slate-400">
                            <ChevronsUpDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </td>

                      {/* STOCK */}
                      <td className="py-3.5 px-4">
                        <div className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-bold w-20 text-center shadow-2xs">
                          {med.stockOnHand}
                        </div>
                      </td>

                      {/* ALERT */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {med.minThreshold}
                      </td>

                      {/* SHELF */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {med.shelf || '5'}
                      </td>

                      {/* RACK */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {med.rack || 'b-10'}
                      </td>

                      {/* ACTION */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => setViewingMed(med)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#101b2d] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* History / Stock Log Button */}
                          <button
                            onClick={() => setHistoryMed(med)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#101b2d] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                            title="Stock & Batch History"
                          >
                            <HistoryIcon className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(med)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#101b2d] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                            title="Edit Medicine"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeletingMed(med)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#101b2d] text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* Add / Edit Medicine Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-2xl max-w-2xl w-full space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
                  <Pill className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {editingMed ? 'Edit Medicine' : 'Add Medicine'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Medicine Name *
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
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Generic Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INN"
                    value={genericName}
                    onChange={e => setGenericName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Dosage Form
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 or Tablet"
                    value={dosageForm}
                    onChange={e => setDosageForm(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Strength
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500MG"
                    value={strength}
                    onChange={e => setStrength(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Batch No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ws23"
                    value={batchNo}
                    onChange={e => setBatchNo(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="12.00"
                    value={unitCost}
                    onChange={e => setUnitCost(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="33.00"
                    value={retailPrice}
                    onChange={e => setRetailPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Stock On Hand
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={stockOnHand}
                    onChange={e => setStockOnHand(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Alert Threshold
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={minThreshold}
                    onChange={e => setMinThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Shelf
                  </label>
                  <input
                    type="text"
                    placeholder="5"
                    value={shelf}
                    onChange={e => setShelf(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Rack
                  </label>
                  <input
                    type="text"
                    placeholder="b-10"
                    value={rack}
                    onChange={e => setRack(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#081120] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200"
                  />
                </div>
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
                  {editingMed ? 'Save Changes' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Medicine Details Modal */}
      {viewingMed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingMed(null);
          }}
        >
          <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                    {viewingMed.drugName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generic: {viewingMed.genericName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingMed(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Dosage Form</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingMed.dosageForm || viewingMed.form}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Strength</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingMed.strength}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Batch No.</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingMed.batchNo || 'Ws23'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Stock / Alert</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingMed.stockOnHand} (Alert: {viewingMed.minThreshold})</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Purchase Price</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">${viewingMed.unitCost.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Selling Price</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">${viewingMed.retailPrice.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Shelf</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingMed.shelf || '5'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Rack</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingMed.rack || 'b-10'}</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingMed(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#101b2d] text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock History Modal */}
      {historyMed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setHistoryMed(null);
          }}
        >
          <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-2xl max-w-xl w-full space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
                  <HistoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                    Stock History: {historyMed.drugName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Batch No: {historyMed.batchNo || 'Ws23'} • Current Stock: {historyMed.stockOnHand}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryMed(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto text-xs pr-1">
              {stockTransactions.filter(t => t.drugName.toLowerCase().includes(historyMed.drugName.toLowerCase())).length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#081120] text-center text-slate-400">
                  No stock activity logs recorded for this batch yet.
                </div>
              ) : (
                stockTransactions
                  .filter(t => t.drugName.toLowerCase().includes(historyMed.drugName.toLowerCase()))
                  .map(stk => (
                    <div key={stk.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081120] border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{stk.type}</div>
                        <div className="text-[11px] text-slate-400">{stk.timestamp} • By {stk.performedBy}</div>
                      </div>
                      <div className="text-right font-bold text-slate-900 dark:text-white">
                        <span className={stk.quantity >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                          {stk.quantity >= 0 ? `+${stk.quantity}` : stk.quantity}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setHistoryMed(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#101b2d] text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
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
        description="Are you sure you want to remove this medication from the inventory catalog?"
      />
    </div>
  );
};
