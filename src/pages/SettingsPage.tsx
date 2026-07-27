import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Smartphone,
  Mail,
  KeyRound,
  QrCode,
  Building,
  Bell,
  CheckCircle2,
  Lock,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const [twoFactorMethod, setTwoFactorMethod] = useState<'authenticator' | 'email'>(
    user?.twoFactorMethod || 'authenticator'
  );
  const [copiedKey, setCopiedKey] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifInquiryAlerts, setNotifInquiryAlerts] = useState(true);

  const mockSecretKey = 'JBSWY3DPEHPK3PXP';

  const copySecret = () => {
    navigator.clipboard.writeText(mockSecretKey);
    setCopiedKey(true);
    toast.success('2FA Secret Key copied to clipboard!');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 2FA Security Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Two-Factor Authentication (2FA) Security
              </h3>
              <p className="text-xs text-slate-500">
                Enforce multi-factor verification for all pharmacist logins
              </p>
            </div>
          </div>

          <Badge variant="emerald" size="md" dot>
            2FA Active
          </Badge>
        </div>

        {/* Delivery Method Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Preferred 2nd Factor Verification Method
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setTwoFactorMethod('authenticator')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                twoFactorMethod === 'authenticator'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-300 dark:bg-emerald-950/40 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm">
                  Google Authenticator (TOTP)
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Generate secure 6-digit codes in Google Authenticator app.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTwoFactorMethod('email')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                twoFactorMethod === 'email'
                  ? 'bg-sky-500/10 border-sky-500 text-sky-900 dark:text-sky-300 dark:bg-sky-950/40 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Mail className="w-6 h-6 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm">
                  Email Verification Code
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Send instant 6-digit OTP to your registered pharmacy email.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Authenticator Secret Key Setup */}
        {twoFactorMethod === 'authenticator' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-teal-600" />
                Google Authenticator Secret Setup
              </span>
              <span className="text-[11px] text-slate-500">Scan or copy secret key</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
              <div className="w-24 h-24 bg-slate-900 rounded-xl flex items-center justify-center text-teal-400 font-mono text-xs font-bold text-center p-2 border border-slate-800">
                [QR CODE SIMULATOR]
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-slate-600 font-medium">Secret Setup Key:</p>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm font-bold bg-slate-100 px-3 py-1 rounded-lg text-slate-900 border border-slate-200">
                    {mockSecretKey}
                  </code>
                  <button
                    onClick={copySecret}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter this secret key in Google Authenticator or Authy to generate TOTP codes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pharmacy Licensing Details */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Building className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Pharmacy Facility & DEA Compliance
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pharmacy Facility Name</label>
            <input
              type="text"
              readOnly
              value="Main Street Pharmacy #401"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">NPI Facility Identifier</label>
            <input
              type="text"
              readOnly
              value="1882930192"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 font-semibold"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">DEA Registration Number</label>
            <input
              type="text"
              readOnly
              value="BA9902144"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 font-semibold"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">State Pharmacy Permit #</label>
            <input
              type="text"
              readOnly
              value="PERMIT-NY-89021"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Bell className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Notification & Alert Triggers
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Urgent Drug Interaction Alerts</span>
              <span className="text-slate-500">Notify immediately when Warfarin or High-Risk flag is triggered.</span>
            </div>
            <input
              type="checkbox"
              checked={notifInquiryAlerts}
              onChange={e => setNotifInquiryAlerts(e.target.checked)}
              className="w-4 h-4 rounded-md text-teal-600 focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Email Digest of Daily Appointments</span>
              <span className="text-slate-500">Receive morning summary of MTM consultations and flu shots.</span>
            </div>
            <input
              type="checkbox"
              checked={notifEmail}
              onChange={e => setNotifEmail(e.target.checked)}
              className="w-4 h-4 rounded-md text-teal-600 focus:ring-teal-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
