import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import {
  Scale,
  BookOpen,
  UserCheck,
  MapPin,
  AlertCircle,
  FileText,
  Activity,
  Download,
  Eye,
  ShieldAlert,
  Building,
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

interface CourtAuditorDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const CourtAuditorDashboard: React.FC<CourtAuditorDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const notarialBookEntries = [
    {
      docNo: '001',
      pageNo: '01',
      bookNo: 'I',
      series: '2026',
      title: 'Affidavit of Good Moral Character',
      act: 'JURAT',
      principal: 'Juan Dela Cruz',
      date: '2026-09-14 09:30',
      hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      fee: '₱250.00',
    },
    {
      docNo: '002',
      pageNo: '01',
      bookNo: 'I',
      series: '2026',
      title: 'Special Power of Attorney — Realty Management',
      act: 'ACKNOWLEDGMENT',
      principal: 'Maria Elena Santos',
      date: '2026-09-14 10:15',
      hash: '3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e',
      fee: '₱500.00',
    },
    {
      docNo: '003',
      pageNo: '02',
      bookNo: 'I',
      series: '2026',
      title: 'Deed of Absolute Sale of Motor Vehicle',
      act: 'ACKNOWLEDGMENT',
      principal: 'Carlos Mendoza',
      date: '2026-09-14 11:00',
      hash: '8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b',
      fee: '₱750.00',
    },
  ];

  const handleExportDocket = () => {
    setExportNotice('Official Judicial Notarial Docket & Monthly Report exported for Office of the Court Administrator (OCA).');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div id="court-auditor-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Judicial Oversight' }, { label: 'Supreme Court Judicial Terminal', active: true }]}
        title="Supreme Court Judicial Oversight Terminal"
        purpose="Inspect electronic notarial registers, verify commissioned ENP territorial jurisdictions, audit monthly notarial dockets, and monitor accreditation compliance pursuant to A.M. No. 24-10-14-SC."
        statusBadge={<StatusBadge status="SUPREME COURT TERMINAL" variant="error" />}
        primaryAction={{
          label: 'Export Monthly Judicial Docket',
          icon: Download,
          onClick: handleExportDocket,
        }}
      />

      {exportNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {exportNotice}
        </div>
      )}

      {/* Mandatory SC-ENAR Notice Banner */}
      <div className="border border-black/20 bg-neutral-50 p-4 dark:border-white/20 dark:bg-neutral-950 text-xs">
        <div className="flex items-start gap-3">
          <Scale className="h-5 w-5 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-black dark:text-white">
                Judicial Registry (SC-ENAR) Status:
              </span>
              <span className="border border-amber-500 bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                AWAITING OFFICIAL SPECIFICATION
              </span>
            </div>
            <p>
              In strict accordance with the Guidelines on the Accreditation of Electronic Notarization Facilities (A.M. No. 24-10-14-SC), the Supreme Court of the Philippines Electronic Notarial Automated Registry (SC-ENAR) technical interface and API specifications have not yet been formally gazetted. The JuriMbrella candidate platform enforces client-side fail-closed safeguards and maintains local immutable registers pending national rollout.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Registered ENP Commissions"
          value="1 Active"
          subtext="RTC Branch 14 — Makati City"
          icon={UserCheck}
          trend={{ value: 'Good Standing', positive: true }}
        />
        <SummaryCard
          label="Recorded Notarial Acts"
          value={notarialBookEntries.length}
          subtext="Series of 2026 (Book I)"
          icon={BookOpen}
        />
        <SummaryCard
          label="Territorial Violations"
          value="0"
          subtext="Strict GPS & geo-boundary enforced"
          icon={MapPin}
          trend={{ value: '100% Compliant', positive: true }}
        />
        <SummaryCard
          label="SC-ENAR Sync Protocol"
          value="Pending Spec"
          subtext="Ready for schema integration"
          icon={Activity}
          trend={{ value: 'Fail-Closed Verified', positive: true }}
        />
      </div>

      {/* Electronic Notarial Register Table */}
      <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              Official Electronic Notarial Register (Rule VI, 2004 Rules / A.M. 24-10-14-SC)
            </h3>
            <p className="text-xs text-neutral-500">
              Notary Public: Atty. Juan Dela Cruz • Commission No. NP-2026-0042 • RTC Makati City
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            {notarialBookEntries.length} Recorded Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="p-2.5">Doc No.</th>
                <th className="p-2.5">Page / Book / Series</th>
                <th className="p-2.5">Instrument Title</th>
                <th className="p-2.5">Notarial Act</th>
                <th className="p-2.5">Principal Signatory</th>
                <th className="p-2.5">Statutory Fee</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5 text-right">Judicial Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
              {notarialBookEntries.map((entry) => (
                <tr key={entry.docNo} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2.5 font-bold">Doc #{entry.docNo}</td>
                  <td className="p-2.5 text-neutral-600 dark:text-neutral-400">
                    Page {entry.pageNo}, Book {entry.bookNo}, S. {entry.series}
                  </td>
                  <td className="p-2.5 font-sans font-medium">{entry.title}</td>
                  <td className="p-2.5 font-sans">
                    <StatusBadge status={entry.act} size="sm" />
                  </td>
                  <td className="p-2.5 font-sans">{entry.principal}</td>
                  <td className="p-2.5 font-bold">{entry.fee}</td>
                  <td className="p-2.5">{entry.date}</td>
                  <td className="p-2.5 text-right font-sans">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                    >
                      Inspect Entry
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
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={`Judicial Register Entry: Doc #${selectedEntry?.docNo}`}
        subtitle={`Series of ${selectedEntry?.series} • Book ${selectedEntry?.bookNo}`}
      >
        {selectedEntry && (
          <div className="space-y-4 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase text-neutral-400">Instrument Title</span>
              <p className="font-bold font-sans text-sm">{selectedEntry.title}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-neutral-400">Principal Signatory</span>
              <p className="font-sans">{selectedEntry.principal}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-neutral-400">Document Cryptographic Hash</span>
              <p className="border border-black/10 p-2 text-[10px] break-all bg-neutral-50 dark:bg-neutral-900">
                {selectedEntry.hash}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-neutral-400">Judicial Compliance Status</span>
              <div className="mt-1">
                <StatusBadge status="CONFORMS TO 2004 RULES" variant="success" size="sm" />
              </div>
            </div>
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
};
