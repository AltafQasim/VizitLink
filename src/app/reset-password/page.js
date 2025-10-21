"use client";

import { useEffect, useState, Suspense } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

function ResetPasswordForm() {
  const { updatePassword, user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Check if we have a valid session or recovery parameters
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        
        // Allow if we have a session, or if it's a recovery flow, or if there's an access token
        if (session || type === 'recovery' || accessToken) {
          setReady(true);
        } else {
          // If no valid session, redirect to login
          toast({ title: 'Invalid link', description: 'This password reset link is invalid or expired.' });
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setReady(true); // Allow user to try anyway
      }
    };

    if (!loading) {
      checkSession();
    }
  }, [searchParams, loading, router, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!password || password.length < 6) {
      toast({ title: 'Weak password', description: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", description: 'Re-enter the same password.' });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await updatePassword(password);
      if (error) throw error;
      toast({ title: 'Password updated', description: 'You can now log in with your new password.' });
      router.push('/login');
    } catch (err) {
      toast({ title: 'Update failed', description: err?.message || 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
          <p className="text-gray-600 text-sm mt-1">Enter a new password for your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="h-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M2 2l20 20"/><path d="M10.58 10.58a2 2 0 102.83 2.83"/><path d="M16.72 16.72A10.94 10.94 0 0112 18c-5 0-9-4-10-6a11.74 11.74 0 013.21-3.88"/><path d="M9.88 5.09A10.94 10.94 0 0112 6c5 0 9 4 10 6a11.67 11.67 0 01-1.67 2.52"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="h-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M2 2l20 20"/><path d="M10.58 10.58a2 2 0 102.83 2.83"/><path d="M16.72 16.72A10.94 10.94 0 0112 18c-5 0-9-4-10-6a11.74 11.74 0 013.21-3.88"/><path d="M9.88 5.09A10.94 10.94 0 0112 6c5 0 9 4 10 6a11.67 11.67 0 01-1.67 2.52"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <Button disabled={submitting} className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold text-base">
            {submitting ? 'Updating...' : 'Update password'}
          </Button>
        </form>
        <div className="text-center text-sm">
          <Link href="/login" className="text-purple-600 hover:text-purple-700">Back to login</Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
