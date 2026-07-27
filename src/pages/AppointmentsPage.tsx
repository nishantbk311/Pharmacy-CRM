import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  Plus,
  Video,
  MapPin,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Appointment, AppointmentType } from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';

interface AppointmentsPageProps {
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  bookingModalOpen,
  setBookingModalOpen,
}) => {
  const { appointments, addAppointment, updateAppointmentStatus, patients, staff } = useData();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Booking Form
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [type, setType] = useState<AppointmentType>('MTM Consultation');
  const [pharmacistName, setPharmacistName] = useState('Dr. Sarah Jenkins, PharmD');
  const [date, setDate] = useState('2026-07-26');
  const [time, setTime] = useState('02:00 PM');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.pharmacistName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === patientId) || patients[0];

    addAppointment({
      patientId: patientObj?.id || 'p-101',
      patientName: patientObj ? `${patientObj.firstName} ${patientObj.lastName}` : 'Eleanor Vance',
      patientPhone: patientObj?.phone || '(555) 432-8811',
      type,
      pharmacistId: 'st-1',
      pharmacistName,
      date,
      time,
      durationMinutes: duration,
      status: 'Scheduled',
      notes: notes || `Scheduled ${type} consultation.`,
      isVirtual,
    });

    setBookingModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search appointments by patient name or notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Consultation Types</option>
            <option value="MTM Consultation">MTM Consultation</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Med Sync Review">Med Sync Review</option>
            <option value="Diabetes Management">Diabetes Management</option>
          </select>

          <button
            onClick={() => setBookingModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 dark:bg-sky-500 text-white font-bold text-xs hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Book Consultation</span>
          </button>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.map(apt => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 font-bold text-xs border border-teal-200">
                      {apt.time} ({apt.durationMinutes} min)
                    </span>
                    <Badge
                      variant={apt.isVirtual ? 'indigo' : 'emerald'}
                      size="sm"
                    >
                      {apt.isVirtual ? 'Virtual Telehealth' : 'In-Store Clinic'}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-1.5">
                    {apt.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Type: <span className="text-teal-700 font-semibold">{apt.type}</span>
                  </p>
                </div>

                <Badge
                  variant={
                    apt.status === 'Completed'
                      ? 'emerald'
                      : apt.status === 'In Progress'
                      ? 'indigo'
                      : apt.status === 'Scheduled'
                      ? 'sky'
                      : 'rose'
                  }
                  size="md"
                  dot
                >
                  {apt.status}
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Pharmacist: {apt.pharmacistName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Patient Phone: {apt.patientPhone}</span>
                </p>
                <p className="text-slate-500 pt-1 border-t border-slate-200/60">
                  <span className="font-semibold text-slate-700">Clinical Note:</span> {apt.notes}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Date: {apt.date}</span>
              <div className="flex items-center gap-1.5">
                <select
                  value={apt.status}
                  onChange={e => updateAppointmentStatus(apt.id, e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Book Pharmacist Consultation"
        subtitle="Schedule Medication Therapy Management (MTM) or Immunization"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.mrn})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Consultation Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as AppointmentType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="MTM Consultation">MTM Consultation</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Med Sync Review">Med Sync Review</option>
                <option value="Diabetes Management">Diabetes Management</option>
                <option value="General Health Consultation">General Health Consultation</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Pharmacist</label>
              <select
                value={pharmacistName}
                onChange={e => setPharmacistName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              >
                {staff
                  .filter(s => s.role.includes('Pharmacist'))
                  .map(s => (
                    <option key={s.id} value={`Dr. ${s.firstName} ${s.lastName}, PharmD`}>
                      Dr. {s.firstName} {s.lastName}, PharmD
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration (Min)</label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="virtualCheck"
              checked={isVirtual}
              onChange={e => setIsVirtual(e.target.checked)}
              className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="virtualCheck" className="font-semibold text-slate-700 cursor-pointer">
              Enable Telehealth / Virtual Video Consultation Link
            </label>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consultation Agenda / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Dosage adjustment review & blood pressure log check..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
