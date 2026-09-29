import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = 'h-12 w-full',
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 ${className}`}
        />
      ))}
    </div>
  );
};
