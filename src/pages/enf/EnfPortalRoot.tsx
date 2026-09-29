import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Compass,
  ShoppingBag,
  FileText,
  Sparkles,
  Shield,
  CreditCard,
  History,
  LogOut,
  User,
  Bell,
  LogIn,
  AlertTriangle,
} from 'lucide-react';
import { EnfPublicLandingPage } from './EnfPublicLandingPage';
import { EnfPlansAndCheckoutView } from './EnfPlansAndCheckoutView';
import { EnfCustomerProfileWizard } from './EnfCustomerProfileWizard';
import { EnfDashboardView } from './EnfDashboardView';
import { EnfDevelopmentView } from './EnfDevelopmentView';
import { EnfBuilderView } from './EnfBuilderView';
import { EnfCreditWalletView } from './EnfCreditWalletView';
import { EnfTransactionsView } from './EnfTransactionsView';
import { EnfDocumentsView } from './EnfDocumentsView';
import { EnfAiResearchView } from './EnfAiResearchView';
import { EnfSupportView } from './EnfSupportView';
import { EnfAdminPortalView } from './EnfAdminPortalView';
import { EnfClientsView } from './EnfClientsView';
import { EnfAuthView } from './EnfAuthView';
import { BrandLogo } from '../../components/common/BrandLogo';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { EnfAuthService, ENFAuthUser } from '../../services/enf/enfAuthService';

interface EnfPortalRootProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const EnfPortalRoot: React.FC<EnfPortalRootProps> = ({ currentPath, onNavigate }) => {
  const [currentUser, setCurrentUser] = useState<ENFAuthUser | null>(() => EnfAuthService.getCurrentUser());
  const actualUserId = currentUser?.id || '';

  const [notifications, setNotifications] = useState(() =>
    actualUserId ? EnfStorageService.getNotifications(actualUserId) : []
  );
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('enf-50k');

  useEffect(() => {
    const user = EnfAuthService.getCurrentUser();
    setCurrentUser(user);
    if (user?.id) {
      setNotifications(EnfStorageService.getNotifications(user.id));
    } else {
      setNotifications([]);
    }
  }, [currentPath]);

  // Determine subview from pathname
  const normalized = currentPath.toLowerCase().replace(/\/$/, '') || '/';

  // 1. PUBLIC ROUTES
  if (normalized === '/enf' || normalized === '') {
    return (
      <EnfPublicLandingPage
        onNavigate={onNavigate}
        onSelectPlan={(planId) => {
          setSelectedPlanId(planId);
          if (currentUser) {
            onNavigate(`/enf/checkout?planId=${planId}`);
          } else {
            onNavigate(`/enf/login?returnTo=${encodeURIComponent(`/enf/checkout?planId=${planId}`)}`);
          }
        }}
        onOpenAuth={() => onNavigate('/enf/login')}
      />
    );
  }

  // 2. AUTHENTICATION ROUTES
  if (normalized === '/enf/login') {
    return (
      <EnfAuthView
        initialMode="LOGIN"
        returnUrl="/enf/dashboard"
        onNavigate={onNavigate}
        onAuthSuccess={() => setCurrentUser(EnfAuthService.getCurrentUser())}
      />
    );
  }

  if (normalized === '/enf/signup' || normalized === '/enf/register') {
    return (
      <EnfAuthView
        initialMode="SIGNUP"
        returnUrl="/enf/profile"
        onNavigate={onNavigate}
        onAuthSuccess={() => setCurrentUser(EnfAuthService.getCurrentUser())}
      />
    );
  }

  if (normalized === '/enf/forgot-password') {
    return (
      <EnfAuthView
        initialMode="FORGOT_PASSWORD"
        returnUrl="/enf/login"
        onNavigate={onNavigate}
      />
    );
  }

  if (normalized === '/enf/verify-email') {
    return (
      <EnfAuthView
        initialMode="VERIFY_EMAIL"
        returnUrl="/enf/dashboard"
        onNavigate={onNavigate}
        onAuthSuccess={() => setCurrentUser(EnfAuthService.getCurrentUser())}
      />
    );
  }

