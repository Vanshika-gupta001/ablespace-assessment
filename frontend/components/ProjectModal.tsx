'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { CreateProjectInput, Project } from '@/lib/types';
import { PRIORITY_META, PRIORITY_ORDER } from '@/lib/taskMeta';

interface ProjectModalProps {
  open: boolean;
  initialProject: Project | null;
  onClose: () => void;
  onSubmit: (input: CreateProjectInput) => Promise<void>;
}

const emptyForm: CreateProjectInput = {
  title: '',
  priority: 'none',
  lead: '',
  dueDate: '',
};

export function ProjectModal({
  open,
  initialProject,
  onClose,
  onSubmit,
}: ProjectModalProps) {
  const [form, setForm] = useState<CreateProjectInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProject) {
      setForm({
        title: initialProject.title,
        priority: initialProject.priority,
        lead: initialProject.lead ?? '',
        dueDate: initialProject.dueDate
          ? initialProject.dueDate.slice(0, 10)
          : '',
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [initialProject, open]);

  if (!open) return null;

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
      <div className="w-full max-w-md rounded-card bg-panel-light p-6 shadow-card dark:bg-panel-dark">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          {initialProject ? 'Edit project' : 'New project'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label
              htmlFor="p-title"
              className="block text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              Title
            </label>
            <input
              id="p-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
              placeholder="e.g. Design Homepage"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="p-priority"
                className="block text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Priority
              </label>
              <select
                id="p-priority"
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as CreateProjectInput['priority'],
                  })
                }
                className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
              >
                {PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_META[p].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="p-lead"
                className="block text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Lead
              </label>
              <input
                id="p-lead"
                type="text"
                value={form.lead}
                onChange={(e) => setForm({ ...form, lead: e.target.value })}
                className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
                placeholder="e.g. Dexter"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="p-dueDate"
              className="block text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              Due date
            </label>
            <input
              id="p-dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="mt-1 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
            />
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
              {submitting
                ? 'Saving...'
                : initialProject
                  ? 'Save changes'
                  : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
