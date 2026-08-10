import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Plus, Stethoscope } from 'lucide-react';
import { Patient } from '../../types';
import { useData } from '../../context/DataContext';
import { NepaliDatePicker } from '../common/NepaliDatePicker';

interface FollowUpModalProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  patient,
  onClose,
}) => {
  const { followUpVisits, addFollowUpVisit } = useData();

  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  // Form state
  const [visitDateBs, setVisitDateBs] = useState<string>('2083-04-20 BS');
  const [doctor, setDoctor] = useState<string>('karan');
  const [mode, setMode] = useState<string>('OFFLINE');
  const [type, setType] = useState<string>('NEW');
  const [doctorFee, setDoctorFee] = useState<string>('500.00');
  const [notes, setNotes] = useState<string>('edwew');

  useEffect(() => {
    if (patient) {
      if (patient.doctor) {
        setDoctor(patient.doctor.toLowerCase().includes('dr') ? patient.doctor : patient.doctor);
      }
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const patientName = patient.fullName || `${patient.firstName} ${patient.lastName}`;

  // Filter follow-up visits for this patient
  const patientVisits = followUpVisits.filter(
    v => v.patientId === patient.id || (v.patientName && v.patientName.toLowerCase() === patientName.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDateBs.trim() || !doctor.trim()) return;

    // Ensure BS suffix if needed
    const formattedDateBs = visitDateBs.endsWith('BS') ? visitDateBs : `${visitDateBs} BS`;

    addFollowUpVisit({
      patientId: patient.id,
      patientName,
      visitDateBs: formattedDateBs,
      doctor,
      mode,
      type,
      doctorFee: doctorFee ? parseFloat(doctorFee).toFixed(2) : '0.00',
      notes,
    });

    // Reset notes and collapse form
    setNotes('');
    setIsAccordionOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111b2e] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#1c2c48] rounded-2xl w-full max-w-4xl shadow-2xl my-8 overflow-visible animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-[#1c2c48] bg-slate-50/50 dark:bg-transparent rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{patientName} — Follow-up</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Doctor visits with Nepali (BS) dates
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-[#1c2c48] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Add Follow-up Collapsible Accordion */}
          <div className={`rounded-xl border border-slate-200 dark:border-[#1c2c48] bg-slate-50/70 dark:bg-[#162238]/60 transition-all ${isAccordionOpen ? 'overflow-visible' : 'overflow-hidden'}`}>
            <button
              type="button"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-100/60 dark:hover:bg-[#1a2944]/50 transition-colors cursor-pointer"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Add Follow-up</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Returning patient — no appointment needed
                </p>
              </div>
              <div className="p-1 rounded-md text-slate-500 dark:text-slate-400">
                {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isAccordionOpen && (
              <form onSubmit={handleSubmit} className="px-5 pb-5 pt-2 border-t border-slate-200/80 dark:border-[#1c2c48] space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Visit Date (BS) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Visit Date (BS) <span className="text-rose-500">*</span>
                    </label>
                    <NepaliDatePicker
                      value={visitDateBs.replace(' BS', '')}
                      onChange={date => setVisitDateBs(`${date} BS`)}
                      placeholder="YYYY-MM-DD"
                      inputClassName="!bg-white dark:!bg-[#192742] !border-slate-300 dark:!border-[#25385c] !text-slate-900 dark:!text-white"
                    />
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Doctor <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={doctor}
                      onChange={e => setDoctor(e.target.value)}
                      placeholder="Doctor Name (e.g. karan)"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mode
                    </label>
                    <select
                      value={mode}
                      onChange={e => setMode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      <option value="OFFLINE" className="bg-white dark:bg-[#111b2e]">OFFLINE</option>
                      <option value="ONLINE" className="bg-white dark:bg-[#111b2e]">ONLINE</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Type
                    </label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      <option value="NEW" className="bg-white dark:bg-[#111b2e]">NEW</option>
                      <option value="FOLLOW_UP" className="bg-white dark:bg-[#111b2e]">FOLLOW_UP</option>
                      <option value="ROUTINE" className="bg-white dark:bg-[#111b2e]">ROUTINE</option>
                    </select>
                  </div>

                  {/* Doctor Fee */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Doctor Fee
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={doctorFee}
                      onChange={e => setDoctorFee(e.target.value)}
                      placeholder="500.00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Notes / Remarks"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#192742] border border-slate-300 dark:border-[#25385c] text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAccordionOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Follow-up</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Table of Follow-up Visits */}
          <div className="rounded-xl border border-slate-200 dark:border-[#1c2c48] overflow-hidden bg-white dark:bg-[#0d1627]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-[#0e1726] border-b border-slate-200 dark:border-[#1c2c48] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 w-12 text-center">S.N</th>
                    <th className="py-3.5 px-4 font-bold">VISIT DATE (BS)</th>
                    <th className="py-3.5 px-4 font-bold">DOCTOR</th>
                    <th className="py-3.5 px-4 font-bold">MODE</th>
                    <th className="py-3.5 px-4 font-bold">TYPE</th>
                    <th className="py-3.5 px-4 font-bold">DOCTOR FEE</th>
                    <th className="py-3.5 px-4 font-bold">NOTES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#16243d]">
                  {patientVisits.length > 0 ? (
                    patientVisits.map((visit, idx) => (
                      <tr
                        key={visit.id}
                        className="hover:bg-slate-50 dark:hover:bg-[#162238]/60 transition-colors text-slate-800 dark:text-slate-200 font-medium"
                      >
                        <td className="py-3.5 px-4 text-center text-slate-400 dark:text-slate-500 font-normal">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {visit.visitDateBs}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {visit.doctor}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block uppercase tracking-tight text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {visit.mode}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block uppercase tracking-tight text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {visit.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                          {typeof visit.doctorFee === 'number' ? visit.doctorFee.toFixed(2) : visit.doctorFee}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                          {visit.notes || '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-slate-400 dark:text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Stethoscope className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                          <p className="text-xs font-medium">No follow-up visits recorded yet for this patient.</p>
                          <button
                            type="button"
                            onClick={() => setIsAccordionOpen(true)}
                            className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                          >
                            + Add Follow-up Visit
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
