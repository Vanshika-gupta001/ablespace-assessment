import { Tag } from 'lucide-react';

const LABEL_COLORS: Record<string, string> = {
  Research: 'bg-priority-low/10 text-priority-low',
  Design: 'bg-accent-soft text-accent',
  Development: 'bg-priority-medium/10 text-priority-medium',
  Testing: 'bg-slate-500/10 text-slate-500 dark:text-slate-300',
  Deployment: 'bg-priority-high/10 text-priority-high',
};

export function LabelChip({ label }: { label: string }) {
  const colorClass = LABEL_COLORS[label] ?? 'bg-black/5 text-slate-500 dark:bg-white/10 dark:text-slate-300';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${colorClass}`}
    >
      <Tag className="h-3 w-3" />
      {label}
    </span>
  );
}
