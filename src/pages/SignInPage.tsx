import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  Lock,
  User,
  Key,
  AlertCircle,
  CheckCircle2,
  Shield,
  ArrowRight,
  Sparkles,
  Building,
  Scale,
  LogOut,
  Info,
  Headphones,
  Eye,
  EyeOff,
  UserPlus,
  Smartphone,
  Mail,
  FileCheck,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSecurity } from '../context/SecurityContext';
import { UserRole } from '../types';
import { ROLE_NAVIGATION_MAP } from '../data/navigationConfig';
import { GlobalFooter } from '../components/common/GlobalFooter';
import { SupportModal } from '../components/common/SupportModal';
import { ErrorSupportMessage } from '../components/common/ErrorSupportMessage';
import { siteContact } from '../config/contactConfig';

interface SignInPageProps {
  returnTo?: string;
  onNavigate: (path: string) => void;
}

interface RoleOption {
  role: UserRole;
  name: string;
  title: string;
  route: string;
  description: string;
  category: 'Parties' | 'Notarial Office' | 'Governance & Security' | 'Operations';
}

const DEMO_ROLES: RoleOption[] = [
  {
    role: 'PRINCIPAL',
    name: 'Maria Elena Santos',
    title: 'Principal / Signer',
    route: '/portal/signer',
    description: 'Submits instruments, completes liveness check, signs documents, and pays fees.',
    category: 'Parties',
  },
  {
    role: 'WITNESS',
    name: 'Atty. Roberto Cruz',
    title: 'Instrument Witness',
    route: '/portal/witness',
    description: 'Attends scheduled notarial hearing, affirms declarations, and signs as witness.',
    category: 'Parties',
  },
  {
    role: 'ORG_REQUESTER',
    name: 'Andrea Dimatulac',
    title: 'Organization Requester',
    route: '/portal/organization/requester',
    description: 'Prepares and submits corporate notarization instruments on behalf of company.',
    category: 'Parties',
  },
  {
    role: 'ORG_ADMIN',
    name: 'Carlos Mendoza, CPA',
    title: 'Organization Administrator',
    route: '/portal/organization/admin',
    description: 'Manages organization users, templates, billing contacts, and corporate audits.',
    category: 'Parties',
  },
  {
    role: 'ENP',
    name: 'Atty. Juan Dela Cruz, En.P.',
    title: 'Electronic Notary Public',
    route: '/enp/workspace',
    description: 'Independent statutory officer exercising sole legal authority to execute notarial acts.',
    category: 'Notarial Office',
  },
  {
    role: 'ENP_ASSISTANT',
    name: 'Joy Bautista',
    title: 'ENP Office Assistant',
    route: '/enp/assistant',
    description: 'Administrative intake, calendar coordination, document checklists, and drafts.',
    category: 'Notarial Office',
  },
  {
    role: 'SECOPS_ANALYST',
    name: 'Engr. Kenneth Tan, CISSP',
    title: 'Security Operations',
    route: '/security/operations',
    description: 'Monitors real-time threats, quarantine telemetry, IP restrictions, and SIEM exports.',
    category: 'Governance & Security',
  },
  {
    role: 'COMPLIANCE_REVIEWER',
    name: 'Atty. Cristina Legaspi',
    title: 'Compliance Reviewer',
    route: '/compliance/reviewer',
    description: 'Enforces A.M. 24-10-14-SC compliance registers, accreditation readiness, and findings.',
    category: 'Governance & Security',
  },
  {
    role: 'DPO',
    name: 'Dean Miguel De Castro, CIPP/E',
    title: 'Data Protection Officer',
    route: '/privacy/dpo',
    description: 'Oversees R.A. 10173 data privacy compliance, ROPA registers, and DSR handling.',
    category: 'Governance & Security',
  },
  {
    role: 'INTERNAL_AUDITOR',
    name: 'Victoria Solis, CIA, CISA',
    title: 'Internal Auditor',
    route: '/audit/internal',
    description: 'Read-only verification of SHA-256 hash chains, SOC 2 controls, and signed workpapers.',
    category: 'Governance & Security',
  },
  {
    role: 'COURT_AUDITOR',
    name: 'Hon. Judicial Inspector',
    title: 'Supreme Court / Regulatory Auditor',
    route: '/regulatory/auditor',
    description: 'Time-limited judicial oversight, SC-ENAR registers, and cryptographic seal proofs.',
    category: 'Governance & Security',
  },
  {
    role: 'FINANCE_OFFICER',
    name: 'Rowena Garcia',
    title: 'Finance Officer',
    route: '/finance',
    description: 'Administers statutory notarial fees, invoice reconciliations, and payment ledgers.',
    category: 'Operations',
  },
  {
    role: 'SUPPORT_AGENT',
    name: 'Mark Lester Aquino',
    title: 'Customer Support Agent',
    route: '/support',
    description: 'Assists participants with video setup, hardware checks, and technical support tickets.',
    category: 'Operations',
  },
  {
    role: 'ENF_ADMIN',
    name: 'Engr. Paul Valdez',
    title: 'ENF System Administrator',
    route: '/admin/system',
    description: 'Platform infrastructure operations, container telemetry, and adapter management.',
    category: 'Operations',
  },
];

