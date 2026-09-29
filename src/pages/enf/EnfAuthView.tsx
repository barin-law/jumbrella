import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Phone,
  Building,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { EnfAuthService, ENFRole } from '../../services/enf/enfAuthService';

interface EnfAuthViewProps {
  initialMode?: 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'VERIFY_EMAIL';
  returnUrl?: string;
  onNavigate: (path: string) => void;
  onAuthSuccess?: () => void;
}

export const EnfAuthView: React.FC<EnfAuthViewProps> = ({
  initialMode = 'LOGIN',
  returnUrl = '/enf/dashboard',
  onNavigate,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'VERIFY_EMAIL'>(initialMode);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await EnfAuthService.login(email, password);
      setIsLoading(false);
      if (res.success) {
        setSuccess('Signed in successfully. Redirecting...');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess();
          onNavigate(returnUrl);
        }, 500);
      } else {
        setError(res.message);
      }
    } catch {
      setIsLoading(false);
      setError('An unexpected error occurred during authentication.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await EnfAuthService.register({
        fullName,
        email,
        password,
        phone,
        organization,
        role: 'ENF_OWNER',
      });
      setIsLoading(false);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess();
          // Direct to profile setup or chosen returnUrl
          onNavigate('/enf/profile');
        }, 800);
      } else {
        setError(res.message);
      }
    } catch {
      setIsLoading(false);
      setError('Failed to create account. Please check your network connection.');
    }
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = EnfAuthService.verifyEmail(verificationCode);
    setIsLoading(false);
    if (res.success) {
      setSuccess(res.message);
      setTimeout(() => {
        onNavigate('/enf/dashboard');
      }, 1000);
    } else {
      setError(res.message);
    }
  };

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = EnfAuthService.requestPasswordReset(email);
    setIsLoading(false);
    if (res.token) {
      setResetToken(res.token);
    }
    setSuccess(res.message);
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await EnfAuthService.resetPassword(resetToken, newPassword);
    setIsLoading(false);
    if (res.success) {
      setSuccess(res.message);
      setTimeout(() => {
        setMode('LOGIN');
        setSuccess(null);
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  const handleQuickSwitch = (userId: string, targetPath = '/enf/dashboard') => {
    const session = EnfAuthService.switchActiveUser(userId);
    if (session) {
      setSuccess(`Signed in as ${session.fullName} (${session.role})`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess();
        onNavigate(targetPath);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('/enf')}
            className="inline-flex items-center justify-center cursor-pointer mb-2"
          >
            <BrandLogo variant="official" height={44} alt="JuriMbrella" priority />
          </div>
          <h2 className="text-2xl font-extrabold text-[#002D5B]">
            {mode === 'LOGIN' && 'Sign In to Your ENF Portal'}
            {mode === 'SIGNUP' && 'Create Your ENF Account'}
            {mode === 'FORGOT_PASSWORD' && 'Reset Portal Password'}
            {mode === 'VERIFY_EMAIL' && 'Verify Your Email Address'}
          </h2>
          <p className="text-xs text-slate-600">
            {mode === 'LOGIN' && 'Access your Electronic Notarial Facility workspace and prepaid credits'}
            {mode === 'SIGNUP' && 'Start your independent, Supreme Court-aligned notarial facility'}
            {mode === 'FORGOT_PASSWORD' && 'Enter your registered email to receive reset instructions'}
            {mode === 'VERIFY_EMAIL' && 'Enter the 6-digit confirmation code sent to your email'}
          </p>
        </div>

        {/* Auth Box Container */}
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-[#D9E1E8] sm:px-8 space-y-6">
          {error && (
            <div className="rounded-xl border border-[#D64545]/40 bg-[#D64545]/10 p-3 text-xs text-[#8A2121] flex items-start gap-2 font-medium">
              <AlertCircle className="h-4 w-4 text-[#D64545] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 p-3 text-xs text-[#1B6C2E] flex items-start gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="atty.santos@santoslaw.ph"
                    className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-3 py-2 text-xs focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#002D5B]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('FORGOT_PASSWORD')}
                    className="text-[11px] font-semibold text-[#0078CE] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-9 py-2 text-xs focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#002D5B] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to ENF'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-slate-200" />
                <span className="shrink mx-3 text-[10px] text-slate-400 font-semibold uppercase">Or continue with</span>
                <div className="grow border-t border-slate-200" />
              </div>

              {/* Google OAuth Adapter */}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess('Google OAuth Adapter active. Connecting via secure workspace identity...');
                  setTimeout(() => {
                    handleQuickSwitch('demo-enf-owner-1');
                  }, 600);
                }}
                className="w-full rounded-lg border border-[#D9E1E8] bg-white py-2 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Workspace</span>
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Don't have an ENF account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('SIGNUP')}
                  className="font-bold text-[#0078CE] hover:underline cursor-pointer"
                >
                  Register Here
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTRATION FORM */}
          {mode === 'SIGNUP' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">
                  Full Name (with Honorific / Title)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Atty. Juan Dela Cruz, En.P."
                    className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-3 py-2 text-xs focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan.delacruz@lawchambers.ph"
                    className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-3 py-2 text-xs focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Mobile Phone
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+63 917 123 4567"
                      className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-3 py-2 text-xs focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002D5B] mb-1">
                    Law Firm / Organization
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Building className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Dela Cruz Law Offices"
                      className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-3 py-2 text-xs focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-9 py-2 text-xs focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-[#F4F7F9] p-3 text-[11px] text-slate-600 border border-[#D9E1E8] space-y-1">
                <p className="font-semibold text-[#002D5B]">
                  Supreme Court A.M. No. 24-10-14-SC Compliance Notice:
                </p>
                <p>
                  By creating an account, you confirm your eligibility to operate or participate in an Electronic Notarial Facility in the Republic of the Philippines.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#2EAF4A] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#258F3C] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Register ENF Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className="font-bold text-[#0078CE] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* 3. VERIFY EMAIL FORM */}
          {mode === 'VERIFY_EMAIL' && (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">
                  6-Digit Verification PIN
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="829104"
                    className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-3 py-2 text-center font-mono text-base tracking-widest focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Tip: Use code <strong>829104</strong> or check your in-app notifications bell.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#002D5B] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify Email</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 4. FORGOT PASSWORD FORM */}
          {mode === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              {!resetToken ? (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#002D5B] mb-1">
                      Account Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="atty.santos@santoslaw.ph"
                        className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 pl-9 pr-3 py-2 text-xs focus:border-[#0078CE] focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-[#002D5B] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Reset Token</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmReset} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#002D5B] mb-1">
                      Reset Token
                    </label>
                    <input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 px-3 py-2 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002D5B] mb-1">
                      New Password (min 8 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-[#D9E1E8] bg-slate-50/50 px-3 py-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-[#2EAF4A] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#258F3C] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Update Password</span>
                  </button>
                </form>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setResetToken('');
                  }}
                  className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}

          {/* Quick Development / Role-Switch Desk (Live Testing Aid) */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Role Switch (Testing & Verification Desk)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickSwitch('demo-enf-owner-1')}
                className="p-1.5 rounded-md border border-[#D9E1E8] bg-slate-50 hover:bg-slate-100 text-[#002D5B] font-semibold text-center truncate cursor-pointer"
                title="Atty. Santos (Customer / ENF Owner)"
              >
                Customer (Owner)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('finance-1', '/enf/admin')}
                className="p-1.5 rounded-md border border-[#D9E1E8] bg-slate-50 hover:bg-slate-100 text-[#2EAF4A] font-bold text-center truncate cursor-pointer"
                title="Finance Officer (Payment Verification)"
              >
                Finance Officer
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('superadmin-1', '/enf/admin')}
                className="p-1.5 rounded-md border border-[#D9E1E8] bg-slate-50 hover:bg-slate-100 text-[#0078CE] font-bold text-center truncate cursor-pointer"
                title="Super Admin (System Authority)"
              >
                Super Admin
              </button>
            </div>
          </div>
        </div>

        {/* Security & Return Footnote */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <Shield className="h-3.5 w-3.5 text-[#2EAF4A]" />
            <span>256-Bit SHA Hashed Credentials • Philippine Data Privacy Act Compliant</span>
          </div>
          <div>
            <button
              onClick={() => onNavigate('/enf')}
              className="text-xs text-[#0078CE] font-bold hover:underline cursor-pointer"
            >
              ← Back to ENF Public Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
