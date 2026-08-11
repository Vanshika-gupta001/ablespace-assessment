'use client';

import type { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { EmptyIcon } from './EmptyIcon';
import { STATUS_META } from '@/lib/taskMeta';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onOpen: (task: Task) => void;
  onDelete: (id: string) => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
}

export function Column({
  status,
  tasks,
  onOpen,
  onDelete,
  onDropTask,
}: ColumnProps) {
  const meta = STATUS_META[status];

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) onDropTask(taskId, status);
      }}
      className="flex min-w-[280px] flex-1 flex-col rounded-card bg-black/[0.02] p-3 dark:bg-white/[0.03] sm:min-w-0"
    >
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
        <h2 className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
          {meta.label}
        </h2>
        <span className="ml-auto font-mono text-xs text-slate-400">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            className="animate-card-in"
            onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
          >
            <TaskCard task={task} onOpen={onOpen} onDelete={onDelete} />
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-black/10 p-6 text-center text-slate-400 dark:border-white/10">
            <EmptyIcon className="h-7 w-7 opacity-50" />
            <p className="text-xs">Nothing here yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
