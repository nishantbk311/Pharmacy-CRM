import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Mail,
  Lock,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Check,
  Cross,
  Users,
  Eye,
  EyeOff,
  Info,
  Sun,
  Moon,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const {
    step,
    loginStep1,
    verify2FACode,
    resend2FACode,
    resetToCredentials,
    generatedCode,
    quickDemoLogin,
    pendingMethod,
  } = useAuth();

  const { theme, toggleTheme } = useTheme();

  // Factor 1 State
  const [email, setEmail] = useState('sarah.jenkins@pharmacycrm.com');
  const [password, setPassword] = useState('Admin@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [method, setMethod] = useState<'authenticator' | 'email'>('authenticator');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Factor 2 State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (step !== '2fa' || pendingMethod !== 'authenticator') {
      setTimeLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          resend2FACode();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, pendingMethod, resend2FACode]);

  const handleFactor1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await loginStep1(email, password, method);
      toast.info(`2FA code sent via ${method === 'authenticator' ? 'Google Authenticator' : 'Email'}.`);
    } catch {
      setErrorMsg('Invalid login credentials');
      toast.error('Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of full 6 digit code
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpDigits(newOtp);
      return;
    }

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleFactor2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your 2FA code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    const success = await verify2FACode(code);
    setIsSubmitting(false);

    if (!success) {
      setErrorMsg('Invalid 2FA code. Please check your Authenticator or Email code.');
    }
  };

  const autoFillDemoCode = () => {
    const digits = (generatedCode || '123456').split('');
    setOtpDigits(digits);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const fillCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans transition-colors duration-200">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-end z-10 max-w-7xl w-full mx-auto">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content Area - Split Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-5xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-colors duration-200">
          
          {/* Left Column: Promo / Security Highlights */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/80 relative">
            <div className="space-y-6 relative z-10">
              {/* Brand Icon Badge */}
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Cross className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Secure Admin Access
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Protected by multi-factor authentication. Only authorized PharmaLink staff can access the management portal.
                </p>
              </div>

              {/* Feature Highlight Cards */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">End-to-end protection</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Encrypted sessions & secure sign-in</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Google Authenticator</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Time-based one-time passcode (TOTP)</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Role-based access</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Permissions scoped to your role</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Step 1 & Step 2 Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white dark:bg-slate-900/60">
            <div>
              {/* Step Tracker Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === 'credentials'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-500/20'
                      : 'bg-emerald-500 text-white dark:text-slate-950 shadow-md shadow-emerald-500/20'
                  }`}>
                    {step === 'credentials' ? '1' : <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                    step === 'credentials'
                      ? 'text-slate-900 dark:text-white font-extrabold'
                      : 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  }`}>
                    Credentials
                  </span>
                </div>

                <div className={`h-0.5 flex-1 mx-4 transition-colors ${
                  step === '2fa' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                }`} />

                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === '2fa'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-500/20 scale-105'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500'
                  }`}>
                    2
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                    step === '2fa'
                      ? 'text-slate-900 dark:text-white font-extrabold'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    Verification
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 'credentials' ? (
                  <motion.div
                    key="step-credentials"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Sign in
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Enter your admin credentials to continue.
                      </p>
                    </div>

                    <form onSubmit={handleFactor1Submit} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                            placeholder="admin@pharmalink.io"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Delivery method pills */}
                      <div className="pt-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                          2FA Delivery Channel
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setMethod('authenticator')}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              method === 'authenticator'
                                ? 'bg-blue-50 dark:bg-blue-600/15 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 font-semibold'
                                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <span className="text-xs block font-bold text-slate-900 dark:text-white">Google Authenticator</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">TOTP Passcode</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMethod('email')}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              method === 'email'
                                ? 'bg-blue-50 dark:bg-blue-600/15 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 font-semibold'
                                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <span className="text-xs block font-bold text-slate-900 dark:text-white">Email OTP</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Verification Link</span>
                          </button>
                        </div>
                      </div>

                      {/* Keep me signed in */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="keep-signed-in"
                          checked={keepSignedIn}
                          onChange={e => setKeepSignedIn(e.target.checked)}
                          className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="keep-signed-in" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                          Keep me signed in on this device
                        </label>
                      </div>

                      {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
                          {errorMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 mt-2 cursor-pointer"
                      >
                        <span>{isSubmitting ? 'Verifying...' : 'Continue'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    {/* Demo Shortcuts */}
                    <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2">
                        Demo Accounts:
                      </p>
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <button
                          type="button"
                          onClick={() => fillCredentials('sarah.jenkins@pharmacycrm.com', 'Admin@1234')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <span className="font-semibold text-slate-900 dark:text-white">Demo Admin:</span> Admin@1234
                        </button>
                        <button
                          type="button"
                          onClick={() => fillCredentials('marcus.vance@pharmacycrm.com', 'User@1234')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <span className="font-semibold text-slate-900 dark:text-white">Pharmacist:</span> User@1234
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-verification"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-200 dark:border-blue-500/20 mb-3">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>TWO-FACTOR AUTHENTICATION</span>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Enter verification code
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Open {pendingMethod === 'authenticator' ? 'Google Authenticator' : 'your email inbox'} and enter the 6-digit code for{' '}
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">{email}</span>
                      </p>
                    </div>

                    <form onSubmit={handleFactor2Submit} className="space-y-5">
                      {/* 6 Digit Input Boxes */}
                      <div className="grid grid-cols-6 gap-2 sm:gap-3">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength={6}
                            value={digit}
                            onChange={e => handleOtpChange(index, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(index, e)}
                            className="h-12 sm:h-14 text-center text-xl font-bold rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                          />
                        ))}
                      </div>

                      {/* Info Banner */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          <p>
                            {pendingMethod === 'authenticator' ? (
                              <>
                                Google Authenticator TOTP rotates every 30 seconds. New code in{' '}
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{timeLeft}s</span>.
                              </>
                            ) : (
                              <>
                                Verification code sent to your email inbox. The code remains valid for 10 minutes.
                              </>
                            )}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                              Demo code —
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
                              {generatedCode || '123456'}
                            </span>
                            <button
                              type="button"
                              onClick={autoFillDemoCode}
                              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1 cursor-pointer"
                            >
                              {copiedCode ? 'Filled ✓' : 'Auto Fill'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
                          {errorMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer"
                      >
                        <span>{isSubmitting ? 'Verifying Code...' : 'Verify & Sign In'}</span>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          type="button"
                          onClick={resetToCredentials}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to sign in</span>
                        </button>

                        <button
                          type="button"
                          onClick={resend2FACode}
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Resend Code</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 dark:text-slate-500 z-10">
        &copy; {new Date().getFullYear()} Pharmacy CRM. All rights reserved. Encrypted & HIPAA Compliant.
      </footer>
    </div>
  );
};
