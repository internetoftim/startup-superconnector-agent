import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { CONVERSATIONS } from "@/lib/conversations-data";
import { ConversationList } from "@/components/conversations/ConversationList";
import { TranscriptView } from "@/components/conversations/TranscriptView";

export const Route = createLazyFileRoute("/conversations")({
  component: ConversationsPage,
});

function ConversationsPage() {
  const sortedFirstId = useMemo(() => {
    const proposed = CONVERSATIONS.find((c) => c.status === "proposed");
    return proposed?.id ?? CONVERSATIONS[0]?.id ?? null;
  }, []);
  const [activeId, setActiveId] = useState<string | null>(sortedFirstId);
  const active = useMemo(() => CONVERSATIONS.find((c) => c.id === activeId) ?? null, [activeId]);

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-white/5 bg-background/80 px-4 py-2.5 backdrop-blur">
        <Link
          to="/agent-network"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back to network
        </Link>
        <div className="ml-auto text-[11px] text-muted-foreground">Superconnect</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* List — hidden on mobile when a conversation is open */}
        <aside
          className={`w-full border-r border-white/5 bg-background/40 lg:w-80 lg:flex-none ${
            active ? "hidden lg:flex" : "flex"
          } flex-col`}
        >
          <ConversationList
            conversations={CONVERSATIONS}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </aside>

        {/* Transcript */}
        <section className={`flex-1 ${active ? "flex" : "hidden lg:flex"} flex-col`}>
          {active ? (
            <TranscriptView conversation={active} onBack={() => setActiveId(null)} />
          ) : (
            <div className="flex flex-1 items-center justify-center p-10 text-center text-sm text-muted-foreground">
              Select a conversation to watch it unfold.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
