'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AccentColor } from '@/lib/types';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const THEME_KEY = 'ablespace-theme';
const ACCENT_KEY = 'ablespace-accent';
const DEFAULT_ACCENT: AccentColor = 'emerald';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Defaults match the server render; the real values are applied after
  // mount once we've read localStorage, avoiding a hydration mismatch.
  const [theme, setTheme] = useState<Theme>('light');
  const [accent, setAccentState] = useState<AccentColor>(DEFAULT_ACCENT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const storedAccent = window.localStorage.getItem(
      ACCENT_KEY,
    ) as AccentColor | null;
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    setTheme(storedTheme ?? (prefersDark ? 'dark' : 'light'));
    setAccentState(storedAccent ?? DEFAULT_ACCENT);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-accent', accent);
    window.localStorage.setItem(ACCENT_KEY, accent);
  }, [accent, mounted]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const setAccent = (next: AccentColor) => setAccentState(next);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
