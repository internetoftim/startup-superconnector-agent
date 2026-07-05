import { AgentAvatar } from "@/components/conversations/AgentAvatar";

type Props = {
  from: "mine" | "other";
  name: string;
  text: string;
  time: string;
  hue: number;
};

export function AgentBubble({ from, name, text, time, hue }: Props) {
  const mine = from === "mine";
  return (
    <div className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      <AgentAvatar hue={hue} size={28} />
      <div className={`max-w-[78%] ${mine ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`flex items-center gap-2 text-[11px] text-muted-foreground ${mine ? "flex-row-reverse" : ""}`}>
          <span className="font-medium text-foreground/70">{name}</span>
          <span>· {time}</span>
        </div>
        <div
          className={
            mine
              ? "rounded-2xl rounded-br-sm bg-primary/90 px-3.5 py-2 text-sm text-primary-foreground shadow-sm"
              : "rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-foreground/90 backdrop-blur"
          }
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export function TypingBubble({ name, hue }: { name: string; hue: number }) {
  return (
    <div className="flex items-end gap-2">
      <AgentAvatar hue={hue} size={28} pulse />
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-muted-foreground">{name} is typing…</span>
        <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50" />
        </div>
      </div>
    </div>
  );
}

export function InsightChip({ text }: { text: string }) {
  return (
    <div className="mx-auto my-1 inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] text-primary">
      <span className="h-1 w-1 rounded-full bg-primary" />
      <span className="truncate">{text}</span>
    </div>
  );
}
