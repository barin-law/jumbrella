import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { NavItemConfig } from '../../data/navigationConfig';
import { AccessibleTooltip } from './AccessibleTooltip';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Activity,
  CheckCircle,
  FileSearch,
  ExternalLink,
  Headphones,
  LayoutDashboard,
  UserCheck,
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Stamp,
  Sliders,
  FolderClosed,
  ChevronsUpDown,
} from 'lucide-react';
import { siteContact } from '../../config/contactConfig';

interface CollapsibleSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  menuItems: NavItemConfig[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
  activeRole: UserRole;
  onOpenIntegrationCenter: () => void;
  onOpenUnitTests: () => void;
  onOpenVerificationPortal: () => void;
  onOpenSupport?: () => void;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('overview') || cat.includes('dashboard')) return LayoutDashboard;
  if (cat.includes('identity')) return UserCheck;
  if (cat.includes('case') || cat.includes('matter')) return Briefcase;
  if (cat.includes('participant') || cat.includes('witness')) return Users;
  if (cat.includes('document') || cat.includes('evidence')) return FileText;
  if (cat.includes('consultation') || cat.includes('hearing') || cat.includes('message')) return MessageSquare;
  if (cat.includes('notari') || cat.includes('stamp')) return Stamp;
  if (cat.includes('account') || cat.includes('setting')) return Sliders;
  return FolderClosed;
};

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  menuItems,
  activeItemId,
  onSelectItem,
  activeRole,
  onOpenIntegrationCenter,
  onOpenUnitTests,
  onOpenVerificationPortal,
  onOpenSupport,
}) => {
  // Group menu items by category if available
  const categories: string[] = Array.from(new Set<string>((menuItems || []).map((item) => item.category || 'Workspace')));

  // Track open state of categories: default to opening the category of the active item
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const activeItem = (menuItems || []).find((i) => i.id === activeItemId);
    const activeCat = activeItem?.category || categories[0] || 'Overview';
    categories.forEach((cat) => {
      initial[cat] = cat === activeCat || cat === 'Overview';
    });
    return initial;
  });

  // Automatically expand category if user navigates to an item in it
  useEffect(() => {
    const activeCat = (menuItems || []).find((i) => i.id === activeItemId)?.category;
    if (activeCat) {
      setOpenCategories((prev) => ({ ...prev, [activeCat]: true }));
    }
  }, [activeItemId, menuItems]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const areAllExpanded = categories.length > 0 && categories.every((cat) => openCategories[cat]);

  const toggleAllCategories = () => {
    const nextState = !areAllExpanded;
    const updated: Record<string, boolean> = {};
    categories.forEach((cat) => {
      updated[cat] = nextState;
    });
    setOpenCategories(updated);
  };

  return (
    <aside
      id="application-sidebar"
      aria-label="Application Navigation Sidebar"
      className={`hidden md:flex flex-col border-r border-[#001F3F] bg-[#002D5B] text-white transition-all duration-200 select-none ${
        isCollapsed ? 'w-[76px]' : 'w-[270px]'
      }`}
    >
      {/* Sidebar Header / Role Info */}
      <div className={`flex items-center border-b border-white/10 ${
        isCollapsed ? 'flex-col gap-2 py-3 px-1' : 'justify-between px-3 py-3'
      }`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 truncate pr-1">
            <BrandLogo
              variant="emblem"
              height={34}
              themeMode="dark"
              decorative
              className="shrink-0"
            />
            <div className="flex flex-col truncate">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-300">
                Workspace Role
              </span>
              <span className="text-xs font-bold text-white truncate">
                {activeRole.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center pt-1" title="JuriMbrella">
            <BrandLogo
              variant="emblem"
              height={32}
              themeMode="dark"
              decorative
              className="shrink-0"
            />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`flex h-7 w-7 items-center justify-center rounded-md border border-white/20 text-slate-200 hover:bg-white/10 transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-2 scrollbar-thin">
        {!isCollapsed && categories.length > 1 && (
          <div className="flex items-center justify-between px-2 pb-1.5 text-[10px] font-mono text-slate-300 border-b border-white/10 mb-2">
            <span className="uppercase tracking-wider">Workspace Modules</span>
            <button
              onClick={toggleAllCategories}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={areAllExpanded ? 'Collapse all categories' : 'Expand all categories'}
            >
              <ChevronsUpDown className="h-3 w-3" />
              <span>{areAllExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>
          </div>
        )}

        {categories.map((category) => {
          const itemsInCategory = menuItems.filter((i) => (i.category || 'Workspace') === category);
          const isCategoryOpen = openCategories[category] ?? false;
          const CategoryIcon = getCategoryIcon(category);
          const hasActiveChild = itemsInCategory.some((i) => i.id === activeItemId);
          const totalBadgeCount = itemsInCategory.reduce((acc, item) => {
            const count = typeof item.badge === 'number' ? item.badge : parseInt(item.badge as string, 10);
            return isNaN(count) ? acc : acc + count;
          }, 0);

          return (
            <div key={category} className="space-y-1">
              {!isCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  aria-expanded={isCategoryOpen}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    hasActiveChild
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <CategoryIcon className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                    <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                      {category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {totalBadgeCount > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2EAF4A] px-1 text-[9px] font-bold text-white">
                        {totalBadgeCount}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">
                      {itemsInCategory.length}
                    </span>
                    {isCategoryOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </div>
                </button>
              ) : (
                <div className="my-1 border-t border-white/10" />
              )}

              {/* Items List */}
              {(isCategoryOpen || isCollapsed) && (
                <div className={`space-y-1 ${!isCollapsed ? 'pl-2' : ''}`}>
                  {itemsInCategory.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItemId === item.id;

                    const buttonElement = (
                      <button
                        onClick={() => onSelectItem(item.id)}
                        className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-[#0078CE] font-semibold text-white shadow-xs border-l-4 border-[#2EAF4A]'
                            : 'text-slate-200 hover:bg-white/10 hover:text-white'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`} />
                        
                        {!isCollapsed && (
                          <div className="flex flex-1 items-center justify-between truncate">
                            <span className="truncate">{item.label}</span>
                            <div className="flex items-center gap-1.5 ml-1.5">
                              {item.statusBadge && (
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-black/30 text-slate-200'
                                  }`}
                                >
                                  {item.statusBadge}
                                </span>
                              )}
                              {item.badge && (
                                <span
                                  className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                                    isActive
                                      ? 'bg-[#2EAF4A] text-white'
                                      : 'bg-white/20 text-slate-100'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    );

                    return isCollapsed ? (
                      <AccessibleTooltip key={item.id} content={`${category}: ${item.label}`} position="right">
                        {buttonElement}
                      </AccessibleTooltip>
                    ) : (
                      <div key={item.id}>{buttonElement}</div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Global Utilities in Sidebar Footer */}
      <div className="border-t border-white/10 p-2.5 space-y-1 bg-[#002447]">
        {!isCollapsed && (
          <div className="px-2 pt-1 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-300">
            Platform Utilities
          </div>
        )}

        {/* Integration Center */}
        {isCollapsed ? (
          <AccessibleTooltip content="Integration Center (18 Adapters)" position="right">
            <button
              onClick={onOpenIntegrationCenter}
              className="flex w-full items-center justify-center p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <Activity className="h-4 w-4" />
            </button>
          </AccessibleTooltip>
        ) : (
          <button
            onClick={onOpenIntegrationCenter}
            className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <Activity className="h-3.5 w-3.5 text-[#0078CE]" />
            <span className="truncate">Integration Center</span>
          </button>
        )}

        {/* Invariant Unit Tests */}
        {isCollapsed ? (
          <AccessibleTooltip content="Accreditation Invariant Tests" position="right">
            <button
              onClick={onOpenUnitTests}
              className="flex w-full items-center justify-center p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          </AccessibleTooltip>
        ) : (
          <button
            onClick={onOpenUnitTests}
            className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <CheckCircle className="h-3.5 w-3.5 text-[#2EAF4A]" />
            <span className="truncate">Invariant Unit Tests</span>
          </button>
        )}

        {/* Public Verification */}
        {isCollapsed ? (
          <AccessibleTooltip content="Public Verification Portal" position="right">
            <button
              onClick={onOpenVerificationPortal}
              className="flex w-full items-center justify-center p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <FileSearch className="h-4 w-4" />
            </button>
          </AccessibleTooltip>
        ) : (
          <button
            onClick={onOpenVerificationPortal}
            className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <FileSearch className="h-3.5 w-3.5 text-[#A8E063]" />
            <span className="truncate">Public Verification</span>
          </button>
        )}

        {/* Contact Administrator / Support Desk */}
        {onOpenSupport && (
          isCollapsed ? (
            <AccessibleTooltip content="Contact Administrator & Support Desk" position="right">
              <button
                onClick={onOpenSupport}
                className="flex w-full items-center justify-center p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <Headphones className="h-4 w-4" />
              </button>
            </AccessibleTooltip>
          ) : (
            <button
              onClick={onOpenSupport}
              className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
            >
              <Headphones className="h-3.5 w-3.5 text-slate-300" />
              <span className="truncate">Contact Admin / Support</span>
            </button>
          )
        )}
      </div>
    </aside>
  );
};
