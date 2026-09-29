import React, { useEffect, useState } from 'react';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SecurityProvider } from './context/SecurityContext';
import { NotarizationProvider } from './context/NotarizationContext';
import { ClientCaseProvider } from './context/ClientCaseContext';
import { IntegrationProvider } from './context/IntegrationContext';

// Application Shell
import { ApplicationShell } from './components/common/ApplicationShell';
import { IntegrationCenterView } from './components/common/IntegrationCenterView';

// Role-specific Authenticated Dashboards
import { PrincipalDashboard } from './components/dashboards/PrincipalDashboard';
import { EnpDashboard } from './components/dashboards/EnpDashboard';
import { WitnessDashboard } from './components/dashboards/WitnessDashboard';
import { OrgDashboard } from './components/dashboards/OrgDashboard';
import { EnpAssistantDashboard } from './components/dashboards/EnpAssistantDashboard';
import { SecOpsDashboard } from './components/dashboards/SecOpsDashboard';
import { DpoDashboard } from './components/dashboards/DpoDashboard';
import { FinanceDashboard } from './components/dashboards/FinanceDashboard';
import { CustomerSupportDashboard } from './components/dashboards/CustomerSupportDashboard';
import { EnfAdminDashboard } from './components/dashboards/EnfAdminDashboard';
import { InternalAuditorDashboard } from './components/dashboards/InternalAuditorDashboard';
import { CourtAuditorDashboard } from './components/dashboards/CourtAuditorDashboard';
import { ComplianceDashboard } from './components/dashboards/ComplianceDashboard';

// System & Forensic Utility Views
import { UnitTestRunnerView } from './components/dashboards/UnitTestRunnerView';
import { VerifyPortal } from './components/dashboards/VerifyPortal';
import { NotarialBookView } from './components/dashboards/NotarialBookView';
import { ApiDocumentationView } from './components/dashboards/ApiDocumentationView';
import { DocumentationView } from './components/dashboards/DocumentationView';

import { ArrowLeft } from 'lucide-react';

import { ROLE_NAVIGATION_MAP } from './data/navigationConfig';
import { ROLE_ROUTE_MAP, ROUTE_ROLE_MAP } from './data/routesConfig';

// Public & Security Route Pages
import { JurimbrellaPortalPage } from './pages/JurimbrellaPortalPage';
import { SignInPage } from './pages/SignInPage';
import { PublicHomePage } from './pages/PublicHomePage';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AccessDenied403 } from './components/common/AccessDenied403';
import { NotFound404 } from './components/common/NotFound404';
import { EnfPortalRoot } from './pages/enf/EnfPortalRoot';

/**
 * ============================================================
 * JURIMBRELLA — PHILIPPINE eNOTARIZATION
 * Application Routing Configuration
 * ============================================================
 */

type OverlayView =
  | 'NONE'
  | 'INTEGRATION_CENTER'
  | 'UNIT_TESTS'
  | 'VERIFICATION_PORTAL'
  | 'API_DOCS'
  | 'NOTARIAL_BOOK'
  | 'DOCS';

/**
 * ============================================================
 * MAIN AUTHENTICATED WORKSPACE
 * ============================================================
 */

