'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api, ApiError } from '@/lib/api';
import type { CreateProjectInput, Project } from '@/lib/types';
import { PriorityMenu } from '@/components/PriorityMenu';
import { DueDateBadge } from '@/components/DueDateBadge';
import { DropdownMenu } from '@/components/DropdownMenu';
import { Avatar } from '@/components/Avatar';
import { ProjectModal } from '@/components/ProjectModal';
import { EmptyIcon } from '@/components/EmptyIcon';

export default function ProjectsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getProjects(token);
      setProjects(data);
    } catch {
      showToast('Could not load projects. Is the API running?', 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreateOrUpdate = async (input: CreateProjectInput) => {
    if (!token) return;
    if (editingProject) {
      const updated = await api.updateProject(token, editingProject.id, input);
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      showToast('Project updated.', 'success');
    } else {
      const created = await api.createProject(token, input);
      setProjects((prev) => [created, ...prev]);
      showToast('Project created.', 'success');
    }
  };

  const handlePriorityChange = async (
    id: string,
    priority: Project['priority'],
  ) => {
    if (!token) return;
    const previous = projects;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priority } : p)),
    );
    try {
      await api.updateProject(token, id, { priority });
    } catch (err) {
      setProjects(previous);
      showToast(
        err instanceof ApiError ? err.message : 'Could not update priority.',
        'error',
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    const previous = projects;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.deleteProject(token, id);
      showToast('Project deleted.', 'success');
    } catch {
      setProjects(previous);
      showToast('Could not delete the project.', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
          Projects
        </h1>
        <button
          type="button"
          onClick={openCreateModal}
          className="ml-auto flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="h-40 animate-shimmer rounded-card bg-gradient-to-r from-panel-light via-black/5 to-panel-light bg-[length:800px_100%] dark:from-panel-dark dark:via-white/5 dark:to-panel-dark" />
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-black/10 p-12 text-center dark:border-white/10">
          <EmptyIcon className="h-8 w-8 opacity-50" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No projects yet — create your first one to get started.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Add Project
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-black/5 dark:border-white/5">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs font-medium text-slate-400 dark:border-white/5">
                <th className="px-3 py-2 font-medium">Project</th>
                <th className="px-3 py-2 font-medium">Priority</th>
                <th className="px-3 py-2 font-medium">Lead</th>
                <th className="px-3 py-2 font-medium">Due Date</th>
                <th className="px-3 py-2 font-medium" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => openEditModal(project)}
                  className="cursor-pointer border-b border-black/5 transition last:border-b-0 hover:bg-black/[0.02] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-100">
                    {project.title}
                  </td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <PriorityMenu
                      value={project.priority}
                      onChange={(p) => handlePriorityChange(project.id, p)}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    {project.lead ? <Avatar name={project.lead} /> : '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    <DueDateBadge date={project.dueDate} variant="plain" />
                  </td>
                  <td
                    className="px-3 py-2.5 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu
                      items={[
                        { label: 'Edit', onClick: () => openEditModal(project) },
                        {
                          label: 'Delete',
                          danger: true,
                          onClick: () => handleDelete(project.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProjectModal
        open={modalOpen}
        initialProject={editingProject}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
}
