import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, FileSpreadsheet, Check, AlertTriangle, Stethoscope, UserCheck, Calendar, Building2, HelpCircle, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ReportCategory, LabReport, LabReportParameter } from '../../types';
import { TEST_TEMPLATES, TestTemplate } from '../../data/reportTemplates';

interface GenerateReportModalProps {
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

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { patients, doctors, addLabReport } = useData();

  const getDoctorName = (doc: any) => {
    if (!doc) return 'Dr. Robert Chen';
    return doc.fullName || `${doc.firstName} ${doc.lastName}`;
  };

  // Basic Info State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [customPatientName, setCustomPatientName] = useState<string>('');
  const [category, setCategory] = useState<ReportCategory>('Blood Test');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('blood-cbc');
  const [customTestName, setCustomTestName] = useState<string>('');
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [referredDoctor, setReferredDoctor] = useState<string>(getDoctorName(doctors[0]));
  const [labName, setLabName] = useState<string>('Central City Diagnostics');
  const [status, setStatus] = useState<'Normal' | 'Abnormal' | 'Critical' | 'Pending Review'>('Normal');

  // Parameters State
  const [parameters, setParameters] = useState<LabReportParameter[]>([]);
  const [impression, setImpression] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');

  // Sync patients/doctors when modal opens
  useEffect(() => {
    if (isOpen) {
      if (patients.length > 0 && (!selectedPatientId || !patients.some(p => p.id === selectedPatientId))) {
        setSelectedPatientId(patients[0].id);
      }
      if (doctors.length > 0) {
        setReferredDoctor(getDoctorName(doctors[0]));
      }
    }
  }, [isOpen, patients, doctors]);

  // Get available templates for selected category
  const categoryTemplates = TEST_TEMPLATES.filter(t => t.category === category);

