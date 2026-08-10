import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Patient, RxStatus } from '../../types';
import { NepaliDatePicker } from '../common/NepaliDatePicker';

interface AddPrescriptionModalProps {
  isOpen: boolean;
  patient?: Patient | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddPrescriptionModal: React.FC<AddPrescriptionModalProps> = ({
  isOpen,
  patient,
  onClose,
  onSuccess,
}) => {
  const { doctors, addPrescription, showToast } = useData();

  const initialPatientName = patient
    ? patient.fullName || `${patient.firstName} ${patient.lastName}`.trim()
    : '';

  const initialDoctorName = patient?.doctor || (doctors[0]?.fullName || 'Dr. Robert Chen');

  const [formData, setFormData] = useState({
    patientName: initialPatientName,
    doctorName: initialDoctorName,
    medicationName: '',
    dosage: '',
    frequency: '',
    route: '',
    duration: '',
    quantity: '',
    refills: '',
    diagnosis: '',
    prescribedDate: '2083-04-17',
    startDate: '',
    endDate: '',
    status: 'Pending Review' as RxStatus,
    instructions: '',
  });

  useEffect(() => {
    if (patient) {
      const pName = patient.fullName || `${patient.firstName} ${patient.lastName}`.trim();
      setFormData(prev => ({
        ...prev,
        patientName: pName,
        doctorName: patient.doctor || prev.doctorName || 'Dr. Robert Chen',
      }));
    }
  }, [patient]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.medicationName || !formData.dosage || !formData.frequency || !formData.prescribedDate) {
      showToast('Please fill in all required fields (*).');
      return;
    }

    const qtyNum = formData.quantity ? parseInt(formData.quantity, 10) : 30;
    const refillsNum = formData.refills ? parseInt(formData.refills, 10) : 0;

    addPrescription({
      patientId: patient?.id || 'p-gen',
      patientName: formData.patientName || 'Unknown Patient',
      doctorName: formData.doctorName || 'Dr. Robert Chen',
      drugName: formData.medicationName,
      dosage: formData.dosage,
      frequency: formData.frequency,
      route: formData.route || 'Oral',
      duration: formData.duration || '7 Days',
      quantity: isNaN(qtyNum) ? 30 : qtyNum,
      refillsTotal: isNaN(refillsNum) ? 0 : refillsNum,
      refillsRemaining: isNaN(refillsNum) ? 0 : refillsNum,
      directions: formData.instructions,
      prescribedDate: formData.prescribedDate,
      startDate: formData.startDate || formData.prescribedDate,
      endDate: formData.endDate,
      status: formData.status,
    });

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111b2e] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#1c2c48] rounded-2xl w-full max-w-3xl shadow-2xl my-8 overflow-visible animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-[#1c2c48] bg-slate-50/50 dark:bg-transparent rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Add New Prescriptions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Fill in the details below</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pb-32 space-y-5 max-h-[78vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Patient
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter Patient Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Doctor <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                placeholder="doctor"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Medication Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Medication Name <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.medicationName}
                onChange={e => setFormData({ ...formData, medicationName: e.target.value })}
                placeholder="Enter Medication Name"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Dosage <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.dosage}
                onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="Example: 500mg"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Frequency <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.frequency}
                onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="Example: Twice Daily"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Route */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Route
              </label>
              <input
                type="text"
                value={formData.route}
                onChange={e => setFormData({ ...formData, route: e.target.value })}
                placeholder="Oral, IV, Topical"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Example: 7 Days"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quantity
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter Quantity"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Refills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Refills
              </label>
              <input
                type="text"
                value={formData.refills}
                onChange={e => setFormData({ ...formData, refills: e.target.value })}
                placeholder="Enter Number of Refills"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Diagnosis
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Enter Diagnosis"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Prescribed Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Prescribed Date <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <NepaliDatePicker
                value={formData.prescribedDate}
                onChange={date => setFormData({ ...formData, prescribedDate: date })}
                placeholder="Select date (BS)"
                inputClassName="!bg-slate-50 dark:!bg-[#192742] !border-slate-300 dark:!border-[#25385c] !text-slate-900 dark:!text-white"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <NepaliDatePicker
                value={formData.startDate}
                onChange={date => setFormData({ ...formData, startDate: date })}
                placeholder="Select date (BS)"
                inputClassName="!bg-slate-50 dark:!bg-[#192742] !border-slate-300 dark:!border-[#25385c] !text-slate-900 dark:!text-white"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                End Date
              </label>
              <NepaliDatePicker
                value={formData.endDate}
                onChange={date => setFormData({ ...formData, endDate: date })}
                placeholder="Select date (BS)"
                inputClassName="!bg-slate-50 dark:!bg-[#192742] !border-slate-300 dark:!border-[#25385c] !text-slate-900 dark:!text-white"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as RxStatus })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="Pending Review" className="bg-white dark:bg-[#111b2e] text-slate-900 dark:text-white">Pending Review</option>
                <option value="Confirmed" className="bg-white dark:bg-[#111b2e] text-slate-900 dark:text-white">Confirmed</option>
                <option value="Completed" className="bg-white dark:bg-[#111b2e] text-slate-900 dark:text-white">Completed</option>
                <option value="Cancelled" className="bg-white dark:bg-[#111b2e] text-slate-900 dark:text-white">Cancelled</option>
                <option value="Processing" className="bg-white dark:bg-[#111b2e] text-slate-900 dark:text-white">Processing</option>
                <option value="Ready for Pickup" className="bg-white dark:bg-[#111b2e] text-slate-900 dark:text-white">Ready for Pickup</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Instructions
            </label>
            <textarea
              rows={3}
              value={formData.instructions}
              onChange={e => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g. Take after meals, twice daily"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#1c2c48] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
