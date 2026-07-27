import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  Stethoscope,
  UserCheck,
  CalendarCheck,
  MessageSquareWarning,
  Pill,
  ArrowRight,
  UserPlus,
  Calendar,
  HelpCircle,
  Activity,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useData } from '../context/DataContext';
import { StatsCard } from '../components/common/StatsCard';
import { Badge } from '../components/common/Badge';

interface DashboardPageProps {
  onQuickAction: (action: 'add_patient' | 'add_appointment' | 'add_inquiry' | 'add_doctor') => void;
}

const VOLUME_DATA = [
  { day: 'Mon', refills: 42, consultations: 12 },
  { day: 'Tue', refills: 58, consultations: 18 },
  { day: 'Wed', refills: 65, consultations: 15 },
  { day: 'Thu', refills: 51, consultations: 22 },
  { day: 'Fri', refills: 78, consultations: 28 },
  { day: 'Sat', refills: 35, consultations: 8 },
  { day: 'Sun', refills: 19, consultations: 4 },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onQuickAction,
}) => {
  const navigate = useNavigate();
  const {
    patients,
    doctors,
    staff,
    appointments,
    inquiries,
    prescriptions,
    activityLogs,
    updateInquiryStatus,
    updateAppointmentStatus,
  } = useData();

  const [chartView, setChartView] = useState<'refills' | 'consultations'>('refills');

  // Stats Calculations
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalStaff = staff.length;
  const staffOnDuty = staff.filter(s => s.status === 'On Duty').length;
  const todayAppointments = appointments.length;
  const openInquiries = inquiries.filter(i => i.status === 'Open' || i.status === 'In Progress');
  const urgentInquiries = inquiries.filter(i => i.priority === 'Urgent' && i.status !== 'Resolved');
  const pendingRefills = prescriptions.filter(p => p.status === 'Requires Review' || p.status === 'Processing');

  // Pie Chart Data
  const prescriptionPieData = [
    { name: 'Ready for Pickup', value: prescriptions.filter(p => p.status === 'Ready for Pickup').length, color: '#10b981' },
    { name: 'Processing', value: prescriptions.filter(p => p.status === 'Processing').length, color: '#0ea5e9' },
    { name: 'Requires Review', value: prescriptions.filter(p => p.status === 'Requires Review').length, color: '#f59e0b' },
    { name: 'Out of Stock', value: prescriptions.filter(p => p.status === 'Out of Stock').length, color: '#ef4444' },
    { name: 'Filled', value: prescriptions.filter(p => p.status === 'Filled').length, color: '#0284c7' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Quick Action Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
              Live Pharmacy Operation
            </span>
            {urgentInquiries.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold text-xs border border-rose-500/30 flex items-center gap-1 animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                {urgentInquiries.length} Urgent Inquiry
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Welcome back to Pharmacy CRM
          </h2>
          <p className="text-xs text-slate-300">
            {todayAppointments} scheduled consultations today &bull; {pendingRefills.length} prescriptions pending verification
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onQuickAction('add_patient')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>

          <button
            onClick={() => onQuickAction('add_appointment')}
            className="px-3.5 py-2 rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Consultation</span>
          </button>

          <button
            onClick={() => onQuickAction('add_inquiry')}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Log Clinical Query</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          id="stat-patients"
          title="Total Patients"
          value={totalPatients}
          subtitle="Registered active files"
          icon={Users}
          trend={{ value: '+12%', isPositive: true }}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
          onClick={() => navigate('/patients')}
        />

        <StatsCard
          id="stat-doctors"
          title="Total Doctors"
          value={totalDoctors}
          subtitle="Active prescribers"
          icon={Stethoscope}
          trend={{ value: '+4%', isPositive: true }}
          iconBgColor="bg-sky-50 dark:bg-sky-950/60"
          iconColor="text-sky-600 dark:text-sky-400"
          onClick={() => navigate('/doctors')}
        />

        <StatsCard
          id="stat-staff"
          title="Total Staff"
          value={`${staffOnDuty}/${totalStaff}`}
          subtitle="Staff on duty today"
          icon={UserCheck}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
          onClick={() => navigate('/staff')}
        />

        <StatsCard
          id="stat-appointments"
          title="New Appointments"
          value={todayAppointments}
          subtitle="Scheduled today"
          icon={CalendarCheck}
          iconBgColor="bg-sky-50 dark:bg-sky-950/60"
          iconColor="text-sky-600 dark:text-sky-400"
          onClick={() => navigate('/appointments')}
        />

        <StatsCard
          id="stat-inquiries"
          title="Open Inquiries"
          value={openInquiries.length}
          subtitle={`${urgentInquiries.length} urgent flags`}
          icon={MessageSquareWarning}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
          onClick={() => navigate('/inquiries')}
        />

        <StatsCard
          id="stat-refills"
          title="Pending Refills"
          value={pendingRefills.length}
          subtitle="Awaiting review"
          icon={Pill}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
          onClick={() => navigate('/prescriptions')}
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Prescription & Consultation Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Weekly Operations & Dispensing Volume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prescription refills filled vs. Pharmacist clinical consultations
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartView('refills')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  chartView === 'refills'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Refill Volume
              </button>
              <button
                onClick={() => setChartView('consultations')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  chartView === 'consultations'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Consultations
              </button>
            </div>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'refills' ? (
                <AreaChart data={VOLUME_DATA}>
                  <defs>
                    <linearGradient id="colorRefills" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="refills"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRefills)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={VOLUME_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
                  />
                  <Bar dataKey="consultations" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prescription Status Donut Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Prescription Queue Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Current stage of active Rx orders
            </p>

            <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prescriptionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {prescriptionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {prescriptionPieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Open Inquiries Queue + Today's Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent & Open Inquiries Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Open Inquiries & Flags
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Clinical queries requiring pharmacist attention
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/inquiries')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {inquiries.slice(0, 3).map(inq => (
              <div key={inq.id} className="py-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        {inq.ticketNumber}
                      </span>
                      <Badge
                        variant={
                          inq.priority === 'Urgent'
                            ? 'rose'
                            : inq.priority === 'High'
                            ? 'amber'
                            : 'sky'
                        }
                        size="sm"
                      >
                        {inq.priority}
                      </Badge>
                      <Badge variant="slate" size="sm">
                        {inq.type}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1">
                      {inq.subject}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Patient: <span className="font-medium text-slate-700 dark:text-slate-300">{inq.patientName}</span> &bull; Doctor: <span className="font-medium text-slate-700 dark:text-slate-300">{inq.relatedDoctorName || 'N/A'}</span>
                    </p>
                  </div>

                  <select
                    value={inq.status}
                    onChange={e => updateInquiryStatus(inq.id, e.target.value as any)}
                    className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending Doctor">Pending Doctor</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Consultations & Appointments */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Today&apos;s Appointments
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pharmacist consultations & immunization schedule
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/appointments')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {appointments.map(apt => (
              <div key={apt.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                      {apt.time}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {apt.patientName}
                    </span>
                    <Badge variant={apt.isVirtual ? 'indigo' : 'emerald'} size="sm">
                      {apt.isVirtual ? 'Virtual MTM' : 'In-Store'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Type: <span className="font-medium text-slate-700 dark:text-slate-300">{apt.type}</span> &bull; Pharmacist: {apt.pharmacistName}
                  </p>
                </div>

                <select
                  value={apt.status}
                  onChange={e => updateAppointmentStatus(apt.id, e.target.value as any)}
                  className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity & Audit Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Recent Activity & Audit Stream
            </h3>
          </div>
          <span className="text-xs text-slate-400">HIPAA Audit Trail Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {activityLogs.slice(0, 4).map(log => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-teal-700 dark:text-teal-300">{log.userName}</span>
                <span className="text-[10px]">{log.timestamp}</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{log.action}</p>
              <p className="text-slate-500 dark:text-slate-400 line-clamp-2">{log.details}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
