

import React from 'react';
import { X, Printer, Download, User, Calendar, Stethoscope, Building2, AlertTriangle, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { LabReport } from '../../types';

interface ViewReportModalProps {
  report: LabReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewReportModal: React.FC<ViewReportModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) overlay.scrollTop = 0;
  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.print();
    });
  });
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto print:static print:inset-auto print:p-0 print:m-0 print:bg-transparent print:block print:overflow-visible print:shadow-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl my-6 overflow-hidden flex flex-col max-h-[92vh] print-area print:static print:shadow-none print:border-none print:rounded-none print:my-0 print:p-0 print:max-w-none print:max-h-none print:w-full print:bg-white print:text-slate-900 print:overflow-visible print:block">
        
        {/* Modal Action Header (Non-printable) */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-sky-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {report.testName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Report No: <span className="font-mono font-bold text-blue-600 dark:text-sky-400">{report.reportNumber}</span> | Mode: {report.mode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Report View */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 print:bg-white print:text-slate-900 print:p-2 print:space-y-3.5 print:overflow-visible">
          
          {/* Header Letterhead */}
          <div className="border-b-2 border-blue-600 dark:border-slate-700 print:border-slate-900 pb-3.5 sm:pb-4 print:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 print:gap-2">
            <div>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-blue-950 dark:text-white print:text-slate-900 print:text-base">
                Apex Clinical Diagnostics & Pharmacy
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-600 print:text-[11px] mt-0.5">
                742 Evergreen Terrace, Springfield, IL | Tel: (555) 234-5678
              </p>
              <p className="text-[11px] print:text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-500">
                ISO 15189 Certified Clinical Pathology & Radiology Services
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs print:text-[10px] print:py-0.5 font-black uppercase tracking-wider ${
                report.status === 'Normal'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 print:bg-emerald-100 print:text-emerald-800'
                  : report.status === 'Critical'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 print:bg-rose-100 print:text-rose-800'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 print:bg-amber-100 print:text-amber-800'
              }`}>
                {report.status} Result
              </span>
              <p className="text-xs font-mono font-bold mt-1 text-slate-700 dark:text-slate-300 print:text-slate-700 print:text-[11px]">
                Ref No: {report.reportNumber}
              </p>
            </div>
          </div>

          {/* Patient Details Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/50 print:bg-slate-50 border border-slate-200 dark:border-slate-800 print:border-slate-200 rounded-xl p-3.5 sm:p-4 print:p-2.5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 print:gap-2 text-xs print:text-[11px]">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-500">Patient Name</p>
              <p className="font-extrabold text-slate-900 dark:text-white print:text-slate-900 text-sm print:text-xs">{report.patientName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-500">MRN Number</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-800">{report.patientMrn || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-500">Age / Gender</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-800">{report.patientAgeGender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-500">Report Date</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-800">{report.reportDate}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-500">Referred Doctor</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-800">{report.referredDoctor}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-500">Category</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-800">{report.category}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-500">Lab Facility</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-800">{report.labName || 'Apex Main Lab'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-500">Report Mode</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-800">{report.mode}</p>
            </div>
          </div>

          {/* Test Name Header */}
          <div className="bg-blue-600 dark:bg-slate-800 print:bg-slate-900 text-white p-3 sm:p-3.5 print:py-2 print:px-3 rounded-xl flex items-center justify-between shadow-xs print:shadow-none">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase print:text-xs">
              {report.testName}
            </h3>
            <span className="text-[11px] sm:text-xs text-blue-100 dark:text-slate-300 print:text-slate-300 print:text-[10px]">
              Diagnostic Report
            </span>
          </div>

          {/* GENERATED REPORT: PARAMETERS TABLE */}
          {report.mode === 'Generated' && report.parameters && (
            <div className="border border-slate-300 dark:border-slate-800 print:border-slate-300 rounded-xl overflow-x-auto print:overflow-visible">
              <table className="w-full text-left text-xs print:text-[11px] min-w-[500px] print:min-w-full">
                <thead className="bg-slate-100 dark:bg-slate-800/80 print:bg-slate-100 text-slate-800 dark:text-slate-200 print:text-slate-900 font-bold uppercase text-[10px] print:text-[9px] border-b border-slate-300 dark:border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 print:py-1.5 print:px-2">Test Parameter</th>
                    <th className="py-2.5 px-3 print:py-1.5 print:px-2">Observed Value</th>
                    <th className="py-2.5 px-3 print:py-1.5 print:px-2">Unit</th>
                    <th className="py-2.5 px-3 print:py-1.5 print:px-2">Normal Reference Range</th>
                    <th className="py-2.5 px-3 print:py-1.5 print:px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-200">
                  {report.parameters.map(param => (
                    <tr key={param.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 print:hover:bg-transparent">
                      <td className="py-2.5 px-3 print:py-1.5 print:px-2 font-semibold text-slate-900 dark:text-white print:text-slate-900">{param.name}</td>
                      <td className={`py-2.5 px-3 print:py-1.5 print:px-2 font-extrabold ${
                        param.flag === 'High' || param.flag === 'Low' || param.flag === 'Abnormal'
                          ? 'text-rose-600 dark:text-rose-400 print:text-rose-600'
                          : 'text-slate-800 dark:text-slate-200 print:text-slate-800'
                      }`}>
                        {param.value}
                      </td>
                      <td className="py-2.5 px-3 print:py-1.5 print:px-2 text-slate-600 dark:text-slate-400 print:text-slate-600">{param.unit}</td>
                      <td className="py-2.5 px-3 print:py-1.5 print:px-2 text-slate-600 dark:text-slate-400 print:text-slate-600">{param.normalRange}</td>
                      <td className="py-2.5 px-3 print:py-1.5 print:px-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] print:text-[9px] font-bold ${
                          param.flag === 'Normal'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 print:bg-emerald-100 print:text-emerald-800'
                            : param.flag === 'High'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 print:bg-rose-100 print:text-rose-800'
                            : param.flag === 'Low'
                            ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 print:bg-sky-100 print:text-sky-800'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 print:bg-amber-100 print:text-amber-800'
                        }`}>
                          {param.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* UPLOADED REPORT DETAILS */}
          {report.mode === 'Uploaded' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 print:border-slate-300 rounded-2xl p-6 print:p-3 bg-slate-50 dark:bg-slate-800/40 print:bg-slate-50 text-center space-y-3 print:space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-sky-400 flex items-center justify-center print:hidden">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white print:text-slate-900">{report.fileName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-500 mt-0.5">
                  Type: {report.fileType} | Size: {report.fileSize} | Uploaded on {report.uploadedDate}
                </p>
              </div>
              {report.notes && (
              
                <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 print:bg-white print:text-slate-700 p-3 print:p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-left">
                  <p className="font-bold text-slate-900 dark:text-white print:text-slate-900 mb-0.5">Notes & Summary:</p>
                  <p>{report.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Impression & Recommendations Box */}
          {(report.impression || report.recommendations) && (
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 print:bg-slate-50 p-3.5 sm:p-4 print:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-200">
              {report.impression && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white print:text-slate-900 tracking-wider print:text-[10px]">
                    Clinical Impression:
                  </h4>
                  <p className="text-xs text-slate-800 dark:text-slate-200 print:text-slate-800 mt-0.5 font-medium leading-relaxed print:text-[11px]">
                    {report.impression}
                  </p>
                </div>
              )}

              {report.recommendations && (
                <div className="pt-2 print:pt-1.5 border-t border-slate-200 dark:border-slate-700 print:border-slate-200">
                  <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white print:text-slate-900 tracking-wider print:text-[10px]">
                    Physician Advice / Recommendations:
                  </h4>
                  <p className="text-xs text-slate-800 dark:text-slate-200 print:text-slate-800 mt-0.5 leading-relaxed print:text-[11px]">
                    {report.recommendations}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer Signature */}
          <div className="pt-6 sm:pt-8 print:pt-3 border-t border-slate-300 dark:border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-end justify-between gap-4 print:gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 print:text-[10px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 print:w-3.5 print:h-3.5" />
                <span>Verified Electronic Health Record</span>
              </div>
              <p className="text-[10px] print:text-[9px] text-slate-400 dark:text-slate-500">
                Generated via Apex Pharmacy CRM System
              </p>
            </div>

            <div className="text-center w-48">
              <div className="border-b border-slate-400 dark:border-slate-600 pb-1 mb-1 text-slate-800 dark:text-slate-200 font-serif italic text-sm print:text-xs">
                {report.technicianName || 'Dr. Sarah Jenkins'}
              </div>
              <p className="text-[11px] print:text-[10px] font-bold text-slate-900 dark:text-white">Medical Technologist / Pathologist</p>
              <p className="text-[10px] print:text-[9px] text-slate-500 dark:text-slate-400">Authorized Signatory</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
