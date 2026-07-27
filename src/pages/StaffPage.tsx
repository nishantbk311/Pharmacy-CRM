import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  UserCheck,
  Search,
  Plus,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Staff, UserRole } from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';

export const StaffPage: React.FC = () => {
  const { staff, addStaff, updateStaff } = useData();

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

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name, role, license..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="all">All Staff Roles</option>
            <option value="Lead Pharmacist">Lead Pharmacists</option>
            <option value="Staff Pharmacist">Staff Pharmacists</option>
            <option value="Pharmacy Technician">Pharmacy Technicians</option>
            <option value="Store Manager">Store Managers</option>
          </select>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.firstName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/30 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-xs text-teal-700 font-semibold">{member.role}</p>
                  </div>
                </div>

                <Badge
                  variant={
                    member.status === 'On Duty'
                      ? 'emerald'
                      : member.status === 'Off Duty'
                      ? 'slate'
                      : 'amber'
                  }
                  size="sm"
                  dot
                >
                  {member.status}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <p className="flex items-center gap-2 font-mono text-slate-500">
                  <Award className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>License: {member.licenseNumber}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Shift: {member.shift}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{member.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{member.email}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Joined: {member.joinedDate}</span>
              <button
                onClick={() => toggleStatus(member.id, member.status)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  member.status === 'On Duty'
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {member.status === 'On Duty' ? 'Set Off Duty' : 'Set On Duty'}
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Staff Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="Lead Pharmacist">Lead Pharmacist</option>
                <option value="Staff Pharmacist">Staff Pharmacist</option>
                <option value="Pharmacy Technician">Pharmacy Technician</option>
                <option value="Store Manager">Store Manager</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned Duty Shift</label>
            <select
              value={shift}
              onChange={e => setShift(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            >
              <option value="Morning (08:00 - 16:00)">Morning (08:00 - 16:00)</option>
              <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
              <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold"
            >
              Save Staff Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
