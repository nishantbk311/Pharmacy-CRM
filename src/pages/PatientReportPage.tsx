import { ChevronRight, Download, Filter, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export const PatientReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = useData();

  const [dateRange, setDateRange] = useState<string>('30days');
  const [reportType, setReportType] = useState<string>('demographics');

  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'Active').length;
  const inProgressPatients = patients.filter(p => p.treatmentStatus === 'In Progress').length;
  const completedPatients = patients.filter(p => p.treatmentStatus === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 dark:hover:text-sky-400">
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button onClick={() => navigate('/patients')} className="hover:text-blue-600 dark:hover:text-sky-400">
              Patients
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Patient Report</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Patient Demographics & Treatment Report
          </h1>
        </div>

        <button
          onClick={() => alert('Exporting patient report...')}
          className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          >
            <option value="demographics">Patient Demographics Summary</option>
            <option value="treatment">Treatment Status Breakdown</option>
            <option value="insurance">Insurance Coverage Distribution</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">This Year</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => alert('Report refreshed.')}
            className="w-full px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Filter className="w-3.5 h-3.5" />
            Apply Filter
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalPatients}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12% this month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Accounts</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{activePatients}</p>
          <p className="text-[11px] text-slate-500 font-medium">98% verification rate</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress Treatment</p>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-sky-400">{inProgressPatients}</p>
          <p className="text-[11px] text-slate-500 font-medium">Active drug regimens</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Treatments</p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{completedPatients}</p>
          <p className="text-[11px] text-slate-500 font-medium">Successfully discharged</p>
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Patient Medical Report Records
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">MRN</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Gender / DOB</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Insurance</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-blue-600 dark:text-sky-400">{p.mrn}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {p.fullName || `${p.firstName} ${p.lastName}`}
                  </td>
                  <td className="py-3 px-4">{p.gender}, {p.dob}</td>
                  <td className="py-3 px-4">{p.doctor || 'Unassigned'}</td>
                  <td className="py-3 px-4 max-w-xs truncate">{p.medicalCondition || 'N/A'}</td>
                  <td className="py-3 px-4">{p.insuranceProvider}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
