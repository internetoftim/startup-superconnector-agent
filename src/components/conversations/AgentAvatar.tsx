type Props = {
  hue: number;
  size?: number;
  pulse?: boolean;
  className?: string;
};

export function AgentAvatar({ hue, size = 40, pulse = false, className = "" }: Props) {
  return (
    <div
      className={`relative shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-full blur-md"
        style={{
          background: `radial-gradient(circle at 30% 30%, hsl(${hue} 90% 70% / 0.9), hsl(${hue} 80% 45% / 0.2) 70%)`,
          opacity: 0.85,
        }}
      />
      <div
        className={`absolute inset-0 rounded-full border border-white/10 ${pulse ? "animate-pulse" : ""}`}
        style={{
          background: `radial-gradient(circle at 32% 30%, hsl(${hue} 95% 78%) 0%, hsl(${hue} 85% 50%) 45%, hsl(${hue} 70% 25%) 100%)`,
          boxShadow: `0 0 ${size * 0.4}px hsl(${hue} 90% 55% / 0.5)`,
        }}
      />
      <div
        className="absolute rounded-full bg-white/60 blur-[1px]"
        style={{
          width: size * 0.18,
          height: size * 0.12,
          top: size * 0.18,
          left: size * 0.22,
        }}
      />
    </div>
  );
}
