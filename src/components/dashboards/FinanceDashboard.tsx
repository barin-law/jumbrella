import React, { useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { SummaryCard } from '../common/SummaryCard';
import { StatusBadge } from '../common/StatusBadge';
import { DetailsDrawer } from '../common/DetailsDrawer';
import {
  CreditCard,
  Receipt,
  FileText,
  RotateCcw,
  CheckCircle,
  Sliders,
  BarChart3,
  Download,
  Eye,
  Shield,
  DollarSign,
  Lock,
} from 'lucide-react';

interface FinanceDashboardProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  activeModuleId,
  onSelectModule,
}) => {
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const transactions = [
    { id: 'TXN-2026-0091', filingId: 'BENF-2026-0001', type: 'Acknowledgment', amount: '₱500.00', status: 'SETTLED', method: 'Maya QR Ph', date: '2026-09-14 09:30' },
    { id: 'TXN-2026-0092', filingId: 'BENF-2026-0002', type: 'Jurat / SPA', amount: '₱350.00', status: 'SETTLED', method: 'GCash', date: '2026-09-14 10:15' },
    { id: 'TXN-2026-0093', filingId: 'BENF-2026-0003', type: 'Affidavit of Loss', amount: '₱250.00', status: 'SETTLED', method: 'BancNet Debit', date: '2026-09-14 11:05' },
    { id: 'TXN-2026-0094', filingId: 'BENF-2026-0004', type: 'Corporate Batch (x3)', amount: '₱1,500.00', status: 'PENDING_ESCROW', method: 'Corporate Prepaid', date: '2026-09-14 11:45' },
  ];

  const handleDownloadReport = () => {
    setDownloadNotice('Official judicial revenue & BIR demo receipt ledger exported.');
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div id="finance-dashboard-view" className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Operations' }, { label: 'Finance & Accounts Workspace', active: true }]}
        title="Finance & Notarial Revenue Workspace"
        purpose="Administer statutory notarial fees pursuant to the Supreme Court Rules, manage invoices, monitor e-wallet settlements, and reconcile receipts."
        statusBadge={<StatusBadge status="FINANCIAL CONTROLS" variant="info" />}
        primaryAction={{
          label: 'Export Revenue Report',
          icon: Download,
          onClick: handleDownloadReport,
        }}
        secondaryActions={[
          {
            label: 'Statutory Fee Schedule',
            icon: Sliders,
            onClick: () => onSelectModule('fin-pricing'),
          },
        ]}
      />

      {downloadNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {downloadNotice}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Today's Collections"
          value="₱2,600.00"
          subtext="Statutory notarial fees"
          icon={Receipt}
          trend={{ value: '+14% vs yesterday', positive: true }}
        />
        <SummaryCard
          label="Settled Invoices"
          value="18"
          subtext="100% gateway reconciliation"
          icon={CheckCircle}
          trend={{ value: 'Maya / GCash', positive: true }}
        />
        <SummaryCard
          label="Corporate Escrow"
          value="₱48,500.00"
          subtext="Prepaid corporate balances"
          icon={CreditCard}
        />
        <SummaryCard
          label="Court Remittance Due"
          value="₱260.00"
          subtext="10% Judicial Development Fund (JDF)"
          icon={DollarSign}
        />
      </div>

      {/* Strict Role Data Separation Banner */}
      <div className="border border-black/15 bg-neutral-50 p-4 dark:border-white/15 dark:bg-neutral-950 text-xs">
        <div className="flex items-start gap-2.5">
          <Lock className="h-4 w-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <p className="font-semibold text-black dark:text-white">
              Strict Segregation of Duties & Zero Access Policy
            </p>
            <p>
              In strict adherence to Supreme Court rules and data minimization under R.A. 10173, the Finance Officer has <strong>zero access</strong> to confidential document contents, executed contracts, video recordings, or participant biometric data. Financial records link only to pseudonymized transaction references.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction & Fee Settlement Table */}
      <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black dark:text-white">
            Itemized Statutory Notarial Transactions
          </h3>
          <span className="text-xs font-mono text-neutral-500">
            Showing {transactions.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="p-2.5">Transaction Ref</th>
                <th className="p-2.5">Filing ID</th>
                <th className="p-2.5">Notarial Act / Category</th>
                <th className="p-2.5">Statutory Amount</th>
                <th className="p-2.5">Settlement Method</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2.5 font-bold">{tx.id}</td>
                  <td className="p-2.5">{tx.filingId}</td>
                  <td className="p-2.5 font-sans">{tx.type}</td>
                  <td className="p-2.5 font-bold">{tx.amount}</td>
                  <td className="p-2.5 font-sans">{tx.method}</td>
                  <td className="p-2.5">
                    <StatusBadge status={tx.status} size="sm" />
                  </td>
                  <td className="p-2.5 text-right font-sans">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer: Official Demo Receipt */}
      <DetailsDrawer
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title={`Official Demo Receipt: ${selectedTx?.id}`}
        subtitle={`Filing Reference: ${selectedTx?.filingId}`}
      >
        {selectedTx && (
          <div className="space-y-4 text-xs font-mono">
            <div className="border border-black/20 p-4 bg-neutral-50 dark:border-white/20 dark:bg-neutral-900 space-y-2">
              <div className="text-center pb-2 border-b border-black/10 dark:border-white/10">
                <span className="font-bold text-sm font-sans">JuriMbrella Philippine Electronic Notarization</span>
                <div className="text-[10px] text-neutral-500">Accreditation Candidate Demonstrative E-Receipt</div>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-neutral-500">Receipt Ref:</span>
                <span className="font-bold">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date/Time:</span>
                <span>{selectedTx.date} PHT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Notarial Act:</span>
                <span className="font-sans">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Gateway:</span>
                <span className="font-sans">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between border-t border-black/10 pt-2 font-bold text-sm">
                <span>Total Statutory Fee:</span>
                <span>{selectedTx.amount}</span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-500 text-center italic">
              Demonstration receipt only. Not an official BIR tax receipt.
            </div>
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
};
