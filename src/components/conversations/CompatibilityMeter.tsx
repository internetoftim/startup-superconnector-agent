type Props = { score: number; className?: string };

export function CompatibilityMeter({ score, className = "" }: Props) {
  const hue = score >= 80 ? 150 : score >= 60 ? 200 : score >= 40 ? 40 : 0;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, hsl(${hue} 80% 55%), hsl(${hue} 90% 70%))`,
            boxShadow: `0 0 12px hsl(${hue} 90% 60% / 0.6)`,
          }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-foreground/80">{score}%</span>
    </div>
  );
}
