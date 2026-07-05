interface Props {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: Props) {
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground">
        Question {Math.min(current, total)} of {total}
      </span>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-muted/40">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
