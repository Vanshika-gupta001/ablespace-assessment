'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api, ApiError } from '@/lib/api';
import type { CreateTaskInput, Task, TaskStatus } from '@/lib/types';
import { STATUS_ORDER } from '@/lib/taskMeta';
import { Column } from '@/components/Column';
import { TaskListTable } from '@/components/TaskListTable';
import { TaskModal } from '@/components/TaskModal';
import { ViewToggle, type BoardView } from '@/components/ViewToggle';
import { BoardSkeleton } from '@/components/BoardSkeleton';

export default function TasksPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<BoardView>('list');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  const loadTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getTasks(token);
      setTasks(data);
    } catch {
      showToast('Could not load tasks. Is the API running?', 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filtered = useMemo(() => {
    if (!search.trim()) return tasks;
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, search]);

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      doing: [],
      completed: [],
      on_hold: [],
    };
    for (const task of filtered) {
      map[task.status].push(task);
    }
    return map;
  }, [filtered]);

  const handleCreate = async (input: CreateTaskInput) => {
    if (!token) return;
    const created = await api.createTask(token, input);
    setTasks((prev) => [created, ...prev]);
    showToast('Task created.', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.deleteTask(token, id);
      showToast('Task deleted.', 'success');
    } catch {
      setTasks(previous);
      showToast('Could not delete the task.', 'error');
    }
  };

  const handlePriorityChange = async (
    id: string,
    priority: Task['priority'],
  ) => {
    if (!token) return;
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t)),
    );
    try {
      await api.updateTask(token, id, { priority });
    } catch (err) {
      setTasks(previous);
      showToast(
        err instanceof ApiError ? err.message : 'Could not update priority.',
        'error',
      );
    }
  };

  const handleDropTask = async (taskId: string, status: TaskStatus) => {
    if (!token) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) return;

    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
    try {
      await api.updateTask(token, taskId, { status });
    } catch (err) {
      setTasks(previous);
      showToast(
        err instanceof ApiError ? err.message : 'Could not move the task.',
        'error',
      );
    }
  };

  const openCreateModal = (status?: TaskStatus) => {
    setDefaultStatus(status ?? 'todo');
    setModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
          Tasks
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-md border border-black/10 bg-panel-light px-2.5 py-1.5 dark:border-white/10 dark:bg-panel-dark sm:flex">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks"
              className="w-40 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            />
          </div>

          <ViewToggle value={view} onChange={setView} />

          <button
            type="button"
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      </div>

      {loading ? (
        <BoardSkeleton />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-black/10 p-12 text-center dark:border-white/10">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No tasks yet — create your first one to get started.
          </p>
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Add Task
          </button>
        </div>
      ) : view === 'list' ? (
        <TaskListTable
          grouped={grouped}
          onPriorityChange={handlePriorityChange}
          onDelete={handleDelete}
          onAddTask={openCreateModal}
        />
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row">
          {STATUS_ORDER.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={grouped[status]}
              onOpen={(task) => router.push(`/tasks/${task.id}`)}
              onDelete={handleDelete}
              onDropTask={handleDropTask}
            />
          ))}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        initialTask={null}
        defaultStatus={defaultStatus}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
