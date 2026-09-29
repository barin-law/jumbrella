import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  purpose: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
    tooltip?: string;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
  }>;
  statusBadge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  purpose,
  primaryAction,
  secondaryActions = [],
  statusBadge,
}) => {
  return (
    <div className="mb-6 space-y-3 border-b border-[#D9E1E8] pb-5">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#002D5B] sm:text-3xl font-sans">
              {title}
            </h1>
            {statusBadge}
          </div>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            {purpose}
          </p>
        </div>

        {/* Action Buttons */}
        {(primaryAction || secondaryActions.length > 0) && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {secondaryActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="flex items-center gap-1.5 rounded-lg border border-[#002D5B] bg-white px-3.5 py-2 text-xs font-semibold text-[#002D5B] transition-colors hover:bg-[#F4F7F9] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{action.label}</span>
                </button>
              );
            })}

            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                title={primaryAction.tooltip}
                className="flex items-center gap-1.5 rounded-lg bg-[#002D5B] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0078CE] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {primaryAction.icon && <primaryAction.icon className="h-3.5 w-3.5" />}
                <span>{primaryAction.label}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
