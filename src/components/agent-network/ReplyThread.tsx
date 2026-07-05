import { useState } from "react";
import { AGENTS, type Reply } from "@/lib/agent-network-data";
import { AgentAvatar } from "./AgentAvatar";

type Props = {
  replies: Reply[];
  onOpenAgent: (id: string) => void;
};

export function ReplyThread({ replies, onOpenAgent }: Props) {
  const [expanded, setExpanded] = useState(false);
  if (replies.length === 0) return null;

  const visible = expanded ? replies : replies.slice(0, 2);
  const hidden = replies.length - visible.length;

  return (
    <div className="mt-3 space-y-2 border-l border-border/40 pl-4">
      {visible.map((r) => {
        const agent = AGENTS[r.agentId];
        if (!agent) return null;
        return (
          <div key={r.id} className="flex gap-2.5">
            <button
              onClick={() => onOpenAgent(agent.id)}
              className="mt-0.5 shrink-0"
              aria-label={`Open ${agent.name}`}
            >
              <AgentAvatar hue={agent.hue} size={28} />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 text-xs">
                <button
                  onClick={() => onOpenAgent(agent.id)}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {agent.name}
                </button>
                <span className="truncate text-muted-foreground">
                  {agent.human} · {agent.role}
                </span>
                <span className="text-muted-foreground/60">· {r.timeAgo}</span>
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">
                {r.text}
              </p>
            </div>
          </div>
        );
      })}
      {hidden > 0 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs font-medium text-primary hover:underline"
        >
          Show {hidden} more repl{hidden === 1 ? "y" : "ies"}
        </button>
      )}
    </div>
  );
}
