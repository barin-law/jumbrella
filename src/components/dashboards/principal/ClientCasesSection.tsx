/**
 * JuriMbrella — Philippine Electronic Notarization
 * Client Cases Management Module
 * Comprehensive Case Portfolio, Creation Wizard, Document Versioning & Approvals
 */

import React, { useState } from 'react';
import {
  FilePlus,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
  FileCheck,
} from 'lucide-react';
import { useClientCase } from '../../../context/ClientCaseContext';
import { useNotarization } from '../../../context/NotarizationContext';
import { useAuth } from '../../../context/AuthContext';
import { CaseStatus, ClientCase } from '../../../types/client-case';
import { StatusBadge } from '../../common/StatusBadge';

interface ClientCasesSectionProps {
  activeSubModule: string;
  onNavigateModule: (moduleId: string) => void;
}

export const ClientCasesSection: React.FC<ClientCasesSectionProps> = ({
  activeSubModule,
  onNavigateModule,
}) => {
  const { cases, activeCase, setActiveCaseId, createNewCase, approveDocumentVersion } =
    useClientCase();
  const { createRequest } = useNotarization();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [creatingCase, setCreatingCase] = useState(false);
  const [approvalNotice, setApprovalNotice] = useState<string | null>(null);

  // New Case Wizard Fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Power of Attorney');
  const [newService, setNewService] = useState('Remote Electronic Notarization (REN)');
  const [newDescription, setNewDescription] = useState('');
  const [newUrgency, setNewUrgency] = useState<'LOW' | 'STANDARD' | 'URGENT'>('STANDARD');
  const [newJurisdiction, setNewJurisdiction] = useState('Makati City, Metro Manila');
  const [consentConflict, setConsentConflict] = useState(false);

  // Filter cases based on sub-module
  const getFilteredCases = () => {
    let result = cases;

    if (activeSubModule === 'principal-active-cases') {
      result = result.filter((c) => c.status !== 'COMPLETED' && c.status !== 'REFUSED');
    } else if (activeSubModule === 'principal-awaiting-client') {
      result = result.filter(
        (c) => c.status === 'CLIENT_APPROVAL_PENDING' || c.status === 'EVIDENCE_INTAKE'
      );
    } else if (activeSubModule === 'principal-awaiting-lawyer') {
      result = result.filter(
        (c) => c.status === 'LAWYER_REVIEW' || c.status === 'DOCUMENT_CORRECTION'
      );
    } else if (activeSubModule === 'principal-ready-signing') {
      result = result.filter(
        (c) => c.status === 'READY_FOR_SIGNING' || c.status === 'CEREMONY_SCHEDULED'
      );
    } else if (activeSubModule === 'principal-completed') {
      result = result.filter((c) => c.status === 'COMPLETED');
    } else if (activeSubModule === 'principal-refused') {
      result = result.filter((c) => c.status === 'REFUSED');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.caseReference.toLowerCase().includes(q) ||
          c.matterCategory.toLowerCase().includes(q)
      );
    }

    return result;
  };

  const filteredCases = getFilteredCases();

  const handleCreateCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !consentConflict) return;

    setCreatingCase(true);
    try {
      const created = await createNewCase({
        title: newTitle,
        matterCategory: newCategory,
        requestedService: newService,
        clientDescription: newDescription,
        urgency: newUrgency,
        jurisdiction: newJurisdiction,
      });

      // Also create parallel request in legacy NotarizationContext for full cross-system compatibility
      await createRequest({
        title: newTitle,
        documentType: newCategory,
        mode: newService.includes('REN') ? 'REN' : 'IEN',
        notarialAct: 'ACKNOWLEDGMENT',
        originalFilename: `${newTitle.replace(/\s+/g, '_')}.pdf`,
        fileSize: 840000,
        requesterName: currentUser.name,
        requesterEmail: currentUser.email,
        participantNames: [currentUser.name],
      });

      // Clear form
      setNewTitle('');
      setNewDescription('');
      setConsentConflict(false);
      setActiveCaseId(created.caseId);
      onNavigateModule('principal-active-cases');
    } finally {
      setCreatingCase(false);
    }
  };

  const handleApproveVersion = (versionId: string) => {
    approveDocumentVersion(activeCase.caseId, versionId);
    setApprovalNotice('Document version approved for electronic signing and ceremony preparation.');
    setTimeout(() => setApprovalNotice(null), 5000);
  };

  return (
    <div className="space-y-5 text-xs">
      {approvalNotice && (
        <div className="border border-emerald-500 bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {approvalNotice}
        </div>
      )}

      {/* VIEW ROUTING */}
      {activeSubModule === 'principal-start' ? (
        /* Create New Case Wizard (Section 12) */
        <div className="border border-black/15 bg-white p-6 dark:border-white/15 dark:bg-neutral-950 space-y-5">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Create New Legal & Notarial Case
              </h3>
              <p className="text-xs text-neutral-500">
                Phase 1: Case intake, matter categorization, and preliminary conflict screening.
              </p>
            </div>
            <span className="font-mono text-[10px] border border-black/20 px-2 py-0.5 dark:border-white/20">
              A.M. No. 24-10-14-SC
            </span>
          </div>

          <form onSubmit={handleCreateCaseSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Case / Instrument Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Special Power of Attorney for Bank Transaction"
                  className="w-full border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Matter Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
                >
                  <option value="Power of Attorney">Power of Attorney (SPA / GPA)</option>
                  <option value="Real Estate">Real Estate (Deed of Sale / Lease / Mortgage)</option>
                  <option value="Affidavit">Affidavit (Loss / Facts / Discrepancy)</option>
                  <option value="Corporate">Corporate (Secretary Certificate / Board Resolution)</option>
                  <option value="Civil Law">Civil Law (Contract / Waiver / Release)</option>
                  <option value="Special Matters">Special Matters (Commercial Undertaking)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Requested Notarial Service
                </label>
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
                >
                  <option value="Remote Electronic Notarization (REN)">
                    Remote Electronic Notarization (REN - Videoconference)
                  </option>
                  <option value="In-Person Electronic Notarization (IEN)">
                    In-Person Electronic Notarization (IEN - Office Tablet)
                  </option>
                  <option value="Legal Document Review & Drafting">
                    Counsel Review & Drafting Assistance
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Jurisdiction & Venue
                </label>
                <input
                  type="text"
                  value={newJurisdiction}
                  onChange={(e) => setNewJurisdiction(e.target.value)}
                  className="w-full border border-black/20 bg-white p-2.5 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                Client Narrative / Background Description
              </label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Explain the background facts, transaction purpose, and any specific deadlines..."
                className="w-full border border-black/20 bg-white p-2 text-xs dark:border-white/20 dark:bg-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-[10px] text-neutral-500 mb-1">
                  Case Urgency
                </label>
                <div className="flex gap-2">
                  {(['LOW', 'STANDARD', 'URGENT'] as const).map((urg) => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setNewUrgency(urg)}
                      className={`flex-1 border py-1.5 text-xs cursor-pointer ${
                        newUrgency === urg
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                          : 'border-black/20 bg-white text-black dark:border-white/20 dark:bg-black dark:text-white'
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center pt-4">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentConflict}
                    onChange={(e) => setConsentConflict(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    I consent to preliminary conflict-of-interest checks and acknowledge this filing is subject to lawyer and ENP review.
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onNavigateModule('principal-active-cases')}
                className="border border-black/20 px-4 py-2 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingCase || !consentConflict}
                className="flex items-center gap-1.5 border border-black bg-black px-5 py-2 font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{creatingCase ? 'Creating Case...' : 'Create Case Filing'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : activeSubModule === 'principal-awaiting-client' && activeCase ? (
        /* Document Correction & Client Approval View (Sections 29 & 30) */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Document Revision & Client Approval
              </h3>
              <p className="text-xs text-neutral-500">
                Case: {activeCase.caseReference} • {activeCase.title}
              </p>
            </div>
            <StatusBadge status={activeCase.status} size="sm" />
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs">Version History & Difference Tracking</h4>
            {(activeCase.versions || []).map((ver) => (
              <div
                key={ver.versionId}
                className="border border-black/10 p-3 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{ver.versionNumber}</span>
                    <span className="text-neutral-500">({ver.label})</span>
                    <span className="border border-black/20 px-1.5 py-0.2 text-[9px]">
                      {ver.isClientApproved ? 'APPROVED' : 'PENDING_APPROVAL'}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(ver.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Changes: {ver.changesSummary}
                </p>

                <div className="font-mono text-[10px] text-neutral-500 truncate">
                  SHA-256: {ver.sha256Hash}
                </div>

                {!ver.isClientApproved && (
                  <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end gap-2">
                    <button
                      onClick={() => handleApproveVersion(ver.versionId)}
                      className="flex items-center gap-1.5 border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Approve Document for Signing Ceremony</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Case List Table */
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-black dark:text-white">
                Cases & Matters Portfolio
              </h3>
              <span className="text-xs font-mono text-neutral-500">
                ({filteredCases.length} items)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cases..."
                  className="w-full border border-black/20 bg-white py-1.5 pl-8 pr-2.5 text-xs dark:border-white/20 dark:bg-black"
                />
              </div>

              <button
                onClick={() => onNavigateModule('principal-start')}
                className="flex items-center gap-1 border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black cursor-pointer"
              >
                <FilePlus className="h-3 w-3" />
                <span>New Case</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/20 bg-neutral-50 text-[11px] font-semibold text-neutral-600 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="p-2.5">Case Reference</th>
                  <th className="p-2.5">Matter Title</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Assigned Lawyer</th>
                  <th className="p-2.5">Participants</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                {filteredCases.map((c) => (
                  <tr
                    key={c.caseId}
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${
                      activeCase?.caseId === c.caseId ? 'bg-neutral-100/60 dark:bg-neutral-900/80 font-bold' : ''
                    }`}
                  >
                    <td className="p-2.5 font-bold">{c.caseReference}</td>
                    <td className="p-2.5 font-sans font-medium">{c.title}</td>
                    <td className="p-2.5 font-sans text-neutral-500">{c.matterCategory}</td>
                    <td className="p-2.5 font-sans">{c.assignedLawyer?.name || 'Unassigned'}</td>
                    <td className="p-2.5">{(c.participants || []).length}</td>
                    <td className="p-2.5">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="p-2.5 text-right font-sans space-x-1">
                      <button
                        onClick={() => {
                          setActiveCaseId(c.caseId);
                          onNavigateModule('principal-documents');
                        }}
                        className="border border-black/20 px-2 py-1 text-[11px] hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900"
                      >
                        Evidence
                      </button>
                      <button
                        onClick={() => {
                          setActiveCaseId(c.caseId);
                          onNavigateModule('principal-signing-session');
                        }}
                        className="border border-black bg-black px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black"
                      >
                        Workspace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
