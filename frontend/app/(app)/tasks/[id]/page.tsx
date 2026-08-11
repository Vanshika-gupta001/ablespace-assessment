'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api, ApiError } from '@/lib/api';
import type { Comment, Task, UpdateTaskInput } from '@/lib/types';
import { StatusMenu } from '@/components/StatusMenu';
import { PriorityMenu } from '@/components/PriorityMenu';
import { LabelPicker } from '@/components/LabelPicker';
import { SubtaskList } from '@/components/SubtaskList';
import { CommentsPanel } from '@/components/CommentsPanel';
import { Avatar } from '@/components/Avatar';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const load = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const [taskData, subtaskData, commentData] = await Promise.all([
        api.getTask(token, id),
        api.getSubtasks(token, id),
        api.getComments(token, id),
      ]);
      setTask(taskData);
      setSubtasks(subtaskData);
      setComments(commentData);
      setTitle(taskData.title);
      setDescription(taskData.description ?? '');
    } catch {
      showToast('Could not load this task.', 'error');
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  useEffect(() => {
    load();
  }, [load]);

  const patchTask = async (patch: UpdateTaskInput) => {
    if (!token || !task) return;
    const previous = task;
    setTask({ ...task, ...patch } as Task);
    try {
      const updated = await api.updateTask(token, task.id, patch);
      setTask(updated);
    } catch (err) {
      setTask(previous);
      showToast(
        err instanceof ApiError ? err.message : 'Could not save that change.',
        'error',
      );
    }
  };

  const handleTitleBlur = () => {
    if (task && title.trim() && title !== task.title) {
      patchTask({ title: title.trim() });
    } else if (task) {
      setTitle(task.title);
    }
  };

  const handleDescriptionBlur = () => {
    if (task && description !== (task.description ?? '')) {
      patchTask({ description });
    }
  };

  const toggleLabel = (label: string) => {
    if (!task) return;
    const labels = task.labels.includes(label)
      ? task.labels.filter((l) => l !== label)
      : [...task.labels, label];
    patchTask({ labels });
  };

  const handleDeleteTask = async () => {
    if (!token || !task) return;
    try {
      await api.deleteTask(token, task.id);
      showToast('Task deleted.', 'success');
      router.push('/tasks');
    } catch {
      showToast('Could not delete the task.', 'error');
    }
  };

  const handleAddSubtask = async (subtaskTitle: string) => {
    if (!token || !task) return;
    const created = await api.createTask(token, {
      title: subtaskTitle,
      parentId: task.id,
    });
    setSubtasks((prev) => [...prev, created]);
  };

  const handleSubtaskPriorityChange = async (
    subtaskId: string,
    priority: Task['priority'],
  ) => {
    if (!token) return;
    const previous = subtasks;
    setSubtasks((prev) =>
      prev.map((s) => (s.id === subtaskId ? { ...s, priority } : s)),
    );
    try {
      await api.updateTask(token, subtaskId, { priority });
    } catch {
      setSubtasks(previous);
      showToast('Could not update subtask priority.', 'error');
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!token) return;
    const previous = subtasks;
    setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
    try {
      await api.deleteTask(token, subtaskId);
    } catch {
      setSubtasks(previous);
      showToast('Could not delete the subtask.', 'error');
    }
  };

  const handleAddComment = async (content: string) => {
    if (!token || !task) return;
    const created = await api.addComment(token, task.id, content);
    setComments((prev) => [...prev, created]);
  };

  if (loading || !task) {
    return (
      <div className="p-4 sm:p-8">
        <div className="h-6 w-32 animate-shimmer rounded bg-gradient-to-r from-panel-light via-black/5 to-panel-light bg-[length:800px_100%] dark:from-panel-dark dark:via-white/5 dark:to-panel-dark" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <button
        type="button"
        onClick={() => router.push('/tasks')}
        className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-accent dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tasks
      </button>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full bg-transparent font-display text-2xl font-semibold text-slate-900 outline-none focus:underline dark:text-white"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            rows={4}
            placeholder="Add a description..."
            className="mt-3 w-full resize-none rounded-md bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400 dark:text-slate-300"
          />

          <div className="mt-6">
            <h3 className="mb-2 font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
              Subtasks
            </h3>
            <SubtaskList
              subtasks={subtasks}
              onAdd={handleAddSubtask}
              onPriorityChange={handleSubtaskPriorityChange}
              onDelete={handleDeleteSubtask}
            />
          </div>

          <div className="mt-8 border-t border-black/5 pt-6 dark:border-white/5">
            <CommentsPanel comments={comments} onAdd={handleAddComment} />
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-card border border-black/5 p-4 dark:border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
                Details
              </h3>
              <button
                type="button"
                onClick={handleDeleteTask}
                aria-label="Delete task"
                className="rounded p-1 text-slate-400 transition hover:bg-priority-high/10 hover:text-priority-high"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-4 flex flex-col gap-4 text-sm">
              <div>
                <dt className="mb-1 text-xs text-slate-400">Status</dt>
                <dd>
                  <StatusMenu
                    value={task.status}
                    onChange={(status) => patchTask({ status })}
                  />
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-xs text-slate-400">Priority</dt>
                <dd>
                  <PriorityMenu
                    value={task.priority}
                    onChange={(priority) => patchTask({ priority })}
                  />
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-xs text-slate-400">Assignee</dt>
                <dd className="flex items-center gap-2">
                  {user && (
                    <>
                      <Avatar name={user.displayName} />
                      <span className="text-slate-700 dark:text-slate-200">
                        {user.displayName}
                      </span>
                    </>
                  )}
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-xs text-slate-400">Due date</dt>
                <dd>
                  <input
                    type="date"
                    value={task.dueDate ? task.dueDate.slice(0, 10) : ''}
                    onChange={(e) => {
                      // Clearing the date picker isn't sent to the API —
                      // the PATCH endpoint treats an omitted dueDate as
                      // "leave unchanged", so there's currently no way to
                      // explicitly unset a due date once set (same
                      // limitation as the create/edit task form).
                      if (e.target.value) {
                        patchTask({ dueDate: e.target.value });
                      }
                    }}
                    className="w-full rounded-md border border-black/10 bg-transparent px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-accent dark:border-white/10 dark:text-slate-200"
                  />
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-xs text-slate-400">Labels</dt>
                <dd>
                  <LabelPicker value={task.labels} onToggle={toggleLabel} />
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
