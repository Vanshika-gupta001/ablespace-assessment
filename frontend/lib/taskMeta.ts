import type { AccentColor, TaskPriority, TaskStatus } from './types';

export const STATUS_META: Record<
  TaskStatus,
  { label: string; dot: string }
> = {
  todo: { label: 'To Do', dot: 'bg-slate-400' },
  doing: { label: 'Doing', dot: 'bg-priority-medium' },
  completed: { label: 'Completed', dot: 'bg-accent' },
  on_hold: { label: 'On Hold', dot: 'bg-priority-high' },
};

export const STATUS_ORDER: TaskStatus[] = [
  'todo',
  'doing',
  'completed',
  'on_hold',
];

// Matches the priority dropdown order in the design: No Priority sits at
// the top, Urgent at the bottom of the "has priority" group.
export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; textClass: string }
> = {
  none: { label: 'No Priority', textClass: 'text-slate-400' },
  urgent: { label: 'Urgent', textClass: 'text-priority-high' },
  high: { label: 'High', textClass: 'text-priority-high' },
  medium: { label: 'Medium', textClass: 'text-priority-medium' },
  low: { label: 'Low', textClass: 'text-priority-low' },
};

export const PRIORITY_ORDER: TaskPriority[] = [
  'none',
  'urgent',
  'high',
  'medium',
  'low',
];

// The label chips shown on task cards/detail pages in the design.
export const AVAILABLE_LABELS = [
  'Research',
  'Design',
  'Development',
  'Testing',
  'Deployment',
];

export const ACCENT_COLORS: { id: AccentColor; label: string; swatch: string }[] = [
  { id: 'amber', label: 'Amber', swatch: '#E8A23D' },
  { id: 'blue', label: 'Blue', swatch: '#5B8DEF' },
  { id: 'pink', label: 'Pink', swatch: '#EC72C4' },
  { id: 'rose', label: 'Rose', swatch: '#E8607A' },
  { id: 'emerald', label: 'Emerald', swatch: '#2F9E8F' },
  { id: 'black', label: 'Black', swatch: '#1A1D23' },
];
