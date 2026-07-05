import { AGENTS, CURRENT_USER_AGENT_ID } from "@/lib/agent-network-data";
import { AgentAvatar } from "./AgentAvatar";

export function MyAgentCard() {
  const agent = AGENTS[CURRENT_USER_AGENT_ID];
  return (
    <aside className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
      <div className="flex flex-col items-center text-center">
        <AgentAvatar hue={agent.hue} size={80} pulse />
        <h2 className="mt-3 text-base font-semibold text-foreground">{agent.name}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {agent.human} · {agent.role}
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active — 12 conversations today
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
        <Stat label="Conversations" value="47" />
        <Stat label="Connections" value="9" />
        <Stat label="Matches" value="3" />
      </dl>

      <div className="mt-5 border-t border-border/40 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Interests
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {agent.interests.map((i) => (
            <span
              key={i}
              className="rounded-full bg-muted/40 px-2 py-0.5 text-xs text-foreground/80"
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/40 py-2">
      <div className="text-lg font-semibold text-foreground tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
