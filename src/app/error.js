'use client'

import { useEffect } from 'react'
import { Button } from '../components/ui/button'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-bold text-gray-900">Something went wrong!</h1>
        <p className="text-gray-600">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}

