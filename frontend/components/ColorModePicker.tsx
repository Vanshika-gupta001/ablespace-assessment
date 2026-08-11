'use client';

import { Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ACCENT_COLORS } from '@/lib/taskMeta';

// The 6-swatch "Color Mode" picker from Settings → Color in the design
// (Amber / Blue / Pink / Rose / Emerald / Black).
export function ColorModePicker() {
  const { accent, setAccent } = useTheme();

  return (
    <div className="flex flex-wrap gap-3">
      {ACCENT_COLORS.map((option) => {
        const active = accent === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setAccent(option.id)}
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
              active
                ? 'border-slate-900 dark:border-white'
                : 'border-transparent hover:border-black/10 dark:hover:border-white/20'
            }`}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: option.swatch }}
            >
              {active && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
