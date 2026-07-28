import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Stethoscope,
  Search,
  Plus,
  Phone,
  Mail,
  Building,
  FileText,
  Star,
  Send,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Doctor } from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';

interface DoctorsPageProps {
  doctorModalOpen: boolean;
  setDoctorModalOpen: (open: boolean) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  doctorModalOpen,
  setDoctorModalOpen,
}) => {
  const { doctors, addDoctor, addInquiry } = useData();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [inquiryDoctor, setInquiryDoctor] = useState<Doctor | null>(null);

  // New Doctor Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [clinicName, setClinicName] = useState('St. Jude Heart & Vascular');
  const [npiNumber, setNpiNumber] = useState('1982736451');
  const [phone, setPhone] = useState('(555) 888-1212');
  const [fax, setFax] = useState('(555) 888-1213');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('500 Medical Center Blvd');

  // Inquiry to Doctor Form
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryPatient, setInquiryPatient] = useState('Eleanor Vance');
  const [inquiryRx, setInquiryRx] = useState('RX-774902');
  const [inquiryDesc, setInquiryDesc] = useState('');

  const filteredDoctors = doctors.filter(doc => {
    const fullName = `Dr. ${doc.firstName} ${doc.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      doc.npiNumber.includes(searchQuery) ||
      doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      specialtyFilter === 'all' || doc.specialty.includes(specialtyFilter);

    return matchesSearch && matchesSpecialty;
  });

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    addDoctor({
      firstName,
      lastName,
      specialty,
      clinicName,
      npiNumber,
      phone,
      fax,
      email: email || `dr.${lastName.toLowerCase()}@clinic.org`,
      address,
      rating: 4.8,
      status: 'Active Prescriber',
    });

    setDoctorModalOpen(false);
    setFirstName('');
    setLastName('');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryDoctor || !inquirySubject) return;

    addInquiry({
      type: 'Doctor Clarification',
      patientName: inquiryPatient,
      patientPhone: '(555) 432-8811',
      relatedDoctorName: `Dr. ${inquiryDoctor.firstName} ${inquiryDoctor.lastName}`,
      rxNumber: inquiryRx,
      priority: 'High',
      status: 'Open',
      assignedStaffName: 'Dr. Sarah Jenkins, PharmD',
      subject: inquirySubject,
      description: inquiryDesc || `Clarification requested for Rx ${inquiryRx}`,
    });

    setInquiryDoctor(null);
    setInquirySubject('');
    setInquiryDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors by name, NPI, or clinic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={specialtyFilter}
            onChange={e => setSpecialtyFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Endocrinology">Endocrinology</option>
            <option value="Pulmonology">Pulmonology</option>
            <option value="Family Medicine">Family Medicine</option>
          </select>

          <button
            onClick={() => setDoctorModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prescriber</span>
          </button>
        </div>
      </div>

      {/* Doctor Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredDoctors.map(doc => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-base border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
                    Dr
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight">
                      Dr. {doc.firstName} {doc.lastName}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                      {doc.specialty}
                    </p>
                  </div>
                </div>

                <Badge variant="emerald" size="sm" dot>
                  {doc.status}
                </Badge>
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2 font-medium">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{doc.clinicName}</span>
                </p>
                <p className="flex items-center gap-2 font-mono text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>NPI #: {doc.npiNumber}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Tel: {doc.phone} &bull; Fax: {doc.fax}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{doc.email}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{doc.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({doc.totalActivePrescriptions} active Rx)
                </span>
              </div>

              <button
                onClick={() => {
                  setInquiryDoctor(doc);
                  setInquirySubject(`Clinical query for Dr. ${doc.lastName}`);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Send Query</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        title="Add Prescribing Physician"
        subtitle="Verify NPI number and clinic contact information"
      >
        <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="e.g. Robert"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="e.g. Chen"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">NPI 10-Digit Identifier</label>
              <input
                type="text"
                value={npiNumber}
                onChange={e => setNpiNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinic / Hospital Affiliation</label>
            <input
              type="text"
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Telephone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Fax Number</label>
              <input
                type="text"
                value={fax}
                onChange={e => setFax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Doctor Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="dr.chen@clinic.org"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDoctorModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold cursor-pointer"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* Send Doctor Query Modal */}
      {inquiryDoctor && (
        <Modal
          isOpen={!!inquiryDoctor}
          onClose={() => setInquiryDoctor(null)}
          title={`Send Clinical Query to Dr. ${inquiryDoctor.lastName}`}
          subtitle={`NPI: ${inquiryDoctor.npiNumber} | Clinic: ${inquiryDoctor.clinicName}`}
        >
          <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Query Subject / Reason *</label>
              <input
                type="text"
                required
                value={inquirySubject}
                onChange={e => setInquirySubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Related Patient</label>
                <input
                  type="text"
                  value={inquiryPatient}
                  onChange={e => setInquiryPatient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Related Rx Number</label>
                <input
                  type="text"
                  value={inquiryRx}
                  onChange={e => setInquiryRx(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description / Clinical Context</label>
              <textarea
                rows={3}
                value={inquiryDesc}
                onChange={e => setInquiryDesc(e.target.value)}
                placeholder="Detail dosage clarification, refills authorization, or potential drug interaction..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInquiryDoctor(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log Ticket & Send Fax/Query</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
