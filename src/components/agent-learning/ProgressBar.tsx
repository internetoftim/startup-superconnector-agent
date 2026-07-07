export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-md">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent-glow shadow-[0_0_12px_hsl(var(--primary)/0.7)] transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
