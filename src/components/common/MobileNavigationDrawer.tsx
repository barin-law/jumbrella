import React, { useEffect, useState } from 'react';
import {
  X,
  Scale,
  Activity,
  CheckCircle,
  FileSearch,
  Headphones,
  ChevronDown,
  ChevronRight,
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
import { BrandLogo } from './BrandLogo';
import { NavItemConfig } from '../../data/navigationConfig';
import { UserRole } from '../../types';

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
  menuItems,
  activeItemId,
  onSelectItem,
  activeRole,
  onOpenIntegrationCenter,
  onOpenUnitTests,
  onOpenVerificationPortal,
  onOpenSupport,
}) => {
  const categories: string[] = Array.from(new Set<string>((menuItems || []).map((item) => item.category || 'Workspace')));

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const activeItem = (menuItems || []).find((i) => i.id === activeItemId);
    const activeCat = activeItem?.category || categories[0] || 'Overview';
    categories.forEach((cat) => {
      initial[cat] = cat === activeCat || cat === 'Overview';
    });
    return initial;
  });

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

  const areAllExpanded = categories.length > 0 && categories.every((c) => openCategories[c]);

  const toggleAll = () => {
    const next = !areAllExpanded;
    const res: Record<string, boolean> = {};
    categories.forEach((c) => (res[c] = next));
    setOpenCategories(res);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className="relative z-10 flex h-full w-[280px] flex-col border-r border-[#001F3F] bg-[#002D5B] text-white shadow-2xl transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo
              variant="emblem"
              height={32}
              themeMode="dark"
              decorative
              className="shrink-0"
            />
            <div>
              <div className="text-sm font-bold leading-none font-sans text-white">
                <span>Juri</span><span className="text-[#A8E063]">Mbrella</span>
              </div>
              <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                {activeRole.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Menu list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
          {categories.length > 1 && (
            <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-mono text-slate-300 border-b border-white/10 mb-2">
              <span className="uppercase tracking-wider">Workspace Modules</span>
              <button
                onClick={toggleAll}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronsUpDown className="h-3 w-3" />
                <span>{areAllExpanded ? 'Collapse All' : 'Expand All'}</span>
              </button>
            </div>
          )}

          {categories.map((category) => {
            const itemsInCategory = menuItems.filter((i) => (i.category || 'Workspace') === category);
            const isOpen = openCategories[category] ?? false;
            const CategoryIcon = getCategoryIcon(category);
            const hasActiveChild = itemsInCategory.some((i) => i.id === activeItemId);

            return (
              <div key={category} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    hasActiveChild ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-3.5 w-3.5 text-slate-300" />
                    <span>{category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>{itemsInCategory.length}</span>
                    {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-0.5 pl-2">
                    {itemsInCategory.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeItemId === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectItem(item.id);
                            onClose();
                          }}
                          className={`flex w-full items-center justify-between px-2.5 py-2 text-xs transition-colors rounded-lg cursor-pointer ${
                            isActive
                              ? 'bg-[#0078CE] font-semibold text-white border-l-4 border-[#2EAF4A]'
                              : 'text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="rounded-full bg-[#2EAF4A] px-1.5 py-0.2 text-[10px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Utilities in footer */}
        <div className="border-t border-white/10 p-3 bg-[#002447] space-y-1.5">
          <button
            onClick={() => {
              onOpenIntegrationCenter();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <Activity className="h-3.5 w-3.5 text-[#0078CE]" />
            <span>Integration Center</span>
          </button>
          <button
            onClick={() => {
              onOpenUnitTests();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <CheckCircle className="h-3.5 w-3.5 text-[#2EAF4A]" />
            <span>Invariant Unit Tests</span>
          </button>
          <button
            onClick={() => {
              onOpenVerificationPortal();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <FileSearch className="h-3.5 w-3.5 text-[#A8E063]" />
            <span>Public Verification</span>
          </button>
          {onOpenSupport && (
            <button
              onClick={() => {
                onOpenSupport();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-2.5 py-2 text-xs font-semibold text-white hover:bg-white/10 rounded-lg cursor-pointer"
            >
              <Headphones className="h-3.5 w-3.5 text-slate-300" />
              <span>Contact Admin / Support</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigationDrawer;
