/**
 * Reusable loading skeleton components
 */

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: 'shimmer 2s infinite',
      }}
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header Skeleton */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-48 h-8 rounded-lg" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="w-32 h-6 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <Skeleton className="w-48 h-12 mx-auto mb-6 rounded-full" />
          <Skeleton className="w-96 h-12 mx-auto mb-4 rounded-lg" />
          <Skeleton className="w-64 h-6 mx-auto rounded-lg" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <Skeleton className="w-24 h-4 mb-2 rounded" />
                  <Skeleton className="w-16 h-10 rounded" />
                </div>
                <Skeleton className="w-14 h-14 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Main CTA */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl mb-12">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <Skeleton className="w-64 h-8 mb-4 rounded-lg" />
              <Skeleton className="w-96 h-6 rounded-lg" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="w-48 h-14 rounded-xl" />
              <Skeleton className="w-48 h-14 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
          <Skeleton className="w-64 h-8 mb-8 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6"
              >
                <Skeleton className="w-full h-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export function LearnPageSkeleton() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 fixed h-full flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-32 h-8 rounded-lg" />
          </div>
        </div>
        <nav className="flex-1 px-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-full h-12 mb-2 rounded-xl" />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-10 rounded-xl" />
              <Skeleton className="w-24 h-10 rounded-xl" />
              <Skeleton className="w-24 h-10 rounded-xl" />
            </div>
          </div>
        </header>

        {/* Learning Path */}
        <main className="max-w-3xl mx-auto px-6 py-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8 mb-12">
            <Skeleton className="w-64 h-8 mb-4 rounded-lg" />
            <Skeleton className="w-full h-6 mb-6 rounded-lg" />
            <Skeleton className="w-56 h-12 rounded-xl" />
          </div>

          {/* Units */}
          {[1, 2, 3].map((unit) => (
            <div key={unit} className="mb-16">
              <Skeleton className="w-full h-32 mb-8 rounded-2xl" />
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className="flex justify-center">
                    <Skeleton className="w-80 h-32 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

export function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <Skeleton className="w-full h-3 mb-8 rounded-full" />

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <Skeleton className="w-48 h-8 mb-6 rounded-lg mx-auto" />
          <Skeleton className="w-full h-64 mb-8 rounded-2xl" />
          
          {/* Answer Options */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-16 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Skeleton className="w-48 h-14 mx-auto rounded-xl" />
      </div>
    </div>
  )
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg"
        >
          <Skeleton className="w-full h-48 mb-4 rounded-xl" />
          <Skeleton className="w-3/4 h-6 mb-2 rounded" />
          <Skeleton className="w-1/2 h-4 rounded" />
        </div>
      ))}
    </>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="w-32 h-5 mb-2 rounded" />
            <Skeleton className="w-48 h-4 rounded" />
          </div>
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function ButtonSkeleton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-12 rounded-xl ${className}`} />
}

export function TextSkeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

// Add shimmer animation to globals.css
export const shimmerAnimation = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`
