import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  RotateCcw,
  User,
  Calendar,
  Tag,
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  Eye,
  X,
  Check,
  Building2,
  Coins,
  ChevronDown,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { StaffSalary, SalaryStatus } from '../types';

export const StaffSalaryPage: React.FC = () => {
  const {
    staff,
    staffSalaries,
    addStaffSalary,
    updateStaffSalary,
    deleteStaffSalary,
  } = useData();

  // Filters state
  const [selectedStaff, setSelectedStaff] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Check if any filter is currently applied
  const isFilterApplied = useMemo(() => {
    return (
      selectedStaff !== 'All' ||
      selectedYear !== 'All' ||
      selectedMonth !== 'All' ||
      selectedStatus !== 'All' ||
      searchTerm.trim() !== ''
    );
  }, [selectedStaff, selectedYear, selectedMonth, selectedStatus, searchTerm]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<StaffSalary | null>(null);
  const [viewingSalary, setViewingSalary] = useState<StaffSalary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    staffId: '',
    staffName: '',
    year: '2025–2026',
    month: 'March',
    baseSalary: 1000,
    bonus: 0,
    taxPercentage: 0,
    taxAmount: 0,
    advance: 0,
    totalSalary: 1000,
    paidAmount: 0,
    remainingAmount: 1000,
    paymentDate: new Date().toISOString().split('T')[0],
  });

  const handleClearFilters = () => {
    setSelectedStaff('All');
    setSelectedYear('All');
    setSelectedMonth('All');
    setSelectedStatus('All');
    setSearchTerm('');
  };

  // Available unique years for dropdown filter
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    staffSalaries.forEach(s => {
      if (s.year) years.add(s.year);
    });
    return Array.from(years);
  }, [staffSalaries]);

  // Months list
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filtered salary records (Instant reactive search as user types or changes selects)
  const filteredSalaries = useMemo(() => {
    return staffSalaries.filter(item => {
      if (selectedStaff !== 'All' && item.staffName !== selectedStaff && item.staffId !== selectedStaff) {
        return false;
      }
      if (selectedYear !== 'All' && item.year !== selectedYear) {
        return false;
      }
      if (selectedMonth !== 'All' && item.month !== selectedMonth) {
        return false;
      }
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = item.staffName.toLowerCase().includes(query);
        const yearMatch = item.year.toLowerCase().includes(query);
        const monthMatch = item.month.toLowerCase().includes(query);
        if (!nameMatch && !yearMatch && !monthMatch) return false;
      }
      return true;
    });
  }, [staffSalaries, selectedStaff, selectedYear, selectedMonth, selectedStatus, searchTerm]);

  // Aggregate stats totals
  const stats = useMemo(() => {
    let totalBasic = 0;
    let totalSalary = 0;
    let totalReceived = 0;
    let totalRemaining = 0;

    filteredSalaries.forEach(s => {
      totalBasic += Number(s.baseSalary) || 0;
      totalSalary += Number(s.totalSalary) || 0;
      totalReceived += Number(s.paidAmount) || 0;
      totalRemaining += Number(s.remainingAmount) || 0;
    });

    return {
      totalBasic,
      totalSalary,
      totalReceived,
      totalRemaining,
    };
  }, [filteredSalaries]);

  // Auto calculate form totals
  const updateFormCalculations = (fields: Partial<typeof formData>) => {
    const merged = { ...formData, ...fields };
    const base = Number(merged.baseSalary) || 0;
    const bonus = Number(merged.bonus) || 0;
    const taxPct = Number(merged.taxPercentage) || 0;
    const taxAmt = merged.taxAmount !== undefined && fields.taxAmount !== undefined
      ? Number(merged.taxAmount) || 0
      : (base * taxPct) / 100;
    const advance = Number(merged.advance) || 0;
    
    const calculatedTotal = base + bonus - taxAmt - advance;
    const total = calculatedTotal < 0 ? 0 : calculatedTotal;
    const paid = Number(merged.paidAmount) || 0;
    const rem = total - paid;

    setFormData({
      ...merged,
      taxAmount: Math.round(taxAmt * 100) / 100,
      totalSalary: Math.round(total * 100) / 100,
      remainingAmount: Math.round(rem * 100) / 100,
    });
  };

  const handleOpenAddModal = () => {
    const firstStaff = staff[0];
    const staffName = firstStaff ? `${firstStaff.firstName} ${firstStaff.lastName}` : 'Donovan Gillespie';
    const staffId = firstStaff ? firstStaff.id : 'st-1';

    setFormData({
      staffId,
      staffName,
      year: '2025–2026',
      month: 'March',
      baseSalary: 1200,
      bonus: 100,
      taxPercentage: 5,
      taxAmount: 60,
      advance: 0,
      totalSalary: 1240,
      paidAmount: 500,
      remainingAmount: 740,
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setEditingSalary(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (salary: StaffSalary) => {
    setEditingSalary(salary);
    setFormData({
      staffId: salary.staffId,
      staffName: salary.staffName,
      year: salary.year,
      month: salary.month,
      baseSalary: salary.baseSalary,
      bonus: salary.bonus,
      taxPercentage: salary.taxPercentage,
      taxAmount: salary.taxAmount,
      advance: salary.advance,
      totalSalary: salary.totalSalary,
      paidAmount: salary.paidAmount,
      remainingAmount: salary.remainingAmount,
      paymentDate: salary.paymentDate,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.staffName || !formData.year || !formData.month) {
      return;
    }

    const total = formData.totalSalary;
    const paid = formData.paidAmount;
    const rem = formData.remainingAmount;

    let computedStatus: SalaryStatus = 'Unpaid';
    if (rem <= 0 && paid >= total && total > 0) {
      computedStatus = 'Paid';
    } else if (paid > 0) {
      computedStatus = 'Partially paid';
    }

    if (editingSalary) {
      updateStaffSalary(editingSalary.id, {
        staffId: formData.staffId,
        staffName: formData.staffName,
        year: formData.year,
        month: formData.month,
        baseSalary: Number(formData.baseSalary),
        bonus: Number(formData.bonus),
        taxPercentage: Number(formData.taxPercentage),
        taxAmount: Number(formData.taxAmount),
        advance: Number(formData.advance),
        totalSalary: Number(formData.totalSalary),
        paidAmount: Number(formData.paidAmount),
        remainingAmount: Number(formData.remainingAmount),
        paymentDate: formData.paymentDate,
        status: computedStatus,
      });
    } else {
      addStaffSalary({
        staffId: formData.staffId,
        staffName: formData.staffName,
        year: formData.year,
        month: formData.month,
        baseSalary: Number(formData.baseSalary),
        bonus: Number(formData.bonus),
        taxPercentage: Number(formData.taxPercentage),
        taxAmount: Number(formData.taxAmount),
        advance: Number(formData.advance),
        totalSalary: Number(formData.totalSalary),
        paidAmount: Number(formData.paidAmount),
        remainingAmount: Number(formData.remainingAmount),
        paymentDate: formData.paymentDate,
        status: computedStatus,
      });
    }

    setIsAddModalOpen(false);
    setEditingSalary(null);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteStaffSalary(deletingId);
      setDeletingId(null);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const getStatusBadge = (status: SalaryStatus) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Paid
          </span>
        );
      case 'Partially paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Coins className="w-3.5 h-3.5" />
            Partially paid
          </span>
        );
      case 'Unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Unpaid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400">
            {status}
          </span>
        );
    }
  };

  const renderStatusDropdown = (salary: StaffSalary) => {
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value as SalaryStatus;
      updateStaffSalary(salary.id, { status: newStatus });
    };

    let badgeColor = 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    let Icon = AlertCircle;

    if (salary.status === 'Paid') {
      badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      Icon = CheckCircle2;
    } else if (salary.status === 'Partially paid') {
      badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      Icon = Coins;
    } else if (salary.status === 'Unpaid') {
      badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      Icon = AlertCircle;
    }

    return (
      <div className={`relative inline-flex items-center justify-center w-[130px] px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor} transition-colors cursor-pointer select-none mx-auto text-center`}>
        <div className="flex items-center justify-center gap-1.5 min-w-0 text-center">
          <Icon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate text-center">{salary.status}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-80 ml-1" />
        <select
          value={salary.status}
          onChange={handleStatusChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none text-center"
        >
          <option value="Paid" className="text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            Paid
          </option>
          <option value="Partially paid" className="text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            Partially paid
          </option>
          <option value="Unpaid" className="text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            Unpaid
          </option>
        </select>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Staff Salary
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage pharmacy personnel compensation, salary structures, tax deductions, and disbursements.
          </p>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL BASIC */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Basic
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(stats.totalBasic)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* TOTAL SALARY */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Salary
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(stats.totalSalary)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* TOTAL RECEIVED */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Received
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(stats.totalReceived)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* TOTAL REMAINING */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Remaining
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {formatCurrency(stats.totalRemaining)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar Section */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Staff Filter */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Staff
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedStaff}
                onChange={e => setSelectedStaff(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-9 py-2 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="All">All Staff</option>
                {staff.map(s => (
                  <option key={s.id} value={`${s.firstName} ${s.lastName}`}>
                    {s.firstName} {s.lastName} ({s.role})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Year
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-9 py-2 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="All">All Years</option>
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
                <option value="2028–2029">2028–2029</option>
                <option value="2025–2026">2025–2026</option>
                <option value="1994–1234">1994–1234</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Month Filter */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Month
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-9 py-2 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="All">All Months</option>
                {monthsList.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Status
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-9 py-2 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partially paid">Partially paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Action / Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-700/50">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search staff, year, month..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isFilterApplied && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600/60 transition-all cursor-pointer whitespace-nowrap"
                title="Clear Filters"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Filter
              </button>
            )}

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Salary
            </button>
          </div>
        </div>
      </div>

      {/* Salary Records Data Table */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/80 font-semibold">
              <tr>
                <th className="py-3.5 px-4">S.N</th>
                <th className="py-3.5 px-4">Staff Name</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">Month</th>
                <th className="py-3.5 px-4">Base Salary</th>
                <th className="py-3.5 px-4">Bonus</th>
                <th className="py-3.5 px-4">Tax Amount</th>
                <th className="py-3.5 px-4">Advance</th>
                <th className="py-3.5 px-4">Total Salary</th>
                <th className="py-3.5 px-4">Paid Amount</th>
                <th className="py-3.5 px-4">Remaining Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-2 opacity-50" />
                    <p className="text-base font-medium">No staff salary records found</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filter search or create a new salary record.</p>
                  </td>
                </tr>
              ) : (
                filteredSalaries.map((salary, index) => (
                  <tr
                    key={salary.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-xs">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {salary.staffName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {salary.year}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-800 dark:text-slate-200">
                      {salary.month}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700 dark:text-slate-200">
                      {formatCurrency(salary.baseSalary)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {formatCurrency(salary.bonus)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-rose-600 dark:text-rose-400">
                      {formatCurrency(salary.taxAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-amber-600 dark:text-amber-400">
                      {formatCurrency(salary.advance)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {formatCurrency(salary.totalSalary)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {formatCurrency(salary.paidAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      {formatCurrency(salary.remainingAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {renderStatusDropdown(salary)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingSalary(salary)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                          title="View Slip Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(salary)}
                          className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all cursor-pointer"
                          title="Edit Salary"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeletingId(salary.id)}
                          className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ADD / EDIT SALARY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingSalary ? 'Edit Staff Salary' : 'Add New Staff Salary'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fill in the details below
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/60 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSalary} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Staff Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Staff <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.staffName}
                      onChange={e => {
                        const selected = staff.find(
                          s => `${s.firstName} ${s.lastName}` === e.target.value
                        );
                        updateFormCalculations({
                          staffName: e.target.value,
                          staffId: selected ? selected.id : formData.staffId,
                        });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-9 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="">Select Staff</option>
                      {staff.map(s => {
                        const fullName = `${s.firstName} ${s.lastName}`;
                        return (
                          <option key={s.id} value={fullName}>
                            {fullName} ({s.role})
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Year Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.year}
                      onChange={e => updateFormCalculations({ year: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-9 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="2025–2026">2025–2026</option>
                      <option value="2026–2027">2026–2027</option>
                      <option value="2027–2028">2027–2028</option>
                      <option value="2028–2029">2028–2029</option>
                      <option value="2024–2025">2024–2025</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Month Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Month <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.month}
                      onChange={e => updateFormCalculations({ month: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-9 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      {monthsList.map(m => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Base Salary */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Base Salary <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={formData.baseSalary}
                    onChange={e =>
                      updateFormCalculations({ baseSalary: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Bonus */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bonus
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.bonus}
                    onChange={e =>
                      updateFormCalculations({ bonus: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Tax Percentage */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tax Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.taxPercentage}
                    onChange={e =>
                      updateFormCalculations({ taxPercentage: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Tax Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tax Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.taxAmount}
                    onChange={e =>
                      updateFormCalculations({ taxAmount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Advance */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Advance ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.advance}
                    onChange={e =>
                      updateFormCalculations({ advance: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Total Salary (Calculated) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Salary ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    value={formData.totalSalary}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-emerald-600 dark:text-emerald-400 font-bold font-mono cursor-not-allowed"
                  />
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paid Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.paidAmount}
                    onChange={e =>
                      updateFormCalculations({ paidAmount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Remaining Amount (Calculated) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Remaining Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    value={formData.remainingAmount}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-amber-600 dark:text-amber-400 font-bold font-mono cursor-not-allowed"
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={e => updateFormCalculations({ paymentDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW SLIP DETAILS MODAL */}
      {viewingSalary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Salary Slip Breakdown</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{viewingSalary.staffName} - {viewingSalary.month} ({viewingSalary.year})</p>
              </div>
              <button
                onClick={() => setViewingSalary(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Staff Name</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{viewingSalary.staffName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Period</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{viewingSalary.month} {viewingSalary.year}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Payment Date</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{viewingSalary.paymentDate || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Status</span>
                  <div className="mt-0.5">{getStatusBadge(viewingSalary.status)}</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3">
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Base Salary</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">{formatCurrency(viewingSalary.baseSalary)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Bonus</span>
                  <span className="font-mono">+{formatCurrency(viewingSalary.bonus)}</span>
                </div>
                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                  <span>Tax ({viewingSalary.taxPercentage}%)</span>
                  <span className="font-mono">-{formatCurrency(viewingSalary.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>Advance</span>
                  <span className="font-mono">-{formatCurrency(viewingSalary.advance)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white">
                  <span>Net Salary</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(viewingSalary.totalSalary)}</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 pt-1">
                  <span>Paid Amount</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(viewingSalary.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-semibold">
                  <span>Remaining Due</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">{formatCurrency(viewingSalary.remainingAmount)}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewingSalary(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Staff Salary Record</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete this salary record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
