

import React, { useState } from 'react';
import { Factory, Phone, Mail, SlidersHorizontal, Plus, Eye, Edit2, Trash2, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Manufacturer } from '../types';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

export const ManufacturerPage: React.FC = () => {
  const { manufacturers, addManufacturer, updateManufacturer, deleteManufacturer } = useData();

  // Filter States
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterEmail, setFilterEmail] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingManufacturer, setViewingManufacturer] = useState<Manufacturer | null>(null);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [deletingManufacturer, setDeletingManufacturer] = useState<Manufacturer | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAddModal = () => {
    setEditingManufacturer(null);
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setLicenseNumber('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (mfg: Manufacturer) => {
    setEditingManufacturer(mfg);
    setName(mfg.name);
    setContactPerson(mfg.contactPerson || '');
    setPhone(mfg.contactPhone || '');
    setEmail(mfg.contactEmail || '');
    setLicenseNumber(mfg.licenseNumber || mfg.fdaRegistrationNo || 'Nplis123456s');
    setStatus(mfg.status === 'Inactive' ? 'Inactive' : 'Active');
    setIsModalOpen(true);
  };

  const handleClearFilter = () => {
    setFilterName('');
    setFilterPhone('');
    setFilterEmail('');
  };

  const hasFilter = Boolean(filterName.trim() || filterPhone.trim() || filterEmail.trim());

  // Filtered Manufacturers List
  const filteredManufacturers = manufacturers.filter(mfg => {
    const nameMatch = mfg.name.toLowerCase().includes(filterName.toLowerCase());
    const phoneMatch = (mfg.contactPhone || '').toLowerCase().includes(filterPhone.toLowerCase());
    const emailMatch = (mfg.contactEmail || '').toLowerCase().includes(filterEmail.toLowerCase());

    return nameMatch && phoneMatch && emailMatch;
  });

  const handleToggleStatus = (mfg: Manufacturer) => {
    const newStatus = mfg.status === 'Active' ? 'Inactive' : 'Active';
    updateManufacturer(mfg.id, { status: newStatus });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingManufacturer) {
      updateManufacturer(editingManufacturer.id, {
        name,
        contactPerson,
        contactPhone: phone,
        contactEmail: email,
        licenseNumber,
        fdaRegistrationNo: licenseNumber,
        status,
      });
    } else {
      addManufacturer({
        name,
        contactPerson,
        contactPhone: phone,
        contactEmail: email,
        licenseNumber,
        fdaRegistrationNo: licenseNumber || 'FDA-REG-100',
        country: 'Nepal',
        qualityStatus: 'FDA Approved',
        activeDrugLines: 10,
        status,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Main Card Container */}
      <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manufacturer
          </h1>
        </div>

        {/* Filter Inputs & Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          {/* Manufacturer Name Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5" />
              <span>Manufacturer Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter Manufacturer Name"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </label>
            <input
              type="text"
              placeholder="Enter Phone"
              value={filterPhone}
              onChange={e => setFilterPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              value={filterEmail}
              onChange={e => setFilterEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#081120] text-slate-900 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Action Buttons in same line */}
          <div className="flex items-center gap-2">
            {hasFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#101b2d] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={openAddModal}
              className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shadow-blue-500/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Manufacturer</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/90 dark:border-slate-800/90 bg-slate-50 dark:bg-[#0a1322] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-12 text-center">S.N</th>
                  <th className="py-3 px-4">MANUFACTURER NAME</th>
                  <th className="py-3 px-4">CONTACT PERSON</th>
                  <th className="py-3 px-4">PHONE</th>
                  <th className="py-3 px-4">EMAIL</th>
                  <th className="py-3 px-4">LICENSE NUMBER</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-[#0c1626]">
                {filteredManufacturers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No manufacturers found.
                    </td>
                  </tr>
                ) : (
                  filteredManufacturers.map((mfg, idx) => {
                    const isActive = mfg.status === 'Active';

                    return (
                      <tr
                        key={mfg.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-center font-bold text-slate-500 dark:text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          {mfg.name}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {mfg.contactPerson || 'bibek'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-mono">
                          {mfg.contactPhone || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-mono">
                          {mfg.contactEmail || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                          {mfg.licenseNumber || mfg.fdaRegistrationNo || 'Nplis123456s'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {/* Green Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(mfg)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                              isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={isActive ? 'Deactivate Manufacturer' : 'Activate Manufacturer'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setViewingManufacturer(mfg)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="View Manufacturer Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(mfg)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Edit Manufacturer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingManufacturer(mfg)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Delete Manufacturer"
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
      </div>

      {/* Add / Edit Manufacturer Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={e => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
                  <Factory className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingManufacturer ? 'Edit Manufacturer' : 'Add Manufacturer'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Manufacturer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nepal Pharmacy Pvt Ltd"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. bibek"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9829010709"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. bhwrs@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nplis123456s"
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden text-slate-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs shadow-blue-500/20 cursor-pointer"
                >
                  {editingManufacturer ? 'Save Changes' : 'Add Manufacturer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingManufacturer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={e => {
            if (e.target === e.currentTarget) setViewingManufacturer(null);
          }}
        >
          <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Factory className="w-4 h-4 text-blue-500" />
                Manufacturer Details
              </h3>
              <button
                onClick={() => setViewingManufacturer(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Manufacturer Name:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{viewingManufacturer.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact Person:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingManufacturer.contactPerson || 'bibek'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{viewingManufacturer.contactPhone || 'N/A'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block mb-0.5">Email:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{viewingManufacturer.contactEmail || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">License Number:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{viewingManufacturer.licenseNumber || viewingManufacturer.fdaRegistrationNo || 'Nplis123456s'}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Status:</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  viewingManufacturer.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {viewingManufacturer.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingManufacturer(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingManufacturer}
        onClose={() => setDeletingManufacturer(null)}
        onConfirm={() => {
          if (deletingManufacturer) {
            deleteManufacturer(deletingManufacturer.id);
          }
        }}
        title="Delete Manufacturer"
        itemName={deletingManufacturer?.name}
        description="Are you sure you want to delete this manufacturer?"
      />
    </div>
  );
};
