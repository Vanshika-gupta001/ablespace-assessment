import type {
  AuthUser,
  Comment,
  CreateProjectInput,
  CreateTaskInput,
  Project,
  Task,
  UpdateProfileInput,
  UpdateProjectInput,
  UpdateTaskInput,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(body.message ?? 'Request failed', res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  // Defensive: some responses (like a DELETE with no explicit status code)
  // can come back 200 with an empty body — .json() on empty text throws,
  // so check for actual content before parsing rather than trusting the
  // status code alone.
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export const api = {
  loginAsGuest: () =>
    request<{ accessToken: string; user: AuthUser }>('/auth/guest', {
      method: 'POST',
    }),

  getTasks: (token: string) => request<Task[]>('/tasks', {}, token),
  getTask: (token: string, id: string) =>
    request<Task>(`/tasks/${id}`, {}, token),
  createTask: (token: string, input: CreateTaskInput) =>
    request<Task>(
      '/tasks',
      { method: 'POST', body: JSON.stringify(input) },
      token,
    ),
  updateTask: (token: string, id: string, input: UpdateTaskInput) =>
    request<Task>(
      `/tasks/${id}`,
      { method: 'PATCH', body: JSON.stringify(input) },
      token,
    ),
  deleteTask: (token: string, id: string) =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }, token),

  getSubtasks: (token: string, taskId: string) =>
    request<Task[]>(`/tasks/${taskId}/subtasks`, {}, token),

  getComments: (token: string, taskId: string) =>
    request<Comment[]>(`/tasks/${taskId}/comments`, {}, token),
  addComment: (token: string, taskId: string, content: string) =>
    request<Comment>(
      `/tasks/${taskId}/comments`,
      { method: 'POST', body: JSON.stringify({ content }) },
      token,
    ),

  getProjects: (token: string) => request<Project[]>('/projects', {}, token),
  createProject: (token: string, input: CreateProjectInput) =>
    request<Project>(
      '/projects',
      { method: 'POST', body: JSON.stringify(input) },
      token,
    ),
  updateProject: (token: string, id: string, input: UpdateProjectInput) =>
    request<Project>(
      `/projects/${id}`,
      { method: 'PATCH', body: JSON.stringify(input) },
      token,
    ),
  deleteProject: (token: string, id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }, token),

  updateProfile: (token: string, input: UpdateProfileInput) =>
    request<AuthUser>(
      '/users/me',
      { method: 'PATCH', body: JSON.stringify(input) },
      token,
    ),
};

export { ApiError };
