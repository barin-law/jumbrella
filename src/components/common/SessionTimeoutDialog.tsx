import React from 'react';
import { Clock, ShieldAlert, Key } from 'lucide-react';

interface SessionTimeoutDialogProps {
  isOpen: boolean;
  remainingSeconds: number;
  onExtend: () => void;
  onSignOut: () => void;
}

export const SessionTimeoutDialog: React.FC<SessionTimeoutDialogProps> = ({
  isOpen,
  remainingSeconds,
  onExtend,
  onSignOut,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-timeout-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md border border-black bg-white p-6 shadow-2xl transition-colors dark:border-white dark:bg-black text-black dark:text-white">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-500 bg-amber-100 text-amber-800 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 id="session-timeout-title" className="text-base font-bold">
              Session Idle Warning
            </h2>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Pursuant to JuriMbrella security policies, your authenticated session will expire due to inactivity in:
            </p>
            <div className="my-3 text-center">
              <span className="font-mono text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">
                00:{remainingSeconds.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Upon expiration, all in-memory cryptographic credentials and cached document references will be wiped immediately.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onSignOut}
            className="border border-black/20 px-3.5 py-1.5 text-xs font-semibold hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
          >
            Sign Out Now
          </button>
          <button
            onClick={onExtend}
            className="flex items-center gap-1.5 border border-black bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <Key className="h-3.5 w-3.5" />
            <span>Extend Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
