import React from 'react';
import { TransactionState, AdapterState, AuditSeverity } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, ShieldCheck, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status?: string | TransactionState | AdapterState | AuditSeverity;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'demo';
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  variant,
  size = 'md',
  showIcon = true,
}) => {
  const displayLabel = label || (typeof status === 'string' ? status.replace(/_/g, ' ') : '');

  // Determine variant automatically if not provided
  let computedVariant = variant || 'default';
  if (!variant && status) {
    const s = String(status);
    if (s.includes('COMPLETED') || s === 'OPERATIONAL' || s === 'CLEARED' || s === 'LOW' || s === 'ACCREDITED') {
      computedVariant = 'success';
    } else if (s.includes('PENDING') || s.includes('REVIEW') || s === 'CONNECTING' || s === 'MEDIUM' || s === 'DEGRADED') {
      computedVariant = 'warning';
    } else if (s.includes('REFUSED') || s.includes('FAILED') || s === 'ERROR' || s === 'CRITICAL' || s === 'UNAVAILABLE' || s === 'QUARANTINED') {
      computedVariant = 'error';
    } else if (s.includes('DEMO') || s.includes('CANDIDATE') || s.includes('INTERACTIVE')) {
      computedVariant = 'demo';
    } else if (s.includes('SESSION') || s === 'SCHEDULED' || s === 'INFO') {
      computedVariant = 'info';
    }
  }

  const variantStyles = {
    default: 'border-[#D9E1E8] bg-[#F4F7F9] text-[#17212B]',
    success: 'border-[#2EAF4A]/40 bg-[#2EAF4A]/10 text-[#1B6C2E]',
    warning: 'border-[#E8B949]/50 bg-[#E8B949]/15 text-[#8F6B12]',
    error: 'border-[#D64545]/40 bg-[#D64545]/10 text-[#A32929]',
    info: 'border-[#0078CE]/40 bg-[#0078CE]/10 text-[#002D5B]',
    demo: 'border-[#002D5B] bg-[#002D5B] text-white',
  };

  const icons = {
    default: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
    demo: Sparkles,
  };

  const Icon = icons[computedVariant];

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-sans font-semibold tracking-tight uppercase select-none ${variantStyles[computedVariant]} ${sizeStyles[size]}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} />}
      <span>{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
