"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Login = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
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
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 text-base">Log in to your VizitLink</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <Input 
                type="email"
                placeholder="Email or username"
                className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg px-4 text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Continue Button */}
            <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold text-base transition-colors duration-200">
              Continue
            </Button>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              {/* Google */}
              <Button 
                onClick={handleGoogleSignIn}
                variant="outline" 
                className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200"
              >
                <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">G</div>
                <span className="text-gray-700 font-medium text-base">Continue with Google</span>
              </Button>

              {/* Apple 
              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200">
                <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">🍎</div>
                <span className="text-gray-700 font-medium text-base">Continue with Apple</span>
              </Button>*/}

              {/* Phone 
              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200">
                <div className="w-5 h-5 bg-gray-600 rounded-sm flex items-center justify-center text-white text-xs">📱</div>
                <span className="text-gray-700 font-medium text-base">Continue with phone number</span>
              </Button>*/}
            </div>

            {/* Links */}
            <div className="space-y-3 text-center">
              <div className="flex justify-center gap-4 text-sm">
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">Forgot password?</a>
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">Forgot username?</a>
              </div>
              <p className="text-gray-600 text-sm">
                Don't have an account? <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">Sign up</Link>
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-green-400 relative overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-800 rounded-full opacity-80 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full opacity-80 transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Main Person */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <div className="relative">
            {/* Person Avatar */}
            <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-56 h-56 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            {/* Video Player - Top Left */}
            <div className="absolute -top-8 -left-8 w-24 h-16 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Floating Shoe - Middle Left */}
            <div className="absolute top-1/2 -left-12 w-16 h-8 bg-white rounded-lg shadow-lg transform -translate-y-1/2">
              <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            </div>

            {/* YouTube & Spotify Icons - Top Right */}
            <div className="absolute -top-8 -right-8 space-y-2">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-l-3 border-l-red-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Product Card - Bottom Right */}
            <div className="absolute -bottom-8 -right-8 w-32 h-20 bg-white rounded-lg shadow-lg p-3">
              <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-12 bg-yellow-200 rounded-sm mx-auto mb-1"></div>
                  <div className="text-xs font-bold text-gray-800">SALT & STONE</div>
                  <div className="text-xs text-gray-600">$36</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
