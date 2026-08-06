import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Calendar, UserCheck, Stethoscope, Building2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ReportCategory, LabReport } from '../../types';

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (report: LabReport) => void;
}

const CATEGORIES: ReportCategory[] = [
  'Blood Test',
  'X-Ray',
  'CT Scan',
  'MRI',
  'Urine Analysis',
  'Ultrasound',
  'ECG/EKG',
  'Pathology',
  'Other',
];

export const UploadReportModal: React.FC<UploadReportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { patients, doctors, addLabReport } = useData();

  const getDoctorName = (doc: any) => {
    if (!doc) return 'Dr. Robert Chen';
    return doc.fullName || `${doc.firstName} ${doc.lastName}`;
  };

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [customPatientName, setCustomPatientName] = useState<string>('');
  const [category, setCategory] = useState<ReportCategory>('Blood Test');
  const [testName, setTestName] = useState<string>('');
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [referredDoctor, setReferredDoctor] = useState<string>(getDoctorName(doctors[0]));
  const [labName, setLabName] = useState<string>('Central Diagnostics Lab');
  const [status, setStatus] = useState<'Normal' | 'Abnormal' | 'Critical' | 'Pending Review'>('Normal');
  const [notes, setNotes] = useState<string>('');

  // File state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Sync state when modal opens or patients/doctors change
  React.useEffect(() => {
    if (isOpen) {
      if (patients.length > 0 && (!selectedPatientId || !patients.some(p => p.id === selectedPatientId))) {
        setSelectedPatientId(patients[0].id);
      }
      if (doctors.length > 0) {
        setReferredDoctor(getDoctorName(doctors[0]));
      }
    }
  }, [isOpen, patients, doctors]);

  if (!isOpen) return null;

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientName = selectedPatient
    ? (selectedPatient.fullName || `${selectedPatient.firstName} ${selectedPatient.lastName}`)
    : (customPatientName || 'Guest Patient');
  
  const patientMrn = selectedPatient?.mrn || 'MRN-NEW';
  const patientAgeGender = selectedPatient ? `${selectedPatient.dob || 'Age N/A'} / ${selectedPatient.gender}` : 'N/A';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.type || 'application/pdf',
      });
      if (!testName) {
        setTestName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.type || 'application/pdf',
      });
      if (!testName) {
        setTestName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTestName = testName.trim() || `${category} Document`;

    const newReport = addLabReport({
      patientId: selectedPatientId || 'p-custom',
      patientName,
      patientMrn,
      patientAgeGender,
      category,
      testName: finalTestName,
      mode: 'Uploaded',
      reportDate,
      referredDoctor,
      labName,
      status,
      fileName: uploadedFile?.name || `${finalTestName.replace(/\s+/g, '_')}_Report.pdf`,
      fileType: uploadedFile?.type || 'application/pdf',
      fileSize: uploadedFile?.size || '1.8 MB',
      fileUrl: '#',
      uploadedDate: new Date().toISOString().split('T')[0],
      notes,
    });

    if (onSuccess) onSuccess(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-sky-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Medical Lab Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attach an existing document scan, PDF, or radiology image
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Patient Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Select Patient <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.fullName || `${p.firstName} ${p.lastName}`} ({p.mrn})
                  </option>
                ))}
                <option value="">+ Add Custom Patient Name</option>
              </select>
            </div>

            {!selectedPatientId && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Patient Name
                </label>
                <input
                  type="text"
                  value={customPatientName}
                  onChange={e => setCustomPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Report Type / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ReportCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Test Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specific Test / Title
              </label>
              <input
                type="text"
                value={testName}
                onChange={e => setTestName(e.target.value)}
                placeholder="e.g. CBC, Lipid Profile, Chest X-Ray..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Report Date
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={e => setReportDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Doctor & Lab Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Referred Doctor
              </label>
              <input
                type="text"
                value={referredDoctor}
                onChange={e => setReferredDoctor(e.target.value)}
                placeholder="e.g. Dr. Robert Chen"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Diagnostic Center / Lab Name
              </label>
              <input
                type="text"
                value={labName}
                onChange={e => setLabName(e.target.value)}
                placeholder="e.g. Apex Imaging / Central Diagnostics"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Result Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
                { label: 'Abnormal', color: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
                { label: 'Critical', color: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
                { label: 'Pending Review', color: 'bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
              ].map(st => (
                <button
                  type="button"
                  key={st.label}
                  onClick={() => setStatus(st.label as any)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                    status === st.label
                      ? `${st.color} ring-2 ring-blue-500/50 shadow-xs font-extrabold`
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop File Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Report File Attachment (PDF, Image, Scan) <span className="text-rose-500">*</span>
            </label>
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.dcm"
                className="hidden"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-sky-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                {uploadedFile ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {uploadedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Size: {uploadedFile.size} | Click or drop another file to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to choose file or drag and drop here
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Supported formats: PDF, JPG, PNG, DICOM (Max size: 25MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Notes / Findings */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Summary Notes / Findings
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add key highlights or radiologist / lab technician comments..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Save Uploaded Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
