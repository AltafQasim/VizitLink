"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Signup = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="font-bold text-gray-900 text-2xl">VizitLink</h1>
            </Link>
            <div className="ml-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">Join VizitLink</h2>
            <p className="text-gray-600 text-base">Sign up for free!</p>
          </div>

          {/* Signup Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input 
                type="email"
                placeholder=""
                className="w-full h-12 bg-white border-gray-300 rounded-lg px-4 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Continue Button */}
            <Button className="w-full h-12 bg-gray-300 text-gray-600 rounded-lg font-semibold text-base transition-colors duration-200" disabled>
              Continue
            </Button>

            {/* Legal Text */}
            <p className="text-xs text-gray-600 leading-relaxed">
              By clicking Create account, you agree to VizitLink's{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">privacy notice</a>,{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">T&Cs</a> and to receive offers, news and updates.
            </p>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="space-y-3">
              {/* Google */}
              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">G</div>
                <span className="text-gray-700 font-medium text-base">Sign up with Google</span>
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">Log in</Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6">
            <a href="#" className="text-gray-500 text-xs hover:text-gray-600 transition-colors duration-200">Cookie preferences</a>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-yellow-400 relative overflow-hidden">
        {/* Main Mockup */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <div className="relative">
            {/* Phone Mockup */}
            <div className="w-80 h-96 bg-amber-800 rounded-3xl shadow-2xl transform rotate-6 relative">
              {/* Profile Header */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg">Nikole Brake</h3>
                <p className="text-white/80 text-sm">Founder of Shape Shifters</p>
              </div>

              {/* Link Buttons */}
              <div className="absolute top-32 left-8 right-8 space-y-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
                  <span className="text-white font-medium">Slow flow</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
                  <span className="text-white font-medium">Online courses</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
                  <span className="text-white font-medium">Wellness retreats</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Purple Card */}
            <div className="absolute -top-4 -left-4 w-32 h-20 bg-purple-500 rounded-lg shadow-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-white/80 rounded mb-1"></div>
                  <div className="h-2 bg-white/60 rounded w-3/4"></div>
                </div>
              </div>
              {/* Instagram Icon */}
              <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              {/* Speech Bubble */}
              <div className="absolute -bottom-2 -left-2 bg-white rounded-lg px-2 py-1 text-xs">
                <span className="text-purple-600">/shapeshft3rs</span>
              </div>
            </div>

            {/* Futuristic Visor */}
            <div className="absolute top-8 right-8 w-16 h-12 bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 rounded-full shadow-lg transform rotate-12">
              <div className="w-full h-full bg-gradient-to-r from-purple-300 via-blue-400 to-green-300 rounded-full opacity-80"></div>
            </div>

            {/* Social Media Icons */}
            <div className="absolute bottom-8 left-8 flex space-x-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm">𝕏</span>
              </div>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-2 border-l-white border-t-1 border-t-transparent border-b-1 border-b-transparent ml-1"></div>
              </div>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm">♪</span>
              </div>
            </div>

            {/* Woman Posing */}
            <div className="absolute bottom-4 right-4 w-20 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg"></div>
            </div>

            {/* Floating Pin Icon */}
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 