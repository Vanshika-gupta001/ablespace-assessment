'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ColorModePicker } from '@/components/ColorModePicker';

export default function SettingsPage() {
  const { user, token, updateUser, logout } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [title, setTitle] = useState(user?.title ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile(token, {
        displayName: displayName.trim(),
        title: title.trim(),
        username: username.trim(),
      });
      updateUser(updated);
      showToast('Profile updated.', 'success');
    } catch {
      showToast('Could not save your profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8">
      <Link
        href="/tasks"
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-accent dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to app
      </Link>

      <h1 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
        Profile
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-md border border-black/10 bg-black/[0.03] px-3 py-2 text-sm text-slate-500 outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400"
          />
        </div>

        <div>
          <label
            htmlFor="displayName"
            className="block text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            Full name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your job title or role"
            className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="One word, like a nickname or first name"
            className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>

      <div className="mt-10 border-t border-black/5 pt-8 dark:border-white/5">
        <h2 className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
          Theme
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {theme === 'dark' ? 'Dark' : 'Light'} mode
          </span>
        </div>
      </div>

      <div className="mt-8 border-t border-black/5 pt-8 dark:border-white/5">
        <h2 className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
          Color mode
        </h2>
        <div className="mt-3">
          <ColorModePicker />
        </div>
      </div>

      <div className="mt-10 border-t border-black/5 pt-8 dark:border-white/5">
        <h2 className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
          Workspace access
        </h2>
        <div className="mt-3 flex items-center justify-between rounded-card border border-black/5 p-4 dark:border-white/5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            End your guest session on this device.
          </p>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-priority-high/30 px-3 py-1.5 text-sm font-medium text-priority-high transition hover:bg-priority-high/10"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
