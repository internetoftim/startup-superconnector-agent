export function AgentOrb({ progress }: { progress: number }) {
  const nodes = Array.from({ length: 8 });
  return (
    <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse"
        style={{ opacity: 0.4 + (progress / 100) * 0.5 }}
      />
      {/* Rotating rings */}
      <div
        className="absolute inset-4 rounded-full border border-primary/30"
        style={{ animation: "spin 12s linear infinite" }}
      />
      <div
        className="absolute inset-8 rounded-full border border-accent-glow/30"
        style={{ animation: "spin 8s linear infinite reverse" }}
      />
      <div
        className="absolute inset-12 rounded-full border border-primary/20"
        style={{ animation: "spin 16s linear infinite" }}
      />

      {/* Orbiting nodes */}
      <div
        className="absolute inset-0"
        style={{ animation: "spin 10s linear infinite" }}
      >
        {nodes.map((_, i) => {
          const angle = (i / nodes.length) * Math.PI * 2;
          const r = 42;
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r;
          const active = progress > (i / nodes.length) * 100;
          return (
            <span
              key={i}
              className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                active
                  ? "bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                  : "bg-muted-foreground/30"
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          );
        })}
      </div>

      {/* Core */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent-glow shadow-[0_0_60px_hsl(var(--primary)/0.6)] animate-pulse" />
          <div className="absolute inset-0 grid place-items-center text-2xl font-bold text-primary-foreground">
            ◆
          </div>
        </div>
      </div>

      {/* Percentage */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-mono tabular-nums text-foreground backdrop-blur">
        {Math.floor(progress)}%
      </div>
    </div>
  );
}
