// Shown while the initial task fetch is in flight, so the layout doesn't
// jump once real data arrives.
export function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {[0, 1, 2].map((col) => (
        <div
          key={col}
          className="flex min-w-[280px] flex-1 flex-col rounded-card bg-black/[0.02] p-3 dark:bg-white/[0.03] sm:min-w-0"
        >
          <div className="mb-3 h-4 w-24 rounded bg-black/10 dark:bg-white/10" />
          <div className="flex flex-col gap-3">
            {[0, 1].map((card) => (
              <div
                key={card}
                className="h-24 animate-shimmer rounded-card border border-black/5 bg-gradient-to-r from-panel-light via-black/5 to-panel-light bg-[length:800px_100%] dark:border-white/5 dark:from-panel-dark dark:via-white/5 dark:to-panel-dark"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
