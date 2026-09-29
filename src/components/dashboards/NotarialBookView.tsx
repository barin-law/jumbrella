import React from 'react';
import { BookOpen, ShieldCheck, Download, ExternalLink, Hash, Lock } from 'lucide-react';
import { useNotarization } from '../../context/NotarizationContext';
import { truncateHash } from '../../utils/crypto';

export const NotarialBookView: React.FC = () => {
  const { requests } = useNotarization();

  // Completed notarizations committed to the electronic notarial book
  const completedEntries = requests
    .filter((r) => r.notarialBookEntry)
    .sort((a, b) => (b.notarialBookEntry?.docNo || 0) - (a.notarialBookEntry?.docNo || 0));

  const exportRegister = () => {
    const data = JSON.stringify(
      {
        facility: 'JuriMbrella Philippine Electronic Notarization',
        jurisdiction: 'RTC Makati Branch 138',
        enp: 'Atty. Leandro V. Morales, En.P. (NP-2025-0814-MKT)',
        accreditationStatus: 'CANDIDATE',
        seriesYear: 2026,
        exportTimestamp: new Date().toISOString(),
        entries: completedEntries.map((e) => ({
          bookNo: e.notarialBookEntry?.bookNo,
          pageNo: e.notarialBookEntry?.pageNo,
          docNo: e.notarialBookEntry?.docNo,
          seriesYear: e.notarialBookEntry?.seriesYear,
          timestamp: e.notarialBookEntry?.entryTimestamp,
          referenceNumber: e.referenceNumber,
          act: e.notarialAct,
          documentTitle: e.title,
          hash: e.document.pdfaSha256,
          regulatoryReceipt: e.regulatoryReceipt,
        })),
      },
      null,
      2
    );

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurimbrella-notarial-book-series-2026-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="notarial-book-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/15 pb-5 dark:border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Electronic Notarial Book</h2>
            <span className="border border-black bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:border-white dark:bg-white dark:text-black">
              DEMO — NOT LEGALLY VALID
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            DEMO NOTARIAL BOOK — NOT AN OFFICIAL NOTARIAL RECORD. Simulated ledger structure for development demonstration only.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={true}
            title="Action disabled: legal authority and operational integrations not established."
            className="border border-black/30 bg-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-500 cursor-not-allowed dark:border-white/30 dark:bg-neutral-800 dark:text-neutral-400"
          >
            Issue Official Notarial Book Entry (Disabled)
          </button>
          <button
            onClick={exportRegister}
            className="flex items-center gap-1.5 border border-black bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
          >
            <Download className="h-3.5 w-3.5" />
            Export Demo Register
          </button>
        </div>
      </div>

      {/* Statutory Details Box */}
      <div className="border border-black/20 bg-neutral-50 p-4 text-xs font-mono dark:border-white/20 dark:bg-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-neutral-500 block text-[10px] uppercase">Commissioned ENP</span>
          <span className="font-bold text-black dark:text-white">Atty. Leandro V. Morales, En.P. (Candidate)</span>
        </div>
        <div>
          <span className="text-neutral-500 block text-[10px] uppercase">Commission Jurisdiction</span>
          <span className="font-bold text-black dark:text-white">RTC Branch 138, Makati City</span>
        </div>
        <div>
          <span className="text-neutral-500 block text-[10px] uppercase">Ledger Designation</span>
          <span className="font-bold text-black dark:text-white">DEMO NOTARIAL BOOK — NOT AN OFFICIAL NOTARIAL RECORD</span>
        </div>
        <div>
          <span className="text-neutral-500 block text-[10px] uppercase">Court Adapter Sync</span>
          <span className="font-bold text-black dark:text-white">Supreme Court integration: Awaiting official specification.</span>
        </div>
      </div>

      {/* Notarial Book Table */}
      <div className="border border-black/15 bg-white dark:border-white/15 dark:bg-black overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-black/10 bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3">Book Coordinates</th>
              <th className="px-4 py-3">Timestamp / Ref</th>
              <th className="px-4 py-3">Instrument & Parties</th>
              <th className="px-4 py-3">Notarial Act</th>
              <th className="px-4 py-3 font-mono">PDF/A Document Hash</th>
              <th className="px-4 py-3 text-right">Regulatory Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {completedEntries.map((req) => {
              const book = req.notarialBookEntry!;
              return (
                <tr
                  key={req.id}
                  className="hover:bg-neutral-50/70 transition-colors dark:hover:bg-neutral-900/60"
                >
                  <td className="px-4 py-3.5 font-mono">
                    <div className="font-bold text-black dark:text-white">
                      Doc No. {book.docNo}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Page {book.pageNo}, Book {book.bookNo}
                    </div>
                    <div className="text-[10px] text-neutral-400">Series of {book.seriesYear}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px]">
                    <div>{book.entryTimestamp}</div>
                    <div className="text-[10px] text-neutral-500 font-semibold">{req.referenceNumber}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-black dark:text-white">{req.title}</div>
                    <div className="text-[11px] text-neutral-500">
                      Principal: {req.participants.find((p) => p.role === 'PRINCIPAL')?.name || req.requester.name}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="border border-black px-1.5 py-0.5 text-[10px] font-bold uppercase dark:border-white">
                      {req.notarialAct}
                    </span>
                    <div className="text-[10px] text-neutral-500 mt-1">{req.mode} Mode</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] space-y-0.5">
                    <div className="text-black dark:text-white">
                      {truncateHash(req.document.pdfaSha256, 8, 6)}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Entry: {truncateHash(book.entryHash, 6, 4)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                      Supreme Court integration: Awaiting official specification.
                    </div>
                  </td>
                </tr>
              );
            })}
            {completedEntries.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-neutral-500">
                  No completed demonstration records committed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
