import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Shield,
  Eye,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  History,
  Hash,
  Plus,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { ENFDocumentRecord, ENFDocumentCategory } from '../../types/enf';

interface EnfDocumentsViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfDocumentsView: React.FC<EnfDocumentsViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [documents, setDocuments] = useState<ENFDocumentRecord[]>(() =>
    EnfStorageService.getDocuments(userId)
  );
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<ENFDocumentRecord | null>(null);

  // New upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<ENFDocumentCategory>('UPLOADS');
  const [uploadFileName, setUploadFileName] = useState('');

  const reloadDocs = () => {
    setDocuments(EnfStorageService.getDocuments(userId));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hash = `sha256_${Date.now().toString(16)}_${Math.random().toString(36).substring(2, 10)}`;
    EnfStorageService.addDocument({
      ownerId: userId,
      title: uploadTitle || uploadFileName || 'Untitled Instrument',
      category: uploadCategory,
      fileSizeBytes: Math.floor(100000 + Math.random() * 400000),
      fileType: 'application/pdf',
      version: 1,
      sha256Hash: hash,
      uploadedBy: 'Atty. Maria Elena Santos, En.P.',
      status: 'PROTECTED',
    });

    setIsUploadOpen(false);
    setUploadTitle('');
    setUploadFileName('');
    reloadDocs();
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = activeCategory === 'ALL' || doc.category === activeCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.sha256Hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <FileText className="h-4 w-4 text-[#002D5B]" />
              <h1 className="text-base font-bold text-[#002D5B]">ENF Document Center & Cryptographic Archive</h1>
            </div>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="rounded-lg bg-[#002D5B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Upload Instrument</span>
          </button>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#D9E1E8] shadow-2xs">
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'ALL', label: 'All Documents' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'GENERATED', label: 'Generated' },
              { id: 'UPLOADS', label: 'Uploads' },
              { id: 'RECEIPTS', label: 'Official Receipts' },
              { id: 'RESEARCH', label: 'Legal References' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-[#002D5B] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-[#D9E1E8] bg-white p-5 shadow-2xs hover:border-[#0078CE] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-[#0078CE]/10 px-2 py-0.5 text-[10px] font-bold text-[#002D5B]">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">v{doc.version}.0</span>
                </div>

                <h3 className="text-sm font-bold text-[#002D5B] line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                {/* Cryptographic SHA-256 Stamp */}
                <div className="rounded-lg bg-[#F4F7F9] p-2 border border-[#D9E1E8] space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                    <Hash className="h-3 w-3 text-[#0078CE]" />
                    <span>SHA-256 Escrow Hash</span>
                  </div>
                  <p className="font-mono text-[9px] text-[#002D5B] truncate">{doc.sha256Hash}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Audit Trail</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Trail Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-[#D9E1E8]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#002D5B] truncate max-w-xs">{selectedDoc.title}</h3>
                <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-500 font-semibold">Document SHA-256 Hash:</p>
                <p className="font-mono bg-slate-50 p-2 rounded border border-slate-200 break-all text-[11px] text-[#002D5B]">
                  {selectedDoc.sha256Hash}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-[#002D5B]">Cryptographic Audit History:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedDoc.auditTrail.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-[#F4F7F9] p-2.5 text-xs border border-slate-200">
                      <div className="flex justify-between font-bold text-[#002D5B]">
                        <span>{item.action}</span>
                        <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Actor: {item.actor}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedDoc(null)}
                className="w-full rounded-lg bg-[#002D5B] py-2 text-xs font-bold text-white hover:bg-[#0078CE] cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form onSubmit={handleUploadSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-[#D9E1E8]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#002D5B]">Upload Instrument to ENF Archive</h3>
                <button type="button" onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Instrument Title *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                  placeholder="e.g. Affidavit of Loss — Passport"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Archive Category *</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as ENFDocumentCategory)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                >
                  <option value="UPLOADS">Uploads (Draft Instruments)</option>
                  <option value="GENERATED">Generated (Template Contracts)</option>
                  <option value="COMPLETED">Completed (Executed & Sealed)</option>
                  <option value="RESEARCH">Research References</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Attach File (PDF, PNG, JPG) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setUploadFileName(e.target.files?.[0]?.name || '')}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#002D5B] file:text-white hover:file:bg-[#0078CE] cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#002D5B] text-xs font-bold text-white hover:bg-[#0078CE] transition-all cursor-pointer"
                >
                  Upload & Seal Hash
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
