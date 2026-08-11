'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Menu, X, LogOut } from 'lucide-react';

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/');
    }
  }, [loading, token, router]);

  if (loading || !token) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-light dark:bg-surface-dark">
      {/* Desktop sidebar */}
      <div className="hidden sm:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 flex sm:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 animate-fade-in">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-black/5 bg-panel-light px-4 py-3 dark:border-white/5 dark:bg-panel-dark sm:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="rounded-md p-1.5 text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-display text-sm font-semibold text-slate-900 dark:text-white">
            AbleSpace
          </span>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            className="rounded-md p-1.5 text-slate-500 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
