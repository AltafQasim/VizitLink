import { SkeletonLoader } from '../../components/ui/loading-spinner'

export default function VerifyOtpLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Skeleton */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        {/* Title Skeleton */}
        <div className="text-center space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
          <div className="h-4 w-72 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>

        {/* OTP Input Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex justify-center gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-12 h-14 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>

          <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          
          <div className="flex justify-center">
            <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

