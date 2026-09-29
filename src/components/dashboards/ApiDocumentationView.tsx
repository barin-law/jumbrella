import React, { useState } from 'react';
import { Code, Terminal, Key, Play, Copy, Check, Send } from 'lucide-react';

export const ApiDocumentationView: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<'create_request' | 'verify_hash' | 'audit_stream'>('verify_hash');
  const [testInput, setTestInput] = useState('ENF-20260914-2201');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [calling, setCalling] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleTestCall = () => {
    setCalling(true);
    setTimeout(() => {
      setCalling(false);
      if (activeEndpoint === 'verify_hash') {
        setApiResponse(
          JSON.stringify(
            {
              status: 'SUCCESS',
              facility: 'JuriMbrella Philippine Electronic Notarization',
              referenceNumber: testInput,
              verified: true,
              documentType: 'Affidavit of Loss (PhilSys)',
              notarialAct: 'JURAT',
              pdfaSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
              notarizedAt: '2026-09-14T09:15:30Z',
              enp: {
                name: 'Atty. Leandro V. Morales, En.P.',
                commissionNo: 'NP-2025-0814-MKT',
                jurisdiction: 'RTC Makati Branch 138',
              },
              accreditationStatus: 'CANDIDATE',
              notice: 'Candidate environment — electronic notarization is not available for legal use.',
            },
            null,
            2
          )
        );
      } else if (activeEndpoint === 'create_request') {
        setApiResponse(
          JSON.stringify(
            {
              status: 'ACCEPTED_QUARANTINED',
              referenceNumber: 'ENF-20260914-9981',
              quarantineStatus: 'CLEARED',
              scanner: 'ClamAV Security Enterprise Core',
              hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
              state: 'INTAKE_REVIEW',
              nextStep: 'ENP Assignment & Identity Liveness Verification',
            },
            null,
            2
          )
        );
      } else {
        setApiResponse(
          JSON.stringify(
            {
              status: 'STREAMING',
              eventsTransmitted: 6,
              format: 'RFC-5424 / CEF',
              tamperChainVerified: true,
            },
            null,
            2
          )
        );
      }
    }, 450);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('enf_live_pk_9a8b7c6d5e4f3a2b1c0d9e8f');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div id="api-documentation-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/15 pb-5 dark:border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">API Reference & Webhook Integration</h2>
            <span className="border border-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase dark:border-white">
              REST v1.0
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Enterprise integrations for banks, real-estate firms, and government agencies with HMAC-SHA256 signed webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyApiKey}
            className="flex items-center gap-1.5 border border-black px-3 py-1.5 text-xs font-mono font-semibold hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900"
          >
            <Key className="h-3.5 w-3.5" />
            {copiedKey ? 'API Key Copied!' : 'Copy Sandbox API Key'}
          </button>
        </div>
      </div>

      {/* Grid: Endpoints + Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Endpoint Selector & Documentation */}
        <div className="lg:col-span-2 border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-black space-y-4">
          <div className="flex items-center gap-2 border-b border-black/10 pb-3 dark:border-white/10">
            <button
              onClick={() => {
                setActiveEndpoint('verify_hash');
                setTestInput('ENF-20260914-2201');
                setApiResponse(null);
              }}
              className={`border px-3 py-1.5 text-xs font-mono font-semibold ${
                activeEndpoint === 'verify_hash'
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900'
              }`}
            >
              GET /api/v1/verify/:ref
            </button>

            <button
              onClick={() => {
                setActiveEndpoint('create_request');
                setTestInput('Special Power of Attorney');
                setApiResponse(null);
              }}
              className={`border px-3 py-1.5 text-xs font-mono font-semibold ${
                activeEndpoint === 'create_request'
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900'
              }`}
            >
              POST /api/v1/requests
            </button>

            <button
              onClick={() => {
                setActiveEndpoint('audit_stream');
                setTestInput('format=CEF');
                setApiResponse(null);
              }}
              className={`border px-3 py-1.5 text-xs font-mono font-semibold ${
                activeEndpoint === 'audit_stream'
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/20 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-neutral-900'
              }`}
            >
              GET /api/v1/audit/stream
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {activeEndpoint === 'verify_hash' && (
              <div>
                <p className="font-bold">Minimal Disclosure Verification Endpoint</p>
                <p className="text-neutral-500 mt-1">
                  Publicly verifies whether a document was notarized, checks SHA-256 hash integrity, and returns ENP commission details without revealing private PII or biometrics.
                </p>
                <pre className="mt-3 border border-black/20 bg-neutral-50 p-3 text-[11px] font-mono dark:border-white/20 dark:bg-neutral-900">
{`curl -X GET "https://api.jurimbrella.notary.ph/api/v1/verify/ENF-20260914-2201" \\
  -H "Authorization: Bearer enf_live_pk_..." \\
  -H "Accept: application/json"`}
                </pre>
              </div>
            )}

            {activeEndpoint === 'create_request' && (
              <div>
                <p className="font-bold">Automated Request Creation Endpoint</p>
                <p className="text-neutral-500 mt-1">
                  Ingests enterprise instruments, deposits into isolated quarantine bucket, initiates ClamAV malware scan, and schedules ENP appearance.
                </p>
                <pre className="mt-3 border border-black/20 bg-neutral-50 p-3 text-[11px] font-mono dark:border-white/20 dark:bg-neutral-900">
{`curl -X POST "https://api.jurimbrella.notary.ph/api/v1/requests" \\
  -H "Authorization: Bearer enf_live_pk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Commercial Space Lease Agreement",
    "mode": "REN",
    "notarialAct": "ACKNOWLEDGMENT",
    "documentBase64": "JVBERi0xLjQK..."
  }'`}
                </pre>
              </div>
            )}

            {activeEndpoint === 'audit_stream' && (
              <div>
                <p className="font-bold">Real-time SIEM Audit Log Ingestion</p>
                <p className="text-neutral-500 mt-1">
                  Streams tamper-evident audit logs directly to security collectors (Splunk, QRadar, Datadog) formatted as RFC 5424 or ArcSight CEF.
                </p>
                <pre className="mt-3 border border-black/20 bg-neutral-50 p-3 text-[11px] font-mono dark:border-white/20 dark:bg-neutral-900">
{`curl -X GET "https://api.jurimbrella.notary.ph/api/v1/audit/stream?format=CEF" \\
  -H "Authorization: Bearer enf_live_pk_..."`}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Sandbox Tester */}
        <div className="border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-black space-y-4">
          <div className="border-b border-black/10 pb-3 dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Interactive Endpoint Sandbox
            </h3>
            <p className="text-[11px] text-neutral-500">
              Execute test queries against the candidate mock router
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1">
              Parameter Input
            </label>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full border border-black bg-white px-2.5 py-1.5 text-xs font-mono dark:border-white dark:bg-black"
            />
          </div>

          <button
            onClick={handleTestCall}
            disabled={calling}
            className="w-full flex items-center justify-center gap-2 border border-black bg-black py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <Send className="h-3.5 w-3.5" />
            {calling ? 'Dispatching Test Call...' : 'Execute Test Request'}
          </button>

          {apiResponse && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                HTTP 200 OK • Response Body
              </span>
              <pre className="max-h-52 overflow-y-auto border border-black/20 bg-neutral-50 p-3 text-[10px] font-mono dark:border-white/20 dark:bg-neutral-900">
                {apiResponse}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
