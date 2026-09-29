import React, { useState, useEffect } from 'react';
import { LegalStatusBanner } from './LegalStatusBanner';
import { TopApplicationBar } from './TopApplicationBar';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { MobileNavigationDrawer } from './MobileNavigationDrawer';
import { NotificationCenter, AppNotification } from './NotificationCenter';
import { GuidedHelpModal } from './GuidedHelpModal';
import { SupportModal } from './SupportModal';
import { SessionTimeoutDialog } from './SessionTimeoutDialog';
import { AuthenticatedFooter } from './AuthenticatedFooter';
import { ROLE_NAVIGATION_MAP, NavItemConfig } from '../../data/navigationConfig';
import { useAuth } from '../../context/AuthContext';

interface ApplicationShellProps {
  children: (activeModuleId: string, setActiveModuleId: (id: string) => void) => React.ReactNode;
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  onOpenIntegrationCenter: () => void;
  onOpenUnitTests: () => void;
  onOpenVerificationPortal: () => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export const ApplicationShell: React.FC<ApplicationShellProps> = ({
  children,
  activeModuleId,
  setActiveModuleId,
  onOpenIntegrationCenter,
  onOpenUnitTests,
  onOpenVerificationPortal,
  onSearch,
}) => {
  const { currentUser, logout } = useAuth();

  // Persistent sidebar collapsed state in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jurimbrella_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('jurimbrella_sidebar_collapsed', String(next));
      } catch (e) {
        console.error('Failed to save sidebar state', e);
      }
      return next;
    });
  };

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Notifications state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Scheduled REN Videoconference Hearing',
      message: 'Demo Hearing BENF-2026-0002 has been pre-scheduled for today at 3:00 PM PHT with Atty. Juan Dela Cruz.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      read: false,
      type: 'info',
      actionLabel: 'View Waiting Room',
      onAction: () => setActiveModuleId('principal-live-sessions'),
    },
    {
      id: 'notif-2',
      title: 'Quarantine Cleared: Board Resolution',
      message: 'Document SHA-256 hash verified. Synthetic ClamAV scan completed in isolated memory.',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      read: false,
      type: 'success',
      actionLabel: 'Inspect Hash',
      onAction: () => setActiveModuleId('principal-documents'),
    },
  ]);

  // Help modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Support & Contact Admin modal state
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Session timeout simulation
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [remainingTimeoutSeconds, setRemainingTimeoutSeconds] = useState(60);

  // Get current role's navigation configuration
  const currentMenuItems: NavItemConfig[] =
    ROLE_NAVIGATION_MAP[currentUser.role] || ROLE_NAVIGATION_MAP.PRINCIPAL;

  // Ensure activeModuleId is valid for the current role
  useEffect(() => {
    const validIds = currentMenuItems.map((m) => m.id);
    if (!validIds.includes(activeModuleId) && validIds.length > 0) {
      setActiveModuleId(validIds[0]);
    }
  }, [currentUser.role, activeModuleId, currentMenuItems, setActiveModuleId]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 text-black dark:bg-black dark:text-white antialiased">
      {/* 1. Mandatory Legal Status Banner */}
      <LegalStatusBanner />

      {/* 2. Top Application Bar */}
      <TopApplicationBar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenIntegrationCenter={onOpenIntegrationCenter}
        unreadCount={notifications.filter((n) => !n.read).length}
        onSearch={onSearch}
      />

      {/* 3. Main Body Container: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Collapsible Sidebar (Desktop) */}
        <CollapsibleSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          menuItems={currentMenuItems}
          activeItemId={activeModuleId}
          onSelectItem={(id) => setActiveModuleId(id)}
          activeRole={currentUser.role}
          onOpenIntegrationCenter={onOpenIntegrationCenter}
          onOpenUnitTests={onOpenUnitTests}
          onOpenVerificationPortal={onOpenVerificationPortal}
          onOpenSupport={() => setIsSupportOpen(true)}
        />

        {/* Off-canvas Mobile Drawer */}
        <MobileNavigationDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          menuItems={currentMenuItems}
          activeItemId={activeModuleId}
          onSelectItem={(id) => setActiveModuleId(id)}
          activeRole={currentUser.role}
          onOpenIntegrationCenter={onOpenIntegrationCenter}
          onOpenUnitTests={onOpenUnitTests}
          onOpenVerificationPortal={onOpenVerificationPortal}
          onOpenSupport={() => setIsSupportOpen(true)}
        />

        {/* Main Application Working Area */}
        <main
          id="main-authenticated-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 lg:p-8 dark:bg-black transition-colors focus:outline-none"
        >
          <div className="mx-auto w-full max-w-7xl">
            {children(activeModuleId, setActiveModuleId)}
          </div>
        </main>
      </div>

      {/* 4. Authenticated Footer */}
      <AuthenticatedFooter
        currentRole={currentUser.role}
        onOpenSupportModal={() => setIsSupportOpen(true)}
      />

      {/* Overlays / Modals */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      <GuidedHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        activeRole={currentUser.role}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        defaultTopic="general"
      />

      <SessionTimeoutDialog
        isOpen={showTimeoutWarning}
        remainingSeconds={remainingTimeoutSeconds}
        onExtend={() => setShowTimeoutWarning(false)}
        onSignOut={() => logout()}
      />
    </div>
  );
};
