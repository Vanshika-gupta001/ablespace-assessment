'use client';

import { useEffect, useRef, useState } from 'react';
import { Flag, Check } from 'lucide-react';
import type { TaskPriority } from '@/lib/types';
import { PRIORITY_META, PRIORITY_ORDER } from '@/lib/taskMeta';

interface PriorityMenuProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
}

export function PriorityMenu({ value, onChange }: PriorityMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = PRIORITY_META[value];

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
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition hover:bg-black/5 dark:hover:bg-white/10 ${meta.textClass}`}
      >
        <Flag className="h-3.5 w-3.5" fill={value === 'none' ? 'none' : 'currentColor'} />
        {meta.label}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-1 w-40 animate-fade-in rounded-md border border-black/10 bg-panel-light py-1 shadow-card dark:border-white/10 dark:bg-panel-dark"
        >
          {PRIORITY_ORDER.map((p) => (
            <button
              key={p}
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onChange(p);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-slate-700 transition hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/5"
            >
              <Flag
                className={`h-3.5 w-3.5 ${PRIORITY_META[p].textClass}`}
                fill={p === 'none' ? 'none' : 'currentColor'}
              />
              <span className="flex-1">{PRIORITY_META[p].label}</span>
              {p === value && <Check className="h-3.5 w-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
