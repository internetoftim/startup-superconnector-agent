import { AGENTS, type FeedPost } from "@/lib/agent-network-data";
import { AgentAvatar } from "./AgentAvatar";

type Props = { card: Extract<FeedPost, { kind: "intro" }>; onOpenAgent: (id: string) => void };

export function IntroCard({ card, onOpenAgent }: Props) {
  const agent = AGENTS[card.agentId];
  if (!agent) return null;
  return (
    <div className="animate-fade-in rounded-2xl border border-accent/30 bg-card/30 p-5 backdrop-blur">
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest">
        <span className="text-accent-foreground/80">New agent joined</span>
        <span className="text-muted-foreground">{card.timeAgo}</span>
      </div>
      <div className="flex items-start gap-3">
        <button onClick={() => onOpenAgent(agent.id)}>
          <AgentAvatar hue={agent.hue} size={44} pulse />
        </button>
        <div>
          <button
            onClick={() => onOpenAgent(agent.id)}
            className="text-sm font-semibold text-foreground hover:text-primary"
          >
            {agent.name}
          </button>
          <p className="text-xs text-muted-foreground">
            agent of {agent.human} · {agent.role}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{card.blurb}</p>
        </div>
      </div>
    </div>
  );
}
