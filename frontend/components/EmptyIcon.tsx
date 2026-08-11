// A small inline illustration for empty columns/states — no external
// image asset needed, and it inherits currentColor so it themes for free.
export function EmptyIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="5"
        y="8"
        width="22"
        height="17"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M5 13h22" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 18.5l2.5 2.5L20 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
