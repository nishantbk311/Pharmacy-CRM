import React, { useState } from 'react';
import { ShieldCheck, Plus, SlidersHorizontal, Search, Edit2, Trash2, CheckCircle2, XCircle, X, Key } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SystemRole } from '../types';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

const ALL_AVAILABLE_PERMISSIONS = [
  'All System Permissions',
  'System Settings',
  'User Management',
  'Roles Management',
  'Audit Logs',
  'Patient Records',
  'Prescription Approval',
  'Prescribe Medication',
  'Fill Prescriptions',
  'Dispense Medication',
  'Appointments View/Manage',
  'Book Appointments',
  'Inquiry Response',
  'Inventory Management',
  'Purchase Orders',
  'Stock Alerts',
];

export const RolesPage: React.FC = () => {
  const { roles, addRole, updateRole, deleteRole } = useData();

  // Filters & Search
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<SystemRole | null>(null);
  const [managingPermissionsRole, setManagingPermissionsRole] = useState<SystemRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<SystemRole | null>(null);

  // Form Fields for Add/Edit
  const [displayName, setDisplayName] = useState('');
  const [keyName, setKeyName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Permissions Manager Temporary State
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);

  const handleClearFilter = () => {
    setSelectedStatus('All');
    setSearchQuery('');
  };

  const filteredRoles = roles.filter(role => {
    const matchesStatus =
      selectedStatus === 'All' || role.status === selectedStatus;
    const matchesQuery =
      searchQuery.trim() === '' ||
      role.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.keyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const isFilterApplied = selectedStatus !== 'All' || searchQuery.trim() !== '';

  // Open Modal Helpers
  const handleOpenAddModal = () => {
    setEditingRole(null);
    setDisplayName('');
    setKeyName('');
    setDescription('');
    setStatus('Active');
    setSelectedPermissions([
      'Patient Records',
      'Prescription Approval',
    ]);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (role: SystemRole) => {
    setEditingRole(role);
    setDisplayName(role.displayName);
    setKeyName(role.keyName);
    setDescription(role.description);
    setStatus(role.status);
    setSelectedPermissions(role.permissions || []);
    setIsAddModalOpen(true);
  };

  const handleOpenPermissionsModal = (role: SystemRole) => {
    setManagingPermissionsRole(role);
    setTempPermissions([...(role.permissions || [])]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !keyName.trim()) return;

    if (editingRole) {
      updateRole(editingRole.id, {
        displayName: displayName.trim(),
        keyName: keyName.trim().toLowerCase().replace(/\s+/g, '_'),
        description: description.trim(),
        status,
        permissions: selectedPermissions,
      });
    } else {
      addRole({
        displayName: displayName.trim(),
        keyName: keyName.trim().toLowerCase().replace(/\s+/g, '_'),
        description: description.trim() || 'Custom system access role.',
        status,
        permissions: selectedPermissions,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleSavePermissions = () => {
    if (managingPermissionsRole) {
      updateRole(managingPermissionsRole.id, {
        permissions: tempPermissions,
      });
      setManagingPermissionsRole(null);
    }
  };

  const togglePermission = (perm: string) => {
    if (tempPermissions.includes(perm)) {
      setTempPermissions(tempPermissions.filter(p => p !== perm));
    } else {
      setTempPermissions([...tempPermissions, perm]);
    }
  };

  const toggleFormPermission = (perm: string) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Container Card matching reference screenshot styling */}
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-lg transition-colors">
        {/* Top Header Row with Title and Right Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Roles</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure system roles, access levels, and module security permissions
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            {isFilterApplied && (
              <button
                onClick={handleClearFilter}
                className="px-3.5 h-[36px] rounded-xl bg-white dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Clear Filter</span>
              </button>
            )}

            <button
              onClick={handleOpenAddModal}
              className="px-4 h-[36px] rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Role</span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="py-4 flex flex-wrap items-end gap-3">
          {/* Status Select */}
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              <span>Role Status</span>
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 h-[36px] text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-[130px]"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Real-time Search Query Input */}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Search Role
            </label>
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by display name, key name, or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700/80 rounded-xl pl-9 pr-3.5 h-[36px] text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/80 mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">S.N</th>
                <th className="py-3 px-4 min-w-[150px]">Display Name</th>
                <th className="py-3 px-4 min-w-[140px]">Key Name</th>
                <th className="py-3 px-4 min-w-[260px]">Description</th>
                <th className="py-3 px-4 text-center min-w-[110px]">Status</th>
                <th className="py-3 px-4 text-center min-w-[120px]">Permissions</th>
                <th className="py-3 px-4 text-right min-w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-xs font-medium text-slate-800 dark:text-slate-200">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No roles found</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing filters or search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role, idx) => (
                  <tr
                    key={role.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* S.N */}
                    <td className="py-3.5 px-4 text-center text-slate-500 dark:text-slate-400 font-bold">
                      {idx + 1}
                    </td>

                    {/* DISPLAY NAME */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {role.displayName}
                    </td>

                    {/* KEY NAME */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                      {role.keyName}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-[320px] truncate">
                      {role.description}
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() =>
                          updateRole(role.id, {
                            status: role.status === 'Active' ? 'Inactive' : 'Active',
                          })
                        }
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer transition-all shadow-2xs ${
                          role.status === 'Active'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/70'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800/70'
                        }`}
                        title="Click to toggle status"
                      >
                        {role.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-500" />
                        )}
                        <span>{role.status}</span>
                      </button>
                    </td>

                    {/* PERMISSIONS */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenPermissionsModal(role)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-bold text-xs underline decoration-blue-500/30 hover:decoration-blue-500 transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>

                    {/* ACTION */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(role)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingRole(role)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Role"
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

      {/* ADD / EDIT ROLE MODAL */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>{editingRole ? 'Edit System Role' : 'Add New Role'}</span>
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Pharmacist"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Key Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. lead_pharmacist"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what this role allows in the system..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Default Permissions
                </label>
                <div className="max-h-36 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">
                  {ALL_AVAILABLE_PERMISSIONS.map(perm => {
                    const checked = selectedPermissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFormPermission(perm)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  {editingRole ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE PERMISSIONS MODAL */}
      {managingPermissionsRole && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setManagingPermissionsRole(null);
          }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setManagingPermissionsRole(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <span>Manage Permissions: {managingPermissionsRole.displayName}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select access privileges granted to users assigned to key name{' '}
                <code className="text-blue-500 font-mono">{managingPermissionsRole.keyName}</code>.
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/50">
              {ALL_AVAILABLE_PERMISSIONS.map(perm => {
                const isSelected = tempPermissions.includes(perm);
                return (
                  <div
                    key={perm}
                    onClick={() => togglePermission(perm)}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800/70 text-blue-900 dark:text-blue-200'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span>{perm}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-semibold">
                {tempPermissions.length} permissions assigned
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setManagingPermissionsRole(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        onConfirm={() => {
          if (deletingRole) {
            deleteRole(deletingRole.id);
          }
        }}
        title="Delete System Role"
        itemName={deletingRole?.displayName}
        description="Are you sure you want to delete this system role? Users assigned to this role may lose their access permissions."
      />
    </div>
  );
};
