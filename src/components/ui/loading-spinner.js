import BrandLogo from '../BrandLogo'

export function LoadingSpinner({ size = 'md', withLogo = false, text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {withLogo && (
        <div className="animate-pulse">
          <BrandLogo size="md" showText={true} colorfulHover={false} />
        </div>
      )}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${sizeClasses[size]} border-4 border-transparent border-r-accent rounded-full animate-spin`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        </div>
      </div>
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  )
}

export function PulseSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse`}></div>
      <div className={`${sizeClasses[size]} bg-accent rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
    </div>
  )
}

export function SkeletonLoader({ variant = 'text', className = '' }) {
  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-8 w-3/4 rounded',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded',
    card: 'h-64 w-full rounded-lg',
  }

  return (
    <div className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] ${variants[variant]} ${className}`}></div>
  )
}

