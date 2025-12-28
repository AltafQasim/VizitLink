"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile Navigation Skeleton */}
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Desktop Top Navbar Skeleton */}
        <div className="hidden lg:block border-b border-gray-200 bg-white">
          <div className="max-w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 max-h-[calc(100dvh-70px)]">
          {/* Sidebar - Static hai, real sidebar dikhenga */}
          <div className="hidden lg:block w-64 border-r border-gray-200 bg-white p-4">
            {/* Sidebar skeleton - actual tabs */}
            <div className="space-y-2">
              {['Links', 'Shop', 'Design', 'Profiles', 'Audience', 'Insights', 'Tools', 'Settings'].map((tab, i) => (
                <div key={i} className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Main Panel - Center Part Skeleton */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Content Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 animate-pulse">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview - Right Side Skeleton */}
          <div className="hidden lg:flex w-[300px] xl:w-[340px] 2xl:w-[380px] bg-background border-l border-border py-4 px-3 flex-col">
            <div className="mb-3">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>

            {/* Mobile mockup skeleton */}
            <div className="bg-black rounded-3xl shadow-2xl p-1">
              <div className="bg-gray-200 rounded-2xl overflow-hidden">
                {/* Profile skeleton */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto animate-pulse"></div>
                    <div className="h-5 w-32 bg-gray-300 rounded mx-auto animate-pulse"></div>
                    <div className="h-4 w-48 bg-gray-300 rounded mx-auto animate-pulse"></div>
                  </div>

                  {/* Links skeleton */}
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-14 w-full bg-gray-300 rounded-3xl animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
