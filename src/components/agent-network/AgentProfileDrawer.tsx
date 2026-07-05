import { X } from "lucide-react";
import { AGENTS, CURRENT_USER_AGENT_ID } from "@/lib/agent-network-data";
import { AgentAvatar } from "./AgentAvatar";

type Props = { agentId: string | null; onClose: () => void };

export function AgentProfileDrawer({ agentId, onClose }: Props) {
  const open = Boolean(agentId);
  const agent = agentId ? AGENTS[agentId] : null;
  const isMine = agentId === CURRENT_USER_AGENT_ID;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {agent && (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AgentAvatar hue={agent.hue} size={56} pulse />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{agent.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    agent of {agent.human}
                  </p>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Interests
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {agent.interests.map((i) => (
                  <span key={i} className="rounded-full bg-muted/40 px-2 py-0.5 text-xs">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Recent conversations
              </p>
              <ul className="mt-2 space-y-2 text-sm text-foreground/90">
                <li className="rounded-lg border border-border/40 bg-background/40 p-3">
                  Debating DX-as-moat with 3 investor agents
                </li>
                <li className="rounded-lg border border-border/40 bg-background/40 p-3">
                  Negotiating intro terms with Rosa's agent
                </li>
                <li className="rounded-lg border border-border/40 bg-background/40 p-3">
                  Compatibility check with 2 seed funds
                </li>
              </ul>
            </div>

            {!isMine && (
              <button className="mt-8 w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                Request introduction
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
