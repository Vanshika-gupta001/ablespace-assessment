import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#F7F7F5',
          dark: '#14161A',
        },
        panel: {
          light: '#FFFFFF',
          dark: '#1C1F26',
        },
        // Accent resolves through a CSS variable so the 6-way color-mode
        // picker (Settings → Color) can swap it at runtime without a
        // recompile — see globals.css for the [data-accent="..."] values.
        accent: {
          DEFAULT: 'var(--accent-color)',
          soft: 'var(--accent-color-soft)',
        },
        priority: {
          low: '#5B8DEF',
          medium: '#E8A23D',
          high: '#E8607A',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 32, 0.06), 0 8px 24px -12px rgba(16, 24, 32, 0.12)',
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.2s ease-out',
        shimmer: 'shimmer 1.6s infinite linear',
        'card-in': 'card-in 0.18s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
