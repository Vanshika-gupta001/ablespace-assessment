interface AvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

const COLORS = [
  'bg-priority-low',
  'bg-accent',
  'bg-priority-medium',
  'bg-priority-high',
];

function colorFor(name: string) {
  const index = name.charCodeAt(0) % COLORS.length;
  return COLORS[index];
}

export function Avatar({ name, size = 'sm' }: AvatarProps) {
  const initial = name.trim()[0]?.toUpperCase() ?? '?';
  const dimension = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs';

  return (
    <span
      title={name}
      className={`inline-flex ${dimension} items-center justify-center rounded-full font-display font-semibold text-white ${colorFor(
        name,
      )}`}
    >
      {initial}
    </span>
  );
}
