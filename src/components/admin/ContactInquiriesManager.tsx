import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download,
  Trash2,
  RefreshCw,
  User,
  Tag,
} from 'lucide-react';
import { siteContact } from '../../config/contactConfig';

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  category: 'technical' | 'consultation' | 'general' | 'feedback';
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
  createdAt: string;
  source: 'WEB_CONTACT_PAGE' | 'PUBLIC_MODAL' | 'JURIMBRELLA_PORTAL' | 'SYSTEM_SUPPORT';
}

const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'INQ-2026-001',
    fullName: 'Maria Elena Santos',
    email: 'm.santos@demo-enterprise.ph',
    phone: '+63 918 123 4567',
    category: 'technical',
    subject: 'WebRTC camera frame rate drop on mobile browser',
    message: 'Good day. During the simulated notarial hearing, our witness experienced a frame drop on mobile Chrome. Seeking guidance on minimum bandwidth requirements.',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-14T09:30:00Z',
    source: 'PUBLIC_MODAL',
  },
  {
    id: 'INQ-2026-002',
    fullName: 'Carlos Mendoza, CPA',
    email: 'carlos.mendoza@bayanilogistics.ph',
    phone: '+63 920 987 6543',
    category: 'consultation',
    subject: 'Corporate Notarial Retainer and Enterprise API Integration',
    message: 'Seeking consultation with Supreme Court of the Philippines regarding bulk notarization agreements for logistics bills of lading under Supreme Court A.M. 24-10-14-SC.',
    status: 'NEW',
    createdAt: '2026-09-14T11:15:00Z',
    source: 'JURIMBRELLA_PORTAL',
  },
  {
    id: 'INQ-2026-003',
    fullName: 'Atty. Roberto Cruz',
    email: 'rcruz@demo-lawchambers.ph',
    phone: '+63 917 555 0192',
    category: 'general',
    subject: 'PhilSys ePhilID QR verification turnaround time',
    message: 'Inquiring about automated fallback turnaround if PhilSys PSA gateway experiences intermittent downtime.',
    status: 'RESOLVED',
    createdAt: '2026-09-13T16:40:00Z',
    source: 'WEB_CONTACT_PAGE',
  },
];

export const ContactInquiriesManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(INITIAL_INQUIRIES);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(INITIAL_INQUIRIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [adminNote, setAdminNote] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || inq.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: ContactInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setNotification(`Inquiry ${id} updated to ${newStatus}`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `contact_inquiries_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setNotification('Exported inquiries log as JSON');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="border border-neutral-300 bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-black text-white px-2 py-0.5">
                Privileged Admin Module
              </span>
              <span className="text-xs font-mono text-neutral-500">
                Inquiries Queue
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-neutral-950 mt-1">
              Contact &amp; Administrator Support Inquiries Manager
            </h2>
            <p className="text-xs text-neutral-600">
              Centralized handling for public inquiries, attorney consultation requests, and technical tickets submitted through the portal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-black transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Inquiries</span>
            </button>
          </div>
        </div>

        {/* Support Channel Quick Card */}
        <div className="border border-neutral-200 bg-neutral-50 p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-neutral-900">
              Official Escalation Contacts:
            </p>
            <p className="text-neutral-600 font-mono text-[11px]">
              Attorney: <strong>{siteContact.attorneyName}</strong> &bull; Developer: <strong>{siteContact.developerName}</strong>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="border border-neutral-300 bg-white px-2 py-1">
              Hotline: <strong>{siteContact.phoneDisplay}</strong>
            </span>
            <span className="border border-neutral-300 bg-white px-2 py-1">
              Email: <strong>{siteContact.email}</strong>
            </span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-900">
          {notification}
        </div>
      )}

      {/* Main Grid: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Filter & List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="border border-neutral-300 bg-white p-3 space-y-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full border border-neutral-300 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-black"
              />
            </div>

            {/* Filter Row */}
            <div className="flex items-center gap-2 pt-1">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-1/2 border border-neutral-300 bg-white p-1 text-xs outline-none focus:border-black"
              >
                <option value="ALL">All Categories</option>
                <option value="technical">Technical Support</option>
                <option value="consultation">Legal Consultation</option>
                <option value="general">General Inquiries</option>
                <option value="feedback">Feedback</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-1/2 border border-neutral-300 bg-white p-1 text-xs outline-none focus:border-black"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          {/* Inquiries Items */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredInquiries.length === 0 ? (
              <div className="border border-dashed border-neutral-300 bg-white p-8 text-center text-xs text-neutral-500">
                No inquiries matching your search criteria.
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`border p-3 cursor-pointer transition-colors text-left ${
                      isSelected
                        ? 'border-black bg-neutral-100 font-medium'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                      <span className="font-bold text-neutral-900">{inq.id}</span>
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                      {inq.subject}
                    </h4>
                    <p className="text-[11px] text-neutral-600 line-clamp-1 mt-0.5">
                      {inq.fullName} &bull; {inq.email}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-200/60 text-[10px] font-mono">
                      <span className="border border-neutral-300 px-1.5 py-0.2 uppercase bg-white">
                        {inq.category}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 font-bold uppercase ${
                          inq.status === 'NEW'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : inq.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : inq.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Detail */}
        <div className="lg:col-span-7">
          {selectedInquiry ? (
            <div className="border border-neutral-300 bg-white p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Inquiry Detail &bull; {selectedInquiry.id}
                  </span>
                  <h3 className="font-serif text-base font-bold text-neutral-950 mt-0.5">
                    {selectedInquiry.subject}
                  </h3>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5">
                  {(['NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedInquiry.id, st)}
                      className={`text-[10px] font-mono px-2 py-1 border transition-colors cursor-pointer ${
                        selectedInquiry.status === st
                          ? 'border-black bg-black text-white font-bold'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-black'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender Info Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 border border-neutral-200 p-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Sender Name</span>
                  <p className="font-bold text-neutral-900">{selectedInquiry.fullName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Email Address</span>
                  <p className="font-mono text-neutral-800 break-all">{selectedInquiry.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Contact Number</span>
                  <p className="font-mono text-neutral-800">{selectedInquiry.phone || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Channel / Category</span>
                  <p className="font-mono text-neutral-800 uppercase">
                    {selectedInquiry.source} &bull; {selectedInquiry.category}
                  </p>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  Message Content
                </span>
                <div className="border border-neutral-200 bg-white p-4 text-xs text-neutral-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=RE: ${encodeURIComponent(
                    selectedInquiry.subject
                  )} [${selectedInquiry.id}]`}
                  className="inline-flex items-center gap-1.5 border border-black bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Reply via Email</span>
                </a>

                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:border-black transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Sender</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'RESOLVED')}
                  className="inline-flex items-center gap-1.5 border border-emerald-600 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark Resolved</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-neutral-300 bg-white p-12 text-center text-xs text-neutral-500">
              Select an inquiry from the queue to view full details and take administrative action.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