export const SignInPage: React.FC<SignInPageProps> = ({
  returnTo,
  onNavigate,
}) => {
  const { switchRole } = useAuth();
  const { addAuditEvent } = useSecurity();

  // Authentication mode: SIGN_IN | REGISTER | FORGOT_PASSWORD
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'REGISTER' | 'FORGOT_PASSWORD'>('SIGN_IN');

  // Authentication state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState<number>(0);

  // Client Registration State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regDob, setRegDob] = useState('1988-06-15');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regAcceptedTerms, setRegAcceptedTerms] = useState(false);
  const [regAcceptedPrivacy, setRegAcceptedPrivacy] = useState(false);
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: OTP, 3: Success
  const [regOtpInput, setRegOtpInput] = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regNotice, setRegNotice] = useState<string | null>(null);
  const [regInternalPersonId, setRegInternalPersonId] = useState('');

  // Password Recovery State
  const [recTarget, setRecTarget] = useState('');
  const [recStep, setRecStep] = useState<1 | 2 | 3>(1); // 1: Input, 2: OTP & New Pass, 3: Success
  const [recOtp, setRecOtp] = useState('');
  const [recNewPassword, setRecNewPassword] = useState('');
  const [recConfirmPassword, setRecConfirmPassword] = useState('');
  const [recNotice, setRecNotice] = useState<string | null>(null);

  // Calculate age from DOB
  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const birth = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculatedAge = calculateAge(regDob);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score; // 0 to 5
  };

  const regPwdStrength = getPasswordStrength(regPassword);

  // Authenticated state (shows demo persona workspace selector)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);

  // Handle 60s lockout timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLockedOut && lockoutSecondsRemaining > 0) {
      timer = setInterval(() => {
        setLockoutSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockedOut, lockoutSecondsRemaining]);

  const handleUseDemoAccess = () => {
    setUsername('test2026');
    setPassword('test2026');
    setErrorNotice(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) return;

    if (!username.trim() || !password.trim()) {
      setErrorNotice('Invalid credentials. Enter the authorized demonstration username and password.');
      return;
    }

    if (username === 'test2026' && password === 'test2026') {
      setIsAuthenticated(true);
      setErrorNotice(null);
      setFailedAttempts(0);
      addAuditEvent({
        timestamp: new Date().toISOString(),
        actor: {
          uid: 'demo-auth-01',
          name: 'Authorized Demo Signer',
          role: 'PRINCIPAL',
          email: 'test2026@demo-enf.gov.ph',
        },
        action: 'DEMO_USER_AUTHENTICATED',
        resource: 'AUTH_GATEWAY',
        severity: 'INFO',
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        metadata: {
          mechanism: 'SHARED_DEMO_CREDENTIALS',
          username: 'test2026',
          result: 'SUCCESS',
        },
      });
    } else {
      const newFails = failedAttempts + 1;
      setFailedAttempts(newFails);

      if (newFails >= 5) {
        setIsLockedOut(true);
        setLockoutSecondsRemaining(60);
        setErrorNotice('Too many unsuccessful attempts. Please wait before trying again.');
        addAuditEvent({
          timestamp: new Date().toISOString(),
          actor: {
            uid: 'anonymous-visitor',
            name: 'Unauthenticated Visitor',
            role: 'PRINCIPAL',
            email: 'visitor@unauthenticated',
          },
          action: 'DEMO_AUTH_LOCKOUT_TRIGGERED',
          resource: 'AUTH_GATEWAY',
          severity: 'HIGH',
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent,
          metadata: {
            failedAttempts: newFails,
            lockoutDurationSeconds: 60,
          },
        });
      } else {
        setErrorNotice('Invalid credentials. Enter the authorized demonstration username and password.');
      }
    }
  };

  const handleSelectRole = (roleOption: RoleOption) => {
    switchRole(roleOption.role);
    addAuditEvent({
      timestamp: new Date().toISOString(),
      actor: {
        uid: 'demo-user',
        name: roleOption.name,
        role: roleOption.role,
        email: `${roleOption.role.toLowerCase()}@demo-enf.gov.ph`,
      },
      action: 'DEMO_ROLE_CONTEXT_ACTIVATED',
      resource: 'PERSONA_SELECTOR',
      severity: 'INFO',
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      metadata: {
        activatedRole: roleOption.role,
        targetRoute: roleOption.route,
        actorName: roleOption.name,
      },
    });

    const destination = returnTo && returnTo.startsWith('/') ? returnTo : roleOption.route;
    onNavigate(destination);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col justify-between font-sans">
      {/* Top Bar with Demo Banner */}
      <header className="border-b border-neutral-200 bg-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center cursor-pointer select-none"
            title="JuriMbrella — Protection over every signature"
          >
            <BrandLogo
              variant="compact"
              height={38}
              priority
              alt="JuriMbrella Philippine Electronic Notarization"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-700">
              DEMONSTRATION ENVIRONMENT — NOT FOR LEGAL USE
            </span>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-xs text-neutral-600 hover:text-black font-medium"
            >
              Public Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        {!isAuthenticated ? (
          /* Auth Gateway Container with 2-Column Corporate Layout */
          <div className="w-full grid grid-cols-1 md:grid-cols-12 rounded-2xl overflow-hidden border border-[#D9E1E8] bg-white shadow-lg">
            {/* LEFT COLUMN: Official JuriMbrella Brand Presentation */}
            <div className="md:col-span-5 bg-[#002D5B] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <BrandLogo
                    variant="emblem"
                    size={48}
                    themeMode="dark"
                    priority
                    alt="JuriMbrella"
                  />
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight">
                      <span>Juri</span><span className="text-[#A8E063]">Mbrella</span>
                    </h2>
                    <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">
                      Philippine eNotarization
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-lg font-bold font-sans text-white leading-snug">
                    "Protection over every signature"
                  </h3>
                  <div className="inline-flex items-center gap-1.5 bg-[#0078CE]/20 border border-[#0078CE]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#A8E063]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Secure. Legal. Digital. Nationwide.</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  A professional Philippine electronic notarization platform focused on secure, compliant, traceable, and professionally controlled digital notarization workflows.
                </p>

                <div className="space-y-2 pt-1 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0" />
                    <span>A.M. No. 24-10-14-SC Aligned Workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0" />
                    <span>SHA-256 Tamper-Evident Audit Chains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2EAF4A] shrink-0" />
                    <span>Nationwide Accessibility for Signers & ENPs</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-[10px] text-slate-300 flex items-center justify-between">
                <span>Supreme Court of the Philippines</span>
                <span>R.A. 8792 • R.A. 10173</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Auth Form */}
            <div className="md:col-span-7 p-6 sm:p-8 space-y-5 bg-white">
              <div className="space-y-1">
                <h1 className="text-lg font-bold tracking-tight text-[#002D5B] font-sans">
                  Electronic Notarization Authentication Gateway
                </h1>
                <p className="text-[11px] text-neutral-500">
                  Supreme Court A.M. No. 24-10-14-SC & R.A. 10173 Secure Client Access
                </p>
              </div>

              {/* Top Auth Mode Tabs */}
              <div className="grid grid-cols-3 border-b border-[#D9E1E8] text-xs font-semibold text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('SIGN_IN');
                    setErrorNotice(null);
                  }}
                  className={`pb-2.5 cursor-pointer transition-colors border-b-2 ${
                    authMode === 'SIGN_IN'
                      ? 'border-[#002D5B] text-[#002D5B] font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('REGISTER');
                    setErrorNotice(null);
                    if (!regInternalPersonId) {
                      setRegInternalPersonId(`JMB-PER-2026-${Math.floor(100000 + Math.random() * 900000)}`);
                    }
                  }}
                  className={`pb-2.5 cursor-pointer transition-colors border-b-2 ${
                    authMode === 'REGISTER'
                      ? 'border-[#002D5B] text-[#002D5B] font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('FORGOT_PASSWORD');
                    setErrorNotice(null);
                  }}
                  className={`pb-2.5 cursor-pointer transition-colors border-b-2 ${
                    authMode === 'FORGOT_PASSWORD'
                      ? 'border-[#002D5B] text-[#002D5B] font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Forgot Password
                </button>
              </div>

            {/* TAB 1: SIGN IN */}
            {authMode === 'SIGN_IN' && (
              <div className="space-y-4 text-xs">
                {/* Demo Notice & Helper Box */}
                <div className="border border-neutral-200 bg-neutral-50 p-3 text-xs space-y-2 text-neutral-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black uppercase font-mono text-[10px]">
                      Authorized Demo Credentials:
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">APP_ENV=demo</span>
                  </div>
                  <div className="font-mono text-xs space-y-0.5 bg-white border border-neutral-200 p-2 text-neutral-800">
                    <p>Demo Username: <strong>test2026</strong></p>
                    <p>Demo Password: <strong>test2026</strong></p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDemoAccess}
                    className="w-full border border-black bg-white py-1 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Use Demo Access (Fill Fields)
                  </button>
                </div>

                {/* Error or Lockout Notice */}
                {errorNotice && (
                  <div
                    role="alert"
                    className={`border p-3 text-xs flex items-start gap-2 ${
                      isLockedOut
                        ? 'border-red-600 bg-red-50 text-red-900 font-semibold'
                        : 'border-neutral-300 bg-neutral-50 text-neutral-800'
                    }`}
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                    <div>
                      <p>{errorNotice}</p>
                      {isLockedOut && (
                        <p className="text-[11px] font-mono mt-1 text-red-700">
                          Lockout active: {lockoutSecondsRemaining}s remaining
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="block font-medium text-neutral-700">
                      Email or Username
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isLockedOut}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username or registered email"
                      className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white disabled:bg-neutral-100 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-neutral-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('FORGOT_PASSWORD')}
                        className="text-[11px] text-neutral-500 hover:text-black underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={isLockedOut}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full border border-neutral-300 p-2 pr-9 text-xs outline-none focus:border-black bg-white disabled:bg-neutral-100 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="border border-amber-200 bg-amber-50/70 p-2.5 text-[10px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                    <span>
                      <strong>Identity Protection Notice:</strong> In accordance with Supreme Court regulations, never use your PhilSys ID number, National ID card number, biometric sample, or Internal Person Identifier as a login credential.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLockedOut}
                    className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isLockedOut
                        ? 'border border-neutral-300 bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-[#002D5B] text-white hover:bg-[#0078CE] border border-transparent shadow-xs'
                    }`}
                  >
                    {isLockedOut ? `Locked Out (${lockoutSecondsRemaining}s)` : 'Sign In to Workspace'}
                  </button>
                </form>

                <div className="text-center pt-1 text-[11px] text-neutral-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('REGISTER')}
                    className="font-semibold text-neutral-900 hover:underline cursor-pointer"
                  >
                    Register as Client Principal
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CLIENT REGISTRATION */}
            {authMode === 'REGISTER' && (
              <div className="space-y-4 text-xs">
                {regStep === 1 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (regPassword !== regConfirmPassword) {
                        setRegNotice('Passwords do not match. Please verify both fields.');
                        return;
                      }
                      if (regPassword.length < 8) {
                        setRegNotice('Password must be at least 8 characters with numbers and symbols.');
                        return;
                      }
                      if (!regAcceptedTerms || !regAcceptedPrivacy) {
                        setRegNotice('You must accept the Terms of Service and Layered Privacy Notice.');
                        return;
                      }
                      if (calculatedAge < 18) {
                        setRegNotice('The principal must be at least 18 years old to execute notarial acts independently.');
                        return;
                      }
                      setRegNotice(null);
                      setRegOtpSent(true);
                      setRegStep(2);
                    }}
                    className="space-y-3"
                  >
                    {regNotice && (
                      <div className="border border-red-300 bg-red-50 p-2.5 text-xs text-red-900 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                        <span>{regNotice}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block font-semibold text-[11px] text-neutral-700">
                        Full Legal Name (as on PhilSys / Official ID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Maria Clara Garcia Santos"
                        className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-semibold text-[11px] text-neutral-700">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="client@domain.ph"
                          className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-semibold text-[11px] text-neutral-700">
                          Philippine Mobile (+63) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          placeholder="+63 917 555 1234"
                          className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Date of birth with computed age */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block font-semibold text-[11px] text-neutral-700">
                          Date of Birth *
                        </label>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Age: {calculatedAge} years &bull;{' '}
                          <span className={calculatedAge >= 18 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                            {calculatedAge >= 18 ? 'Legal Age (18+)' : 'Minor (Requires Guardian/Rep)'}
                          </span>
                        </span>
                      </div>
                      <input
                        type="date"
                        required
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white font-mono"
                      />
                    </div>

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-semibold text-[11px] text-neutral-700">
                          Create Password *
                        </label>
                        <div className="relative">
                          <input
                            type={regShowPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full border border-neutral-300 p-2 pr-8 text-xs outline-none focus:border-black bg-white font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => setRegShowPassword(!regShowPassword)}
                            className="absolute right-2 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          >
                            {regShowPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-semibold text-[11px] text-neutral-700">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white font-sans"
                        />
                      </div>
                    </div>

                    {/* Password strength meter */}
                    {regPassword && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-neutral-500">Password Strength:</span>
                          <span className="font-bold">
                            {regPwdStrength <= 2 ? 'Weak' : regPwdStrength <= 4 ? 'Good' : 'Strong'}
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 h-1 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              regPwdStrength <= 2 ? 'bg-amber-500 w-1/3' : regPwdStrength <= 4 ? 'bg-blue-500 w-2/3' : 'bg-emerald-500 w-full'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Consent Checkboxes */}
                    <div className="border border-neutral-200 bg-neutral-50 p-3 space-y-2 text-[11px]">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regAcceptedTerms}
                          onChange={(e) => setRegAcceptedTerms(e.target.checked)}
                          className="mt-0.5"
                        />
                        <span>
                          I accept the <strong>Terms of Service</strong> governing electronic appearance and digital notarization pursuant to Supreme Court A.M. No. 24-10-14-SC.
                        </span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regAcceptedPrivacy}
                          onChange={(e) => setRegAcceptedPrivacy(e.target.checked)}
                          className="mt-0.5"
                        />
                        <span>
                          I acknowledge the <strong>Layered Privacy Notice</strong> under R.A. 10173 (Data Privacy Act of 2012) authorizing strict purpose-limited processing of my identity for legal instrument execution.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer"
                    >
                      Continue to SMS & Email Verification &rarr;
                    </button>
                  </form>
                )}

                {/* Step 2: Simulated OTP Verification */}
                {regStep === 2 && (
                  <div className="space-y-4">
                    <div className="border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Simulated Two-Step Verification OTP Dispatched</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        A 6-digit one-time PIN has been dispatched to <strong>{regMobile || '+63 917 555 1234'}</strong> and verification token to <strong>{regEmail || 'client@domain.ph'}</strong>.
                      </p>
                    </div>

                    <div className="border border-neutral-200 p-3 bg-neutral-50 text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-neutral-700">Simulated SMS Preview:</span>
                        <span className="font-mono text-neutral-500">SENDER: JURIMBRELLA</span>
                      </div>
                      <div className="font-mono bg-white p-2 border border-neutral-200 text-xs">
                        [JuriMbrella] Your one-time verification PIN is <strong>829104</strong>. Valid for 10 minutes. Do not share with anyone.
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegOtpInput('829104')}
                        className="w-full border border-neutral-300 bg-white py-1 text-xs font-medium hover:bg-neutral-100 cursor-pointer font-mono"
                      >
                        Auto-Fill Simulated OTP (829104)
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (regOtpInput.trim() !== '829104') {
                          setRegNotice('Invalid OTP code. Please enter 829104 for demonstration verification.');
                          return;
                        }
                        setRegNotice(null);
                        setRegStep(3);
                        addAuditEvent({
                          timestamp: new Date().toISOString(),
                          actor: {
                            uid: regInternalPersonId,
                            name: regFullName || 'Registered Client',
                            role: 'PRINCIPAL',
                            email: regEmail || 'client@demo.ph',
                          },
                          action: 'CLIENT_ACCOUNT_REGISTERED',
                          resource: 'AUTH_GATEWAY',
                          severity: 'INFO',
                          ipAddress: '127.0.0.1',
                          userAgent: navigator.userAgent,
                          metadata: {
                            internalPersonId: regInternalPersonId,
                            legalName: regFullName,
                            result: 'PROVISIONED',
                          },
                        });
                      }}
                      className="space-y-3"
                    >
                      {regNotice && (
                        <div className="border border-red-300 bg-red-50 p-2 text-xs text-red-900">
                          {regNotice}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="block font-semibold text-[11px] text-neutral-700">
                          Enter 6-Digit One-Time PIN *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={regOtpInput}
                          onChange={(e) => setRegOtpInput(e.target.value)}
                          placeholder="829104"
                          className="w-full border border-neutral-300 p-2.5 text-sm font-mono tracking-widest text-center outline-none focus:border-black bg-white"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRegStep(1)}
                          className="w-1/3 border border-neutral-300 py-2 text-xs font-medium hover:bg-neutral-100 cursor-pointer"
                        >
                          &larr; Back
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer"
                        >
                          Verify & Activate Account
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Account Provisioned & Internal Person ID Issued */}
                {regStep === 3 && (
                  <div className="border border-emerald-300 bg-white p-4 space-y-3 text-xs">
                    <div className="text-center space-y-1">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                      <h3 className="font-bold text-sm text-neutral-900">
                        Account Successfully Provisioned
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Your electronic notarization principal record has been established.
                      </p>
                    </div>

                    <div className="border border-neutral-200 bg-neutral-50 p-3 space-y-1.5 font-mono text-[11px]">
                      <div className="text-neutral-500 text-[10px] uppercase font-sans font-bold">
                        Internal Person Identifier:
                      </div>
                      <div className="p-2 border border-neutral-300 bg-white font-bold text-neutral-900 text-xs">
                        {regInternalPersonId}
                      </div>
                      <p className="text-[10px] text-neutral-500 font-sans">
                        <strong>Notice:</strong> This identifier is an internal system dossier key for indexing case appearances. It does not replace your government ID and is not a login credential.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        switchRole('PRINCIPAL');
                        onNavigate(returnTo || '/dashboard/principal');
                      }}
                      className="w-full border border-black bg-black py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Principal Dashboard Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FORGOT PASSWORD / RECOVERY */}
            {authMode === 'FORGOT_PASSWORD' && (
              <div className="space-y-4 text-xs">
                {recStep === 1 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setRecStep(2);
                    }}
                    className="space-y-3"
                  >
                    <div className="text-neutral-600 text-xs">
                      Enter your registered email address or Philippine mobile number to receive a secure recovery code.
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold text-[11px] text-neutral-700">
                        Registered Email or Mobile *
                      </label>
                      <input
                        type="text"
                        required
                        value={recTarget}
                        onChange={(e) => setRecTarget(e.target.value)}
                        placeholder="e.g. nardalinang@gmail.com or +63 917 555 1234"
                        className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer"
                    >
                      Send Recovery Code &rarr;
                    </button>
                  </form>
                )}

                {recStep === 2 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (recNewPassword !== recConfirmPassword) {
                        setRecNotice('Passwords do not match.');
                        return;
                      }
                      setRecStep(3);
                    }}
                    className="space-y-3"
                  >
                    <div className="border border-neutral-200 bg-neutral-50 p-2.5 text-xs space-y-1">
                      <span className="font-bold">Simulated Recovery OTP:</span>
                      <div className="font-mono bg-white p-1.5 border border-neutral-200 text-xs">
                        Use demo recovery PIN: <strong>482109</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRecOtp('482109')}
                        className="text-[10px] underline font-mono text-neutral-700 hover:text-black"
                      >
                        Auto-fill PIN
                      </button>
                    </div>

                    {recNotice && (
                      <div className="border border-red-300 bg-red-50 p-2 text-xs text-red-900">
                        {recNotice}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block font-semibold text-[11px] text-neutral-700">
                        6-Digit Recovery PIN *
                      </label>
                      <input
                        type="text"
                        required
                        value={recOtp}
                        onChange={(e) => setRecOtp(e.target.value)}
                        placeholder="482109"
                        className="w-full border border-neutral-300 p-2 text-xs font-mono outline-none focus:border-black bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold text-[11px] text-neutral-700">
                        New Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={recNewPassword}
                        onChange={(e) => setRecNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold text-[11px] text-neutral-700">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={recConfirmPassword}
                        onChange={(e) => setRecConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full border border-neutral-300 p-2 text-xs outline-none focus:border-black bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer"
                    >
                      Update Password & Return to Sign In
                    </button>
                  </form>
                )}

                {recStep === 3 && (
                  <div className="border border-emerald-300 bg-white p-4 space-y-3 text-center text-xs">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                    <h3 className="font-bold text-sm text-neutral-900">Password Successfully Updated</h3>
                    <p className="text-[11px] text-neutral-500">
                      You can now sign in using your updated credentials.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('SIGN_IN');
                        setRecStep(1);
                      }}
                      className="w-full border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer"
                    >
                      Go to Sign In
                    </button>
                  </div>
                )}
              </div>
            )}

            {isLockedOut && (
              <div className="pt-2">
                <ErrorSupportMessage
                  errorType="access"
                  customTitle="Authentication Security Lockout"
                  onOpenSupport={() => setIsSupportModalOpen(true)}
                />
              </div>
            )}

            <div className="border-t border-neutral-200 pt-4 space-y-2 text-center">
              <div className="flex items-center justify-center gap-3 text-xs text-neutral-600">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 font-medium text-neutral-800 hover:text-black cursor-pointer underline"
                >
                  <Headphones className="h-3.5 w-3.5" />
                  <span>Need Assistance? Contact Support</span>
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="text-neutral-600 hover:text-black"
                >
                  Contact Us Page
                </button>
              </div>

              <div className="text-[10px] text-neutral-500 font-mono">
                Hotline: {siteContact.phoneDisplay} &bull; {siteContact.email}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('/jurimbrella-portal')}
                  className="text-xs text-neutral-500 hover:text-black"
                >
                  Return to JuriMbrella Legal Information Page
                </button>
              </div>
            </div>
          </div>
        </div>
        ) : (
          /* Step 2: Role / Persona Selector */
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <span className="border border-neutral-300 bg-neutral-100 px-3 py-1 text-xs font-mono uppercase tracking-wider text-neutral-700">
                Session Authenticated (test2026)
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
                Select a Demonstration Workspace
              </h1>
              <p className="text-xs text-neutral-600 max-w-xl mx-auto">
                Explore the platform through any of the 14 authorized statutory roles. Each persona
                operates within an isolated, role-specific dashboard with strict permission boundaries.
              </p>
            </div>

            {/* Filter categories */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {['ALL', 'Parties', 'Notarial Office', 'Governance & Security', 'Operations'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'border-black bg-black text-white font-bold'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-black'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* 14 Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DEMO_ROLES.filter(
                (r) => selectedCategory === 'ALL' || r.category === selectedCategory
              ).map((option) => (
                <div
                  key={option.role}
                  onClick={() => handleSelectRole(option)}
                  className="group cursor-pointer border border-neutral-200 bg-white p-4 hover:border-black hover:shadow-xs transition-all flex flex-col justify-between text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 border border-neutral-200 px-1.5 py-0.5">
                        {option.category}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {option.route}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black">
                        {option.title}
                      </h3>
                      <p className="text-xs text-neutral-600 font-medium">{option.name}</p>
                    </div>

                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900 group-hover:text-black">
                    <span>Enter Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 text-xs text-neutral-500">
              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="hover:text-black"
              >
                Sign Out Demo Session
              </button>
              <span>Demo Persona Switcher is active</span>
            </div>
          </div>
        )}
      </main>

      {/* Standardized Global Public Footer */}
      <GlobalFooter
        onNavigate={onNavigate}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        defaultTopic="technical"
      />
    </div>
  );
};
