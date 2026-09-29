/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Notifications Module
 * Clean, non-technical notification inbox with one-click actions
 */

import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  FileCheck,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Check,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  category: 'HEARING' | 'DOCUMENT' | 'IDENTITY' | 'SECURITY';
  targetModuleId?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Hearing Reminder: Session Tomorrow at 10:00 AM',
    message: 'Your remote videoconference notarization hearing is confirmed with Atty. Juan Dela Cruz.',
    time: '15 minutes ago',
    isRead: false,
    category: 'HEARING',
    targetModuleId: 'principal-appointments',
    actionLabel: 'View Hearing',
  },
  {
    id: 'notif-2',
    title: 'Identity Credential Approved',
    message: 'Your PSA ePhilID verification has been pre-screened and approved for notarial proceedings.',
    time: '2 hours ago',
    isRead: false,
    category: 'IDENTITY',
    targetModuleId: 'principal-identity-verification',
    actionLabel: 'View Status',
  },
  {
    id: 'notif-3',
    title: 'Document Hash Verification Complete',
    message: 'Special Power of Attorney SHA-256 integrity check and PDF/A normalization passed with zero warnings.',
    time: 'Yesterday',
    isRead: true,
    category: 'DOCUMENT',
    targetModuleId: 'principal-evidence-vault',
    actionLabel: 'Inspect Vault',
  },
  {
    id: 'notif-4',
    title: 'Instrumental Witness Confirmed',
    message: 'Atty. Roberto Cruz has acknowledged participation as an instrumental witness for filing #ENF-2026-0814.',
    time: '2 days ago',
    isRead: true,
    category: 'SECURITY',
    targetModuleId: 'principal-participants-witnesses',
    actionLabel: 'Witness Details',
  },
];

interface ClientNotificationsSectionProps {
  onNavigateModule: (moduleId: string) => void;
}

export const ClientNotificationsSection: React.FC<ClientNotificationsSectionProps> = ({
  onNavigateModule,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setToastMessage('All notifications marked as read.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setToastMessage('Notification dismissed.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const clearAll = () => {
    setNotifications([]);
    setToastMessage('Notification inbox cleared.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'HEARING':
        return <Calendar className="h-4 w-4 text-black dark:text-white" />;
      case 'DOCUMENT':
        return <FileCheck className="h-4 w-4 text-black dark:text-white" />;
      case 'IDENTITY':
        return <UserCheck className="h-4 w-4 text-black dark:text-white" />;
      case 'SECURITY':
        return <ShieldCheck className="h-4 w-4 text-black dark:text-white" />;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {toastMessage && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header card */}
      <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-black dark:text-white">
              Notifications & Hearing Alerts
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-black">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 border border-black/20 px-2.5 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark All Read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 border border-black/20 px-2.5 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer text-neutral-500"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-black/20 text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`px-3 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
              filter === 'UNREAD'
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-black/20 text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="border border-black/15 bg-white p-8 text-center dark:border-white/15 dark:bg-neutral-950 space-y-2">
            <Bell className="h-8 w-8 mx-auto text-neutral-400" />
            <h4 className="font-bold text-black dark:text-white">No notifications</h4>
            <p className="text-neutral-500 text-xs">You are all caught up with your updates.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`border p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isRead
                  ? 'border-black/10 bg-white dark:border-white/10 dark:bg-neutral-950'
                  : 'border-black/30 bg-neutral-50 dark:border-white/30 dark:bg-neutral-900 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-black/20 bg-neutral-100 dark:border-white/20 dark:bg-neutral-800">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-black dark:text-white">
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
                    )}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {item.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.targetModuleId && item.actionLabel && (
                  <button
                    onClick={() => {
                      markAsRead(item.id);
                      onNavigateModule(item.targetModuleId!);
                    }}
                    className="inline-flex items-center gap-1 border border-black bg-black px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={() => dismissNotification(item.id)}
                  className="border border-black/20 p-1 text-neutral-500 hover:text-black dark:border-white/20 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                  title="Dismiss notification"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
