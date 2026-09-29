import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo, BrandMark } from '../common/BrandLogo';
import {
  Send,
  Trash2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  FileText,
  ExternalLink,
  Info,
} from 'lucide-react';
import { AssistantMessage, UserCreditProfile } from '../../types/jurimbrella-assistant';
import { CreditLedgerService } from '../../services/credit-ledger/creditService';
import { AssistantGatewayService } from '../../services/ai-provider/assistantGateway';
import { ConsentModal } from './ConsentModal';
import { siteContact } from '../../config/contactConfig';

interface JurimbrellaAssistantWorkspaceProps {
  onSignInClick?: () => void;
  onContactAdminClick?: () => void;
}

export const JurimbrellaAssistantWorkspace: React.FC<JurimbrellaAssistantWorkspaceProps> = ({
  onSignInClick,
  onContactAdminClick,
}) => {
  const initialMessage: AssistantMessage = {
    id: 'msg-welcome',
    sender: 'ASSISTANT',
    text: 'Hello. I am the JuriMbrella Legal Assistant. I can help you understand Philippine electronic notarization rules under Supreme Court A.M. No. 24-10-14-SC, document requirements, and digital verification workflows. My responses provide general procedural information and do not constitute formal legal representation.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    jurisdiction: 'Republic of the Philippines',
    isGeneralInformation: true,
  };

  const [messages, setMessages] = useState<AssistantMessage[]>([initialMessage]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [creditProfile, setCreditProfile] = useState<UserCreditProfile>(() =>
    CreditLedgerService.getCreditStatus('GUEST')
  );
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jurimbrella_assistant_consented') === 'true';
    } catch {
      return false;
    }
  });
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showAccessOptions, setShowAccessOptions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleConsentConfirmed = () => {
    setHasConsented(true);
    try {
      localStorage.setItem('jurimbrella_assistant_consented', 'true');
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    setIsConsentModalOpen(false);

    if (pendingSubmission) {
      executeSubmission(pendingSubmission);
      setPendingSubmission(null);
    }
  };

  const handleSend = () => {
    const trimmed = inputQuery.trim();
    if (!trimmed || isLoading) return;

    if (!hasConsented) {
      setPendingSubmission(trimmed);
      setIsConsentModalOpen(true);
      return;
    }

    executeSubmission(trimmed);
  };

  const executeSubmission = async (queryText: string) => {
    const creditResult = CreditLedgerService.consumeCredit('GUEST');
    setCreditProfile(creditResult.status);

    if (!creditResult.success) {
      return;
    }

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const resp = await AssistantGatewayService.queryAssistant(queryText);

      const assistantMsg: AssistantMessage = {
        id: `asst-${Date.now()}`,
        sender: 'ASSISTANT',
        text: resp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jurisdiction: 'Republic of the Philippines',
        isGeneralInformation: true,
        sources: resp.sources,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: AssistantMessage = {
        id: `asst-err-${Date.now()}`,
        sender: 'ASSISTANT',
        text: 'An unexpected processing error occurred while evaluating your legal query. Please try again or consult authorized notarial counsel.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearConversation = () => {
    setMessages([initialMessage]);
  };

  const handleSuggestedClick = (text: string) => {
    if (creditProfile.isExhausted) return;
    if (!hasConsented) {
      setPendingSubmission(text);
      setIsConsentModalOpen(true);
      return;
    }
    executeSubmission(text);
  };

  return (
    <div
      id="jurimbrella-assistant-workspace"
      className="w-full max-w-4xl mx-auto border border-slate-200 bg-white shadow-xs text-slate-900 rounded-xs overflow-hidden"
    >
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 px-4 py-3 gap-2 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <BrandMark size={28} />
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#002D5B] leading-none">
              JuriMbrella Assistant
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">
              Philippine eNotarization Procedural Guidance
            </span>
          </div>
          <span className="ml-2 border border-[#2EAF4A]/40 bg-[#E8F5E9]/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#002D5B] rounded-full">
            Evaluation Sandbox
          </span>
        </div>

        {/* Right tools: Credit indicator & clear button */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-xs">
            Free queries remaining:{' '}
            <strong className="text-[#002D5B]">{creditProfile.questionsRemaining}</strong>
          </span>

          <button
            type="button"
            onClick={handleClearConversation}
            title="Clear Conversation"
            className="flex items-center gap-1 border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:text-[#002D5B] hover:bg-white transition-colors rounded-xs"
          >
            <Trash2 className="h-3 w-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Demonstration Banner */}
      <div className="border-b border-slate-200 bg-amber-50/40 px-4 py-2 text-[11px] text-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-[#2EAF4A] shrink-0" />
          <span>
            DEMO / SIMULATED IDENTITY &amp; PROCEDURAL ASSISTANT — No live government database was queried.
          </span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="p-4 sm:p-6 space-y-5 min-h-[360px] max-h-[540px] overflow-y-auto bg-white">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'ASSISTANT';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-2xl border p-4 text-xs leading-relaxed space-y-2 rounded-xs ${
                  isAssistant
                    ? 'border-slate-200 bg-white text-slate-900 border-l-4 border-l-[#002D5B]'
                    : 'border-[#002D5B] bg-[#002D5B] text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75 font-mono pb-1 border-b border-current/10">
                  <span>{isAssistant ? 'JuriMbrella Assistant' : 'You (Principal / Signer)'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap">{msg.text}</div>

                {isAssistant && msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase font-mono block">
                      Statutory &amp; Regulatory Authorities:
                    </span>
                    <ul className="space-y-1">
                      {msg.sources.map((src) => (
                        <li key={src.id} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <FileText className="h-3 w-3 text-[#2EAF4A] shrink-0" />
                          <span>{src.title}</span>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#002D5B] hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 inline" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {isAssistant && (
                <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-slate-700 flex items-center gap-1"
                  >
                    {copiedMessageId === msg.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic">
            <span className="h-2 w-2 rounded-full bg-[#2EAF4A] animate-pulse" />
            <span>Evaluating legal sources under A.M. No. 24-10-14-SC...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="border-t border-slate-200 px-4 py-2.5 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-500 font-mono shrink-0">
          Topics:
        </span>
        {[
          'What is the difference between IEN and REN under Supreme Court rules?',
          'What government IDs are acceptable for notarial identification?',
          'What is the requirement for witness appearance during remote notarization?',
        ].map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestedClick(prompt)}
            className="border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:border-[#002D5B] hover:text-[#002D5B] whitespace-nowrap transition-colors rounded-xs shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Credit Exhaustion Notice & Actions */}
      {creditProfile.isExhausted && (
        <div className="border-t border-slate-200 bg-slate-50 p-4 text-xs space-y-3">
          <div className="flex items-start gap-2.5 text-slate-800">
            <AlertTriangle className="h-4 w-4 text-[#2EAF4A] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#002D5B]">Daily Evaluation Allowance Reached</p>
              <p className="text-slate-600 mt-0.5">
                You have reached your free daily evaluation questions. Please sign in or contact administration for expanded quota.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onContactAdminClick || (() => window.open(`mailto:${siteContact.email}`, '_blank'))}
              className="border border-[#002D5B] bg-[#002D5B] px-3 py-1.5 text-xs text-white font-semibold hover:bg-[#0078CE] transition-colors"
            >
              Contact Administration
            </button>

            <button
              type="button"
              onClick={onSignInClick || (() => (window.location.pathname = '/sign-in'))}
              className="border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-semibold hover:bg-slate-100 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Input Composer Section */}
      <div className="border-t border-slate-200 p-3 sm:p-4 bg-white">
        <div className="relative border border-slate-300 focus-within:border-[#002D5B] transition-colors rounded-xs">
          <textarea
            ref={textareaRef}
            rows={2}
            disabled={creditProfile.isExhausted || isLoading}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              creditProfile.isExhausted
                ? 'Allowance exhausted. Please sign in or contact the administrator.'
                : 'Ask JuriMbrella Assistant about Philippine electronic notarization procedures (Enter to send, Shift+Enter for newline)...'
            }
            className="w-full resize-none p-3 text-xs outline-none bg-transparent placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
          />

          <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 bg-slate-50/50">
            <span className="text-[10px] text-slate-500 font-mono">
              Does not constitute legal advice • Grounded in Philippine eNotarization rules
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!inputQuery.trim() || isLoading || creditProfile.isExhausted}
                onClick={handleSend}
                className="border border-[#002D5B] bg-[#002D5B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0078CE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 rounded-xs"
              >
                <span>Send</span>
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Consent Modal */}
      <ConsentModal
        isOpen={isConsentModalOpen}
        onAgree={handleConsentConfirmed}
        onCancel={() => setIsConsentModalOpen(false)}
      />
    </div>
  );
};
export default JurimbrellaAssistantWorkspace;
