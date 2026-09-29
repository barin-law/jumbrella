import React from 'react';
import {
  FileText,
  Stamp,
  ShieldAlert,
  ListOrdered,
  BookOpen,
  Search,
  CheckSquare,
  Code,
  Terminal,
  FileCheck,
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export type ActiveTab =
  | 'PRINCIPAL'
  | 'ENP'
  | 'SECOPS'
  | 'AUDIT'
  | 'BOOK'
  | 'VERIFY'
  | 'COMPLIANCE'
  | 'API'
  | 'TESTS'
  | 'DOCS';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const { threatAlerts, chainIntegrity } = useSecurity();
  const activeThreatsCount = threatAlerts.filter((t) => t.status === 'ACTIVE').length;

  const tabs: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    alert?: boolean;
  }> = [
    { id: 'PRINCIPAL', label: 'Signer Portal', icon: FileText },
    { id: 'ENP', label: 'ENP Workspace', icon: Stamp },
    {
      id: 'SECOPS',
      label: 'SecOps & Threats',
      icon: ShieldAlert,
      badge: activeThreatsCount > 0 ? activeThreatsCount : undefined,
    },
    {
      id: 'AUDIT',
      label: 'Audit Logs',
      icon: ListOrdered,
      alert: !chainIntegrity.isValid,
    },
    { id: 'BOOK', label: 'Notarial Book', icon: BookOpen },
    { id: 'VERIFY', label: 'Verify Document', icon: Search },
    { id: 'COMPLIANCE', label: 'Compliance Register', icon: FileCheck },
    { id: 'API', label: 'API & SIEM', icon: Code },
    { id: 'TESTS', label: 'Unit Tests', icon: CheckSquare, badge: '10' },
    { id: 'DOCS', label: 'Onboarding Docs', icon: Terminal },
  ];

  return (
    <nav
      id="main-navigation-tabs"
      className="border-b border-black/15 bg-neutral-50 px-4 transition-colors dark:border-white/15 dark:bg-neutral-950"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto py-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 border px-3.5 py-2 text-xs font-semibold tracking-tight transition-all ${
                isActive
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-transparent text-neutral-700 hover:border-black/20 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-neutral-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? 'bg-white text-black dark:bg-black dark:text-white'
                      : 'border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
              {tab.alert && (
                <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" title="Integrity Alert" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
