import {
  Award,
  Building2,
  CheckCircle,
  Edit2,
  FileCheck,
  Filter,
  Globe,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { type FC, type FormEvent, useState } from 'react';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';
import { useData } from '../context/DataContext';
import { Manufacturer } from '../types';

export const ManufacturerPage: FC = () => {
  const { manufacturers, addManufacturer, updateManufacturer, deleteManufacturer } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [qualityFilter, setQualityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMfg, setEditingMfg] = useState<Manufacturer | null>(null);
  const [deletingMfg, setDeletingMfg] = useState<Manufacturer | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [country, setCountry] = useState('United States');
  const [fdaRegistrationNo, setFdaRegistrationNo] = useState('');
  const [qualityStatus, setQualityStatus] = useState<Manufacturer['qualityStatus']>('FDA Approved');
  const [activeDrugLines, setActiveDrugLines] = useState('12');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [status, setStatus] = useState<Manufacturer['status']>('Active');

  const openAddModal = () => {
    setEditingMfg(null);
    setName('');
    setCountry('United States');
    setFdaRegistrationNo('');
    setQualityStatus('FDA Approved');
    setActiveDrugLines('12');
    setContactEmail('');
    setContactPhone('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (mfg: Manufacturer) => {
    setEditingMfg(mfg);
    setName(mfg.name);
    setCountry(mfg.country);
    setFdaRegistrationNo(mfg.fdaRegistrationNo);
    setQualityStatus(mfg.qualityStatus);
    setActiveDrugLines(mfg.activeDrugLines.toString());
    setContactEmail(mfg.contactEmail || '');
    setContactPhone(mfg.contactPhone || '');
    setStatus(mfg.status);
    setIsModalOpen(true);
  };

  const filteredManufacturers = manufacturers.filter(mfg => {
    const matchesSearch =
      mfg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mfg.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mfg.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mfg.fdaRegistrationNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesQuality = qualityFilter === 'All' || mfg.qualityStatus === qualityFilter;
    const matchesStatus = statusFilter === 'All' || mfg.status === statusFilter;

    return matchesSearch && matchesQuality && matchesStatus;
  });

  const handleAddManufacturerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !fdaRegistrationNo) return;

    if (editingMfg) {
      updateManufacturer(editingMfg.id, {
        name,
        country,
        fdaRegistrationNo,
        qualityStatus,
        activeDrugLines: parseInt(activeDrugLines, 10) || 5,
        contactEmail,
        contactPhone,
        status,
      });
    } else {
      addManufacturer({
        name,
        country,
        fdaRegistrationNo,
        qualityStatus,
        activeDrugLines: parseInt(activeDrugLines, 10) || 5,
        contactEmail,
        contactPhone,
        status,
      });
    }

    setName('');
    setFdaRegistrationNo('');
    setContactEmail('');
    setContactPhone('');
    setEditingMfg(null);
    setIsModalOpen(false);
  };

  const fdaApprovedCount = manufacturers.filter(m => m.qualityStatus === 'FDA Approved').length;
  const totalDrugLines = manufacturers.reduce((sum, m) => sum + m.activeDrugLines, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-1">
            <span>Medicine</span>
            <span>/</span>
            <span>Manufacturer Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Pharmaceutical Manufacturers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track registered pharmaceutical producers, FDA registration IDs, quality standard certifications, and active drug lines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Register Manufacturer
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Producers</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{manufacturers.length}</p>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Global drug lines</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">FDA Approved</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{fdaApprovedCount}</p>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Verified FDA status</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Drug Formulations</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalDrugLines}</p>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total cataloged SKUs</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Quality Audited</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">100%</p>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">GMP compliant standards</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search manufacturer, FDA Reg #..."
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
            value={qualityFilter}
            onChange={e => setQualityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Quality Grades</option>
            <option value="FDA Approved">FDA Approved</option>
            <option value="EU GMP">EU GMP</option>
            <option value="ISO 9001">ISO 9001</option>
            <option value="Under Audit">Under Audit</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Flagged">Flagged</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Manufacturer Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Manufacturer</th>
                <th className="py-3.5 px-6">Country / HQ</th>
                <th className="py-3.5 px-6">FDA Registration No</th>
                <th className="py-3.5 px-6">Quality Status</th>
                <th className="py-3.5 px-6">Active Drug Lines</th>
                <th className="py-3.5 px-6">Contact Info</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredManufacturers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No manufacturers found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredManufacturers.map(mfg => (
                  <tr
                    key={mfg.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {mfg.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">{mfg.code}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium text-xs">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mfg.country}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {mfg.fdaRegistrationNo}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          mfg.qualityStatus === 'FDA Approved'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : mfg.qualityStatus === 'EU GMP'
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 border border-blue-500/20'
                            : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {mfg.qualityStatus}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {mfg.activeDrugLines} formulations
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-xs text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{mfg.contactEmail || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{mfg.contactPhone || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(mfg)}
                          className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Edit Manufacturer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingMfg(mfg)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Delete Manufacturer"
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

      {/* Register Manufacturer Modal */}
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
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingMfg ? 'Edit Manufacturer' : 'Register Manufacturer'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManufacturerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Manufacturer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Novartis AG"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Country / Origin *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United States"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    FDA Registration No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="FDA-REG-10928"
                    value={fdaRegistrationNo}
                    onChange={e => setFdaRegistrationNo(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Quality Standard
                  </label>
                  <select
                    value={qualityStatus}
                    onChange={e => setQualityStatus(e.target.value as Manufacturer['qualityStatus'])}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="FDA Approved">FDA Approved</option>
                    <option value="EU GMP">EU GMP</option>
                    <option value="ISO 9001">ISO 9001</option>
                    <option value="Under Audit">Under Audit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Active Drug Lines
                  </label>
                  <input
                    type="number"
                    value={activeDrugLines}
                    onChange={e => setActiveDrugLines(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@manufacturer.com"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="(800) 223-0182"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
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
                  {editingMfg ? 'Save Changes' : 'Register Manufacturer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Manufacturer Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingMfg}
        onClose={() => setDeletingMfg(null)}
        onConfirm={() => {
          if (deletingMfg) {
            deleteManufacturer(deletingMfg.id);
          }
        }}
        title="Delete Manufacturer Record"
        itemName={deletingMfg?.name}
        description="Are you sure you want to delete this manufacturer? This action cannot be undone and will affect pharmaceutical catalog tracking."
      />
    </div>
  );
};
