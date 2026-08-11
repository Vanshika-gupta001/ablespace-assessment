'use client';

import { AVAILABLE_LABELS } from '@/lib/taskMeta';

interface LabelPickerProps {
  value: string[];
  onToggle: (label: string) => void;
}

// Shared by the create/edit task form and the task detail page, so the
// tag-toggle UI (and the fixed label set from the design) only lives once.
export function LabelPicker({ value, onToggle }: LabelPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {AVAILABLE_LABELS.map((label) => {
        const active = value.includes(label);
        return (
          <button
            key={label}
            type="button"
            onClick={() => onToggle(label)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              active
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-black/10 text-slate-500 hover:bg-black/5 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
