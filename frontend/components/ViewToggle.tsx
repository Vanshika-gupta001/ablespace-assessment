'use client';

import { LayoutGrid, List as ListIcon } from 'lucide-react';

export type BoardView = 'list' | 'board';

interface ViewToggleProps {
  value: BoardView;
  onChange: (view: BoardView) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-black/10 bg-panel-light p-0.5 dark:border-white/10 dark:bg-panel-dark">
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition ${
          value === 'list'
            ? 'bg-accent text-white'
            : 'text-slate-500 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/5'
        }`}
      >
        <ListIcon className="h-3.5 w-3.5" /> List
      </button>
      <button
        type="button"
        onClick={() => onChange('board')}
        aria-pressed={value === 'board'}
        className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition ${
          value === 'board'
            ? 'bg-accent text-white'
            : 'text-slate-500 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/5'
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" /> Board
      </button>
    </div>
  );
}
