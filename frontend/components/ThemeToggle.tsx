'use client';

import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-pressed={isDark}
      className="relative inline-flex h-9 w-16 items-center rounded-full bg-panel-light dark:bg-panel-dark border border-black/10 dark:border-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-accent transition-transform duration-200 ${
          isDark ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
