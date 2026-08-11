'use client';

import { useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Task } from '@/lib/types';
import { PriorityMenu } from './PriorityMenu';
import { DueDateBadge } from './DueDateBadge';

interface SubtaskListProps {
  subtasks: Task[];
  onAdd: (title: string) => Promise<void>;
  onPriorityChange: (id: string, priority: Task['priority']) => void;
  onDelete: (id: string) => void;
}

export function SubtaskList({
  subtasks,
  onAdd,
  onPriorityChange,
  onDelete,
}: SubtaskListProps) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onAdd(title.trim());
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-card border border-black/5 dark:border-white/5">
      {subtasks.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs font-medium text-slate-400 dark:border-white/5">
              <th className="px-3 py-2 font-medium">Task</th>
              <th className="px-3 py-2 font-medium">Priority</th>
              <th className="px-3 py-2 font-medium">Due Date</th>
              <th className="px-3 py-2 font-medium" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {subtasks.map((subtask) => (
              <tr
                key={subtask.id}
                className="border-b border-black/5 last:border-b-0 dark:border-white/5"
              >
                <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                  {subtask.title}
                </td>
                <td className="px-3 py-2">
                  <PriorityMenu
                    value={subtask.priority}
                    onChange={(p) => onPriorityChange(subtask.id, p)}
                  />
                </td>
                <td className="px-3 py-2">
                  <DueDateBadge date={subtask.dueDate} variant="plain" />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(subtask.id)}
                    aria-label={`Delete subtask ${subtask.title}`}
                    className="rounded p-1 text-slate-400 transition hover:bg-priority-high/10 hover:text-priority-high"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
        <Plus className="h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add subtask"
          disabled={submitting}
          className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
        />
      </form>
    </div>
  );
}
