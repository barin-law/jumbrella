import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-neutral-500 dark:text-neutral-400">
      <div className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
        <Home className="h-3 w-3" />
        <span>Workspace</span>
      </div>
      {(items || []).map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3 w-3 shrink-0 text-neutral-400 dark:text-neutral-600" />
          {item.onClick && !item.active ? (
            <button
              onClick={item.onClick}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className={item.active ? 'font-semibold text-black dark:text-white' : ''}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
