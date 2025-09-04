"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { DashboardProvider } from '../../context/DashboardContext';
import { isUsernameAvailable, getUsernameSuggestions } from '../../lib/dashboardStorage';
import { useDashboard } from '../../context/DashboardContext';

function OnboardingInner() {
  const { createProfile, needsProfileCreation, setNeedsProfileCreation, isLoading, profiles } = useDashboard();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null); // true | false | null
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  // Do not auto-redirect from onboarding; dashboard handles routing

  const normalized = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);

  const isValidPattern = useMemo(() => username.length >= 3 && username.length <= 20, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !isValidPattern) return;
    if (available === false) return;
    setSubmitting(true);
    try {
      await createProfile({ username: normalized(username), displayName: normalized(username) });
      setNeedsProfileCreation(false);
      router.replace('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  // Debounced availability check and suggestions
  useEffect(() => {
    const value = normalized(username.trim());
    if (!value) {
      setAvailable(null);
      setSuggestions([]);
      return;
    }
    if (value.length < 3) {
      setAvailable(null);
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const ok = await isUsernameAvailable(value);
        setAvailable(ok);
        if (!ok) {
          const sugg = await getUsernameSuggestions(value);
          setSuggestions(sugg);
        } else {
          setSuggestions([]);
        }
      } finally {
        setChecking(false);
      }
    }, 400);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [username]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="px-6 sm:px-10 lg:px-16 py-8 flex flex-col items-center justify-center">
        {Array.isArray(profiles) && profiles.length > 0 && (
          <button onClick={() => router.push('/dashboard')} className="self-start text-sm text-gray-600 mb-8 inline-flex items-center gap-2">
            <span>←</span> Back to admin
          </button>
        )}
        <div className="w-full bg-white/80 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 text-center">Choose a username</h1>
          <p className="text-gray-600 mb-6 text-center">Choose a VizitLink URL for your new profile. You can always change it later.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <div className={`flex items-stretch border rounded-xl bg-white overflow-hidden transition-colors ${
                  checking ? 'border-gray-300' : (available === true && isValidPattern) ? 'border-green-400' : ((available === false || !isValidPattern) ? 'border-red-300' : 'border-gray-300')
                }`}>
                  <span className="px-3 sm:px-4 inline-flex items-center text-gray-500 bg-gray-50 border-r">vizitlink.com/</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(normalized(e.target.value))}
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 outline-none"
                    placeholder="yourname"
                    required
                    autoFocus
                  />
                  <span className="w-12 flex items-center justify-center">
                    {checking && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
                    {!checking && available === true && isValidPattern && <Check className="h-5 w-5 text-green-600" />}
                    {!checking && (available === false || !isValidPattern) && <X className="h-5 w-5 text-red-500" />}
                  </span>
                </div>
                <div className="mt-2 text-xs sm:text-sm text-gray-500 flex items-center justify-between">
                  <span>Use 3–20 letters or numbers. No spaces or symbols.</span>
                  <span className="tabular-nums">{username.length}/20</span>
                </div>
                {username && (
                  <div className="mt-2 text-sm">
                    {checking && <span className="text-gray-500">Checking availability…</span>}
                    {!checking && available === true && (
                      <span className="text-green-600">Great! Username is available.</span>
                    )}
                    {!checking && (available === false || !isValidPattern) && (
                      <span className="text-red-600">{!isValidPattern ? 'Please enter 3–20 valid characters.' : 'Username taken. Try one of these:'}</span>
                    )}
                  </div>
                )}
                {!checking && available === false && suggestions?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setUsername(s)}
                        className="px-3 py-1 rounded-full border text-sm hover:bg-gray-100"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || username.trim().length === 0 || available === false || checking || !isValidPattern}
              className="w-full py-4 rounded-xl bg-gray-900 text-white disabled:bg-gray-200 disabled:text-gray-500"
            >
              {submitting ? 'Creating…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block bg-[#d19a2a] relative">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="bg-white/90 rounded-2xl shadow-2xl p-6 w-[420px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
              <div>
                <div className="font-semibold">Nikole Brake</div>
                <div className="text-xs text-gray-500">Founder of Shape Shifters</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm">Slow flow</span>
                <span>▾</span>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm">Online courses</span>
                <span>▾</span>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm">Wellness retreats</span>
                <span>▾</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <OnboardingInner />
      </DashboardProvider>
    </ProtectedRoute>
  );
}


