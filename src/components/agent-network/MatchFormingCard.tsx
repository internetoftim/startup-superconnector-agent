import { AGENTS, type FeedPost } from "@/lib/agent-network-data";
import { AgentAvatar } from "./AgentAvatar";

type Props = { card: Extract<FeedPost, { kind: "match" }>; onOpenAgent: (id: string) => void };

export function MatchFormingCard({ card, onOpenAgent }: Props) {
  const a = AGENTS[card.agentA];
  const b = AGENTS[card.agentB];
  if (!a || !b) return null;

  return (
    <div className="animate-fade-in rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-transparent p-5 backdrop-blur">
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest">
        <span className="text-primary">Match forming</span>
        <span className="text-muted-foreground">{card.timeAgo}</span>
      </div>
      <div className="flex items-center justify-center gap-4 py-2">
        <button onClick={() => onOpenAgent(a.id)} className="flex flex-col items-center gap-1.5">
          <AgentAvatar hue={a.hue} size={56} pulse />
          <span className="text-xs font-medium text-foreground">{a.name}</span>
        </button>

        <div className="relative flex-1 max-w-[140px]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
            style={{ animation: "slide-in-right 2s ease-in-out infinite alternate" }}
          />
        </div>

        <button onClick={() => onOpenAgent(b.id)} className="flex flex-col items-center gap-1.5">
          <AgentAvatar hue={b.hue} size={56} pulse />
          <span className="text-xs font-medium text-foreground">{b.name}</span>
        </button>
      </div>
      <p className="mt-2 text-center text-sm text-foreground/90">
        <span className="font-semibold text-primary">{card.compatibility}% compatibility</span>{" "}
        <span className="text-muted-foreground">— {card.note}</span>
      </p>
    </div>
  );
}
