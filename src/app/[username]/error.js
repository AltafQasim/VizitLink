'use client'

import { useEffect } from 'react'
import { Button } from '../../components/ui/button'
import Link from 'next/link'

export default function ProfileError({ error, reset }) {
  useEffect(() => {
    console.error('Profile error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ background: '#21232a url(/profilebg.jpg) repeat 0 0' }}>
      <div className="text-center space-y-4 max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white">Profile Not Found</h1>
        <p className="text-white/80">
          This profile doesn't exist or is currently unavailable.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

