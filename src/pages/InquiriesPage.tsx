import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquareWarning,
  Search,
  Plus,
  AlertTriangle,
  Clock,
  User,
  Send,
  CheckCircle2,
  HelpCircle,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Inquiry, InquiryPriority, InquiryStatus, InquiryType } from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';

interface InquiriesPageProps {
  inquiryModalOpen: boolean;
  setInquiryModalOpen: (open: boolean) => void;
}

export const InquiriesPage: React.FC<InquiriesPageProps> = ({
  inquiryModalOpen,
  setInquiryModalOpen,
}) => {
  const { inquiries, addInquiry, updateInquiryStatus, addInquiryNote, staff, doctors } = useData();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // New Inquiry Form State
  const [type, setType] = useState<InquiryType>('Drug Interaction');
  const [patientName, setPatientName] = useState('Eleanor Vance');
  const [patientPhone, setPatientPhone] = useState('(555) 432-8811');
  const [doctorName, setDoctorName] = useState('Dr. Robert Chen');
  const [rxNumber, setRxNumber] = useState('RX-774902');
  const [priority, setPriority] = useState<InquiryPriority>('Urgent');
  const [assignedStaff, setAssignedStaff] = useState('Dr. Sarah Jenkins, PharmD');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Thread Note State
  const [noteText, setNoteText] = useState('');

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch =
      inq.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.rxNumber && inq.rxNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = activeStatusTab === 'all' || inq.status === activeStatusTab;
    const matchesPriority = priorityFilter === 'all' || inq.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    addInquiry({
      type,
      patientName,
      patientPhone,
      relatedDoctorName: doctorName,
      rxNumber,
      priority,
      status: 'Open',
      assignedStaffName: assignedStaff,
      subject,
      description,
    });

    setInquiryModalOpen(false);
    setSubject('');
    setDescription('');
  };

  const handleAppendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !noteText) return;

    addInquiryNote(selectedInquiry.id, 'Dr. Sarah Jenkins', 'Lead Pharmacist', noteText);
    setNoteText('');

    // Local refresh
    const updated = inquiries.find(i => i.id === selectedInquiry.id);
    if (updated) setSelectedInquiry(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search inquiry tickets by TKT#, subject, patient..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <button
              onClick={() => setInquiryModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Inquiry Ticket</span>
            </button>
          </div>
        </div>

        {/* Status Tab Bar */}
        <div className="flex items-center gap-1 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-semibold overflow-x-auto">
          {['all', 'Open', 'In Progress', 'Pending Doctor', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setActiveStatusTab(st)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeStatusTab === st
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st === 'all' ? 'All Tickets' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Ticket List */}
      <div className="space-y-3">
        {filteredInquiries.map(inq => (
          <div
            key={inq.id}
            onClick={() => setSelectedInquiry(inq)}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
                  {inq.ticketNumber}
                </span>
                <Badge
                  variant={
                    inq.priority === 'Urgent'
                      ? 'rose'
                      : inq.priority === 'High'
                      ? 'amber'
                      : 'sky'
                  }
                  size="sm"
                  dot
                >
                  {inq.priority} Priority
                </Badge>
                <Badge variant="purple" size="sm">
                  {inq.type}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    inq.status === 'Resolved'
                      ? 'emerald'
                      : inq.status === 'Open'
                      ? 'rose'
                      : 'indigo'
                  }
                  size="md"
                >
                  {inq.status}
                </Badge>
                <span className="text-[11px] text-slate-400 font-mono">{inq.createdAt}</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{inq.subject}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">{inq.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4 flex-wrap">
                <span>
                  Patient: <strong className="text-slate-800 dark:text-slate-200">{inq.patientName}</strong>
                </span>
                {inq.relatedDoctorName && (
                  <span>
                    Doctor: <strong className="text-slate-800 dark:text-slate-200">{inq.relatedDoctorName}</strong>
                  </span>
                )}
                {inq.rxNumber && (
                  <span className="font-mono">
                    Rx#: <strong className="text-slate-800 dark:text-slate-200">{inq.rxNumber}</strong>
                  </span>
                )}
              </div>

              <span className="text-teal-700 dark:text-teal-400 font-semibold">
                Assigned: {inq.assignedStaffName} ({inq.notes.length} notes)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Detailed Workspace Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          title={`Inquiry Ticket ${selectedInquiry.ticketNumber}`}
          subtitle={`Type: ${selectedInquiry.type} | Created: ${selectedInquiry.createdAt}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{selectedInquiry.subject}</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedInquiry.priority === 'Urgent' ? 'rose' : 'amber'
                    }
                  >
                    {selectedInquiry.priority}
                  </Badge>
                  <select
                    value={selectedInquiry.status}
                    onChange={e => {
                      updateInquiryStatus(selectedInquiry.id, e.target.value as any);
                      setSelectedInquiry({ ...selectedInquiry, status: e.target.value as any });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending Doctor">Pending Doctor</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{selectedInquiry.description}</p>
            </div>

            {/* Notes & Clinical Audit Thread */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
                Clinical Communication & Audit Thread ({selectedInquiry.notes.length})
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedInquiry.notes.map(note => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span>{note.authorName} ({note.authorRole})</span>
                      <span className="text-[10px] text-slate-400">{note.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{note.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAppendNote} className="mt-3 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type clinical update or pharmacist recommendation..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Note</span>
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Log Inquiry Modal */}
      <Modal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        title="Log Clinical Inquiry Ticket"
        subtitle="Flag drug interactions, prior auths, or doctor clarifications"
      >
        <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Inquiry Category</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as InquiryType)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="Drug Interaction">Drug Interaction</option>
              <option value="Prior Authorization">Prior Authorization</option>
              <option value="Refill Delay">Refill Delay</option>
              <option value="Prescription Transfer">Prescription Transfer</option>
              <option value="Doctor Clarification">Doctor Clarification</option>
              <option value="Insurance Claim">Insurance Claim</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject / Summary *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Interaction between Warfarin and Cipro"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as InquiryPriority)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Prescribing Doctor</label>
              <select
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="">Select Doctor</option>
                {doctors.map(doc => {
                  const dName = `Dr. ${doc.firstName} ${doc.lastName}`;
                  return (
                    <option key={doc.id} value={dName}>
                      {dName} ({doc.specialty})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Clinical Context</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe clinical concern or insurance step therapy requirements..."
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setInquiryModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold cursor-pointer"
            >
              Submit Inquiry Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
