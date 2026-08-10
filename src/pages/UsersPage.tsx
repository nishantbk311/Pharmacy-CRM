

import React, { useState } from 'react';
import { Plus, SlidersHorizontal, User as UserIcon, Mail, Phone, Shield, Tag, Pencil, Trash2, UserCheck, Upload, Camera } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SystemUser } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

export const UsersPage: React.FC = () => {
  const { systemUsers, roles, addSystemUser, updateSystemUser, deleteSystemUser } = useData();

  // Filter Input States
  const [usernameFilter, setUsernameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewSalaryModalOpen, setViewSalaryModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<SystemUser | null>(null);

  // New User Form State
  const [newUserId, setNewUserId] = useState(`M${10000 + systemUsers.length + 2}`);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Staff Pharmacist');
  const [newStatus, setNewStatus] = useState<'Active' | 'Inactive' | 'Pending'>('Active');
  const [newSalary, setNewSalary] = useState('$75,000 / yr');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  // Edit User Form State
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive' | 'Pending'>('Active');
  const [editSalary, setEditSalary] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  const isFilterActive =
    usernameFilter.trim() !== '' ||
    emailFilter.trim() !== '' ||
    phoneFilter.trim() !== '' ||
    statusFilter !== 'all' ||
    roleFilter !== 'all';

  const handleClearFilter = () => {
    setUsernameFilter('');
    setEmailFilter('');
    setPhoneFilter('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  const filteredUsers = systemUsers.filter(user => {
    const matchesUsername =
      !usernameFilter ||
      user.username.toLowerCase().includes(usernameFilter.toLowerCase()) ||
      user.name.toLowerCase().includes(usernameFilter.toLowerCase()) ||
      user.userId.toLowerCase().includes(usernameFilter.toLowerCase());
    const matchesEmail =
      !emailFilter ||
      user.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchesPhone = !phoneFilter || user.phone.includes(phoneFilter);
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesUsername && matchesEmail && matchesPhone && matchesStatus && matchesRole;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const currentFormattedTime = new Date()
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);

    const isSelectedRoleInactive = roles.find(r => r.displayName === newRole)?.status === 'Inactive';

    addSystemUser({
      userId: newUserId || `M${10000 + Math.floor(Math.random() * 9000)}`,
      name: newName,
      username: newUsername || newName.toLowerCase().replace(/\s+/g, ''),
      email: newEmail,
      phone: newPhone || '9999999999',
      role: newRole,
      status: isSelectedRoleInactive ? 'Inactive' : newStatus,
      salary: newSalary || 'View',
      avatarUrl: newAvatarUrl || undefined,
      lastLoginAt: currentFormattedTime,
    });

    setNewName('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    setNewAvatarUrl('');
    setAddUserModalOpen(false);
  };

  const handleOpenEditModal = (user: SystemUser) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditSalary(user.salary);
    setEditAvatarUrl(user.avatarUrl || '');
    setEditModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'edit' | 'new') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'edit') {
            setEditAvatarUrl(reader.result);
          } else {
            setNewAvatarUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const isSelectedRoleInactive = roles.find(r => r.displayName === editRole)?.status === 'Inactive';

    updateSystemUser(selectedUser.id, {
      name: editName,
      username: editUsername,
      email: editEmail,
      phone: editPhone,
      role: editRole,
      status: isSelectedRoleInactive ? 'Inactive' : editStatus,
      salary: editSalary,
      avatarUrl: editAvatarUrl.trim() ? editAvatarUrl : undefined,
    });

    setEditModalOpen(false);
  };

  return (
    <div className="space-y-5 text-slate-900 dark:text-slate-100 font-sans">
      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-2xl space-y-5 transition-colors">
        {/* Filters Grid Bar */}
        <form onSubmit={e => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
            {/* Username Field */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Username</span>
              </label>
              <input
                type="text"
                placeholder="Search By Username"
                value={usernameFilter}
                onChange={e => setUsernameFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111c38] border border-slate-300 dark:border-slate-700/70 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Email</span>
              </label>
              <input
                type="text"
                placeholder="Search Email"
                value={emailFilter}
                onChange={e => setEmailFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111c38] border border-slate-300 dark:border-slate-700/70 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Phone</span>
              </label>
              <input
                type="text"
                placeholder="Search Phone"
                value={phoneFilter}
                onChange={e => setPhoneFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111c38] border border-slate-300 dark:border-slate-700/70 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Status</span>
              </label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111c38] border border-slate-300 dark:border-slate-700/70 text-xs text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Role</span>
              </label>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111c38] border border-slate-300 dark:border-slate-700/70 text-xs text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">All</option>
                {roles.map(r => (
                  <option key={r.id} value={r.displayName}>
                    {r.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
            {isFilterActive && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#15203b] dark:hover:bg-[#1e2c4f] border border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Clear Filter</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setAddUserModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </form>

        {/* Responsive Table Container */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-[#0c1429]">
                <th className="py-3.5 px-4 font-semibold">NAME</th>
                <th className="py-3.5 px-4 font-semibold">PROFILE</th>
                <th className="py-3.5 px-4 font-semibold">USERNAME</th>
                <th className="py-3.5 px-4 font-semibold">EMAIL</th>
                <th className="py-3.5 px-4 font-semibold">PHONE NO.</th>
                <th className="py-3.5 px-4 font-semibold">ROLE</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold">SALARY</th>
                <th className="py-3.5 px-4 font-semibold">LAST LOGIN AT</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500 opacity-60" />
                    <p className="font-semibold text-sm">No matching user accounts found</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting filters or clear filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#121c38]/60 transition-colors group"
                  >
                    {/* NAME */}
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {user.name}
                    </td>

                    {/* PROFILE */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {user.avatarUrl ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                          />
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700/80">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700/80 flex items-center justify-center text-[9px] font-bold text-slate-500 dark:text-slate-400">
                            N/A
                          </span>
                          <span>No Profile</span>
                        </span>
                      )}
                    </td>

                    {/* USERNAME */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {user.username}
                    </td>

                    {/* EMAIL */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {user.email}
                    </td>

                    {/* PHONE NO. */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {user.phone}
                    </td>

                    {/* ROLE */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={e => {
                          const newRoleName = e.target.value;
                          const selectedRoleObj = roles.find(r => r.displayName === newRoleName);
                          if (selectedRoleObj?.status === 'Inactive') {
                            updateSystemUser(user.id, { role: newRoleName, status: 'Inactive' });
                          } else {
                            updateSystemUser(user.id, { role: newRoleName });
                          }
                        }}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.displayName} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">
                            {r.displayName}{r.status === 'Inactive' ? ' (Inactive)' : ''}
                          </option>
                        ))}
                        {!roles.some(r => r.displayName === user.role) && user.role && (
                          <option value={user.role} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">
                            {user.role}
                          </option>
                        )}
                      </select>
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={e => {
                          const newStatus = e.target.value as 'Active' | 'Inactive' | 'Pending';
                          const userRoleObj = roles.find(r => r.displayName === user.role);
                          if (newStatus === 'Active' && userRoleObj?.status === 'Inactive') {
                            alert(`Cannot activate user while their assigned role (${user.role}) is Inactive. Please activate the role first in Roles page.`);
                            return;
                          }
                          updateSystemUser(user.id, { status: newStatus });
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border cursor-pointer focus:outline-none transition-colors ${
                          user.status === 'Active'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/70'
                            : user.status === 'Inactive'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800/70'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/70'
                        }`}
                      >
                        <option value="Active" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">Active</option>
                        <option value="Inactive" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">Inactive</option>
                        <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">Pending</option>
                      </select>
                    </td>

                    {/* SALARY */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {user.salary}
                    </td>

                    {/* LAST LOGIN AT */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {user.lastLoginAt || '—'}
                    </td>

                    {/* ACTION */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {user.role !== 'Super Admin' && (
                          <button
                            onClick={() => setDeletingUser(user)}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Add New System User"
        subtitle="Create an authorized user profile for system access and role management."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                User ID *
              </label>
              <input
                type="text"
                required
                value={newUserId}
                onChange={e => setNewUserId(e.target.value)}
                placeholder="e.g. M10008"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Robert Smith"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="e.g. rsmith"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="e.g. rsmith@pharmacycrm.com"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="e.g. 9801234567"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                System Role
              </label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.displayName}>
                    {r.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Status
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Salary / Status Display
              </label>
              <input
                type="text"
                value={newSalary}
                onChange={e => setNewSalary(e.target.value)}
                placeholder="e.g. View or $65,000 / yr"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddUserModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
            >
              Save User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      {selectedUser && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit User: ${selectedUser.name}`}
          subtitle={`User ID: ${selectedUser.userId}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            {/* Profile Image Upload Section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group">
                {editAvatarUrl ? (
                  <img
                    src={editAvatarUrl}
                    alt={editName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/80 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm border-2 border-slate-300 dark:border-slate-600">
                    <UserIcon className="w-8 h-8 opacity-70" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-md transition-transform active:scale-95">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'edit')}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-1.5 w-full text-center sm:text-left">
                <label className="block font-semibold text-slate-700 dark:text-slate-200">
                  Profile Picture
                </label>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'edit')}
                      className="hidden"
                    />
                  </label>
                  {editAvatarUrl && (
                    <button
                      type="button"
                      onClick={() => setEditAvatarUrl('')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white font-medium transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter Image URL (https://...)"
                  value={editAvatarUrl}
                  onChange={e => setEditAvatarUrl(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.displayName}>
                      {r.displayName}
                    </option>
                  ))}
                  {!roles.some(r => r.displayName === editRole) && editRole && (
                    <option value={editRole}>{editRole}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Salary / Note
                </label>
                <input
                  type="text"
                  value={editSalary}
                  onChange={e => setEditSalary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
              >
                Update User
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Salary Detail View Modal */}
      {selectedUser && (
        <Modal
          isOpen={viewSalaryModalOpen}
          onClose={() => setViewSalaryModalOpen(false)}
          title={`Compensation & Account Details`}
          subtitle={`User: ${selectedUser.name} (${selectedUser.userId})`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Account Owner:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Salary Status:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">$68,500 / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Login Timestamp:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedUser.lastLoginAt || 'N/A'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewSalaryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete User Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => {
          if (deletingUser) {
            deleteSystemUser(deletingUser.id);
          }
        }}
        title="Delete System User"
        itemName={deletingUser?.name}
        description="Are you sure you want to delete this user account? Their system permissions will be revoked immediately."
      />
    </div>
  );
};
