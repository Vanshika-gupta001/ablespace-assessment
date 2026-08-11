export type TaskStatus = 'todo' | 'doing' | 'completed' | 'on_hold';
export type TaskPriority = 'none' | 'urgent' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  labels: string[];
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorName: string;
  taskId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  priority: TaskPriority;
  lead: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  title: string | null;
  username: string | null;
  isGuest: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  labels?: string[];
  parentId?: string;
}
export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface CreateProjectInput {
  title: string;
  priority?: TaskPriority;
  lead?: string;
  dueDate?: string;
}
export type UpdateProjectInput = Partial<CreateProjectInput>;

export interface UpdateProfileInput {
  displayName?: string;
  title?: string;
  username?: string;
}

export type AccentColor =
  | 'amber'
  | 'blue'
  | 'pink'
  | 'rose'
  | 'emerald'
  | 'black';
