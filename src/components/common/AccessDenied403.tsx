import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, LogOut, Key } from 'lucide-react';
import { UserRole } from '../../types';
import { ErrorSupportMessage } from './ErrorSupportMessage';
import { SupportModal } from './SupportModal';

interface AccessDenied403Props {
  currentRole: UserRole;
  requiredRole: UserRole;
  authorizedRoute: string;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export const AccessDenied403: React.FC<AccessDenied403Props> = ({
  currentRole,
  requiredRole,
  authorizedRoute,
  onNavigate,
  onSignOut,
}) => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans text-neutral-900">
      <div className="w-full max-w-lg border border-neutral-300 bg-white p-6 sm:p-8 shadow-sm space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-red-600 bg-red-50 text-red-600">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-700">
            A.M. No. 24-10-14-SC Role Boundary Enforcement
          </span>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-red-700">
            403 — You do not have permission to access this workspace.
          </h1>
          <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
            Your current authenticated session is assigned to the <strong>{currentRole}</strong> role.
            Access to this workspace requires the <strong>{requiredRole}</strong> role credential.
          </p>
        </div>

        <div className="border border-neutral-200 bg-neutral-50 p-3 text-xs font-mono text-left space-y-1">
          <p className="text-neutral-500">Security Audit Context:</p>
          <p className="text-neutral-800">• Assigned Persona: <strong>{currentRole}</strong></p>
          <p className="text-neutral-800">• Authorized Route: <strong>{authorizedRoute}</strong></p>
          <p className="text-neutral-800">• Target Route Restriction: <strong>{requiredRole}</strong></p>
        </div>

        {/* Standardized Administrator Support Box for Access Issues */}
        <ErrorSupportMessage
          errorType="access"
          customTitle="Need Role Elevation or Credentials Support?"
          onOpenSupport={() => setIsSupportModalOpen(true)}
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate(authorizedRoute)}
            className="w-full sm:w-auto border border-black bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Return to Authorized Workspace
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/sign-in')}
            className="w-full sm:w-auto border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 hover:border-black transition-colors cursor-pointer"
          >
            Switch Persona (Sign In)
          </button>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="hover:text-black transition-colors underline"
          >
            Contact Administrator
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="hover:text-red-600 transition-colors"
          >
            Sign Out Session
          </button>
        </div>
      </div>

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        defaultTopic="technical"
      />
    </div>
  );
};
