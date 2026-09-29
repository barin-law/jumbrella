import React from 'react';
import { 
  BrandLogo, 
  BrandMark, 
  BrandIcon, 
  BrandWordmark, 
  Logo 
} from './BrandLogo';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  X 
} from 'lucide-react';

/**
 * ============================================================
 * JURIMBRELLA — OFFICIAL CENTRAL BRAND COMPONENT SYSTEM
 * ============================================================
 */

// 1. BUTTON COMPONENT
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  }[size];

  const variantStyles = {
    primary: 'bg-[#002D5B] text-white hover:bg-[#0078CE] active:bg-[#002447] shadow-xs border border-transparent',
    secondary: 'bg-white text-[#002D5B] border border-[#002D5B] hover:bg-[#F4F7F9] active:bg-[#EAF0F6]',
    success: 'bg-[#2EAF4A] text-white hover:bg-[#258F3C] active:bg-[#1E7B34] shadow-xs border border-transparent',
    outline: 'bg-transparent text-[#002D5B] border border-[#D9E1E8] hover:bg-[#F4F7F9] hover:border-[#002D5B]',
    ghost: 'bg-transparent text-[#002D5B] hover:bg-[#F4F7F9]',
    danger: 'bg-[#D64545] text-white hover:bg-[#BF3636] active:bg-[#A32929] border border-transparent',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

// 2. CARD COMPONENT
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  border = true,
  hoverable = false,
  children,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];

  return (
    <div
      className={`bg-white rounded-xl ${border ? 'border border-[#D9E1E8]' : ''} shadow-xs ${
        hoverable ? 'transition-all duration-150 hover:shadow-md hover:border-[#0078CE]/40' : ''
      } ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 3. INPUT COMPONENT
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#002D5B] dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#17212B] placeholder:text-slate-400 transition-colors focus:outline-none ${
            Icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-[#D64545] focus:border-[#D64545] focus:ring-1 focus:ring-[#D64545]'
              : success
              ? 'border-[#2EAF4A] focus:border-[#2EAF4A] focus:ring-1 focus:ring-[#2EAF4A]'
              : 'border-[#D9E1E8] focus:border-[#0078CE] focus:ring-1 focus:ring-[#0078CE]'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#D64545] font-medium">{error}</p>}
      {success && <p className="text-xs text-[#2EAF4A] font-medium">{success}</p>}
      {helperText && !error && !success && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

// 4. SELECT COMPONENT
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ label: string; value: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  children,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-[#002D5B] dark:text-slate-200">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#17212B] transition-colors focus:outline-none ${
          error
            ? 'border-[#D64545] focus:border-[#D64545]'
            : 'border-[#D9E1E8] focus:border-[#0078CE]'
        } ${className}`}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error && <p className="text-xs text-[#D64545] font-medium">{error}</p>}
    </div>
  );
};

