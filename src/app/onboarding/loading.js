import { SkeletonLoader } from '../../components/ui/loading-spinner'

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Progress Bar Skeleton */}
      <div className="h-2 bg-white/20">
        <div className="h-full w-1/3 bg-white/40 animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Title */}
          <div className="space-y-3">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

