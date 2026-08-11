'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { TaskStatus } from '@/lib/types';
import { STATUS_META, STATUS_ORDER } from '@/lib/taskMeta';

interface StatusMenuProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

export function StatusMenu({ value, onChange }: StatusMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[value];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-black/10 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-black/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
      >
        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
        {meta.label}
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-1 w-40 animate-fade-in rounded-md border border-black/10 bg-panel-light py-1 shadow-card dark:border-white/10 dark:bg-panel-dark"
        >
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onChange(s);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-slate-700 transition hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/5"
            >
              <span className={`h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />
              <span className="flex-1">{STATUS_META[s].label}</span>
              {s === value && <Check className="h-3.5 w-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