// 5. ALERT COMPONENT
export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string | React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const config = {
    info: {
      border: 'border-[#0078CE]/30',
      bg: 'bg-[#0078CE]/5',
      text: 'text-[#002D5B]',
      icon: Info,
      iconColor: 'text-[#0078CE]',
    },
    success: {
      border: 'border-[#2EAF4A]/30',
      bg: 'bg-[#2EAF4A]/5',
      text: 'text-[#1E7B34]',
      icon: CheckCircle2,
      iconColor: 'text-[#2EAF4A]',
    },
    warning: {
      border: 'border-[#E8B949]/40',
      bg: 'bg-[#E8B949]/10',
      text: 'text-[#9A7318]',
      icon: AlertTriangle,
      iconColor: 'text-[#E8B949]',
    },
    error: {
      border: 'border-[#D64545]/30',
      bg: 'bg-[#D64545]/5',
      text: 'text-[#A32929]',
      icon: AlertCircle,
      iconColor: 'text-[#D64545]',
    },
  }[variant];

  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm ${config.border} ${config.bg} ${config.text} ${className}`}
    >
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-95">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// 6. KPI CARD COMPONENT
export interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: 'blue' | 'green' | 'yellow' | 'red';
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  accent = 'blue',
  trend,
  onClick,
  className = '',
}) => {
  const accentBorder = {
    blue: 'border-l-4 border-l-[#0078CE]',
    green: 'border-l-4 border-l-[#2EAF4A]',
    yellow: 'border-l-4 border-l-[#E8B949]',
    red: 'border-l-4 border-l-[#D64545]',
  }[accent];

  const iconBg = {
    blue: 'bg-[#0078CE]/10 text-[#0078CE]',
    green: 'bg-[#2EAF4A]/10 text-[#2EAF4A]',
    yellow: 'bg-[#E8B949]/15 text-[#9A7318]',
    red: 'bg-[#D64545]/10 text-[#D64545]',
  }[accent];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#D9E1E8] p-5 shadow-xs transition-all duration-150 ${accentBorder} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-[#0078CE]/40' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-[#002D5B] sm:text-3xl font-sans">
          {value}
        </div>
        {trend && (
          <div
            className={`flex items-center text-xs font-semibold ${
              trend.positive ? 'text-[#2EAF4A]' : 'text-[#D64545]'
            }`}
          >
            {trend.positive ? (
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
          {subtext}
        </p>
      )}
    </div>
  );
};

// 7. DOCUMENT CARD COMPONENT
export interface DocumentCardProps {
  title: string;
  documentNumber: string;
  sha256Hash?: string;
  status: 'PENDING' | 'VERIFIED' | 'COMPLETED' | 'REJECTED';
  date: string;
  onView?: () => void;
  onDownload?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  documentNumber,
  sha256Hash,
  status,
  date,
  onView,
  onDownload,
}) => {
  const statusConfig = {
    PENDING: { label: 'Pending Review', color: 'bg-[#E8B949]/15 text-[#9A7318] border-[#E8B949]/40' },
    VERIFIED: { label: 'Cryptographically Verified', color: 'bg-[#0078CE]/10 text-[#0078CE] border-[#0078CE]/30' },
    COMPLETED: { label: 'Notarization Complete', color: 'bg-[#2EAF4A]/10 text-[#2EAF4A] border-[#2EAF4A]/30' },
    REJECTED: { label: 'Refused / Quarantined', color: 'bg-[#D64545]/10 text-[#D64545] border-[#D64545]/30' },
  }[status];

  return (
    <div className="bg-white rounded-xl border border-[#D9E1E8] p-4 shadow-xs hover:border-[#0078CE]/40 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#002D5B]/5 text-[#002D5B]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#002D5B] line-clamp-1">{title}</h4>
            <span className="text-xs text-slate-500 font-mono">Doc #{documentNumber}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {sha256Hash && (
        <div className="mt-3 bg-[#F4F7F9] rounded p-2 flex items-center gap-1.5 text-[11px] font-mono text-slate-600 truncate">
          <ShieldCheck className="h-3.5 w-3.5 text-[#0078CE] shrink-0" />
          <span className="truncate">SHA-256: {sha256Hash}</span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[#D9E1E8] flex items-center justify-between text-xs text-slate-500">
        <span>{date}</span>
        <div className="flex items-center gap-2">
          {onView && (
            <button onClick={onView} className="text-[#0078CE] hover:underline font-semibold cursor-pointer">
              View
            </button>
          )}
          {onDownload && (
            <button onClick={onDownload} className="text-[#002D5B] hover:underline font-semibold cursor-pointer">
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Re-exports
export { BrandLogo, BrandMark, BrandIcon, BrandWordmark, Logo };
export { PageHeader } from './PageHeader';
export { SummaryCard } from './SummaryCard';
export { StatusBadge } from './StatusBadge';
export { Header } from './Header';
export { CollapsibleSidebar } from './CollapsibleSidebar';
export { GlobalFooter } from './GlobalFooter';
