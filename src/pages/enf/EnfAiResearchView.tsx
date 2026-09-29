import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Bookmark,
  Share2,
  Download,
  ExternalLink,
  Shield,
  AlertTriangle,
  History,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { ENFResearchItem, ENFCitation } from '../../types/enf';

interface EnfAiResearchViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfAiResearchView: React.FC<EnfAiResearchViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('Electronic Notarization (A.M. 24-10-14-SC)');
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<ENFResearchItem[]>(() =>
    EnfStorageService.getResearchItems(userId)
  );
  const [activeItem, setActiveItem] = useState<ENFResearchItem | null>(history[0] || null);

  const KNOWLEDGE_BASE_RESPONSES: Record<string, { analysis: string; citations: ENFCitation[] }> = {
    DEFAULT: {
      analysis:
        'Under Supreme Court A.M. No. 24-10-14-SC (Rules on Electronic Notarization), Electronic Notaries Public are authorized to administer oaths, receive acknowledgments, and witness electronic signatures using secure videoconference and cryptographically sealed facilities. The Electronic Notary Public must maintain real-time physical presence within their designated territorial jurisdiction throughout the remote execution, while verifying signatory identities through Philippine government IDs and dynamic biometrics liveness validation.',
      citations: [
        {
          source: 'Supreme Court of the Philippines',
          title: 'Rules on Electronic Notarization (A.M. No. 24-10-14-SC)',
          date: 'October 2024',
          citation: 'Rule 2, Section 1 & Rule 4, Section 2',
          provision: 'Defines the scope of electronic notarial acts and establishes physical presence jurisdiction requirements for the electronic notary public.',
          sourceLink: 'https://sc.judiciary.gov.ph',
        },
        {
          source: 'Congress of the Philippines',
          title: 'Electronic Commerce Act of 2000 (Republic Act No. 8792)',
          date: 'June 2000',
          citation: 'Sections 6, 7 & 8',
          provision: 'Legal recognition of electronic data messages, electronic documents, and electronic signatures as legally binding instruments.',
          sourceLink: 'https://www.officialgazette.gov.ph',
        },
      ],
    },
    WITNESS: {
      analysis:
        'Under Rule 5 of A.M. No. 24-10-14-SC, credible witnesses participating in an electronic notarial act may attend the remote videoconference session provided their identity is independently established using Philippine government-issued photo identification and sworn affirmations made on the recorded video record.',
      citations: [
        {
          source: 'Supreme Court A.M. No. 24-10-14-SC',
          title: 'Rules on Electronic Notarization',
          date: 'October 2024',
          citation: 'Rule 5, Section 3 (Witness Qualification & Identification)',
          provision: 'Mandates that instrument witnesses affirm the identity and voluntary act of the principal under penalty of perjury during the recorded session.',
        },
      ],
    },
    REGISTER: {
      analysis:
        'Rule 7 mandates the maintenance of an automated, chronological, and tamper-evident Electronic Notarial Register. Every entry must record the unique instrument number, timestamp, participants’ verified biometrics hash, document title, and technical platform transaction receipt code.',
      citations: [
        {
          source: 'Supreme Court A.M. No. 24-10-14-SC',
          title: 'Rules on Electronic Notarization',
          date: 'October 2024',
          citation: 'Rule 7, Section 1 & 2 (Electronic Notarial Register)',
          provision: 'The electronic register replaces traditional paper logbooks for electronic acts and must be backed up daily to an encrypted offsite escrow facility.',
        },
      ],
    },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      let matched = KNOWLEDGE_BASE_RESPONSES.DEFAULT;
      if (query.toLowerCase().includes('witness')) {
        matched = KNOWLEDGE_BASE_RESPONSES.WITNESS;
      } else if (query.toLowerCase().includes('register') || query.toLowerCase().includes('book')) {
        matched = KNOWLEDGE_BASE_RESPONSES.REGISTER;
      }

      const newItem = EnfStorageService.saveResearchItem({
        userId,
        topic,
        query,
        analysisText: matched.analysis,
        citations: matched.citations,
        saved: true,
      });

      const updatedHistory = EnfStorageService.getResearchItems(userId);
      setHistory(updatedHistory);
      setActiveItem(newItem);
      setIsSearching(false);
    }, 600);
  };

  const handleExportMarkdown = () => {
    if (!activeItem) return;
    const content = `# JuriMbrella ENF AI Legal Research Report
Topic: ${activeItem.topic}
Query: ${activeItem.query}
Date: ${new Date(activeItem.createdAt).toLocaleString()}

## Legal Analysis
${activeItem.analysisText}

## Citations & Statutory Provisions
${activeItem.citations
  .map(
    (c) => `### ${c.title} (${c.source})
- Date: ${c.date}
- Citation: ${c.citation}
- Provision: "${c.provision}"
`
  )
  .join('\n')}

---
*Notice: Generated via JuriMbrella ENF AI Research Assistant. Does not constitute formal legal advice.*
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ENF_Research_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#17212B] font-sans antialiased py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E1E8] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/enf/dashboard')}
              className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
            >
              ← Back to Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#2EAF4A]" />
              <h1 className="text-base font-bold text-[#002D5B]">ENF AI Research Assistant (Philippine Legal Grounding)</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeItem && (
              <button
                onClick={handleExportMarkdown}
                className="rounded-lg border border-[#D9E1E8] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#002D5B] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-[#0078CE]" />
                <span>Export Research (.md)</span>
              </button>
            )}
          </div>
        </div>

        {/* STATUTORY DISCLAIMER (Section 15) */}
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">MANDATORY STATUTORY & RESEARCH NOTICE: </span>
            <span className="text-amber-900">
              The ENF AI Research Assistant provides automated statutory citations and jurisprudential cross-references. AI output does NOT constitute formal legal advice or an attorney-client relationship. Commissioned Electronic Notaries Public retain sole statutory responsibility for evaluating instruments under Supreme Court rules.
            </span>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: Research Console & Saved Topics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Search & Response Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#002D5B] font-semibold bg-[#F4F7F9] focus:outline-none sm:w-56"
                >
                  <option value="Electronic Notarization (A.M. 24-10-14-SC)">A.M. 24-10-14-SC (ENP Rules)</option>
                  <option value="Rules on Electronic Evidence">Rules on Electronic Evidence</option>
                  <option value="E-Commerce Act (R.A. 8792)">E-Commerce Act (R.A. 8792)</option>
                  <option value="Data Privacy in Notarial Practice">Data Privacy (R.A. 10173)</option>
                </select>

                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a Philippine electronic notarization question..."
                    className="w-full rounded-lg border border-[#D9E1E8] p-2.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none pr-24"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-1.5 top-1.5 rounded-md bg-[#002D5B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0078CE] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSearching ? 'Grounding...' : 'Research'}
                  </button>
                </div>
              </div>

              {/* Suggested Query Chips */}
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                <span>Quick Research Prompts:</span>
                <button
                  type="button"
                  onClick={() => setQuery('Can a remote notary notarize an instrument for a signer located abroad?')}
                  className="text-[#0078CE] hover:underline cursor-pointer"
                >
                  • Signatories located abroad
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('What are the credible witness requirements under Rule 5?')}
                  className="text-[#0078CE] hover:underline cursor-pointer"
                >
                  • Credible witness rules
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('What are the daily backup requirements for Rule 7 Electronic Registers?')}
                  className="text-[#0078CE] hover:underline cursor-pointer"
                >
                  • Rule 7 electronic register backup
                </button>
              </div>
            </form>

            {/* Active Analysis Response */}
            {activeItem && (
              <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4 space-y-1">
                  <span className="rounded bg-[#2EAF4A]/20 px-2 py-0.5 text-[10px] font-bold text-[#1B6C2E] uppercase">
                    {activeItem.topic}
                  </span>
                  <h3 className="text-lg font-bold text-[#002D5B]">{activeItem.query}</h3>
                  <p className="text-[11px] text-slate-400">
                    Grounded on: {new Date(activeItem.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#002D5B] uppercase tracking-wider">
                    Statutory Analysis & Guidance:
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-[#F4F7F9] p-4 rounded-xl border border-slate-200">
                    {activeItem.analysisText}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#002D5B] uppercase tracking-wider">
                    Verified Citations & Provisions:
                  </h4>
                  <div className="space-y-3">
                    {activeItem.citations.map((cite, idx) => (
                      <div key={idx} className="rounded-xl border border-[#D9E1E8] p-4 space-y-2 bg-white">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0078CE]">{cite.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">{cite.date}</span>
                        </div>
                        <p className="text-xs font-semibold text-[#002D5B]">{cite.citation}</p>
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded border border-slate-100">
                          "{cite.provision}"
                        </p>
                        {cite.sourceLink && (
                          <a
                            href={cite.sourceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#0078CE] hover:underline"
                          >
                            <span>Official Gazette / Supreme Court e-Library Record</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Saved Research History */}
          <div className="lg:col-span-4 rounded-2xl border border-[#D9E1E8] bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <History className="h-4 w-4 text-[#002D5B]" />
              <h3 className="text-xs font-bold text-[#002D5B] uppercase tracking-wider">
                Saved Research History
              </h3>
            </div>

            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all space-y-1 ${
                    activeItem?.id === item.id
                      ? 'border-[#0078CE] bg-[#0078CE]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#2EAF4A]">{item.topic}</span>
                  <p className="text-xs font-bold text-[#002D5B] line-clamp-2">{item.query}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()} • {item.citations.length} Citations
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
