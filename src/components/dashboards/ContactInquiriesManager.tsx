import React, { useState, useEffect, useMemo } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  ArrowUpDown,
  Phone,
  Mail,
  FileText,
  User,
  Shield,
  Tag,
  RefreshCw,
} from 'lucide-react';
import {
  ContactInquiry,
  InquiryStatus,
  InquiryPriority,
  inquiryService,
} from '../../services/inquiryService';
import { siteContact } from '../../config/contactConfig';

interface ContactInquiriesManagerProps {
  currentUserRole?: string;
  currentUserName?: string;
  userEmailFilter?: string; // Optional client-isolation filter
  className?: string;
}

export const ContactInquiriesManager: React.FC<ContactInquiriesManagerProps> = ({
  currentUserRole = 'ENF_ADMIN',
  currentUserName = 'Supreme Court of the Philippines',
  userEmailFilter,
  className = '',
}) => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST' | 'PRIORITY'>('NEWEST');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // New Note & Reply states
  const [newNoteText, setNewNoteText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyChannel, setReplyChannel] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const isStaffOrAdmin =
    currentUserRole === 'ENF_ADMIN' ||
    currentUserRole === 'SUPPORT_AGENT' ||
    currentUserRole === 'ENP' ||
    currentUserRole === 'AUDITOR';

  // Load inquiries
  const reloadData = () => {
    if (userEmailFilter && !isStaffOrAdmin) {
      setInquiries(inquiryService.getInquiriesByUserEmail(userEmailFilter));
    } else {
      setInquiries(inquiryService.getAllInquiries());
    }
  };

  useEffect(() => {
    reloadData();
  }, [userEmailFilter, isStaffOrAdmin]);

  // Set default selected inquiry
  useEffect(() => {
    if (!selectedInquiryId && inquiries.length > 0) {
      setSelectedInquiryId(inquiries[0].id);
    }
  }, [inquiries, selectedInquiryId]);

  // Filtering & Sorting
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((item) => {
        // Search
        if (searchTerm.trim()) {
          const s = searchTerm.toLowerCase();
          const matchSearch =
            item.id.toLowerCase().includes(s) ||
            item.senderName.toLowerCase().includes(s) ||
            item.email.toLowerCase().includes(s) ||
            item.phone.toLowerCase().includes(s) ||
            item.subject.toLowerCase().includes(s) ||
            item.message.toLowerCase().includes(s);
          if (!matchSearch) return false;
        }

        // Status Filter
        if (statusFilter !== 'ALL' && item.status !== statusFilter) {
          return false;
        }

        // Priority Filter
        if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) {
          return false;
        }

        // Category Filter
        if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'NEWEST') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOrder === 'OLDEST') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortOrder === 'PRIORITY') {
          const pRank: Record<InquiryPriority, number> = {
            URGENT: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1,
          };
          return pRank[b.priority] - pRank[a.priority];
        }
        return 0;
      });
  }, [inquiries, searchTerm, statusFilter, priorityFilter, categoryFilter, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredInquiries.length / pageSize) || 1;
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInquiries.slice(start, start + pageSize);
  }, [filteredInquiries, currentPage, pageSize]);

  // Selected item
  const selectedInquiry = useMemo(() => {
    return inquiries.find((i) => i.id === selectedInquiryId) || inquiries[0] || null;
  }, [inquiries, selectedInquiryId]);

  // Status Badge Helper
  const renderStatusBadge = (status: InquiryStatus) => {
    const config: Record<InquiryStatus, { label: string; bg: string; text: string; border: string }> = {
      OPEN: { label: 'Open', bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-800' },
      IN_PROGRESS: { label: 'In Progress', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-800' },
      WAITING_CLIENT: { label: 'Waiting for Client', bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-800' },
      RESOLVED: { label: 'Resolved', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800' },
      CLOSED: { label: 'Closed', bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-300 dark:border-neutral-700' },
      SPAM: { label: 'Spam', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-800' },
    };
    const c = config[status] || config.OPEN;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono border ${c.bg} ${c.text} ${c.border}`}>
        {c.label}
      </span>
    );
  };

  // Priority Badge Helper
  const renderPriorityBadge = (priority: InquiryPriority) => {
    const config: Record<InquiryPriority, { label: string; text: string }> = {
      URGENT: { label: 'Urgent', text: 'text-red-600 dark:text-red-400 font-bold' },
      HIGH: { label: 'High', text: 'text-amber-600 dark:text-amber-400 font-semibold' },
      MEDIUM: { label: 'Medium', text: 'text-neutral-600 dark:text-neutral-300' },
      LOW: { label: 'Low', text: 'text-neutral-500' },
    };
    const p = config[priority] || config.MEDIUM;
    return <span className={`text-[11px] font-mono ${p.text}`}>{p.label}</span>;
  };

  // Handle adding internal note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNoteText.trim()) return;

    inquiryService.addInternalNote(selectedInquiry.id, currentUserName, newNoteText);
    setNewNoteText('');
    setFeedbackMessage('Internal staff note recorded in audit log.');
    reloadData();
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Handle recording reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;

    inquiryService.recordReply(selectedInquiry.id, currentUserName, replyChannel, replyText);
    setReplyText('');
    setFeedbackMessage(`Reply recorded via ${replyChannel}. Client notified.`);
    reloadData();
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Handle status update
  const handleStatusChange = (newStatus: InquiryStatus) => {
    if (!selectedInquiry) return;
    inquiryService.updateStatus(selectedInquiry.id, newStatus, currentUserName);
    reloadData();
  };

  // Handle priority update
  const handlePriorityChange = (newPriority: InquiryPriority) => {
    if (!selectedInquiry) return;
    inquiryService.updatePriority(selectedInquiry.id, newPriority, currentUserName);
    reloadData();
  };

  // Export handlers
  const handleExportCsv = () => {
    const csvContent = inquiryService.exportAsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `JuriMbrella_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const jsonContent = inquiryService.exportAsJson();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `JuriMbrella_Inquiries_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-neutral-800 dark:text-neutral-200" aria-hidden="true" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
              Contact Inquiries &amp; Public Intake Management
            </h2>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Role: <span className="font-mono font-semibold">{currentUserRole}</span> • Lead Attorney: {siteContact.attorneyName} • Developer: {siteContact.developerAttribution}
          </p>
        </div>

        {isStaffOrAdmin && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        )}
      </div>

      {feedbackMessage && (
        <div className="p-3 border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <label htmlFor="inquiry-search" className="sr-only">
            Search inquiries
          </label>
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
          <input
            type="text"
            id="inquiry-search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search ref #, name, email, subject, text..."
            className="w-full pl-8 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:border-black dark:focus:border-white focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="filter-status" className="sr-only">
            Status
          </label>
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:border-black dark:focus:border-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_CLIENT">Waiting for Client</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="SPAM">Spam</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="filter-priority" className="sr-only">
            Priority
          </label>
          <select
            id="filter-priority"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:border-black dark:focus:border-white focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label htmlFor="filter-sort" className="sr-only">
            Sort Order
          </label>
          <select
            id="filter-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="w-full px-2.5 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:border-black dark:focus:border-white focus:outline-none"
          >
            <option value="NEWEST">Sort: Newest First</option>
            <option value="OLDEST">Sort: Oldest First</option>
            <option value="PRIORITY">Sort: Highest Priority</option>
          </select>
        </div>
      </div>

      {/* Main 2-Panel View: List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* List Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <span>Showing {filteredInquiries.length} inquiries</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {paginatedInquiries.length === 0 ? (
            <div className="border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-xs text-neutral-500">
              No inquiries match your current filter criteria.
            </div>
          ) : (
            <div className="space-y-2">
              {paginatedInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <button
                    key={inq.id}
                    type="button"
                    onClick={() => setSelectedInquiryId(inq.id)}
                    className={`w-full text-left p-3.5 border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-800'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {inq.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {renderPriorityBadge(inq.priority)}
                        {renderStatusBadge(inq.status)}
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                      {inq.subject}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2">
                      <span>{inq.senderName}</span>
                      <span>{new Date(inq.createdAt).toLocaleDateString('en-PH')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-[11px] text-neutral-500">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Detail Panel (7 cols) */}
        <div className="lg:col-span-7">
          {selectedInquiry ? (
            <div className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-xs">
              {/* Header Info */}
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold tracking-wide text-neutral-950 dark:text-neutral-50">
                      {selectedInquiry.id}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      • {new Date(selectedInquiry.createdAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} PHT
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderPriorityBadge(selectedInquiry.priority)}
                    {renderStatusBadge(selectedInquiry.status)}
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-neutral-950 dark:text-neutral-50">
                  {selectedInquiry.subject}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 p-3 border border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-1">
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Sender:</span>{' '}
                      {selectedInquiry.senderName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-neutral-400" />
                      <a href={`mailto:${selectedInquiry.email}`} className="underline text-black dark:text-white">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-neutral-400" />
                      <a href={`tel:${selectedInquiry.phone.replace(/[\s-]/g, '')}`} className="underline text-black dark:text-white font-mono">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Category:</span>{' '}
                      {selectedInquiry.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Inquiry Content
                </span>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Admin Actions (Status & Priority transitions) */}
              {isStaffOrAdmin && (
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                    Administrative Action &amp; Status Controls
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label htmlFor="select-status-change" className="block text-neutral-600 dark:text-neutral-400 mb-1">
                        Transition Status:
                      </label>
                      <select
                        id="select-status-change"
                        value={selectedInquiry.status}
                        onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                        className="w-full px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="WAITING_CLIENT">Waiting for Client</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                        <option value="SPAM">Spam</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="select-priority-change" className="block text-neutral-600 dark:text-neutral-400 mb-1">
                        Assign Priority:
                      </label>
                      <select
                        id="select-priority-change"
                        value={selectedInquiry.priority}
                        onChange={(e) => handlePriorityChange(e.target.value as InquiryPriority)}
                        className="w-full px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Reply Section */}
              {isStaffOrAdmin && (
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                    Dispatch Response to Client
                  </span>

                  {selectedInquiry.replyHistory.length > 0 && (
                    <div className="space-y-2 mb-3">
                      <span className="text-[11px] text-neutral-500 font-medium">Prior Responses:</span>
                      {selectedInquiry.replyHistory.map((rep) => (
                        <div key={rep.id} className="p-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-neutral-500">
                            <span>{rep.author} via {rep.channel}</span>
                            <span>{new Date(rep.timestamp).toLocaleString('en-PH')}</span>
                          </div>
                          <p className="text-neutral-800 dark:text-neutral-200">{rep.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleSendReply} className="space-y-2">
                    <div className="flex items-center gap-3 text-xs mb-1">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="reply_chan"
                          checked={replyChannel === 'EMAIL'}
                          onChange={() => setReplyChannel('EMAIL')}
                          className="accent-black dark:accent-white"
                        />
                        <span>Email to {selectedInquiry.email}</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="reply_chan"
                          checked={replyChannel === 'PHONE'}
                          onChange={() => setReplyChannel('PHONE')}
                          className="accent-black dark:accent-white"
                        />
                        <span>Phone / SMS Log</span>
                      </label>
                    </div>

                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type response to client..."
                      className="w-full p-2.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:outline-none"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="inline-flex items-center gap-1.5 border border-black bg-black text-white px-4 py-2 text-xs font-semibold hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black disabled:opacity-40 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Dispatch Response</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Internal Staff Notes */}
              {isStaffOrAdmin && (
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                    Internal Staff Notes &amp; Observations (Not Visible to Client)
                  </span>

                  {selectedInquiry.internalNotes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedInquiry.internalNotes.map((note) => (
                        <div key={note.id} className="p-2.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs">
                          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                            <span className="font-semibold">{note.author}</span>
                            <span>{new Date(note.timestamp).toLocaleString('en-PH')}</span>
                          </div>
                          <p className="text-neutral-800 dark:text-neutral-200">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 italic">No internal staff notes recorded yet.</p>
                  )}

                  <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add staff observation or verification flag..."
                      className="flex-1 px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:border-black dark:hover:border-white disabled:opacity-40 cursor-pointer"
                    >
                      Add Note
                    </button>
                  </form>
                </div>
              )}

              {/* Audit Trail Log */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                  Inquiry Audit Trail
                </span>
                <div className="space-y-1 text-[11px] text-neutral-500 font-mono">
                  {selectedInquiry.auditTrail.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span>• {new Date(entry.timestamp).toLocaleTimeString('en-PH')}</span>
                      <span className="text-neutral-700 dark:text-neutral-300">[{entry.actor}]:</span>
                      <span>{entry.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-neutral-300 dark:border-neutral-700 p-12 text-center text-xs text-neutral-500">
              Select an inquiry from the list to view intake details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
