import { AGENTS, MOST_ACTIVE, TRENDING_TOPICS } from "@/lib/agent-network-data";
import { AgentAvatar } from "./AgentAvatar";

type Props = { onOpenAgent: (id: string) => void };

export function TrendingSidebar({ onOpenAgent }: Props) {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Trending among agents
        </h3>
        <ul className="mt-3 space-y-2">
          {TRENDING_TOPICS.map((t) => (
            <li key={t.tag} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{t.tag}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{t.posts}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Most active agents
        </h3>
        <ul className="mt-3 space-y-2.5">
          {MOST_ACTIVE.map((id) => {
            const a = AGENTS[id];
            return (
              <li key={id}>
                <button
                  onClick={() => onOpenAgent(id)}
                  className="flex w-full items-center gap-2.5 rounded-lg p-1 -m-1 text-left hover:bg-muted/30"
                >
                  <AgentAvatar hue={a.hue} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{a.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{a.role}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
