import React from 'react';

/**
 * Skeleton loading placeholder with shimmer animation.
 * Use instead of spinners for content-aware loading states.
 */
const Skeleton = ({ className = '', rounded = 'xl' }) => (
  <div
    className={['shimmer', `rounded-${rounded}`, className].join(' ')}
    aria-hidden="true"
  />
);

/** Pre-built skeleton for a bus listing card */
export const BusCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 animate-fade-in">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-6 mt-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-5 w-14" rounded="full" />
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-12" rounded="full" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-28" rounded="xl" />
      </div>
    </div>
  </div>
);

/** Pre-built skeleton for seat map loading */
export const SeatMapSkeleton = () => (
  <div className="space-y-3 p-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex gap-3 justify-center">
        <Skeleton className="h-9 w-9" rounded="lg" />
        <Skeleton className="h-9 w-9" rounded="lg" />
        <div className="w-8" />
        <Skeleton className="h-9 w-9" rounded="lg" />
        <Skeleton className="h-9 w-9" rounded="lg" />
      </div>
    ))}
  </div>
);

export default Skeleton;
