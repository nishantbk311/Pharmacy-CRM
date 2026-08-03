import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Plus, Phone, Mail, Briefcase, Calendar, Wallet, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Staff, UserRole } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

export const StaffPage: React.FC = () => {
  const { staff, staffSalaries, addStaff, updateStaff, deleteStaff } = useData();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [deletingMember, setDeletingMember] = useState<Staff | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('Staff Pharmacist');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [licenseNumber, setLicenseNumber] = useState('RPH-884012');
  const [shift, setShift] = useState<Staff['shift']>('Morning (08:00 - 16:00)');

  const filteredStaff = staff.filter(s => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRole = roleFilter === 'all' || s.role === roleFilter;

    return matchSearch && matchRole;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    addStaff({
      firstName,
      lastName,
      role,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@pharmacycrm.com`,
      phone,
      licenseNumber,
      shift,
      status: 'On Duty',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?w=150&auto=format&fit=crop&q=80',
    });

    setAddModalOpen(false);
    setFirstName('');
    setLastName('');
  };

  const toggleStatus = (id: string, currentStatus: Staff['status']) => {
    const nextStatus = currentStatus === 'On Duty' ? 'Off Duty' : 'On Duty';
    updateStaff(id, { status: nextStatus });
  };

  const getDepartmentTag = (roleName: string) => {
    const lower = roleName.toLowerCase();
    if (lower.includes('tech') || lower.includes('lab')) return 'Lab';
    if (lower.includes('pharmacist')) return 'Pharmacy';
    if (lower.includes('manager')) return 'Store';
    return 'General';
  };

  const getStaffSalaryFormatted = (member: Staff) => {
    const matchingSalary = staffSalaries.find(
      s =>
        s.staffId === member.id ||
        s.staffName.toLowerCase() === `${member.firstName} ${member.lastName}`.toLowerCase() ||
        s.staffName.toLowerCase().includes(member.firstName.toLowerCase())
    );
    if (matchingSalary && matchingSalary.totalSalary) {
      return matchingSalary.totalSalary.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    if (member.role === 'Lead Pharmacist') return '25,000.00';
    if (member.role === 'Staff Pharmacist') return '20,000.00';
    if (member.role === 'Pharmacy Technician') return '16,500.00';
    if (member.role === 'Store Manager') return '22,000.00';
    return '20,000.00';
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name, role, license..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Staff Roles</option>
            <option value="Lead Pharmacist">Lead Pharmacists</option>
            <option value="Staff Pharmacist">Staff Pharmacists</option>
            <option value="Pharmacy Technician">Pharmacy Technicians</option>
            <option value="Store Manager">Store Managers</option>
          </select>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map(member => (
          <div
            key={member.id}
            className="bg-white dark:bg-[#0c1626] rounded-3xl border border-slate-200/90 dark:border-slate-800/80 p-5 sm:p-5 shadow-md shadow-slate-200/40 dark:shadow-none flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Header: Avatar, Name, Role, Dept Tag, and Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={member.avatarUrl}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-blue-500/30 dark:border-blue-500/40 shadow-xs"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#0c1626] ${
                        member.status === 'On Duty'
                          ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                          : member.status === 'Off Duty'
                          ? 'bg-slate-400'
                          : 'bg-amber-500'
                      }`}
                      title={member.status}
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate tracking-tight">
                      {member.firstName} {member.lastName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                      <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{member.role}</span>
                    </div>
                    <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                      {getDepartmentTag(member.role)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleStatus(member.id, member.status)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
                    member.status === 'On Duty'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                      : member.status === 'Off Duty'
                      ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 hover:bg-slate-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  {member.status === 'On Duty' ? 'Active' : member.status}
                </button>
              </div>

              {/* Middle Stats Box Grid: SALARY & JOIN DATE */}
              <div className="grid grid-cols-2 gap-3 my-4">
                {/* Salary Box */}
                <div className="bg-slate-50 dark:bg-[#132036] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/50 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-200 font-bold text-base">
                    ₹
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-400 uppercase block">
                      SALARY
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono truncate block">
                      {getStaffSalaryFormatted(member)}
                    </span>
                  </div>
                </div>

                {/* Join Date Box */}
                <div className="bg-slate-50 dark:bg-[#132036] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/50 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-200">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-400 uppercase block">
                      JOIN DATE
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono truncate block">
                      {member.joinedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer: Contacts & Action Buttons */}
            <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 text-xs min-w-0">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate max-w-[150px] sm:max-w-[180px]">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() =>
                    navigate(`/staff/salary?staff=${encodeURIComponent(member.id)}`)
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Payroll</span>
                </button>
                <button
                  onClick={() => setDeletingMember(member)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/40 transition-all cursor-pointer"
                  title="Delete Staff Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={() => {
          if (deletingMember) {
            deleteStaff(deletingMember.id);
            setDeletingMember(null);
          }
        }}
        title="Delete Staff Member"
        itemName={deletingMember ? `${deletingMember.firstName} ${deletingMember.lastName}` : ''}
        description="Are you sure you want to remove this staff member from the roster?"
        confirmText="Remove Staff"
      />

      {/* Add Staff Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Onboard Pharmacy Staff"
        subtitle="Assign role, shift schedule, and pharmacist license verification"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Staff Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Lead Pharmacist">Lead Pharmacist</option>
                <option value="Staff Pharmacist">Staff Pharmacist</option>
                <option value="Pharmacy Technician">Pharmacy Technician</option>
                <option value="Store Manager">Store Manager</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Duty Shift</label>
            <select
              value={shift}
              onChange={e => setShift(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="Morning (08:00 - 16:00)">Morning (08:00 - 16:00)</option>
              <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
              <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
            >
              Save Staff Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

