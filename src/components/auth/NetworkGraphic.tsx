export function NetworkGraphic() {
  // Deterministic node positions to avoid SSR mismatch
  const nodes = [
    { x: 20, y: 25, r: 4 },
    { x: 75, y: 15, r: 5 },
    { x: 50, y: 45, r: 7 },
    { x: 15, y: 70, r: 4 },
    { x: 82, y: 62, r: 5 },
    { x: 40, y: 82, r: 4 },
    { x: 65, y: 88, r: 3 },
    { x: 88, y: 35, r: 3 },
    { x: 30, y: 55, r: 3 },
  ];
  const links: [number, number][] = [
    [0, 2], [1, 2], [2, 3], [2, 4], [2, 8], [3, 5], [4, 6], [1, 7], [4, 7], [5, 6], [0, 8],
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Radial glow */}
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-accent-glow/20 blur-[140px]" />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />
      {/* Network */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="link-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-accent-glow)" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="node-grad">
            <stop offset="0%" stopColor="var(--color-accent-glow)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="url(#link-grad)"
            strokeWidth="0.15"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r / 3} fill="url(#node-grad)">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur={`${3 + (i % 4)}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r / 1.5}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="0.1"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
