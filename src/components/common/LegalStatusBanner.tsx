import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const LegalStatusBanner: React.FC = () => {
  return (
    <div
      id="mandatory-legal-status-banner"
      role="banner"
      aria-label="Legal Status and Accreditation Notice"
      className="sticky top-0 z-50 flex items-center justify-between border-b border-black/20 bg-neutral-100 px-3 py-1.5 text-xs text-black transition-colors dark:border-white/20 dark:bg-neutral-900 dark:text-white"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex items-center gap-2 truncate">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="truncate text-[11px] font-medium sm:text-xs">
            <span className="font-semibold">Development / Accreditation Candidate Environment</span> — electronic notarization is not available for legal use.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            id="legal-status-badge-demo"
            className="inline-flex items-center gap-1 border border-black bg-black px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase dark:border-white dark:bg-white dark:text-black"
          >
            <ShieldAlert className="h-2.5 w-2.5" />
            DEMO — NOT LEGALLY VALID
          </span>
        </div>
      </div>
    </div>
  );
};
