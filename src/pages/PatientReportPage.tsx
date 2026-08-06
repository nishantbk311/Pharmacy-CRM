import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Upload, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Activity,
  Calendar,
  User,
  Plus
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { LabReport, ReportCategory } from '../types';
import { UploadReportModal } from '../components/reports/UploadReportModal';
import { GenerateReportModal } from '../components/reports/GenerateReportModal';
import { ViewReportModal } from '../components/reports/ViewReportModal';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

export const PatientReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { labReports, deleteLabReport } = useData();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const patientParam = searchParams.get('patient') || searchParams.get('q');
    if (patientParam) {
      setSearchTerm(patientParam);
    }
  }, [searchParams]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [selectedReportToView, setSelectedReportToView] = useState<LabReport | null>(null);
  const [reportToDelete, setReportToDelete] = useState<LabReport | null>(null);

  // Compute stats
  const totalReports = labReports.length;
  const generatedReportsCount = labReports.filter(r => r.mode === 'Generated').length;
  const uploadedReportsCount = labReports.filter(r => r.mode === 'Uploaded').length;
  const abnormalCriticalCount = labReports.filter(r => r.status === 'Abnormal' || r.status === 'Critical').length;

  // Filter logic
  const filteredReports = labReports.filter(report => {
    const matchesSearch =
      report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.patientMrn && report.patientMrn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    const matchesMode = selectedMode === 'All' || report.mode === selectedMode;
    const matchesStatus = selectedStatus === 'All' || report.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesMode && matchesStatus;
  });

  const getCategoryBadgeClass = (category: ReportCategory) => {
    switch (category) {
      case 'Blood Test':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'X-Ray':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-sky-300 border-blue-200 dark:border-blue-900';
      case 'CT Scan':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      case 'MRI':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
      case 'Urine Analysis':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'Ultrasound':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-900';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusBadgeClass = (status: LabReport['status']) => {
    switch (status) {
      case 'Normal':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
      case 'Abnormal':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300';
      case 'Critical':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300';
      case 'Pending Review':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Patient Medical & Diagnostic Reports
          </h1>
        </div>

        {/* Action Buttons: Upload & Generate Report */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            Upload Report
          </button>

          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Total Reports</span>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 rounded-lg shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{totalReports}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Recorded files</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Generated Reports</span>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{generatedReportsCount}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Structured lab panels</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Uploaded Scans</span>
            <div className="p-1.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
              <Upload className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{uploadedReportsCount}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">External PDF & DICOM</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Abnormal / Critical</span>
            <div className="p-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{abnormalCriticalCount}</span>
            <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-medium hidden sm:inline">Physician review</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Patient Name, MRN, Report No, or Test..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Categories (Blood, X-Ray, CT...)</option>
              <option value="Blood Test">Blood Test</option>
              <option value="X-Ray">X-Ray</option>
              <option value="CT Scan">CT Scan</option>
              <option value="MRI">MRI</option>
              <option value="Urine Analysis">Urine Analysis</option>
              <option value="Ultrasound">Ultrasound</option>
              <option value="ECG/EKG">ECG / EKG</option>
              <option value="Pathology">Pathology</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Modes (Generated / Uploaded)</option>
              <option value="Generated">Generated Reports</option>
              <option value="Uploaded">Uploaded Files</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Results</option>
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
              <option value="Critical">Critical</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>

        </div>
      </div>

      {/* Reports Directory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Medical & Lab Report Records
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredReports.length} of {labReports.length} reports
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Report No & Date</th>
                <th className="py-3 px-4">Patient Name & MRN</th>
                <th className="py-3 px-4">Test Type / Category</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Referred Doctor</th>
                <th className="py-3 px-4 text-center">Result Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    <p className="mb-2">No medical reports found matching your search and filter criteria.</p>
                    {(searchTerm || selectedCategory !== 'All' || selectedMode !== 'All' || selectedStatus !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                          setSelectedMode('All');
                          setSelectedStatus('All');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 rounded-lg hover:bg-blue-100 transition-all cursor-pointer"
                      >
                        Clear Search & Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Report No & Date */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-blue-600 dark:text-sky-400 block">
                        {report.reportNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {report.reportDate}
                      </span>
                    </td>

                    {/* Patient Name */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {report.patientName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {report.patientMrn || 'N/A'}
                      </p>
                    </td>

                    {/* Category & Test Name */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mb-1 ${getCategoryBadgeClass(report.category)}`}>
                        {report.category}
                      </span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {report.testName}
                      </p>
                    </td>

                    {/* Mode */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        report.mode === 'Generated'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                      }`}>
                        {report.mode === 'Generated' ? <FileSpreadsheet className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                        {report.mode}
                      </span>
                    </td>

                    {/* Referred Doctor */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{report.referredDoctor}</p>
                      <p className="text-[11px] text-slate-500">{report.labName || 'Central Lab'}</p>
                    </td>

                    {/* Result Status */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block ${getStatusBadgeClass(report.status)}`}>
                        {report.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedReportToView(report)}
                          className="px-2.5 py-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          title="View Official Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>

                        <button
                          onClick={() => setReportToDelete(report)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-all cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* MODALS */}
      <UploadReportModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={newRep => setSelectedReportToView(newRep)}
      />

      <GenerateReportModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSuccess={newRep => setSelectedReportToView(newRep)}
      />

      <ViewReportModal
        report={selectedReportToView}
        isOpen={!!selectedReportToView}
        onClose={() => setSelectedReportToView(null)}
      />

      <ConfirmDeleteModal
        isOpen={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={() => {
          if (reportToDelete) {
            deleteLabReport(reportToDelete.id);
            setReportToDelete(null);
          }
        }}
        title="Delete Patient Report"
        itemName={reportToDelete ? `${reportToDelete.testName} (${reportToDelete.reportNumber})` : undefined}
        description="Are you sure you want to permanently delete this lab report? This action cannot be undone."
        confirmText="Delete Report"
      />
    </div>
  );
};
