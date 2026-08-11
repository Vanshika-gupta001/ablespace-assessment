'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckSquare, FolderKanban, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const initial = user?.displayName?.[0]?.toUpperCase() ?? 'G';

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-black/5 bg-panel-light dark:border-white/5 dark:bg-panel-dark">
      <div className="flex items-center gap-2 border-b border-black/5 px-4 py-4 dark:border-white/5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent font-display text-sm font-semibold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-slate-900 dark:text-white">
            {user?.displayName ?? 'Workspace'}
          </p>
          <p className="truncate text-xs text-slate-400">Workspace</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-accent-soft text-accent dark:bg-white/10'
                  : 'text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/5 p-3 dark:border-white/5">
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
            pathname?.startsWith('/settings')
              ? 'bg-accent-soft text-accent dark:bg-white/10'
              : 'text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5'
          }`}
        >
          <Settings className="h-4 w-4" strokeWidth={2} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
