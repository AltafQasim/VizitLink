"use client";

import { useEffect, useState, Suspense } from 'react';
import { Input } from '../../components/ui/input';
import BrandLogo from '../../components/BrandLogo';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { OTPInput, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../../components/ui/input-otp';

function VerifyOtpForm() {
    const { verifyEmailOtp, resendEmailOtp } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        const e = searchParams.get('email') || '';
        setEmail(e);
    }, [searchParams]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (submitting) return;
        const trimmedCode = code.trim();
        const qpEmail = (searchParams.get('email') || '').trim();
        const trimmedEmail = ((email || '').trim()) || qpEmail;

        if (!trimmedEmail) {
            toast({ title: 'Missing email', description: 'Email is required to verify OTP.' });
            return;
        }
        if (!trimmedCode || trimmedCode.length !== 6) {
            toast({ title: 'Invalid code', description: 'Enter the 6-digit code sent to your email.' });
            return;
        }

        try {
            setSubmitting(true);
            const { error } = await verifyEmailOtp(trimmedEmail, trimmedCode, 'signup');
            if (error) throw error;
            toast({ title: 'Verified', description: 'Welcome! Completing onboarding...' });
            router.push('/onboarding');
        } catch (err) {
            toast({ title: 'Verification failed', description: err?.message || 'Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (resending) return;
        const qpEmail = (searchParams.get('email') || '').trim();
        const trimmedEmail = ((email || '').trim()) || qpEmail;
        if (!trimmedEmail) {
            toast({ title: 'Missing email', description: 'Email is required to resend code.' });
            return;
        }
        try {
            setResending(true);
            const { error } = await resendEmailOtp(trimmedEmail, 'signup');
            if (error) throw error;
            toast({ title: 'Code resent', description: 'Check your email for a new code.' });
        } catch (err) {
            toast({ title: 'Resend failed', description: err?.message || 'Please try again.' });
        } finally {
            setResending(false);
        }
    };

    const getMailboxUrl = (addr) => {
        const domain = (addr.split('@')[1] || '').toLowerCase();
        if (!domain) return '';
        const mapping = {
            'gmail.com': 'https://mail.google.com',
            'googlemail.com': 'https://mail.google.com',
            'yahoo.com': 'https://mail.yahoo.com',
            'outlook.com': 'https://outlook.live.com/mail',
            'hotmail.com': 'https://outlook.live.com/mail',
            'live.com': 'https://outlook.live.com/mail',
            'msn.com': 'https://outlook.live.com/mail',
            'office365.com': 'https://outlook.office.com/mail',
            'outlook.office365.com': 'https://outlook.office.com/mail',
            'icloud.com': 'https://www.icloud.com/mail',
            'me.com': 'https://www.icloud.com/mail',
            'proton.me': 'https://mail.proton.me',
            'protonmail.com': 'https://mail.proton.me',
            'zoho.com': 'https://mail.zoho.com',
            'yandex.com': 'https://mail.yandex.com',
        };
        if (mapping[domain]) return mapping[domain];
        return `https://${domain}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 space-y-6">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <BrandLogo size="lg" />
                </div>
                
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
                    <p className="text-gray-600 text-sm mt-1">We sent a 6-digit code to <span className="font-medium">{email || 'your email'}</span>.</p>
                    <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-600 text-sm">
                        <li>Check your inbox and spam/junk folders.</li>
                        <li>The code expires soon. Enter it here to continue.</li>
                        <li>If you didn't receive it, resend a new code.</li>
                    </ul>
                </div>
                <form onSubmit={handleVerify} className="space-y-4">
                    <InputOTP
                        maxLength={6}
                        onChange={(value) => setCode(value)}
                        value={code}
                        pattern={REGEXP_ONLY_DIGITS}
                        className="h-12 tracking-widest text-center w-full"
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className="h-12 min-w-16" />
                            <InputOTPSlot index={1} className="h-12 min-w-16" />
                            <InputOTPSlot index={2} className="h-12 min-w-16" />
                            <InputOTPSlot index={3} className="h-12 min-w-16" />
                            <InputOTPSlot index={4} className="h-12 min-w-16" />
                            <InputOTPSlot index={5} className="h-12 min-w-16" />
                        </InputOTPGroup>
                    </InputOTP>
                    <Button disabled={submitting} className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold text-base">
                        {submitting ? 'Verifying...' : 'Verify'}
                    </Button>
                </form>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                        <button onClick={handleResend} disabled={resending} className="text-purple-600 hover:text-purple-700">
                            {resending ? 'Resending...' : 'Resend code'}
                        </button>
                        <Link href="/signup" className="text-gray-500 hover:text-gray-600">Change email</Link>
                    </div>
                    {email && (
                        <a
                            href={getMailboxUrl(email)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full h-11 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Open your mailbox
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <VerifyOtpForm />
        </Suspense>
    );
}
