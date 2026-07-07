import { useMemo } from "react";
import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "@/lib/conversations-data";

const ORDER: Record<Conversation["status"], number> = {
  proposed: 0,
  talking: 1,
  evaluating: 2,
  scheduled: 3,
  ended_no_fit: 4,
};

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function ConversationList({ conversations, activeId, onSelect }: Props) {
  const sorted = useMemo(
    () => [...conversations].sort((a, b) => ORDER[a.status] - ORDER[b.status]),
    [conversations],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/5 px-4 py-4">
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          My Agent's Conversations
        </h1>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Private view — you're watching your agent talk on your behalf.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-1.5">
          {sorted.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              active={c.id === activeId}
              onSelect={() => onSelect(c.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
