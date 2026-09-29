import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  Compass,
  CreditCard,
  FileText,
  Users,
  Sparkles,
  HelpCircle,
  Shield,
  LayoutDashboard,
  LogOut,
  Bell,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  User,
  ShoppingBag,
} from 'lucide-react';
import { EnfPublicLandingPage } from './EnfPublicLandingPage';
import { EnfPlansAndCheckoutView } from './EnfPlansAndCheckoutView';
import { EnfDashboardView } from './EnfDashboardView';
import { EnfBuilderView } from './EnfBuilderView';
import { EnfCreditWalletView } from './EnfCreditWalletView';
import { EnfClientsView } from './EnfClientsView';
import { EnfDocumentsView } from './EnfDocumentsView';
import { EnfAiResearchView } from './EnfAiResearchView';
import { EnfSupportView } from './EnfSupportView';
import { EnfCustomerProfileWizard } from './EnfCustomerProfileWizard';
import { EnfAdminPortalView } from './EnfAdminPortalView';
import { EnfStorageService } from '../../services/enf/enfStorageService';

interface EnfPortalRootProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const EnfPortalRoot: React.FC<EnfPortalRootProps> = ({ currentPath, onNavigate }) => {
  const [notifications] = useState(() => EnfStorageService.getNotifications('demo-enf-owner-1'));
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('enf-plan-50k');

  // Determine subview from pathname
  const normalized = currentPath.toLowerCase().replace(/\/$/, '');

  // Render Public Landing Page for `/enf`
  if (normalized === '/enf') {
    return (
      <EnfPublicLandingPage
        onNavigate={onNavigate}
        onSelectPlan={(planId) => {
          setSelectedPlanId(planId);
          onNavigate('/enf/order');
        }}
      />
    );
  }

  // Render Subviews with ENF Authenticated Workspace Bar
  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased flex flex-col">
      {/* Top Application Header for ENF Workspace */}
      <header className="sticky top-0 z-40 border-b border-[#D9E1E8] bg-white/95 backdrop-blur-xs shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Brand & Subdomain Lockup */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigate('/enf')}
              className="flex items-center cursor-pointer select-none"
              title="JuriMbrella ENF Portal"
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
                ENF PORTAL
              </span>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {[
              { path: '/enf/dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { path: '/enf/order', label: 'Plans & Orders', icon: ShoppingBag },
              { path: '/enf/builder', label: 'ENF Builder', icon: Compass },
              { path: '/enf/wallet', label: 'Credit Wallet', icon: CreditCard },
              { path: '/enf/documents', label: 'Documents', icon: FileText },
              { path: '/enf/clients', label: 'Clients', icon: Users },
              { path: '/enf/research', label: 'AI Research', icon: Sparkles },
              { path: '/enf/admin', label: 'Admin Desk', icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = normalized === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
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
                    <span className="font-bold text-[#002D5B]">ENF Notifications</span>
                    <span className="text-[10px] text-slate-400 font-mono">{notifications.length} Total</span>
                  </div>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-[#F4F7F9] border border-slate-100 space-y-0.5">
                        <p className="font-bold text-[#002D5B]">{n.title}</p>
                        <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                        <p className="text-[9px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Wizard Trigger */}
            <button
              onClick={() => onNavigate('/enf/profile')}
              className="flex items-center gap-1.5 rounded-lg border border-[#D9E1E8] px-2.5 py-1.5 text-xs font-semibold text-[#002D5B] hover:bg-[#F4F7F9] cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-[#0078CE]" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Return to Main JuriMbrella Platform */}
            <button
              onClick={() => onNavigate('/')}
              className="rounded-lg bg-[#0078CE]/10 px-3 py-1.5 text-xs font-bold text-[#002D5B] hover:bg-[#0078CE]/20 transition-colors cursor-pointer whitespace-nowrap"
            >
              Main eNotary →
            </button>
          </div>
        </div>
      </header>

      {/* Main Routed Content Area */}
      <main className="flex-1">
        {normalized === '/enf/dashboard' && <EnfDashboardView onNavigate={onNavigate} />}
        {(normalized === '/enf/order' || normalized === '/enf/payment' || normalized === '/enf/plans') && (
          <EnfPlansAndCheckoutView
            initialPlanId={selectedPlanId}
            onNavigate={onNavigate}
            onPaymentSubmitted={() => onNavigate('/enf/dashboard')}
          />
        )}
        {normalized === '/enf/builder' && <EnfBuilderView onNavigate={onNavigate} />}
        {normalized === '/enf/wallet' && <EnfCreditWalletView onNavigate={onNavigate} />}
        {normalized === '/enf/clients' && <EnfClientsView onNavigate={onNavigate} />}
        {normalized === '/enf/documents' && <EnfDocumentsView onNavigate={onNavigate} />}
        {normalized === '/enf/research' && <EnfAiResearchView onNavigate={onNavigate} />}
        {normalized === '/enf/support' && <EnfSupportView onNavigate={onNavigate} />}
        {normalized === '/enf/profile' && <EnfCustomerProfileWizard onNavigate={onNavigate} />}
        {normalized === '/enf/admin' && <EnfAdminPortalView onNavigate={onNavigate} />}

        {/* Fallback to Dashboard if path starts with /enf/ but isn't explicitly matched */}
        {normalized.startsWith('/enf/') &&
          ![
            '/enf/dashboard',
            '/enf/order',
            '/enf/payment',
            '/enf/plans',
            '/enf/builder',
            '/enf/wallet',
            '/enf/clients',
            '/enf/documents',
            '/enf/research',
            '/enf/support',
            '/enf/profile',
            '/enf/admin',
          ].includes(normalized) && <EnfDashboardView onNavigate={onNavigate} />}
      </main>
    </div>
  );
};
