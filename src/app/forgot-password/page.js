"use client";

import { useState } from 'react';
import { Input } from '../../components/ui/input';
import BrandLogo from '../../components/BrandLogo';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { ArrowLeft, Mail, Shield } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast({ title: 'Email required', description: 'Please enter your email.' });
      return;
    }
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailRegex.test(trimmedEmail)) {
      toast({ title: 'Invalid email', description: 'Enter a valid email address.' });
      return;
    }
    try {
      setSubmitting(true);
      const { error } = await sendPasswordReset(trimmedEmail);
      if (error) throw error;
      setSent(true);
      toast({ title: 'Check your email', description: 'We sent a password reset link.' });
    } catch (err) {
      toast({ title: 'Failed to send reset', description: err?.message || 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-600">
              We sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <p>• Check your spam/junk folder if you don't see it</p>
            <p>• The link expires in 1 hour</p>
            <p>• Click the link to reset your password</p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => setSent(false)} 
              variant="outline" 
              className="w-full h-12 border-gray-200 hover:bg-gray-50"
            >
              Send to different email
            </Button>
            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full h-12 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <BrandLogo size="lg" />

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">Forgot password?</h2>
            <p className="text-gray-600 text-base">No worries, we'll send you reset instructions.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg px-4 text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <Button 
              disabled={submitting} 
              className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold text-base transition-colors duration-200"
            >
              {submitting ? 'Sending reset link...' : 'Send reset link'}
            </Button>
          </form>

          {/* Back to login */}
          <div className="text-center">
            <Link href="/login" className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>

          {/* Help text */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700 mb-1">Need help?</p>
                <p>If you're having trouble resetting your password, contact our support team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800 rounded-full opacity-80 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-80 transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center w-full h-full p-10">
          <div className="text-center text-white">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Secure Password Reset</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              We'll send you a secure link to reset your password. 
              Your account security is our priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