  // When Category or Template changes, populate parameters
  useEffect(() => {
    const templates = TEST_TEMPLATES.filter(t => t.category === category);
    if (templates.length > 0) {
      const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
      setSelectedTemplateId(activeTemplate.id);
      setCustomTestName(activeTemplate.testName);
      
      const mappedParams: LabReportParameter[] = activeTemplate.defaultParameters.map((p, idx) => ({
        id: `param-${Date.now()}-${idx}`,
        ...p,
      }));
      setParameters(mappedParams);
      setImpression(activeTemplate.defaultImpression || '');
      setRecommendations(activeTemplate.defaultRecommendations || '');
    } else {
      // Custom / fallback
      setSelectedTemplateId('custom');
      setCustomTestName(`${category} Comprehensive Panel`);
      setParameters([
        { id: `param-${Date.now()}-1`, name: 'Primary Parameter', value: 'Normal', unit: 'N/A', normalRange: 'Normal', flag: 'Normal' }
      ]);
      setImpression('');
      setRecommendations('');
    }
  }, [category]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === 'custom') {
      setCustomTestName(`Custom ${category} Test`);
      setParameters([
        { id: `param-${Date.now()}-1`, name: 'Test Parameter 1', value: '', unit: '', normalRange: '', flag: 'Normal' }
      ]);
      return;
    }
    const template = TEST_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setCustomTestName(template.testName);
      setParameters(template.defaultParameters.map((p, idx) => ({
        id: `param-${Date.now()}-${idx}`,
        ...p,
      })));
      setImpression(template.defaultImpression || '');
      setRecommendations(template.defaultRecommendations || '');
    }
  };

  if (!isOpen) return null;

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientName = selectedPatient
    ? (selectedPatient.fullName || `${selectedPatient.firstName} ${selectedPatient.lastName}`)
    : (customPatientName || 'Walk-in Patient');
  
  const patientMrn = selectedPatient?.mrn || 'MRN-NEW';
  const patientAgeGender = selectedPatient ? `${selectedPatient.dob || 'Age N/A'} / ${selectedPatient.gender}` : 'N/A';

  // Handler to modify parameter row fields
  const handleParameterChange = (id: string, field: keyof LabReportParameter, value: any) => {
    setParameters(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };

        // Quick auto-flag helper if value or normalRange is numeric/string
        if (field === 'value' && updated.normalRange) {
          const numVal = parseFloat(value);
          if (!isNaN(numVal)) {
            if (updated.normalRange.includes('<')) {
              const max = parseFloat(updated.normalRange.replace(/[^0-9.]/g, ''));
              if (!isNaN(max) && numVal > max) updated.flag = 'High';
            } else if (updated.normalRange.includes('>')) {
              const min = parseFloat(updated.normalRange.replace(/[^0-9.]/g, ''));
              if (!isNaN(min) && numVal < min) updated.flag = 'Low';
            } else if (updated.normalRange.includes('-')) {
              const parts = updated.normalRange.split('-').map(s => parseFloat(s.replace(/[^0-9.]/g, '')));
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                if (numVal < parts[0]) updated.flag = 'Low';
                else if (numVal > parts[1]) updated.flag = 'High';
                else updated.flag = 'Normal';
              }
            }
          }
        }
        return updated;
      })
    );
  };

  const handleAddParameterRow = () => {
    const newParam: LabReportParameter = {
      id: `param-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: 'New Test Parameter',
      value: '',
      unit: '',
      normalRange: '',
      flag: 'Normal',
    };
    setParameters(prev => [...prev, newParam]);
  };

  const handleDeleteParameterRow = (id: string) => {
    setParameters(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any parameter is flagged high/low/abnormal to suggest status
    const hasAbnormal = parameters.some(p => p.flag === 'High' || p.flag === 'Low' || p.flag === 'Abnormal');
    const finalStatus = status === 'Normal' && hasAbnormal ? 'Abnormal' : status;

    const newReport = addLabReport({
      patientId: selectedPatientId || 'p-custom',
      patientName,
      patientMrn,
      patientAgeGender,
      category,
      testName: customTestName || `${category} Test`,
      mode: 'Generated',
      reportDate,
      referredDoctor,
      labName,
      status: finalStatus,
      parameters,
      impression,
      recommendations,
    });

    if (onSuccess) onSuccess(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Generate Custom Clinical Report
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  Builder Mode
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select test category, test package, and manually input parameter values and reference ranges
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* STEP 1: CATEGORY & TEST SELECTOR */}
          <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 p-4 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Step 1: Select Report Type & Test Package
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Report Type / Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ReportCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  2. Select Available Test Template <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={e => handleTemplateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {categoryTemplates.map(tmpl => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.testName}
                    </option>
                  ))}
                  <option value="custom">+ Custom Blank Template</option>
                </select>
              </div>

              {/* Custom Test Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Report Title / Test Name
                </label>
                <input
                  type="text"
                  value={customTestName}
                  onChange={e => setCustomTestName(e.target.value)}
                  placeholder="e.g. Complete Blood Count (CBC)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: PATIENT & DOCTOR METADATA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Patient <span className="text-rose-500">*</span>
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
                <option value="">+ Custom Patient</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Referred Doctor
              </label>
              <input
                type="text"
                value={referredDoctor}
                onChange={e => setReferredDoctor(e.target.value)}
                placeholder="Dr. Robert Chen"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Diagnostic Center
              </label>
              <input
                type="text"
                value={labName}
                onChange={e => setLabName(e.target.value)}
                placeholder="Central City Diagnostics"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 3: MANUAL PARAMETERS & VALUES INPUT TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Step 2: Test Parameters & Normal Ranges</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    ({parameters.length} test items)
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Manually edit parameter names, observed values, units, normal reference ranges, and result flags.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddParameterRow}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Parameter Row
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3 min-w-[160px]">Test Parameter Name</th>
                      <th className="py-2.5 px-3 min-w-[140px]">Observed Value</th>
                      <th className="py-2.5 px-3 w-28">Unit</th>
                      <th className="py-2.5 px-3 min-w-[140px]">Normal Range</th>
                      <th className="py-2.5 px-3 w-32 text-center">Flag / Status</th>
                      <th className="py-2.5 px-2 w-10 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {parameters.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No parameters added yet. Click "+ Add Parameter Row" to begin.
                        </td>
                      </tr>
                    ) : (
                      parameters.map((param, index) => (
                        <tr key={param.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          {/* Parameter Name */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={param.name}
                              onChange={e => handleParameterChange(param.id, 'name', e.target.value)}
                              placeholder="e.g. Hemoglobin"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>

                          {/* Observed Value */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={param.value}
                              onChange={e => handleParameterChange(param.id, 'value', e.target.value)}
                              placeholder="e.g. 14.2 or Clear"
                              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:ring-2 focus:outline-none ${
                                param.flag === 'High' || param.flag === 'Low' || param.flag === 'Abnormal'
                                  ? 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                              }`}
                            />
                          </td>

                          {/* Unit */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={param.unit}
                              onChange={e => handleParameterChange(param.id, 'unit', e.target.value)}
                              placeholder="g/dL, mg/dL..."
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>

                          {/* Normal Reference Range */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={param.normalRange}
                              onChange={e => handleParameterChange(param.id, 'normalRange', e.target.value)}
                              placeholder="e.g. 12.0 - 16.0"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </td>

                          {/* Flag / Status Selection */}
                          <td className="py-2 px-3 text-center">
                            <select
                              value={param.flag}
                              onChange={e => handleParameterChange(param.id, 'flag', e.target.value)}
                              className={`w-full px-2 py-1.5 rounded-lg border text-[11px] font-bold focus:outline-none ${
                                param.flag === 'Normal'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                  : param.flag === 'High'
                                  ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                  : param.flag === 'Low'
                                  ? 'bg-sky-50 border-sky-300 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                                  : 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                              }`}
                            >
                              <option value="Normal">Normal</option>
                              <option value="High">High ↑</option>
                              <option value="Low">Low ↓</option>
                              <option value="Abnormal">Abnormal</option>
                            </select>
                          </td>

                          {/* Action */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteParameterRow(param.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all cursor-pointer"
                              title="Delete Parameter"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* STEP 4: DOCTOR IMPRESSION & RECOMMENDATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Impression / Primary Findings
              </label>
              <textarea
                rows={3}
                value={impression}
                onChange={e => setImpression(e.target.value)}
                placeholder="Summary conclusion of laboratory/imaging results..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Doctor Recommendations & Plan
              </label>
              <textarea
                rows={3}
                value={recommendations}
                onChange={e => setRecommendations(e.target.value)}
                placeholder="Treatment modifications, repeat testing schedule, or lifestyle advice..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Overall Result Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Overall Report Classification
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Determines badge color in patient records
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['Normal', 'Abnormal', 'Critical', 'Pending Review'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    status === st
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Generate & Save Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
