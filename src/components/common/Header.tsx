import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  Sun,
  Moon,
  Shield,
  User,
  ChevronDown,
  Lock,
  AlertCircle,
  Key,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSecurity } from '../../context/SecurityContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { currentUser, activeRole, switchRole, availableRoles } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const { threatAlerts, chainIntegrity } = useSecurity();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const activeThreatsCount = threatAlerts.filter((t) => t.status === 'ACTIVE').length;

  return (
    <header
      id="app-main-header"
      className="sticky top-0 z-40 border-b border-[#D9E1E8] bg-white text-[#17212B] transition-colors shadow-2xs"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-3">
          <BrandLogo
            variant="compact"
            height={38}
            priority
            alt="JuriMbrella Philippine Electronic Notarization"
            className="shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="border border-[#2EAF4A]/40 bg-[#2EAF4A]/10 text-[#1B6C2E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md">
                A.M. No. 24-10-14-SC Aligned
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-500 sm:block font-medium">
              Supreme Court Rules on Electronic Notarization
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Security & Cryptography State Pill */}
          <div className="hidden items-center gap-2 border border-[#D9E1E8] bg-[#F4F7F9] px-3 py-1.5 text-[11px] md:flex rounded-lg text-[#002D5B]">
            <Lock className="h-3.5 w-3.5 text-[#0078CE]" />
            <span className="font-mono font-semibold">AES-256 • SHA-256</span>
            {!chainIntegrity.isValid && (
              <span className="flex items-center gap-1 font-bold text-red-600">
                <AlertCircle className="h-3 w-3" />
                Tamper Detected!
              </span>
            )}
            {activeThreatsCount > 0 && (
              <span className="ml-1 bg-[#D64545] px-1.5 py-0.2 text-[10px] font-bold text-white rounded">
                {activeThreatsCount} Threats
              </span>
            )}
          </div>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              id="role-switcher-button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 border border-[#D9E1E8] bg-white px-3 py-1.5 text-xs font-semibold text-[#002D5B] hover:border-[#0078CE] rounded-lg transition-colors cursor-pointer"
              title="Switch role to view the platform from different authorization perspectives"
            >
              <User className="h-3.5 w-3.5 text-[#0078CE]" />
              <span className="max-w-[130px] truncate sm:max-w-[200px]">
                {currentUser.name} ({activeRole})
              </span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {roleMenuOpen && (
              <div
                id="role-switcher-dropdown"
                className="absolute right-0 mt-1.5 w-80 border border-[#D9E1E8] bg-white p-2 shadow-xl z-50 rounded-xl"
              >
                <div className="border-b border-[#D9E1E8] pb-2 mb-2 px-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#002D5B]">
                    Switch Active Persona & Role (RBAC)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Simulate permissions and dashboard access:
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1">
                  {availableRoles.map((r) => {
                    const isSelected = activeRole === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 text-xs transition-colors flex flex-col gap-0.5 rounded-lg border cursor-pointer ${
                          isSelected
                            ? 'border-[#002D5B] bg-[#002D5B] text-white font-semibold'
                            : 'border-transparent hover:border-[#D9E1E8] hover:bg-[#F4F7F9] text-[#17212B]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{r.label}</span>
                          <span className="text-[10px] uppercase opacity-70">
                            {r.category}
                          </span>
                        </div>
                        <p className={`text-[10px] line-clamp-1 ${isSelected ? 'opacity-85' : 'text-slate-500'}`}>
                          {r.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            id="dark-mode-toggle-button"
            onClick={toggleDarkMode}
            className="flex h-8 w-8 items-center justify-center border border-[#D9E1E8] rounded-lg hover:border-[#0078CE] transition-colors cursor-pointer text-[#002D5B]"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
