import { AgentAvatar } from "@/components/agent-network/AgentAvatar";
import type { Conversation } from "@/lib/conversations-data";

const STATUS: Record<
  Conversation["status"],
  { label: string; className: string; pulse?: boolean }
> = {
  talking: { label: "Talking", className: "bg-primary/15 text-primary border-primary/30", pulse: true },
  evaluating: { label: "Evaluating fit", className: "bg-white/5 text-foreground/70 border-white/10" },
  proposed: { label: "Match proposed", className: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30" },
  scheduled: { label: "Meeting scheduled", className: "bg-emerald-400/10 text-emerald-300/80 border-emerald-400/20" },
  ended_no_fit: { label: "Ended — not a fit", className: "bg-white/5 text-muted-foreground border-white/10" },
};

type Props = {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
};

export function ConversationItem({ conversation, active, onSelect }: Props) {
  const s = STATUS[conversation.status];
  return (
    <button
      onClick={onSelect}
      className={`group flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
        active
          ? "border-primary/40 bg-primary/10"
          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      <AgentAvatar hue={conversation.otherHue} size={40} pulse={conversation.status === "talking"} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">{conversation.otherAgentName}</div>
            <div className="truncate text-[11px] text-muted-foreground">{conversation.otherRole}</div>
          </div>
          <span className="shrink-0 text-[10px] text-muted-foreground">{conversation.lastTime}</span>
        </div>
        <div className="mt-1.5 truncate text-xs text-foreground/60">{conversation.lastPreview}</div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${s.className}`}>
            {s.pulse && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />}
            {s.label}
          </span>
        </div>
      </div>
    </button>
  );
}
