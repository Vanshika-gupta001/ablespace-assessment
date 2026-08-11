'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus } from 'lucide-react';
import type { Task, TaskStatus } from '@/lib/types';
import { STATUS_META, STATUS_ORDER } from '@/lib/taskMeta';
import { DueDateBadge } from './DueDateBadge';
import { PriorityMenu } from './PriorityMenu';
import { DropdownMenu } from './DropdownMenu';
import { Avatar } from './Avatar';
import { useAuth } from '@/context/AuthContext';

interface TaskListTableProps {
  grouped: Record<TaskStatus, Task[]>;
  onPriorityChange: (taskId: string, priority: Task['priority']) => void;
  onDelete: (id: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function TaskListTable({
  grouped,
  onPriorityChange,
  onDelete,
  onAddTask,
}: TaskListTableProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const router = useRouter();

  const toggle = (status: TaskStatus) =>
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));

  return (
    <div className="flex flex-col gap-1">
      {STATUS_ORDER.map((status) => {
        const tasks = grouped[status];
        const isCollapsed = collapsed[status];
        const meta = STATUS_META[status];

        return (
          <div key={status} className="rounded-card">
            <button
              type="button"
              onClick={() => toggle(status)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left"
            >
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  isCollapsed ? '-rotate-90' : ''
                }`}
              />
              <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
              <span className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
                {meta.label}
              </span>
              <span className="font-mono text-xs text-slate-400">
                {tasks.length}
              </span>
            </button>

            {!isCollapsed && (
              <div className="overflow-x-auto rounded-card border border-black/5 dark:border-white/5">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-black/5 text-left text-xs font-medium text-slate-400 dark:border-white/5">
                      <th className="px-3 py-2 font-medium">Task</th>
                      <th className="px-3 py-2 font-medium">Priority</th>
                      <th className="px-3 py-2 font-medium">Members</th>
                      <th className="px-3 py-2 font-medium">Due Date</th>
                      <th className="px-3 py-2 font-medium" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        className="cursor-pointer border-b border-black/5 transition last:border-b-0 hover:bg-black/[0.02] dark:border-white/5 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-100">
                          {task.title}
                        </td>
                        <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <PriorityMenu
                            value={task.priority}
                            onChange={(p) => onPriorityChange(task.id, p)}
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          {user && <Avatar name={user.displayName} />}
                        </td>
                        <td className="px-3 py-2.5">
                          <DueDateBadge date={task.dueDate} variant="plain" />
                        </td>
                        <td
                          className="px-3 py-2.5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu
                            items={[
                              {
                                label: 'Open',
                                onClick: () => router.push(`/tasks/${task.id}`),
                              },
                              {
                                label: 'Delete',
                                danger: true,
                                onClick: () => onDelete(task.id),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5} className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => onAddTask(status)}
                          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-accent"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Task
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
