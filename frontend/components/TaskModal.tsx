'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { CreateTaskInput, Task, TaskPriority, TaskStatus } from '@/lib/types';
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from '@/lib/taskMeta';
import { LabelPicker } from './LabelPicker';

interface TaskModalProps {
  open: boolean;
  initialTask: Task | null;
  defaultStatus?: TaskStatus;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
}

const emptyForm: CreateTaskInput = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'none',
  dueDate: '',
  labels: [],
};

export function TaskModal({
  open,
  initialTask,
  defaultStatus,
  onClose,
  onSubmit,
}: TaskModalProps) {
  const [form, setForm] = useState<CreateTaskInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description ?? '',
        status: initialTask.status,
        priority: initialTask.priority,
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : '',
        labels: initialTask.labels,
      });
    } else {
      setForm({ ...emptyForm, status: defaultStatus ?? 'todo' });
    }
    setError(null);
  }, [initialTask, open, defaultStatus]);

  if (!open) return null;

  const toggleLabel = (label: string) => {
    setForm((prev) => {
      const labels = prev.labels ?? [];
      return {
        ...prev,
        labels: labels.includes(label)
          ? labels.filter((l) => l !== label)
          : [...labels, label],
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || undefined });
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-card bg-panel-light p-6 shadow-card dark:bg-panel-dark">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          {initialTask ? 'Edit task' : 'New task'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
              placeholder="e.g. Write API documentation"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1 w-full resize-none rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
              placeholder="Optional details"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
                className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
              >
                {PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_META[p].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Due date
            </label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
            />
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Labels
            </span>
            <div className="mt-1.5">
              <LabelPicker value={form.labels ?? []} onToggle={toggleLabel} />
            </div>
          </div>

          {error && <p className="text-sm text-priority-high">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-black/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialTask ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
