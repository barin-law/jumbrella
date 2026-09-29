/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Activity & Audit Trail Module
 * Non-technical, clean chronological activity log with cryptographic integrity details
 */

import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  FileText,
  UserCheck,
  Calendar,
  CreditCard,
  Download,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface ActivityRecord {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'FILING' | 'IDENTITY' | 'HEARING' | 'PAYMENT' | 'SECURITY';
  shaDigest?: string;
  status: 'SUCCESS' | 'INFO' | 'PENDING';
}

const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'act-1',
    timestamp: 'Today, 2:45 PM',
    title: 'Document PDF/A Hash Verification Completed',
    description: 'Special Power of Attorney was normalized to ISO 19005-1 format and isolated quarantine screening returned zero malware signatures.',
    category: 'FILING',
    shaDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'SUCCESS',
  },
  {
    id: 'act-2',
    timestamp: 'Today, 11:15 AM',
    title: 'PhilSys ePhilID Biometric Verification Passed',
    description: 'Signer identity verified against PSA registry format with 98.6% passive liveness confidence score.',
    category: 'IDENTITY',
    status: 'SUCCESS',
  },
  {
    id: 'act-3',
    timestamp: 'Yesterday, 4:30 PM',
    title: 'Remote Videoconference Hearing Scheduled',
    description: 'Notice of Remote Notarial Hearing issued by Atty. Juan Dela Cruz for tomorrow at 10:00 AM PHT.',
    category: 'HEARING',
    status: 'INFO',
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday, 3:10 PM',
    title: 'Instrumental Witness Invitation Dispatched',
    description: 'Invitation sent to Atty. Roberto Cruz (Instrumental Witness) via authenticated SMS and email token.',
    category: 'SECURITY',
    status: 'SUCCESS',
  },
  {
    id: 'act-5',
    timestamp: 'Sep 17, 2026, 9:20 AM',
    title: 'New Notarization Filing Created (Reference ENF-2026-0814)',
    description: 'Draft request initiated under Supreme Court A.M. No. 24-10-14-SC Electronic Notarization Rules.',
    category: 'FILING',
    status: 'SUCCESS',
  },
];

export const ClientActivitySection: React.FC = () => {
  const [activities] = useState<ActivityRecord[]>(INITIAL_ACTIVITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleExportLogs = () => {
    setExportNotice('Exporting demonstration activity log (CSV format)...');
    setTimeout(() => {
      setExportNotice('Activity log exported successfully (demo mode).');
      setTimeout(() => setExportNotice(null), 3500);
    }, 1000);
  };

  const filteredActivities = activities.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="space-y-4 text-xs">
      {exportNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {exportNotice}
        </div>
      )}

      {/* Header card */}
      <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              Activity & Security Audit History
            </h3>
            <p className="text-neutral-500 text-[11px]">
              Chronological log of all actions, uploads, verifications, and hearing updates on your files.
            </p>
          </div>
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 border border-black/20 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Log (Demo)</span>
          </button>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-neutral-500 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Filter:
          </span>
          {['ALL', 'FILING', 'IDENTITY', 'HEARING', 'SECURITY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-mono border transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                  : 'border-black/20 text-neutral-600 hover:bg-neutral-100 dark:border-white/20 dark:text-neutral-400 dark:hover:bg-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="border border-black/15 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 space-y-4">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
          {filteredActivities.map((item) => (
            <div key={item.id} className="relative space-y-1">
              {/* Dot */}
              <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-black dark:border-black dark:bg-white" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-black dark:text-white">
                    {item.title}
                  </span>
                  <span className="border border-black/15 bg-neutral-100 px-1.5 py-0.2 text-[10px] font-mono dark:border-white/15 dark:bg-neutral-900">
                    {item.category}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                {item.description}
              </p>

              {item.shaDigest && (
                <div className="pt-1 flex items-center gap-2">
                  <div className="font-mono text-[10px] bg-neutral-50 border border-black/10 px-2 py-1 dark:bg-neutral-900 dark:border-white/10 text-neutral-600 dark:text-neutral-400 truncate max-w-md">
                    SHA-256: {item.shaDigest}
                  </div>
                  <button
                    onClick={() => handleCopyHash(item.shaDigest!)}
                    className="border border-black/20 p-1 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
                    title="Copy SHA-256 Hash"
                  >
                    {copiedHash === item.shaDigest ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
