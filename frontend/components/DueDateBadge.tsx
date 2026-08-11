import { CalendarDays } from 'lucide-react';

interface DueDateBadgeProps {
  date: string | null;
  variant?: 'pill' | 'plain';
}

export function DueDateBadge({ date, variant = 'pill' }: DueDateBadgeProps) {
  if (!date) {
    return (
      <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
        No due date
      </span>
    );
  }

  const formatted = new Date(date).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: variant === 'plain' ? 'numeric' : undefined,
  });

  const isOverdue = new Date(date) < new Date(new Date().toDateString());

  if (variant === 'plain') {
    return (
      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
        {formatted}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium ${
        isOverdue
          ? 'bg-priority-high/10 text-priority-high'
          : 'bg-black/5 text-slate-500 dark:bg-white/10 dark:text-slate-400'
      }`}
    >
      <CalendarDays className="h-3 w-3" />
      {formatted}
    </span>
  );
}
