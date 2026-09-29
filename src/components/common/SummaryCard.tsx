import React from 'react';

interface SummaryCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  badge,
  trend,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[#D9E1E8] bg-white p-5 shadow-xs transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-[#0078CE]/40 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {badge}
          {Icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#002D5B]/5 text-[#002D5B]">
              <Icon className="h-4 w-4 text-[#002D5B]" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#002D5B] font-sans">
          {value}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.positive ? 'text-[#2EAF4A]' : 'text-slate-500'
            }`}
          >
            {trend.value}
          </span>
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

export default SummaryCard;
