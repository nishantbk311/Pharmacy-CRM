import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  AlertTriangle,
  Pill,
  Calendar,
  Shield,
  Trash2,
  Edit2,
  ChevronRight,
  UserPlus,
  FileText,
  MapPin,
  Clock,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Patient, Allergy } from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';

interface PatientsPageProps {
  registerModalOpen: boolean;
  setRegisterModalOpen: (open: boolean) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({
  registerModalOpen,
  setRegisterModalOpen,
}) => {
  const { patients, addPatient, updatePatient, deletePatient, processRefill } = useData();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [filterInsurance, setFilterInsurance] = useState<string>('all');
  const [filterAllergies, setFilterAllergies] = useState<boolean>(false);

  // New Patient Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('1980-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('123 Health Ave, Springfield');
  const [insuranceProvider, setInsuranceProvider] = useState('BlueCross BlueShield');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('BCBS-77123');
  const [allergyInput, setAllergyInput] = useState('Penicillin (Severe)');
  const [conditionsInput, setConditionsInput] = useState('Hypertension, Asthma');

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const matchSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchInsurance =
        filterInsurance === 'all' || p.insuranceProvider === filterInsurance;

      const matchAllergies = !filterAllergies || p.allergies.length > 0;

      return matchSearch && matchInsurance && matchAllergies;
    });
  }, [patients, searchQuery, filterInsurance, filterAllergies]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    const allergiesList: Allergy[] = allergyInput
      ? allergyInput.split(',').map((item, idx) => ({
          id: `al-new-${idx}`,
          substance: item.trim(),
          severity: 'Severe',
          reaction: 'Reported by patient',
        }))
      : [];

    const conds = conditionsInput ? conditionsInput.split(',').map(c => c.trim()) : [];

    addPatient({
      firstName,
      lastName,
      dob,
      gender,
      phone,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      address,
      insuranceProvider,
      insurancePolicyNumber,
      allergies: allergiesList,
      conditions: conds,
      activePrescriptionsCount: 0,
      prescriptions: [],
      status: 'Active',
    });

    setRegisterModalOpen(false);
    // Reset form
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients by name, MRN, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterInsurance}
            onChange={e => setFilterInsurance(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Insurance Plans</option>
            <option value="BlueCross BlueShield">BlueCross BlueShield</option>
            <option value="Aetna Health Care">Aetna Health Care</option>
            <option value="UnitedHealthcare">UnitedHealthcare</option>
            <option value="Humana Medicare">Humana Medicare</option>
            <option value="Cigna Health">Cigna Health</option>
          </select>

          <button
            onClick={() => setFilterAllergies(!filterAllergies)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filterAllergies
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Has Drug Allergy</span>
          </button>

          <button
            onClick={() => setRegisterModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-xs ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Patient Cards / Table List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Patient Name & MRN</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Insurance</th>
                <th className="py-3.5 px-4">Drug Allergies</th>
                <th className="py-3.5 px-4">Active Rx</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.map(patient => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm shrink-0 border border-teal-200/60">
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {patient.mrn} &bull; {patient.gender}, DOB: {patient.dob}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <p className="text-slate-800 font-medium flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {patient.phone}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {patient.email}
                    </p>
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-800">{patient.insuranceProvider}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Pol #: {patient.insurancePolicyNumber}
                    </p>
                  </td>

                  <td className="py-4 px-4">
                    {patient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies.map(a => (
                          <Badge key={a.id} variant="rose" size="sm" dot>
                            {a.substance} ({a.severity})
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-medium text-[11px]">No known allergies</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900">
                      {patient.prescriptions.length} Active Rx
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedPatient(patient);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile Detail Modal */}
      {selectedPatient && (
        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
          subtitle={`MRN: ${selectedPatient.mrn} | DOB: ${selectedPatient.dob} (${selectedPatient.gender})`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Quick Contact & Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Phone Number</p>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  {selectedPatient.phone}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Email Address</p>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  {selectedPatient.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Home Address</p>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {selectedPatient.address}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Insurance Details</p>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  {selectedPatient.insuranceProvider} ({selectedPatient.insurancePolicyNumber})
                </p>
              </div>
            </div>

            {/* Allergies Highlight Banner */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Drug Allergies & Adverse Reactions
              </h4>
              {selectedPatient.allergies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPatient.allergies.map(a => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-rose-800">
                        <span>{a.substance}</span>
                        <Badge variant="rose" size="sm">
                          {a.severity}
                        </Badge>
                      </div>
                      <p className="text-rose-600 text-[11px]">{a.reaction}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No documented drug allergies.</p>
              )}
            </div>

            {/* Medical Conditions */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Chronic Diagnoses & Conditions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPatient.conditions.map((cond, idx) => (
                  <Badge key={idx} variant="slate">
                    {cond}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Prescriptions List */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Active Prescriptions ({selectedPatient.prescriptions.length})</span>
              </h4>

              <div className="space-y-2">
                {selectedPatient.prescriptions.map(rx => (
                  <div
                    key={rx.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rx.medicationName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {rx.dosage}
                        </span>
                        <Badge
                          variant={rx.status === 'Active' ? 'emerald' : 'amber'}
                          size="sm"
                        >
                          {rx.status}
                        </Badge>
                      </div>
                      <p className="text-slate-500 mt-1">
                        Sig: {rx.frequency} &bull; Dr. {rx.prescribingDoctorName}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        Rx#: {rx.rxNumber} &bull; Refills Remaining: {rx.refillsRemaining}
                      </p>
                    </div>

                    <button
                      onClick={() => processRefill(rx.rxNumber)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0"
                    >
                      Process Refill
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Register New Patient Modal */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Register New Patient File"
        subtitle="Create a HIPAA-compliant medical record number and profile"
        maxWidth="lg"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="e.g. Eleanor"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="e.g. Vance"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="eleanor@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Home Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Insurance Provider</label>
              <input
                type="text"
                value={insuranceProvider}
                onChange={e => setInsuranceProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Insurance Policy Number</label>
              <input
                type="text"
                value={insurancePolicyNumber}
                onChange={e => setInsurancePolicyNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Known Drug Allergies (Comma Separated)
            </label>
            <input
              type="text"
              value={allergyInput}
              onChange={e => setAllergyInput(e.target.value)}
              placeholder="e.g. Penicillin, Sulfa"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Medical Conditions / Diagnoses (Comma Separated)
            </label>
            <input
              type="text"
              value={conditionsInput}
              onChange={e => setConditionsInput(e.target.value)}
              placeholder="e.g. Diabetes, Hypertension"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
            >
              Save Patient Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
