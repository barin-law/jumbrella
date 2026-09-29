import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import {
  Headphones,
  Ticket,
  Users,
  Calendar,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Lock,
  Clock,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { ContactInquiriesManager } from '../admin/ContactInquiriesManager';

interface CustomerSupportDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const CustomerSupportDashboard: React.FC<CustomerSupportDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const [supportTab, setSupportTab] = useState<'TICKETS' | 'INQUIRIES'>('TICKETS');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [resolutionNotice, setResolutionNotice] = useState<string | null>(null);

  const tickets = [
    {
      id: 'TCK-2026-081',
      subject: 'Microphone permission error on Chrome for Android',
      category: 'Technical / Video',
      priority: 'HIGH',
      user: 'm.santos@demo-enterprise.ph (Principal)',
      status: 'OPEN',
      created: '2026-09-14 11:20',
      description: 'Signatory reported browser permission prompt did not appear when entering the waiting room.',
    },
    {
      id: 'TCK-2026-082',
      subject: 'Reschedule request for afternoon hearing BENF-2026-0002',
      category: 'Appointment Scheduling',
      priority: 'MEDIUM',
      user: 'rcruz@demo-lawchambers.ph (Witness)',
      status: 'IN_PROGRESS',
      created: '2026-09-14 10:45',
      description: 'Instrumental witness requested 30-minute delay due to regional trial court hearing conflict.',
    },
    {
      id: 'TCK-2026-083',
      subject: 'Clarification on PhilSys ePhilID acceptance',
      category: 'Identity Requirements',
      priority: 'LOW',
      user: 'a.dimatulac@demo-logistics.ph',
      status: 'RESOLVED',
      created: '2026-09-14 09:10',
      description: 'Confirmed that printed ePhilID with valid QR code is accepted under Supreme Court A.M. 24-10-14-SC.',
    },
  ];

  const handleResolveTicket = (ticketId: string) => {
    setResolutionNotice(`Ticket ${ticketId} status updated to RESOLVED. Notification dispatched.`);
    setSelectedTicket(null);
    setTimeout(() => setResolutionNotice(null), 4000);
  };

  return (
    <div id="support-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Operations' }, { label: 'Customer Support Workspace', active: true }]}
        title="Customer Support & Help Desk Workspace"
        purpose="Assist signers, witnesses, and organizational requesters with device technical readiness, videoconference troubleshooting, and appointment coordination."
        statusBadge={<StatusBadge status="TIER 2 SUPPORT" variant="info" />}
        primaryAction={{
          label: 'View Urgent Tickets',
          icon: AlertTriangle,
          onClick: () => {
            if (tickets.length > 0) setSelectedTicket(tickets[0]);
          },
        }}
      />

      {resolutionNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {resolutionNotice}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Open Tickets"
          value="2"
          subtext="Awaiting response"
          icon={Ticket}
          trend={{ value: 'Within 15m SLA', positive: true }}
        />
        <SummaryCard
          label="Hardware Diagnostics"
          value="98.2%"
          subtext="First-call video pass rate"
          icon={Headphones}
        />
        <SummaryCard
          label="Reschedule Requests"
          value="1"
          subtext="Pending ENP docket check"
          icon={Calendar}
        />
        <SummaryCard
          label="Knowledge Base Articles"
          value="34"
          subtext="User guides & video tutorials"
          icon={BookOpen}
        />
      </div>

      {/* Privacy Redaction Notice */}
      <div className="border border-black/15 bg-neutral-50 p-4 dark:border-white/15 dark:bg-neutral-950 text-xs">
        <div className="flex items-start gap-2.5">
          <Lock className="h-4 w-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <p className="font-semibold text-black dark:text-white">
              Support Staff Data Isolation Policy
            </p>
            <p>
              Support agents assist users purely with network diagnostics, device configurations, and scheduling logistics. Support personnel have <strong>redacted views</strong> and are prohibited from viewing uploaded legal contracts, financial figures, or biometric records.
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Tabs: Diagnostic Tickets vs Public Inquiries */}
      <div className="flex items-center gap-2 border-b border-neutral-300 dark:border-neutral-700 pb-2">
        <button
          type="button"
          onClick={() => setSupportTab('TICKETS')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
            supportTab === 'TICKETS'
              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
          }`}
        >
          <Ticket className="h-3.5 w-3.5" />
          <span>Diagnostic &amp; Troubleshooting Tickets (3)</span>
        </button>
        <button
          type="button"
          onClick={() => setSupportTab('INQUIRIES')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
            supportTab === 'INQUIRIES'
              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
          }`}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Public Contact &amp; Admin Inquiries</span>
        </button>
      </div>

      {supportTab === 'INQUIRIES' ? (
        <ContactInquiriesManager />
      ) : (
        <>
          {/* Ticket Management Table */}
          <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black dark:text-white">
            Support Inquiry & Troubleshooting Tickets
          </h3>
          <span className="text-xs font-mono text-neutral-500">
            Showing {tickets.length} tickets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="p-2.5">Ticket ID</th>
                <th className="p-2.5">Subject</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Party</th>
                <th className="p-2.5">Priority</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2.5 font-bold">{t.id}</td>
                  <td className="p-2.5 font-sans font-medium">{t.subject}</td>
                  <td className="p-2.5 font-sans">{t.category}</td>
                  <td className="p-2.5 font-sans text-neutral-600 dark:text-neutral-400">{t.user}</td>
                  <td className="p-2.5">
                    <StatusBadge status={t.priority} size="sm" />
                  </td>
                  <td className="p-2.5">
                    <StatusBadge status={t.status} size="sm" />
                  </td>
                  <td className="p-2.5 text-right font-sans">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer */}
      <DetailsDrawer
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`Support Ticket: ${selectedTicket?.id}`}
        subtitle={selectedTicket?.subject}
      >
        {selectedTicket && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Party Contact</span>
              <p className="font-bold">{selectedTicket.user}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Description</span>
              <p className="mt-1 border border-black/10 p-3 bg-neutral-50 dark:bg-neutral-900 leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Troubleshooting Steps</span>
              <ul className="mt-1 list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-400 text-[11px]">
                <li>Guide participant to click browser lock icon next to URL address.</li>
                <li>Ensure Camera and Microphone are set to "Allow".</li>
                <li>Verify no third-party Zoom or Teams instance is holding the hardware lock.</li>
              </ul>
            </div>
            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                onClick={() => handleResolveTicket(selectedTicket.id)}
                className="border border-black bg-black px-4 py-1.5 text-xs text-white font-semibold hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        )}
      </DetailsDrawer>
        </>
      )}
    </div>
  );
};
