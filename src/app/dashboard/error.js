'use client'

import { useEffect } from 'react'
import { Button } from '../../components/ui/button'

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Error</h1>
        <p className="text-gray-600">
          Unable to load your dashboard. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Retry
          </Button>
          <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
            Reload Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