const MainWorkspace: React.FC = () => {
  const { currentUser } = useAuth();

  const defaultModuleForRole = (role: string) => {
    const navItems =
      ROLE_NAVIGATION_MAP[
        role as keyof typeof ROLE_NAVIGATION_MAP
      ] || ROLE_NAVIGATION_MAP.PRINCIPAL;

    return navItems[0]?.id || 'principal-overview';
  };

  const getInitialModule = (role: string) => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get('module');
      const navItems =
        ROLE_NAVIGATION_MAP[
          role as keyof typeof ROLE_NAVIGATION_MAP
        ] || ROLE_NAVIGATION_MAP.PRINCIPAL;

      if (mod && navItems.some((item) => item.id === mod)) {
        return mod;
      }
    } catch {
      // Fall back to default
    }
    return defaultModuleForRole(role);
  };

  const [activeModuleId, setActiveModuleId] = useState<string>(() =>
    getInitialModule(currentUser.role)
  );

  const [overlayView, setOverlayView] =
    useState<OverlayView>('NONE');

  /**
   * Synchronize the default module whenever the user's role changes.
   */
  useEffect(() => {
    setActiveModuleId(getInitialModule(currentUser.role));
    setOverlayView('NONE');
  }, [currentUser.role]);

  /**
   * Listen to browser back/forward popstate to restore correct module.
   */
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get('module');
      const navItems =
        ROLE_NAVIGATION_MAP[
          currentUser.role as keyof typeof ROLE_NAVIGATION_MAP
        ] || ROLE_NAVIGATION_MAP.PRINCIPAL;

      if (mod && navItems.some((item) => item.id === mod)) {
        setActiveModuleId(mod);
      } else {
        setActiveModuleId(defaultModuleForRole(currentUser.role));
      }
      setOverlayView('NONE');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser.role]);

  /**
   * Handle navigation between workspace modules with URL sync.
   */
  const handleSelectModule = (moduleId: string) => {
    if (moduleId === 'global-integration-center') {
      setOverlayView('INTEGRATION_CENTER');
      return;
    }

    if (moduleId === 'global-verify-portal') {
      setOverlayView('VERIFICATION_PORTAL');
      return;
    }

    if (moduleId === 'global-unit-tests') {
      setOverlayView('UNIT_TESTS');
      return;
    }

    if (
      moduleId === 'enp-register' &&
      currentUser.role !== 'ENP'
    ) {
      setOverlayView('NOTARIAL_BOOK');
      return;
    }

    setOverlayView('NONE');
    setActiveModuleId(moduleId);

    // Synchronize browser history and URL query parameter without page reload
    try {
      const url = new URL(window.location.href);
      const defaultMod = defaultModuleForRole(currentUser.role);
      if (moduleId === defaultMod) {
        url.searchParams.delete('module');
      } else {
        url.searchParams.set('module', moduleId);
      }
      window.history.pushState({ moduleId }, '', url.pathname + url.search);
    } catch {
      // Ignore if history manipulation fails in test environment
    }
  };

  return (
    <ApplicationShell
      activeModuleId={activeModuleId}
      setActiveModuleId={handleSelectModule}
      onOpenIntegrationCenter={() =>
        setOverlayView('INTEGRATION_CENTER')
      }
      onOpenUnitTests={() =>
        setOverlayView('UNIT_TESTS')
      }
      onOpenVerificationPortal={() =>
        setOverlayView('VERIFICATION_PORTAL')
      }
    >
      {(currentModuleId, setCurrentModuleId) => {
        /**
         * ------------------------------------------------------------
         * GLOBAL / SYSTEM OVERLAY VIEWS
         * ------------------------------------------------------------
         */

        if (overlayView !== 'NONE') {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={() =>
                    setOverlayView('NONE')
                  }
                  className="flex cursor-pointer items-center gap-1.5 border border-black px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />

                  <span>
                    Return to{' '}
                    {currentUser.role.replace(
                      /_/g,
                      ' '
                    )}{' '}
                    Workspace
                  </span>
                </button>

                <span className="font-mono text-[11px] text-neutral-500">
                  System Utility Mode
                </span>
              </div>

              {overlayView ===
                'INTEGRATION_CENTER' && (
                <IntegrationCenterView />
              )}

              {overlayView ===
                'UNIT_TESTS' && (
                <UnitTestRunnerView />
              )}

              {overlayView ===
                'VERIFICATION_PORTAL' && (
                <VerifyPortal />
              )}

              {overlayView ===
                'API_DOCS' && (
                <ApiDocumentationView />
              )}

              {overlayView ===
                'NOTARIAL_BOOK' && (
                <NotarialBookView />
              )}

              {overlayView ===
                'DOCS' && (
                <DocumentationView />
              )}
            </div>
          );
        }

        /**
         * ------------------------------------------------------------
         * ROLE-SPECIFIC WORKSPACES
         * ------------------------------------------------------------
         */

        switch (currentUser.role) {
          case 'PRINCIPAL':
            return (
              <PrincipalDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'ENP':
            return (
              <EnpDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'WITNESS':
            return (
              <WitnessDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'ORG_REQUESTER':
          case 'ORG_ADMIN':
            return (
              <OrgDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'ENP_ASSISTANT':
            return (
              <EnpAssistantDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'SECOPS_ANALYST':
            return (
              <SecOpsDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'DPO':
            return (
              <DpoDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'FINANCE_OFFICER':
            return (
              <FinanceDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'SUPPORT_AGENT':
            return (
              <CustomerSupportDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'ENF_ADMIN':
            return (
              <EnfAdminDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
                onOpenIntegrationCenter={() =>
                  setOverlayView(
                    'INTEGRATION_CENTER'
                  )
                }
              />
            );

          case 'INTERNAL_AUDITOR':
            return (
              <InternalAuditorDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'COURT_AUDITOR':
            return (
              <CourtAuditorDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          case 'COMPLIANCE_REVIEWER':
            return (
              <ComplianceDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );

          default:
            return (
              <PrincipalDashboard
                activeModuleId={currentModuleId}
                onSelectModule={
                  setCurrentModuleId
                }
              />
            );
        }
      }}
    </ApplicationShell>
  );
};

/**
 * ============================================================
 * APPLICATION ROUTER
 * ============================================================
 *
 * This router is GitHub Pages base-path aware.
 *
 * Example:
 *
 * Browser:
 * /contact
 *
 * Application:
 * /contact
 *
 * ============================================================
 */

const AppRouter: React.FC = () => {
  const { currentUser, logout } = useAuth();

  /**
   * Vite BASE_URL comes from vite.config.ts.
   *
   * Current production configuration:
   *
   * base: '/barinlaw/'
   *
   * Remove the final slash so we can safely construct URLs.
   */
  const basePath =
    import.meta.env.BASE_URL === '/'
      ? ''
      : import.meta.env.BASE_URL.replace(
          /\/$/,
          ''
        );

  /**
   * Convert the actual browser pathname into an application-relative pathname.
   */
  const getAppPath = (): string => {
    let pathname = window.location.pathname || '/';

    if (pathname.startsWith('/barinlaw/')) {
      pathname = pathname.replace(/^\/barinlaw/, '');
    } else if (pathname === '/barinlaw') {
      pathname = '/';
    }

    if (basePath && pathname === basePath) {
      return '/';
    }

    if (basePath && pathname.startsWith(`${basePath}/`)) {
      const relativePath = pathname.slice(basePath.length);
      return relativePath || '/';
    }

    return pathname || '/';
  };

  const [currentPath, setCurrentPath] =
    useState<string>(() => getAppPath());

  /**
   * Handle browser Back / Forward navigation.
   */
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getAppPath());
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, []);

  /**
   * Navigate internally while preserving the application base path.
   */
  const navigate = (path: string) => {
    let normalizedPath =
      path && path !== '/'
        ? path.startsWith('/')
          ? path
          : `/${path}`
        : '/';

    if (basePath && normalizedPath.startsWith(`${basePath}/`)) {
      normalizedPath = normalizedPath.slice(basePath.length);
    }
    if (basePath && normalizedPath === basePath) {
      normalizedPath = '/';
    }

    const browserPath =
      basePath
        ? normalizedPath === '/'
          ? `${basePath}/`
          : `${basePath}${normalizedPath}`
        : normalizedPath;

    window.history.pushState(
      {},
      '',
      browserPath
    );

    setCurrentPath(normalizedPath);

    /**
     * Move to top of page after navigation.
     */
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  };

  /**
   * ============================================================
   * PUBLIC ROUTES
   * ============================================================
   */

  /**
   * 1. JuriMbrella Legal Portal Public Page
   *
   * Preserves backward compatibility routes:
   * /jurimbrella-portal, /legal-information, /dhenze-law-firm, /barin-law-firm
   */
  if (
    currentPath === '/jurimbrella-portal' ||
    currentPath === '/legal-information' ||
    currentPath === '/dhenze-law-firm' ||
    currentPath === '/barin-law-firm'
  ) {
    return (
      <JurimbrellaPortalPage
        onNavigate={navigate}
      />
    );
  }

  /**
   * 2. Sign-In
   */
  if (currentPath === '/sign-in') {
    return (
      <SignInPage
        onNavigate={navigate}
      />
    );
  }

  /**
   * 3. Public Verification
   */
  if (currentPath === '/verify') {
    return (
      <PublicVerifyPage
        onNavigate={navigate}
      />
    );
  }

  /**
   * 4. Contact / Technical Support
   */
  if (
    currentPath === '/contact' ||
    currentPath === '/contact-us'
  ) {
    return (
      <ContactUsPage
        onNavigate={navigate}
      />
    );
  }

  /**
   * 5. ENF Development & Prepaid Access Portal
   * Operations on /enf and all /enf/* subviews
   */
  if (
    currentPath === '/enf' ||
    currentPath.startsWith('/enf/')
  ) {
    return (
      <EnfPortalRoot
        currentPath={currentPath}
        onNavigate={navigate}
      />
    );
  }

  /**
   * ============================================================
   * AUTHENTICATED ROLE ROUTES
   * ============================================================
   */

  if (currentPath in ROUTE_ROLE_MAP) {
    const requiredRole =
      ROUTE_ROLE_MAP[currentPath];

    /**
     * User is authenticated under a different
     * role than the requested workspace.
     */
    if (
      currentUser.role !== requiredRole
    ) {
      return (
        <AccessDenied403
          currentRole={
            currentUser.role
          }
          requiredRole={
            requiredRole
          }
          authorizedRoute={
            ROLE_ROUTE_MAP[
              currentUser.role
            ]
          }
          onNavigate={navigate}
          onSignOut={() => {
            logout();
            navigate('/sign-in');
          }}
        />
      );
    }

    return <MainWorkspace />;
  }

  /**
   * ============================================================
   * PUBLIC HOMEPAGE
   * ============================================================
   */

  if (
    currentPath === '' ||
    currentPath === '/'
  ) {
    return (
      <PublicHomePage
        onNavigate={navigate}
      />
    );
  }

  /**
   * ============================================================
   * UNKNOWN ROUTE
   * ============================================================
   */

  return (
    <NotFound404
      onNavigate={navigate}
    />
  );
};

/**
 * ============================================================
 * APPLICATION ROOT
 * ============================================================
 */

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SecurityProvider>
          <NotarizationProvider>
            <ClientCaseProvider>
              <IntegrationProvider>
                <AppRouter />
              </IntegrationProvider>
            </ClientCaseProvider>
          </NotarizationProvider>
        </SecurityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
