import React from 'react';
import { FileCheck, Shield, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { AUTHORITATIVE_REQUIREMENTS } from '../../data/initialData';

export const ComplianceRegisterView: React.FC = () => {
  const exportComplianceRegister = () => {
    const data = JSON.stringify(
      {
        registerName: 'JuriMbrella Authoritative Requirements Register',
        governingLaw: 'Supreme Court A.M. No. 24-10-14-SC, R.A. 8792, R.A. 10173',
        exportDate: new Date().toISOString(),
        requirements: AUTHORITATIVE_REQUIREMENTS,
      },
      null,
      2
    );

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurimbrella-compliance-register-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="compliance-register-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/15 pb-5 dark:border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">
              Authoritative Requirements Register
            </h2>
            <span className="border border-black px-2 py-0.5 text-[10px] font-bold uppercase dark:border-white">
              Court Baseline
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Legal & technical controls mapped directly to Supreme Court A.M. No. 24-10-14-SC, R.A. 8792, and R.A. 10173.
          </p>
        </div>

        <button
          onClick={exportComplianceRegister}
          className="flex items-center gap-1.5 border border-black bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
        >
          <Download className="h-3.5 w-3.5" />
          Export Compliance Matrix
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Total Regulated Controls
          </p>
          <p className="text-2xl font-bold mt-1 font-mono">{AUTHORITATIVE_REQUIREMENTS.length}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Statutory & procedural baseline</p>
        </div>

        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Implemented & Verified
          </p>
          <p className="text-2xl font-bold mt-1 font-mono">
            {AUTHORITATIVE_REQUIREMENTS.filter((r) => r.status === 'IMPLEMENTED').length}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Backed by automated test suites</p>
        </div>

        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Awaiting Official Specs
          </p>
          <p className="text-2xl font-bold mt-1 font-mono">
            {AUTHORITATIVE_REQUIREMENTS.filter((r) => r.status === 'AWAITING_OFFICIAL_SPECIFICATION').length}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Court adapter pending API bulletin</p>
        </div>
      </div>

      {/* Requirements Matrix */}
      <div className="border border-black/15 bg-white dark:border-white/15 dark:bg-black overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-black/10 bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3">Requirement ID & Source</th>
              <th className="px-4 py-3">Statutory Requirement</th>
              <th className="px-4 py-3">Counsel Interpretation & Control</th>
              <th className="px-4 py-3">Accountable Owner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Test Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {AUTHORITATIVE_REQUIREMENTS.map((req) => {
              const isImplemented = req.status === 'IMPLEMENTED';
              return (
                <tr
                  key={req.id}
                  className="hover:bg-neutral-50/70 transition-colors dark:hover:bg-neutral-900/60"
                >
                  <td className="px-4 py-3.5 font-mono">
                    <div className="font-bold text-black dark:text-white">{req.id}</div>
                    <div className="text-[11px] text-neutral-500">{req.source}</div>
                    <div className="text-[10px] text-neutral-400">{req.section}</div>
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="font-medium text-black dark:text-white">{req.requirement}</p>
                    <p className="text-[11px] text-neutral-500 mt-1">Workflow: {req.affectedWorkflow}</p>
                  </td>
                  <td className="px-4 py-3.5 max-w-sm">
                    <p className="text-neutral-600 dark:text-neutral-400">{req.counselInterpretation}</p>
                    <div className="text-[10px] font-mono font-semibold text-black dark:text-white mt-1">
                      Control: {req.technicalControl}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] whitespace-nowrap">
                    {req.accountableOwner}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase ${
                        isImplemented
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-black/30 bg-neutral-100 text-neutral-600 dark:border-white/30 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                    {req.testEvidence}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
