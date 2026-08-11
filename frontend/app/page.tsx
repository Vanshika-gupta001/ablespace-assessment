'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const { loginAsGuest } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
    } catch {
      showToast('Could not start a guest session. Is the API running?', 'error');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-light px-4 dark:bg-surface-dark">
      <div className="w-full max-w-[360px] rounded-card border border-black/5 bg-panel-light p-8 shadow-card dark:border-white/5 dark:bg-panel-dark">
        <h1 className="text-center font-display text-lg font-semibold text-slate-900 dark:text-white">
          Let&rsquo;s get back on track
        </h1>
        <p className="mt-1.5 text-center text-sm text-slate-500 dark:text-slate-400">
          Enter your email below to login to your account.
        </p>

        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={loading}
          className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-slate-900"
        >
          {loading ? 'Starting session...' : 'Continue as Guest'}
        </button>

        <button
          type="button"
          disabled
          title="Google sign-in isn't wired up in this assessment build — use Continue as Guest."
          className="mt-2.5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-black/10 px-4 py-2.5 text-sm font-medium text-slate-400 dark:border-white/10 dark:text-slate-500"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.85z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"
            />
          </svg>
          Login with Google
        </button>

        <p className="mt-5 text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
          By clicking continue, you agree to our{' '}
          <span className="underline">Terms of Service</span> and{' '}
          <span className="underline">Privacy Policy</span>.
        </p>
      </div>
    </main>
  );
}