  // 3. ROUTE PROTECTION: Unauthenticated access to protected routes
  const isProtectedCustomerRoute =
    normalized.startsWith('/enf/profile') ||
    normalized.startsWith('/enf/plans') ||
    normalized.startsWith('/enf/checkout') ||
    normalized.startsWith('/enf/order') ||
    normalized.startsWith('/enf/payment') ||
    normalized.startsWith('/enf/dashboard') ||
    normalized.startsWith('/enf/development') ||
    normalized.startsWith('/enf/wallet') ||
    normalized.startsWith('/enf/credits') ||
    normalized.startsWith('/enf/transactions') ||
    normalized.startsWith('/enf/customize') ||
    normalized.startsWith('/enf/builder') ||
    normalized.startsWith('/enf/documents') ||
    normalized.startsWith('/enf/research') ||
    normalized.startsWith('/enf/settings') ||
    normalized.startsWith('/enf/clients') ||
    normalized.startsWith('/enf/support');

  const isAdminRoute =
    normalized === '/admin' ||
    normalized === '/enf/admin' ||
    normalized.startsWith('/admin/');

  if (!currentUser && (isProtectedCustomerRoute || isAdminRoute)) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#D9E1E8] p-6 shadow-md text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#002D5B]">Authentication Required</h2>
          <p className="text-xs text-slate-600">
            You must be signed in to access this protected area of the Electronic Notarial Facility platform.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate(`/enf/login?returnTo=${encodeURIComponent(normalized)}`)}
              className="w-full rounded-lg bg-[#002D5B] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#0078CE] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Proceed to Sign In</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. ADMIN ROLE PROTECTION: Non-admin trying to access /admin
  const isAdminUser =
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'FINANCE';

  if (isAdminRoute && !isAdminUser) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-6 shadow-md text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#002D5B]">Administrative Access Denied (403)</h2>
          <p className="text-xs text-slate-600">
            Your account ({currentUser?.email}) does not possess administrative or finance privileges.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/enf/dashboard')}
              className="w-full rounded-lg bg-[#002D5B] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#0078CE] transition-all cursor-pointer"
            >
              Return to Customer Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine active admin tab if path is `/admin/*`
  const getAdminTab = (): 'PAYMENTS' | 'ORDERS' | 'PLANS' | 'BANK_SETTINGS' | 'WALLETS' | 'AUDIT_LOGS' | 'REPORTS' => {
    if (normalized.includes('payment')) return 'PAYMENTS';
    if (normalized.includes('order') || normalized.includes('subscription')) return 'ORDERS';
    if (normalized.includes('bank')) return 'BANK_SETTINGS';
    if (normalized.includes('credit') || normalized.includes('ledger')) return 'WALLETS';
    if (normalized.includes('audit')) return 'AUDIT_LOGS';
    if (normalized.includes('report')) return 'REPORTS';
    if (normalized.includes('plan')) return 'PLANS';
    return 'PAYMENTS';
  };

  const handleLogout = async () => {
    await EnfAuthService.logout();
    setCurrentUser(null);
    onNavigate('/enf/login');
  };

  // Render Subviews with ENF Workspace Bar
  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased flex flex-col">
      {/* Top Application Header for ENF Workspace */}
      <header className="sticky top-0 z-40 border-b border-[#D9E1E8] bg-white/95 backdrop-blur-xs shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Brand & Subdomain Lockup */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigate('/enf/dashboard')}
              className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
            >
              <BrandLogo
                variant="compact"
                height={34}
                priority
                alt="JuriMbrella ENF"
                className="shrink-0"
              />
            </div>

            <div className="hidden md:flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <span className="rounded bg-[#0078CE]/10 px-2 py-0.5 text-[10px] font-bold text-[#002D5B] uppercase font-mono">
                {isAdminUser ? 'ADMINISTRATION DESK' : 'ENF CUSTOMER PORTAL'}
              </span>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {[
              { path: '/enf/dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { path: '/enf/development', label: 'Milestones', icon: Compass },
              { path: '/enf/plans', label: 'Plans & Orders', icon: ShoppingBag },
              { path: '/enf/customize', label: 'Builder', icon: Compass },
              { path: '/enf/wallet', label: 'Credits & Wallet', icon: CreditCard },
              { path: '/enf/transactions', label: 'Receipts', icon: History },
              { path: '/enf/documents', label: 'Documents', icon: FileText },
              { path: '/enf/research', label: 'AI Research', icon: Sparkles },
              ...(isAdminUser ? [{ path: '/admin/payments', label: 'Admin Desk', icon: Shield }] : []),
            ].map((item) => {
              const Icon = item.icon;
              const isActive =
                normalized === item.path ||
                (item.path === '/admin/payments' && (normalized === '/enf/admin' || normalized.startsWith('/admin'))) ||
                (item.path === '/enf/plans' && (normalized === '/enf/checkout' || normalized === '/enf/payment' || normalized === '/enf/order')) ||
                (item.path === '/enf/customize' && normalized === '/enf/builder') ||
                (item.path === '/enf/wallet' && normalized === '/enf/credits');

              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#002D5B] text-white font-bold'
                      : 'text-slate-600 hover:text-[#002D5B] hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E1E8] text-[#002D5B] hover:bg-[#F4F7F9] cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2EAF4A]" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#D9E1E8] bg-white p-3 shadow-xl z-50 text-xs space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-[#002D5B]">Notifications</span>
                    <span className="text-[10px] text-slate-400 font-mono">{notifications.length} Total</span>
                  </div>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-center py-2 text-[11px]">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-2 rounded-lg bg-[#F4F7F9] border border-slate-100 space-y-0.5">
                          <p className="font-bold text-[#002D5B]">{n.title}</p>
                          <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                          <p className="text-[9px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile & Real Sign Out */}
            {currentUser && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('/enf/profile')}
                  className="flex items-center gap-1.5 rounded-lg border border-[#D9E1E8] px-2.5 py-1.5 text-xs font-semibold text-[#002D5B] hover:bg-[#F4F7F9] cursor-pointer max-w-[130px] sm:max-w-xs truncate"
                  title={`${currentUser.fullName} (${currentUser.role})`}
                >
                  <User className="h-3.5 w-3.5 text-[#0078CE] shrink-0" />
                  <span className="truncate">{currentUser.fullName.split(' ')[0]}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E1E8] text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Sign Out (Invalidate Session)"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Routed Content Area */}
      <main className="flex-1">
        {normalized === '/enf/dashboard' && <EnfDashboardView onNavigate={onNavigate} userId={actualUserId} />}

        {normalized === '/enf/development' && <EnfDevelopmentView onNavigate={onNavigate} userId={actualUserId} />}

        {(normalized === '/enf/order' ||
          normalized === '/enf/payment' ||
          normalized === '/enf/plans' ||
          normalized === '/enf/checkout') && (
          <EnfPlansAndCheckoutView
            initialPlanId={selectedPlanId}
            onNavigate={onNavigate}
            onPaymentSubmitted={() => onNavigate('/enf/transactions')}
          />
        )}

        {(normalized === '/enf/builder' || normalized === '/enf/customize') && (
          <EnfBuilderView onNavigate={onNavigate} userId={actualUserId} />
        )}

        {(normalized === '/enf/wallet' || normalized === '/enf/credits') && (
          <EnfCreditWalletView onNavigate={onNavigate} userId={actualUserId} />
        )}

        {normalized === '/enf/transactions' && (
          <EnfTransactionsView onNavigate={onNavigate} userId={actualUserId} />
        )}

        {normalized === '/enf/clients' && <EnfClientsView onNavigate={onNavigate} />}
        {normalized === '/enf/documents' && <EnfDocumentsView onNavigate={onNavigate} />}
        {normalized === '/enf/research' && <EnfAiResearchView onNavigate={onNavigate} />}
        {normalized === '/enf/support' && <EnfSupportView onNavigate={onNavigate} />}
        {normalized === '/enf/profile' && <EnfCustomerProfileWizard onNavigate={onNavigate} userId={actualUserId} />}

        {/* Commercial Admin Desk (Protected to Authorized Administrators) */}
        {(normalized === '/enf/admin' || normalized === '/admin' || normalized.startsWith('/admin/')) && (
          <EnfAdminPortalView onNavigate={onNavigate} initialTab={getAdminTab()} />
        )}

        {/* Fallback to Dashboard if path starts with /enf/ but isn't explicitly matched */}
        {normalized.startsWith('/enf/') &&
          ![
            '/enf/dashboard',
            '/enf/development',
            '/enf/order',
            '/enf/checkout',
            '/enf/payment',
            '/enf/plans',
            '/enf/builder',
            '/enf/customize',
            '/enf/wallet',
            '/enf/credits',
            '/enf/transactions',
            '/enf/clients',
            '/enf/documents',
            '/enf/research',
            '/enf/support',
            '/enf/profile',
            '/enf/admin',
          ].includes(normalized) && <EnfDashboardView onNavigate={onNavigate} userId={actualUserId} />}
      </main>
    </div>
  );
};
