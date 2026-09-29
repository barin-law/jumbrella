import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { EnfStorageService } from '../../services/enf/enfStorageService';
import { ENFClientRecord } from '../../types/enf';

interface EnfClientsViewProps {
  onNavigate: (path: string) => void;
  userId?: string;
}

export const EnfClientsView: React.FC<EnfClientsViewProps> = ({
  onNavigate,
  userId = 'demo-enf-owner-1',
}) => {
  const [clients, setClients] = useState<ENFClientRecord[]>(() =>
    EnfStorageService.getClients(userId)
  );
  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite modal fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientOrg, setClientOrg] = useState('');

  const reloadClients = () => {
    setClients(EnfStorageService.getClients(userId));
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    EnfStorageService.addClient({
      ownerId: userId,
      fullName: clientName,
      email: clientEmail,
      phone: clientPhone,
      organization: clientOrg,
      status: 'ACTIVE',
    });

    setIsInviteOpen(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientOrg('');
    reloadClients();
  };

  const filtered = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.organization && c.organization.toLowerCase().includes(search.toLowerCase()))
  );

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
              <Users className="h-4 w-4 text-[#002D5B]" />
              <h1 className="text-base font-bold text-[#002D5B]">Client Intake Directory & Permissions</h1>
            </div>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="rounded-lg bg-[#002D5B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0078CE] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Invite Client Signer</span>
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#D9E1E8] shadow-2xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search signers, emails, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-[#17212B] focus:border-[#0078CE] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span>Total Signers: <strong className="text-[#002D5B]">{clients.length}</strong></span>
            <span>Active: <strong className="text-[#2EAF4A]">{clients.filter((c) => c.status === 'ACTIVE').length}</strong></span>
          </div>
        </div>

        {/* Clients Table */}
        <div className="rounded-2xl border border-[#D9E1E8] bg-white p-6 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Client Name</th>
                <th className="pb-3">Contact Email & Phone</th>
                <th className="pb-3">Organization</th>
                <th className="pb-3">Instruments Sealed</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 font-bold text-[#002D5B]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-[#0078CE]/10 text-[#0078CE] font-bold flex items-center justify-center text-xs">
                        {client.fullName.charAt(0)}
                      </div>
                      <span>{client.fullName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600">
                    <p className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span>{client.email}</span>
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{client.phone}</span>
                    </p>
                  </td>
                  <td className="py-3.5 text-slate-600">
                    {client.organization || 'Individual Signer'}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-[#002D5B]">
                    {client.totalInstrumentsNotarized}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        client.status === 'ACTIVE'
                          ? 'bg-[#2EAF4A]/20 text-[#1B6C2E]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => onNavigate('/enf/documents')}
                      className="text-xs font-semibold text-[#0078CE] hover:underline cursor-pointer"
                    >
                      View Filings →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invite Client Modal */}
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form
              onSubmit={handleInviteSubmit}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-[#D9E1E8]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#002D5B]">Invite Signer to ENF Portal</h3>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                  placeholder="e.g. Roberto Gomez"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                  placeholder="signer@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                  placeholder="+63 917 000 0000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002D5B] mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={clientOrg}
                  onChange={(e) => setClientOrg(e.target.value)}
                  className="w-full rounded-lg border border-[#D9E1E8] p-2 text-xs focus:border-[#0078CE] focus:outline-none"
                  placeholder="e.g. Manila Premier Corp."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#002D5B] text-xs font-bold text-white hover:bg-[#0078CE] transition-all cursor-pointer"
                >
                  Send Intake Invitation
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
