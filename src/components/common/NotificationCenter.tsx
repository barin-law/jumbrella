import React from 'react';
import { DetailsDrawer } from './DetailsDrawer';
import { Bell, AlertCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications & Summons"
      subtitle="Filing updates, waiting room summons, and security advisories"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
          <span className="text-xs font-semibold uppercase text-neutral-500">
            Recent Alerts ({notifications.length})
          </span>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white underline cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            No active notifications
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`border p-3.5 transition-colors ${
                  n.read
                    ? 'border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/30'
                    : 'border-black bg-white dark:border-white dark:bg-black'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {n.type === 'alert' && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                    {n.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                    {n.type === 'success' && <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                    {n.type === 'info' && <Info className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />}
                    <h4 className="text-xs font-bold text-black dark:text-white">
                      {n.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {n.message}
                </p>

                {n.actionLabel && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        n.onAction?.();
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 border border-black/30 px-2.5 py-1 text-[11px] font-semibold hover:bg-neutral-100 dark:border-white/30 dark:hover:bg-neutral-900"
                    >
                      <span>{n.actionLabel}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DetailsDrawer>
  );
};
