

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Send,
  MessageSquare,
  Eye,
  Clock,
  User,
  Stethoscope,
  Pill,
  HelpCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Inquiry, InquiryPriority, InquiryType, InquiryStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Pagination } from '../components/common/Pagination';
import { usePagination } from '../hooks/usePagination';

interface InquiriesPageProps {
  inquiryModalOpen: boolean;
  setInquiryModalOpen: (open: boolean) => void;
}

export const InquiriesPage: React.FC<InquiriesPageProps> = ({
  inquiryModalOpen,
  setInquiryModalOpen,
}) => {
  const { inquiries, addInquiry, updateInquiryStatus, addInquiryNote, doctors } = useData();

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
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // New Inquiry Form State
  const [type, setType] = useState<InquiryType>('Drug Interaction');
  const [patientName, setPatientName] = useState('Eleanor Vance');
  const [patientPhone] = useState('(555) 432-8811');
  const [doctorName, setDoctorName] = useState('Dr. Robert Chen');
  const [rxNumber] = useState('RX-774902');
  const [priority, setPriority] = useState<InquiryPriority>('Urgent');
  const [assignedStaff] = useState('Dr. Sarah Jenkins, PharmD');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Thread Note State
  const [noteText, setNoteText] = useState('');

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = inquiries.length;
    const open = inquiries.filter(i => i.status === 'Open').length;
    const inProgress = inquiries.filter(i => i.status === 'In Progress').length;
    const pendingDoc = inquiries.filter(i => i.status === 'Pending Doctor').length;
    const resolved = inquiries.filter(i => i.status === 'Resolved').length;
    const urgent = inquiries.filter(i => i.priority === 'Urgent').length;
    return { total, open, inProgress, pendingDoc, resolved, urgent };
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      const matchesSearch =
        inq.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inq.relatedDoctorName && inq.relatedDoctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inq.rxNumber && inq.rxNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = activeStatusTab === 'all' || inq.status === activeStatusTab;
      const matchesPriority = priorityFilter === 'all' || inq.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || inq.type === typeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [inquiries, searchQuery, activeStatusTab, priorityFilter, typeFilter]);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedInquiries,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(filteredInquiries, { initialItemsPerPage: 10 });

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

  const getPriorityBadgeVariant = (p: InquiryPriority) => {
    switch (p) {
      case 'Urgent':
        return 'rose';
      case 'High':
        return 'amber';
      case 'Medium':
        return 'sky';
      default:
        return 'slate';
    }
  };

  const getStatusBadgeClass = (s: InquiryStatus) => {
    switch (s) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Open':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Pending Doctor':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Filter Control & Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Ticket#, Patient, Doctor, Rx#, Subject..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Filters & Log Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Inquiry Types</option>
              <option value="Drug Interaction">Drug Interaction</option>
              <option value="Prior Authorization">Prior Authorization</option>
              <option value="Refill Delay">Refill Delay</option>
              <option value="Prescription Transfer">Prescription Transfer</option>
              <option value="Doctor Clarification">Doctor Clarification</option>
              <option value="Insurance Claim">Insurance Claim</option>
            </select>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <button
              onClick={() => setInquiryModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs ml-auto sm:ml-0"
            >
              <Plus className="w-4 h-4" />
              <span>Log Inquiry Ticket</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Tickets', count: stats.total },
            { id: 'Open', label: 'Open', count: stats.open },
            { id: 'In Progress', label: 'In Progress', count: stats.inProgress },
            { id: 'Pending Doctor', label: 'Pending Doctor', count: stats.pendingDoc },
            { id: 'Resolved', label: 'Resolved', count: stats.resolved },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeStatusTab === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeStatusTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Data Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold">Ticket # / Date</th>
                <th className="py-3.5 px-4 font-bold">Subject & Category</th>
                <th className="py-3.5 px-4 font-bold">Patient & Doctor</th>
                <th className="py-3.5 px-4 font-bold">Priority</th>
                <th className="py-3.5 px-4 font-bold">Assigned Staff</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No inquiry tickets found</p>
                    <p className="text-xs">Try adjusting your search terms or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedInquiries.map(inq => (
                  <tr
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Ticket # / Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200/80 dark:border-teal-800/60 inline-block w-fit">
                          {inq.ticketNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {inq.createdAt}
                        </span>
                      </div>
                    </td>

                    {/* Subject & Category */}
                    <td className="py-3.5 px-4 min-w-[240px] max-w-[320px]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                            {inq.subject}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {inq.description}
                        </p>
                        <div className="pt-0.5">
                          <Badge variant="purple" size="sm">
                            {inq.type}
                          </Badge>
                        </div>
                      </div>
                    </td>

                    {/* Patient & Doctor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{inq.patientName}</span>
                        </div>
                        {inq.relatedDoctorName && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{inq.relatedDoctorName}</span>
                          </div>
                        )}
                        {inq.rxNumber && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                            <Pill className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{inq.rxNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant={getPriorityBadgeVariant(inq.priority)} size="sm" dot>
                        {inq.priority}
                      </Badge>
                    </td>

                    {/* Assigned Staff & Notes count */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{inq.assignedStaffName}</p>
                        <div className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                          <MessageSquare className="w-3 h-3" />
                          <span>{inq.notes.length} notes</span>
                        </div>
                      </div>
                    </td>

                    {/* Status (with inline quick change) */}
                    <td className="py-3.5 px-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <select
                        value={inq.status}
                        onChange={e => updateInquiryStatus(inq.id, e.target.value as InquiryStatus)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-hidden transition-all text-center [text-align-last:center] ${getStatusBadgeClass(
                          inq.status
                        )}`}
                      >
                        <option value="Open" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-normal text-left">Open</option>
                        <option value="In Progress" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-normal text-left">In Progress</option>
                        <option value="Pending Doctor" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-normal text-left">Pending Doctor</option>
                        <option value="Resolved" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-normal text-left">Resolved</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedInquiry(inq);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/60 text-slate-700 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300 font-bold text-xs transition-colors inline-flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Thread</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
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
                  <Badge variant={getPriorityBadgeVariant(selectedInquiry.priority)}>
                    {selectedInquiry.priority}
                  </Badge>
                  <select
                    value={selectedInquiry.status}
                    onChange={e => {
                      updateInquiryStatus(selectedInquiry.id, e.target.value as InquiryStatus);
                      setSelectedInquiry({ ...selectedInquiry, status: e.target.value as InquiryStatus });
                    }}
                    className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer text-center [text-align-last:center] ${getStatusBadgeClass(
                      selectedInquiry.status
                    )}`}
                  >
                    <option value="Open" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-normal text-left">Open</option>
                    <option value="In Progress" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-normal text-left">In Progress</option>
                    <option value="Pending Doctor" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-normal text-left">Pending Doctor</option>
                    <option value="Resolved" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-normal text-left">Resolved</option>
                  </select>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{selectedInquiry.description}</p>
              
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4 text-slate-500 dark:text-slate-400 flex-wrap">
                <span>Patient: <strong className="text-slate-800 dark:text-slate-200">{selectedInquiry.patientName}</strong> ({selectedInquiry.patientPhone})</span>
                {selectedInquiry.relatedDoctorName && (
                  <span>Doctor: <strong className="text-slate-800 dark:text-slate-200">{selectedInquiry.relatedDoctorName}</strong></span>
                )}
                {selectedInquiry.rxNumber && (
                  <span>Rx#: <strong className="text-slate-800 dark:text-slate-200 font-mono">{selectedInquiry.rxNumber}</strong></span>
                )}
              </div>
            </div>

            {/* Notes & Clinical Audit Thread */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Clinical Communication & Audit Thread ({selectedInquiry.notes.length})</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Assigned: {selectedInquiry.assignedStaffName}</span>
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

