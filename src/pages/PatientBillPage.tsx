

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Receipt, Plus, User as UserIcon, Trash2, Pencil, Printer, CheckCircle2, SlidersHorizontal, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { PatientBill, PatientBillMedicineItem } from '../types';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';

export const PatientBillPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { patients, medicines, patientBills, addPatientBill, updatePatientBill, deletePatientBill, showToast } = useData();

  // Determine if we are on the create page route or list page
  const isCreateRoute = location.pathname.endsWith('/create');

  // Filter state for list view
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>('all');

  // Sync patient filter from URL parameter
  useEffect(() => {
    const patientParam = searchParams.get('patient') || searchParams.get('patientId') || searchParams.get('q');
    if (patientParam) {
      const matched = patients.find(
        p =>
          p.id === patientParam ||
          (p.fullName && p.fullName.toLowerCase() === patientParam.toLowerCase()) ||
          `${p.firstName} ${p.lastName}`.toLowerCase() === patientParam.toLowerCase() ||
          p.firstName.toLowerCase() === patientParam.toLowerCase()
      );
      if (matched) {
        setSelectedPatientFilter(matched.id);
        setSelectedPatientId(matched.id);
      } else {
        setSelectedPatientFilter(patientParam);
      }
    }
  }, [searchParams, patients]);

  // View / Print modal state
  const [viewingBill, setViewingBill] = useState<PatientBill | null>(null);

  // Delete Bill state
  const [deletingBill, setDeletingBill] = useState<PatientBill | null>(null);

  // Edit Bill Modal state
  const [editingBill, setEditingBill] = useState<PatientBill | null>(null);
  const [editPatientId, setEditPatientId] = useState<string>('');
  const [editBillDate, setEditBillDate] = useState<string>('');
  const [editPaidAmountInput, setEditPaidAmountInput] = useState<string>('0');
  const [editStatusOverride, setEditStatusOverride] = useState<PatientBill['status']>('Unpaid');
  const [editNotesText, setEditNotesText] = useState<string>('');
  const [editItems, setEditItems] = useState<
    {
      id: string;
      medicineId: string;
      medicineName: string;
      price: number;
      qty: number;
      discPercent: number;
      vatPercent: number;
    }[]
  >([]);

  const handleOpenEditModal = (bill: PatientBill) => {
    setEditingBill(bill);
    setEditPatientId(bill.patientId);
    setEditBillDate(bill.billDate || new Date().toISOString().split('T')[0]);
    setEditPaidAmountInput(bill.paidAmount ? bill.paidAmount.toString() : '0');
    setEditStatusOverride(bill.status || 'Unpaid');
    setEditNotesText(bill.notes || '');
    setEditItems(
      (bill.medicines || []).map((m, idx) => ({
        id: m.id || `edit-item-${idx}-${Date.now()}`,
        medicineId: m.medicineId || '',
        medicineName: m.medicineName || '',
        price: m.price || 0,
        qty: m.qty || 1,
        discPercent: m.discPercent || 0,
        vatPercent: m.vatPercent || 0,
      }))
    );
  };

  const handleQuickStatusChange = (bill: PatientBill, newStatus: PatientBill['status']) => {
    let updatedPaid = bill.paidAmount;
    let updatedDue = bill.dueAmount;

    if (newStatus === 'Paid') {
      updatedPaid = bill.totalAmount;
      updatedDue = 0;
    } else if (newStatus === 'Unpaid') {
      updatedPaid = 0;
      updatedDue = bill.totalAmount;
    } else if (newStatus === 'Partial') {
      if (bill.paidAmount <= 0 || bill.paidAmount >= bill.totalAmount) {
        updatedPaid = Math.round((bill.totalAmount / 2) * 100) / 100;
        updatedDue = Math.max(0, bill.totalAmount - updatedPaid);
      }
    }

    updatePatientBill(bill.id, {
      status: newStatus,
      paidAmount: updatedPaid,
      dueAmount: updatedDue,
    });
  };

  const handleEditStatusSelectChange = (newStatus: PatientBill['status']) => {
    setEditStatusOverride(newStatus);
    if (newStatus === 'Paid') {
      setEditPaidAmountInput(editTotalAmount.toString());
    } else if (newStatus === 'Unpaid') {
      setEditPaidAmountInput('0');
    }
  };

  const handleAddEditMedicineItem = () => {
    setEditItems(prev => [
      ...prev,
      {
        id: `edit-item-${Date.now()}-${prev.length + 1}`,
        medicineId: '',
        medicineName: '',
        price: 0,
        qty: 1,
        discPercent: 0,
        vatPercent: 0,
      },
    ]);
    showToast('Item row added to bill.');
  };

  const handleRemoveEditMedicineItem = (id: string) => {
    setEditItems(prev => prev.filter(item => item.id !== id));
    showToast('Item row removed from bill.');
  };

  const handleEditItemChange = (
    id: string,
    field: 'medicineId' | 'qty' | 'price' | 'discPercent' | 'vatPercent',
    value: any
  ) => {
    setEditItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (field === 'medicineId') {
            const selectedMed = medicines.find(m => m.id === value);
            return {
              ...item,
              medicineId: value,
              medicineName: selectedMed ? selectedMed.drugName : '',
              price: selectedMed ? selectedMed.retailPrice : 0,
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Edit mode calculated totals
  const editSubtotal = useMemo(() => {
    return editItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 0), 0);
  }, [editItems]);

  const editDiscountAmount = useMemo(() => {
    return editItems.reduce((acc, item) => {
      const lineSub = (item.price || 0) * (item.qty || 0);
      return acc + lineSub * ((item.discPercent || 0) / 100);
    }, 0);
  }, [editItems]);

  const editVatAmount = useMemo(() => {
    return editItems.reduce((acc, item) => {
      const lineSub = (item.price || 0) * (item.qty || 0);
      const lineDisc = lineSub * ((item.discPercent || 0) / 100);
      return acc + (lineSub - lineDisc) * ((item.vatPercent || 0) / 100);
    }, 0);
  }, [editItems]);

  const editTotalAmount = useMemo(() => {
    return editSubtotal - editDiscountAmount + editVatAmount;
  }, [editSubtotal, editDiscountAmount, editVatAmount]);

  const editNumPaid = parseFloat(editPaidAmountInput) || 0;
  const editDueAmount = Math.max(0, editTotalAmount - editNumPaid);

  const handleSaveEditBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBill) return;

    const patientObj = patients.find(p => p.id === editPatientId);
    const patientName = patientObj
      ? patientObj.fullName || `${patientObj.firstName} ${patientObj.lastName}`
      : editingBill.patientName;

    const formattedMedicines: PatientBillMedicineItem[] = editItems.map(item => {
      const subtotal = item.price * item.qty;
      const discount = subtotal * (item.discPercent / 100);
      const vat = (subtotal - discount) * (item.vatPercent / 100);
      const lineTotal = subtotal - discount + vat;

      return {
        id: item.id,
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        price: item.price,
        qty: item.qty,
        subtotal,
        discPercent: item.discPercent,
        discount,
        vatPercent: item.vatPercent,
        vat,
        lineTotal,
      };
    });

    updatePatientBill(editingBill.id, {
      patientId: editPatientId,
      patientName,
      billDate: editBillDate,
      items: formattedMedicines,
      medicines: formattedMedicines,
      subTotal: editSubtotal,
      discountAmount: editDiscountAmount,
      vatAmount: editVatAmount,
      totalAmount: editTotalAmount,
      paidAmount: editNumPaid,
      dueAmount: editDueAmount,
      status: editStatusOverride,
      notes: editNotesText,
    });

    setEditingBill(null);
  };

  // Form state for Create Patient Bill
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [billDate, setBillDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paidAmountInput, setPaidAmountInput] = useState<string>('0');
  const [notesText] = useState<string>('');

  // Line items state for Create Patient Bill
  const [billItems, setBillItems] = useState<
    {
      id: string;
      medicineId: string;
      medicineName: string;
      price: number;
      qty: number;
      discPercent: number;
      vatPercent: number;
    }[]
  >([
    {
      id: `item-${Date.now()}-1`,
      medicineId: '',
      medicineName: '',
      price: 0,
      qty: 1,
      discPercent: 0,
      vatPercent: 0,
    },
  ]);

  // Handle adding a line item
  const handleAddMedicineItem = () => {
    setBillItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}-${prev.length + 1}`,
        medicineId: '',
        medicineName: '',
        price: 0,
        qty: 1,
        discPercent: 0,
        vatPercent: 0,
      },
    ]);
    showToast('Item row added.');
  };

  // Handle removing a line item
  const handleRemoveMedicineItem = (id: string) => {
    if (billItems.length === 1) return;
    setBillItems(prev => prev.filter(item => item.id !== id));
    showToast('Item row removed.');
  };

  // Handle selecting a medicine for a line item
  const handleSelectMedicine = (itemId: string, medId: string) => {
    const med = medicines.find(m => m.id === medId);
    setBillItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            medicineId: medId,
            medicineName: med ? `${med.drugName} (${med.strength})` : '',
            price: med ? med.retailPrice : 0,
          };
        }
        return item;
      })
    );
  };

  // Update item field value
  const handleUpdateItemField = (
    itemId: string,
    field: 'price' | 'qty' | 'discPercent' | 'vatPercent',
    value: number
  ) => {
    setBillItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Calculate totals for line items
  const computedItems = useMemo(() => {
    return billItems.map(item => {
      const price = item.price || 0;
      const qty = item.qty || 0;
      const subtotal = price * qty;
      const discPercent = item.discPercent || 0;
      const discount = (subtotal * discPercent) / 100;
      const taxable = subtotal - discount;
      const vatPercent = item.vatPercent || 0;
      const vat = (taxable * vatPercent) / 100;
      const lineTotal = taxable + vat;

      return {
        ...item,
        subtotal,
        discount,
        vat,
        lineTotal,
      };
    });
  }, [billItems]);

  // Overall totals calculation
  const summaryTotals = useMemo(() => {
    const subTotal = computedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    const totalDiscount = computedItems.reduce((acc, curr) => acc + curr.discount, 0);
    const totalVat = computedItems.reduce((acc, curr) => acc + curr.vat, 0);
    const grandTotal = subTotal - totalDiscount + totalVat;
    const paidAmount = parseFloat(paidAmountInput) || 0;
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    return {
      subTotal,
      totalDiscount,
      totalVat,
      grandTotal,
      paidAmount,
      dueAmount,
    };
  }, [computedItems, paidAmountInput]);

  // Handle Save Bill
  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === selectedPatientId);
    if (!patientObj && !selectedPatientId) {
      alert('Please select a patient.');
      return;
    }

    const patientName = patientObj
      ? patientObj.fullName || `${patientObj.firstName} ${patientObj.lastName}`
      : selectedPatientId;

    const medicinesList: PatientBillMedicineItem[] = computedItems.map(i => ({
      id: i.id,
      medicineId: i.medicineId,
      medicineName: i.medicineName || 'Unspecified Medicine',
      price: i.price,
      qty: i.qty,
      subtotal: i.subtotal,
      discPercent: i.discPercent,
      discount: i.discount,
      vatPercent: i.vatPercent,
      vat: i.vat,
      lineTotal: i.lineTotal,
    }));

    let status: 'Paid' | 'Partial' | 'Unpaid' | 'Due' = 'Paid';
    if (summaryTotals.dueAmount === 0) {
      status = 'Paid';
    } else if (summaryTotals.paidAmount > 0) {
      status = 'Partial';
    } else {
      status = 'Due';
    }

    addPatientBill({
      patientId: selectedPatientId,
      patientName,
      billDate,
      subTotal: summaryTotals.subTotal,
      discountAmount: summaryTotals.totalDiscount,
      vatAmount: summaryTotals.totalVat,
      totalAmount: summaryTotals.grandTotal,
      paidAmount: summaryTotals.paidAmount,
      dueAmount: summaryTotals.dueAmount,
      status,
      billedBy: user?.role === 'Super Admin' ? 'Super Admin' : user?.name || 'Super Admin',
      medicines: medicinesList,
      notes: notesText,
    });

    // Reset form & redirect back to list
    navigate('/patients/bill');
  };

  // Filtered bills for list view
  const filteredBills = useMemo(() => {
    if (selectedPatientFilter === 'all') return patientBills;
    const matchedPatient = patients.find(
      p =>
        p.id === selectedPatientFilter ||
        (p.fullName && p.fullName.toLowerCase() === selectedPatientFilter.toLowerCase()) ||
        `${p.firstName} ${p.lastName}`.toLowerCase() === selectedPatientFilter.toLowerCase()
    );
    const filterId = matchedPatient ? matchedPatient.id : selectedPatientFilter;
    const filterName = matchedPatient
      ? matchedPatient.fullName || `${matchedPatient.firstName} ${matchedPatient.lastName}`
      : selectedPatientFilter;

    return patientBills.filter(
      b =>
        b.patientId === filterId ||
        b.patientName.toLowerCase().includes(filterName.toLowerCase()) ||
        filterName.toLowerCase().includes(b.patientName.toLowerCase())
    );
  }, [patientBills, selectedPatientFilter, patients]);

  const hasActiveFilter = selectedPatientFilter !== 'all';

  const handleClearFilter = () => {
    setSelectedPatientFilter('all');
    setSearchParams({});
  };

  // Render CREATE BILL VIEW
  if (isCreateRoute) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Patient Bill
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <UserIcon className="w-3.5 h-3.5" />
              Billed by {user?.role === 'Super Admin' ? 'Super Admin' : user?.name || 'Super Admin'}
            </span>
            <button
              onClick={() => navigate('/patients/bill')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Bills
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSaveBill} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Details & Medicines (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Bill details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Bill details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose the patient and billing date
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Patient <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Search Patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.fullName || `${p.firstName} ${p.lastName}`} ({p.mrn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bill Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Bill Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      required
                      value={billDate}
                      onChange={e => setBillDate(e.target.value)}
                      className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                      BS
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Today's date is set automatically
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Medicines */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Medicines
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add one or more medicines to this bill
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicineItem}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Medicine
                </button>
              </div>

              {/* Line items cards */}
              <div className="space-y-4">
                {billItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 relative space-y-3"
                  >
                    {/* Item header */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        #{index + 1}
                      </span>
                      {billItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineItem(item.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Medicine select */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Medicine <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={item.medicineId}
                        onChange={e => handleSelectMedicine(item.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Medicine</option>
                        {medicines.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.drugName} ({m.strength}) - Stock: {m.stockOnHand} - ${m.retailPrice.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 8 Grid Fields */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
                      {/* Price */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 truncate">
                          Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={e =>
                            handleUpdateItemField(item.id, 'price', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Qty */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 truncate">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={e =>
                            handleUpdateItemField(item.id, 'qty', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Subtotal */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 truncate">
                          Subtotal
                        </label>
                        <div className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold truncate">
                          ${(computedItems[index]?.subtotal || 0).toFixed(2)}
                        </div>
                      </div>

                      {/* Disc % */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 truncate">
                          Disc %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discPercent}
                          onChange={e =>
                            handleUpdateItemField(item.id, 'discPercent', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Discount Amount */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 truncate">
                          Discount
                        </label>
                        <div className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-rose-600 dark:text-rose-400 text-xs font-semibold truncate">
                          ${(computedItems[index]?.discount || 0).toFixed(2)}
                        </div>
                      </div>

                      {/* VAT % */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 truncate">
                          VAT %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.vatPercent}
                          onChange={e =>
                            handleUpdateItemField(item.id, 'vatPercent', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* VAT Amount */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 truncate">
                          VAT
                        </label>
                        <div className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold truncate">
                          ${(computedItems[index]?.vat || 0).toFixed(2)}
                        </div>
                      </div>

                      {/* Line Total */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-blue-600 dark:text-sky-400 mb-1 truncate">
                          Total
                        </label>
                        <div className="px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-xs font-bold truncate">
                          ${(computedItems[index]?.lineTotal || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add another medicine text link button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddMedicineItem}
                  className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another medicine
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Summary, Notes & Submit (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Summary
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review totals before saving
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ${summaryTotals.subTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <span>Total Discount</span>
                  <span className="font-semibold text-rose-500">
                    -${summaryTotals.totalDiscount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <span>Total VAT</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ${summaryTotals.totalVat.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Grand Total Display Container */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Grand Total
                </p>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  ${summaryTotals.grandTotal.toFixed(2)}
                </p>
              </div>

              {/* Paid Amount Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  $ Paid amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter Paid Amount"
                    value={paidAmountInput}
                    onChange={e => setPaidAmountInput(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Due Amount Container */}
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Due Amount
                </p>
                <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
                  ${summaryTotals.dueAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Bill
              </button>
              <button
                type="button"
                onClick={() => navigate('/patients/bill')}
                className="py-3 px-4 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Render PATIENT BILL LIST VIEW
  return (
    <div className="space-y-6">
      {/* Filter & Action Row Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Card Title */}
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
          Patient Bill
        </h1>

        {/* Filter Input & Action Buttons in same row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              Filter by Patient
            </label>
            <select
              value={selectedPatientFilter}
              onChange={e => {
                setSelectedPatientFilter(e.target.value);
                if (e.target.value === 'all') {
                  setSearchParams({});
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All patients</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName || `${p.firstName} ${p.lastName}`} ({p.mrn})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {hasActiveFilter && (
              <button
                onClick={handleClearFilter}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                Clear Filter
              </button>
            )}

            <button
              onClick={() => navigate('/patients/bill/create')}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Bill
            </button>
          </div>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">S.N</th>
                <th className="py-3.5 px-4">BILL NO</th>
                <th className="py-3.5 px-4">PATIENT</th>
                <th className="py-3.5 px-4 text-right">SUB TOTAL</th>
                <th className="py-3.5 px-4 text-right">DISCOUNT AMOUNT</th>
                <th className="py-3.5 px-4 text-right">VAT AMOUNT</th>
                <th className="py-3.5 px-4 text-right">TOTAL AMOUNT</th>
                <th className="py-3.5 px-4 text-right">PAID AMOUNT</th>
                <th className="py-3.5 px-4 text-right">DUE AMOUNT</th>
                <th className="py-3.5 px-4 text-center">STATUS</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-medium">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      No Patient Bills Found.
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Click "+ Add Bill" to create a new patient bill.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill, index) => (
                  <tr
                    key={bill.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-500 dark:text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-sky-400">
                      {bill.billNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {bill.patientName}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      ${bill.subTotal.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-rose-500 font-semibold">
                      -${bill.discountAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      ${bill.vatAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                      ${bill.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                      ${bill.paidAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-rose-600 dark:text-rose-400 font-bold">
                      ${bill.dueAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={bill.status}
                        onChange={e => handleQuickStatusChange(bill, e.target.value as PatientBill['status'])}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          bill.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : bill.status === 'Partial'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                        }`}
                      >
                        <option value="Paid" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">Paid</option>
                        <option value="Partial" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">Partial</option>
                        <option value="Unpaid" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">Unpaid</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(bill)}
                          className="p-1.5 rounded-lg text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                          title="Edit Bill"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewingBill(bill)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingBill(bill)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Bill"
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

      {/* Bill Details / Invoice Modal */}
      {viewingBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 print:p-0 print:m-0 print:bg-transparent print:block print:overflow-visible print:shadow-none">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print-area print:shadow-none print:border-none print:rounded-none print:p-2 print:m-0 print:space-y-3 print:max-w-none print:max-h-none print:w-full print:bg-white print:text-slate-900 print:overflow-visible print:block">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 print:border-slate-300">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 print:text-slate-900">
                  <Receipt className="w-5 h-5 text-blue-600 dark:text-sky-400 print:text-slate-900" />
                  Invoice {viewingBill.billNo}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                  Billed on {viewingBill.billDate} by {viewingBill.billedBy}
                </p>
              </div>
              <button
                onClick={() => setViewingBill(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-500 uppercase text-[10px]">Patient Name</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{viewingBill.patientName}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 uppercase text-[10px]">Payment Status</p>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                  {viewingBill.status}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Medicine</th>
                    <th className="p-2.5 text-right">Price</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {viewingBill.medicines.map((m, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-slate-900 dark:text-white">{m.medicineName}</td>
                      <td className="p-2.5 text-right">${m.price.toFixed(2)}</td>
                      <td className="p-2.5 text-right">{m.qty}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 dark:text-white">${m.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total summary breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">${viewingBill.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-500">
                <span>Discount</span>
                <span className="font-bold">-${viewingBill.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT</span>
                <span className="font-bold">${viewingBill.vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount</span>
                <span>${viewingBill.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Paid Amount</span>
                <span>${viewingBill.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                <span>Due Amount</span>
                <span>${viewingBill.dueAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
              <button
                onClick={() => setViewingBill(null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bill Modal */}
      {editingBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                  Edit Patient Bill: {editingBill.billNo}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update bill items, patient details, or payment record
                </p>
              </div>
              <button
                onClick={() => setEditingBill(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBill} className="space-y-6">
              {/* Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Patient <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editPatientId}
                    onChange={e => setEditPatientId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.fullName || `${p.firstName} ${p.lastName}`} ({p.mrn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bill Date
                  </label>
                  <input
                    type="date"
                    value={editBillDate}
                    onChange={e => setEditBillDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Medicine / Items
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddEditMedicineItem}
                    className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3 min-w-[180px]">Medicine</th>
                        <th className="p-3 w-20 text-right">Price</th>
                        <th className="p-3 w-16 text-right">Qty</th>
                        <th className="p-3 w-20 text-right">Disc %</th>
                        <th className="p-3 w-20 text-right">VAT %</th>
                        <th className="p-3 w-24 text-right">Total</th>
                        <th className="p-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {editItems.map(item => {
                        const lineSub = (item.price || 0) * (item.qty || 0);
                        const lineDisc = lineSub * ((item.discPercent || 0) / 100);
                        const lineVat = (lineSub - lineDisc) * ((item.vatPercent || 0) / 100);
                        const lineTotal = lineSub - lineDisc + lineVat;

                        return (
                          <tr key={item.id}>
                            <td className="p-2.5">
                              <select
                                value={item.medicineId}
                                onChange={e =>
                                  handleEditItemChange(item.id, 'medicineId', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                              >
                                <option value="">Select medicine...</option>
                                {medicines.map(m => (
                                  <option key={m.id} value={m.id}>
                                    {m.drugName} (${m.retailPrice})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={e =>
                                  handleEditItemChange(item.id, 'price', parseFloat(e.target.value) || 0)
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={e =>
                                  handleEditItemChange(item.id, 'qty', parseInt(e.target.value) || 1)
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discPercent}
                                onChange={e =>
                                  handleEditItemChange(item.id, 'discPercent', parseFloat(e.target.value) || 0)
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.vatPercent}
                                onChange={e =>
                                  handleEditItemChange(item.id, 'vatPercent', parseFloat(e.target.value) || 0)
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right text-xs"
                              />
                            </td>
                            <td className="p-2.5 text-right font-bold text-slate-900 dark:text-white">
                              ${lineTotal.toFixed(2)}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveEditMedicineItem(item.id)}
                                disabled={editItems.length === 1}
                                className="p-1 text-rose-500 hover:text-rose-700 disabled:opacity-30 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Breakdown & Paid Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Status
                      </label>
                      <select
                        value={editStatusOverride}
                        onChange={e => handleEditStatusSelectChange(e.target.value as PatientBill['status'])}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Paid Amount ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editPaidAmountInput}
                        onChange={e => setEditPaidAmountInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs flex flex-col justify-center">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">${editSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-rose-500">
                    <span>Discount Amount</span>
                    <span className="font-bold">-${editDiscountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>VAT Amount</span>
                    <span className="font-bold text-slate-900 dark:text-white">${editVatAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-blue-600 dark:text-sky-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Total Amount</span>
                    <span>${editTotalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                    <span>Due Amount</span>
                    <span>${editDueAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBill(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-blue-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deletingBill !== null}
        onClose={() => setDeletingBill(null)}
        onConfirm={() => {
          if (deletingBill) {
            deletePatientBill(deletingBill.id);
            setDeletingBill(null);
          }
        }}
        title="Delete Patient Bill"
        itemName={deletingBill ? `Invoice #${deletingBill.billNo} (${deletingBill.patientName})` : ''}
        description="Are you sure you want to delete this patient bill record? This action cannot be undone."
      />
    </div>
  );
};
