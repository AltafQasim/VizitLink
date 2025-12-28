import { SkeletonLoader } from '../../components/ui/loading-spinner'

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Skeleton */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form Skeleton */}
          <div className="space-y-6">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-32 w-full bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

