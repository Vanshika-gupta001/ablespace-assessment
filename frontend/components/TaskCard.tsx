'use client';

import type { Task } from '@/lib/types';
import { DropdownMenu } from './DropdownMenu';
import { DueDateBadge } from './DueDateBadge';
import { LabelChip } from './LabelChip';
import { Avatar } from './Avatar';
import { useAuth } from '@/context/AuthContext';

const PRIORITY_STRIPE: Record<Task['priority'], string> = {
  none: 'before:bg-slate-300 dark:before:bg-slate-700',
  urgent: 'before:bg-priority-high',
  high: 'before:bg-priority-high',
  medium: 'before:bg-priority-medium',
  low: 'before:bg-priority-low',
};

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onOpen, onDelete }: TaskCardProps) {
  const { user } = useAuth();

  return (
    <div
      onClick={() => onOpen(task)}
      className={`group relative cursor-pointer rounded-card border border-black/5 bg-panel-light p-4 pl-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/5 dark:bg-panel-dark before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:rounded-l-card ${PRIORITY_STRIPE[task.priority]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
          {task.title}
        </h3>
        <DropdownMenu
          items={[
            { label: 'Open', onClick: () => onOpen(task) },
            {
              label: 'Delete',
              danger: true,
              onClick: () => onDelete(task.id),
            },
          ]}
        />
      </div>

      {task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.slice(0, 2).map((label) => (
            <LabelChip key={label} label={label} />
          ))}
          {task.labels.length > 2 && (
            <span className="text-[11px] text-slate-400">
              +{task.labels.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <DueDateBadge date={task.dueDate} />
        {user && <Avatar name={user.displayName} />}
      </div>
    </div>
  );
}
