/**
 * Loading Skeleton Components for Next.js 16 Instant Loading UI
 * Used by loading.tsx files to show instant feedback while pages load
 */

type SkeletonProps = {
  className?: string;
};

/**
 * Base skeleton component with pulsing animation
 */
function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-label="Loading..."
    />
  );
}

/**
 * Generic page skeleton - full height with spinner
 */
export function PageSkeleton() {
  return (
    <div
      style={{ height: '100vh' }}
      className="flex items-center justify-center bg-gray-50/50 animate-pulse"
      aria-label="Loading page"
    >
      <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

/**
 * About Me page skeleton
 */
export function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>

        {/* Image skeleton */}
        <Skeleton className="h-96 w-full" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      </div>
    </div>
  );
}

/**
 * Blog page skeleton
 */
export function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header skeleton */}
        <Skeleton className="h-12 w-1/3" />

        {/* Blog grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array.from({ length: 6 })].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Contact page skeleton
 */
export function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-full" />
        </div>

        {/* Form skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-1/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Portfolio page skeleton
 */
export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <PageSkeleton />
    </div>
  );
}
