import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  HelpCircle,
  Headphones,
  Activity,
  LogOut,
  ChevronDown,
  User,
  Shield,
  ShieldAlert,
  Building,
  CheckCircle,
  Scale,
  Sparkles,
  Info,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useIntegration } from '../../context/IntegrationContext';
import { UserRole } from '../../types';
import { SYSTEM_ROLES } from '../../data/initialData';
import { StatusBadge } from './StatusBadge';
import { ROLE_ROUTE_MAP } from '../../data/routesConfig';
import { siteContact } from '../../config/contactConfig';

interface TopApplicationBarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileDrawer: () => void;
  onOpenNotifications: () => void;
  onOpenHelp: () => void;
  onOpenSupport?: () => void;
  onOpenIntegrationCenter: () => void;
  unreadCount?: number;
  onSearch?: (query: string) => void;
}

export const TopApplicationBar: React.FC<TopApplicationBarProps> = ({
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenMobileDrawer,
  onOpenNotifications,
  onOpenHelp,
  onOpenSupport,
  onOpenIntegrationCenter,
  unreadCount = 0,
  onSearch,
}) => {
  const { currentUser, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { adapters, operationalCount, demoCount, unconfiguredCount } = useIntegration();

  const [searchQuery, setSearchQuery] = useState('');
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const personaMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setIsPersonaMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const currentRoleInfo = SYSTEM_ROLES.find((r) => r.role === currentUser.role);

  return (
    <header
      id="top-application-bar"
      className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#D9E1E8] bg-white px-3 sm:px-4 text-[#17212B] transition-colors shadow-2xs"
    >
      {/* Left Section: Sidebar Toggle & Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile drawer toggle */}
        <button
          onClick={onOpenMobileDrawer}
          aria-label="Open mobile navigation menu"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E1E8] text-[#002D5B] hover:bg-[#F4F7F9] hover:border-[#0078CE] md:hidden cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Desktop sidebar collapse toggle */}
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E1E8] text-[#002D5B] hover:bg-[#F4F7F9] hover:border-[#0078CE] cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Brand wordmark */}
        <div className="flex items-center gap-2.5">
          <BrandLogo
            variant="emblem"
            height={32}
            decorative
            className="shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight font-sans text-[#002D5B] leading-none">
              <span>Juri</span><span className="text-[#2EAF4A]">Mbrella</span>
            </span>
            <span className="hidden text-[10px] text-slate-500 sm:inline-block leading-none mt-0.5 font-medium">
              Philippine eNotarization
            </span>
          </div>
        </div>

        {/* Environment & Accreditation Badges */}
        <div className="hidden lg:flex items-center gap-1.5 ml-2">
          <span className="inline-flex items-center gap-1 border border-[#0078CE]/30 bg-[#0078CE]/10 px-2 py-0.5 text-[10px] font-mono font-semibold tracking-tight text-[#002D5B] rounded-md">
            DEV / CANDIDATE
          </span>
          <span className="inline-flex items-center gap-1 border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 px-2 py-0.5 text-[10px] font-mono font-semibold tracking-tight text-[#1B6C2E] rounded-md">
            A.M. 24-10-14-SC ALIGNED
          </span>
        </div>
      </div>

      {/* Middle Section: Global Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filings, participants, hashes (e.g. BENF-2026)..."
            aria-label="Search filings and audit events"
            className="h-8 w-full rounded-lg border border-[#D9E1E8] bg-[#F4F7F9] pl-8 pr-3 text-xs text-[#17212B] placeholder:text-slate-400 focus:border-[#0078CE] focus:bg-white focus:outline-none"
          />
        </form>
      </div>

      {/* Right Section: Actions, Persona Switcher & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Integration health trigger */}
        <button
          onClick={onOpenIntegrationCenter}
          title="Open Integration Center & Adapter Health"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-[#D9E1E8] px-2 text-xs font-mono text-[#002D5B] hover:bg-[#F4F7F9] hover:border-[#0078CE] cursor-pointer"
        >
          <Activity className="h-3.5 w-3.5 text-[#0078CE]" />
          <span className="hidden xl:inline text-[11px] font-semibold">Adapters</span>
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0078CE]/15 px-1 text-[10px] font-bold text-[#002D5B]">
            {demoCount + operationalCount}/{adapters.length}
          </span>
        </button>

        {/* Notifications trigger */}
        <button
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E1E8] text-[#002D5B] hover:bg-[#F4F7F9] hover:border-[#0078CE] cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D64545] px-1 text-[9px] font-bold text-white shadow-2xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Help trigger */}
        <button
          onClick={onOpenHelp}
          aria-label="Open operational guide and help"
          title="Operational Guide & Legal Framework"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E1E8] text-[#002D5B] hover:bg-[#F4F7F9] hover:border-[#0078CE] cursor-pointer"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Support & Administrator Contact Trigger */}
        {onOpenSupport && (
          <button
            onClick={onOpenSupport}
            aria-label="Contact Administrator & Support"
            title="Contact Administrator & Technical Support"
            className="flex h-8 items-center gap-1 rounded-lg border border-[#D9E1E8] px-2 text-xs text-[#002D5B] hover:bg-[#F4F7F9] hover:border-[#0078CE] cursor-pointer"
          >
            <Headphones className="h-3.5 w-3.5 text-[#0078CE]" />
            <span className="hidden lg:inline text-[11px] font-semibold">Support</span>
          </button>
        )}

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E1E8] text-[#002D5B] hover:bg-[#F4F7F9] hover:border-[#0078CE] cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Demo Persona Switcher */}
        <div className="relative" ref={personaMenuRef}>
          <button
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            aria-expanded={isPersonaMenuOpen}
            aria-haspopup="true"
            id="demo-persona-switcher-button"
            className="flex h-8 items-center gap-1.5 border border-black bg-black px-2.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Demo Persona Switcher</span>
            <span className="sm:hidden">Persona</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {isPersonaMenuOpen && (
            <div
              id="demo-persona-switcher-dropdown"
              className="absolute right-0 mt-1.5 w-80 max-h-[85vh] overflow-y-auto border border-black bg-white shadow-2xl z-50 text-black dark:border-white dark:bg-black dark:text-white"
            >
              <div className="border-b border-black/15 bg-neutral-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-400">
                Switch Role / Persona (14 Demo Personas)
              </div>
              <div className="p-1 space-y-0.5">
                {SYSTEM_ROLES.map((roleInfo) => {
                  const isCurrent = currentUser.role === roleInfo.role;
                  return (
                    <button
                      key={roleInfo.role}
                      onClick={() => {
                        switchRole(roleInfo.role as UserRole);
                        setIsPersonaMenuOpen(false);
                        const target = ROLE_ROUTE_MAP[roleInfo.role as UserRole];
                        if (target) {
                          window.history.pushState({}, '', target);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }
                      }}
                      className={`flex w-full flex-col text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-l-2 border-black bg-neutral-100 font-bold dark:border-white dark:bg-neutral-900'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-black dark:text-white">
                          {roleInfo.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {roleInfo.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Popover */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            aria-label="User profile menu"
            className="flex h-8 items-center gap-1.5 border border-black/20 px-2 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-black/20 bg-neutral-200 text-neutral-800 dark:border-white/20 dark:bg-neutral-800 dark:text-neutral-200">
              <User className="h-3 w-3" />
            </div>
            <span className="hidden md:inline text-xs font-medium max-w-[100px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-72 border border-black bg-white p-3 shadow-2xl z-50 text-black dark:border-white dark:bg-black dark:text-white">
              <div className="border-b border-black/10 pb-2.5 mb-2.5 dark:border-white/10">
                <p className="text-xs font-bold text-black dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {currentUser.email}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <StatusBadge status={currentUser.role} size="sm" />
                  {currentUser.mfaEnabled && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                      <Shield className="h-3 w-3" /> MFA Active
                    </span>
                  )}
                </div>
              </div>

              {currentUser.organization && (
                <div className="mb-2 text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Building className="h-3 w-3 shrink-0" />
                  <span className="truncate">{currentUser.organization}</span>
                </div>
              )}

              {currentUser.commissionNo && (
                <div className="mb-2 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                  Commission: {currentUser.commissionNo}
                </div>
              )}

              {/* Public Portal Navigation Links */}
              <div className="border-t border-black/10 py-2 space-y-1 dark:border-white/10 text-xs">
                <a
                  href="/jurimbrella-portal"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsProfileMenuOpen(false);
                    window.history.pushState({}, '', '/jurimbrella-portal');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="flex items-center justify-between px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                >
                  <span>JuriMbrella Legal Portal</span>
                  <span className="text-[10px] font-mono text-neutral-400">/jurimbrella-portal</span>
                </a>
                <a
                  href="/verify"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsProfileMenuOpen(false);
                    window.history.pushState({}, '', '/verify');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="flex items-center justify-between px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                >
                  <span>Public Hash Verification</span>
                  <span className="text-[10px] font-mono text-neutral-400">/verify</span>
                </a>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsProfileMenuOpen(false);
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="flex items-center justify-between px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                >
                  <span>Public Homepage</span>
                  <span className="text-[10px] font-mono text-neutral-400">/</span>
                </a>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsProfileMenuOpen(false);
                    window.history.pushState({}, '', '/contact');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="flex items-center justify-between px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                >
                  <span className="font-medium text-black dark:text-white">Contact Us / Inquiries</span>
                  <span className="text-[10px] font-mono text-neutral-400">/contact</span>
                </a>
              </div>

              {/* Support & Admin Desk Quick Action */}
              <div className="border-t border-black/10 py-2 dark:border-white/10 text-xs space-y-1">
                {onOpenSupport && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenSupport();
                    }}
                    className="flex w-full items-center justify-between px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Headphones className="h-3.5 w-3.5" />
                      <span>Contact Administrator</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Hotline</span>
                  </button>
                )}
                <div className="px-2 pt-1 text-[10px] text-neutral-500 space-y-0.5 font-mono">
                  <div>Hotline: {siteContact.phoneDisplay}</div>
                  <div>Email: {siteContact.email}</div>
                </div>
              </div>

              <div className="border-t border-black/10 pt-2 dark:border-white/10">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                    window.history.pushState({}, '', '/sign-in');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="flex w-full items-center gap-1.5 px-2 py-1.5 text-xs text-red-600 hover:bg-neutral-100 dark:text-red-400 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
