/**
 * Reusable Loading Skeleton Components
 * Optimized for Next.js 16 instant loading states
 */

export function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-4 animate-pulse">
        <div className="w-48 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto" />
        <div className="w-64 h-4 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
      </div>
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-pulse">
          <div className="w-64 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
          <div className="w-96 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array.from({ length: 6 })].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg mb-3" />
              <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
              <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-pulse">
          <div className="w-48 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
          <div className="w-80 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>

        {/* Blog posts */}
        <div className="space-y-8">
          {[...Array.from({ length: 3 })].map((_, i) => (
            <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-8 animate-pulse">
              <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
              <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
              <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
              <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="animate-pulse space-y-6">
          <div className="w-64 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8" />

          {/* Form fields */}
          <div className="space-y-4">
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            <div className="w-32 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-8">
          {/* Hero section */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-64 h-64 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-4">
              <div className="w-48 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded" />
              <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
              <div className="w-4/6 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-6">
            {[...Array.from({ length: 3 })].map((_, i) => (
              <div key={i}>
                <div className="w-40 h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded" />
                  <div className="w-11/12 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
                  <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
