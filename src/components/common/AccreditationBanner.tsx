import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const AccreditationBanner: React.FC = () => {
  return (
    <div
      id="accreditation-candidate-banner"
      className="w-full border-b border-black/20 bg-neutral-100 px-4 py-2.5 text-xs text-black transition-colors dark:border-white/20 dark:bg-neutral-900 dark:text-white"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 shrink-0 text-black dark:text-white" />
          <span>
            <strong>Mandatory Legal Notice:</strong> Development / Accreditation Candidate Environment — electronic notarization is not available for legal use.
          </span>
          <span className="ml-2 border border-black bg-black px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:border-white dark:bg-white dark:text-black">
            DEMO — NOT LEGALLY VALID
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Supreme Court A.M. No. 24-10-14-SC Candidate Baseline
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">All Regulated Functions Fail Closed</span>
        </div>
      </div>
    </div>
  );
};
