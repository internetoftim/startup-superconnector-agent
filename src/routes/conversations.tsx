import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  getConversations,
  getMyAgent,
  type Persona,
} from "@/lib/conversations-data";
import { AgentAvatar } from "@/components/conversations/AgentAvatar";
import { ConversationList } from "@/components/conversations/ConversationList";
import { TranscriptView } from "@/components/conversations/TranscriptView";

export const Route = createFileRoute("/conversations")({
  head: () => ({
    meta: [
      { title: "My Agent's Conversations — Superconnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConversationsPage,
});

function ConversationsPage() {
  const [persona, setPersona] = useState<Persona>("startup");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sc:userType");
      if (stored === "investor" || stored === "startup") setPersona(stored);
    } catch {}
  }, []);

  const myAgent = getMyAgent(persona);
  const conversations = useMemo(() => getConversations(persona), [persona]);

  const firstId = useMemo(() => {
    const proposed = conversations.find((c) => c.status === "proposed");
    return proposed?.id ?? conversations[0]?.id ?? null;
  }, [conversations]);
  const [activeId, setActiveId] = useState<string | null>(firstId);

  // Keep selection valid when the persona (and thus dataset) resolves
  useEffect(() => {
    setActiveId(firstId);
  }, [firstId]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="flex items-center gap-5 border-b border-white/5 bg-background/80 px-4 py-2.5 backdrop-blur">
        <Link to="/" className="text-xs font-semibold tracking-tight text-foreground">
          Superconnect
        </Link>
        <nav className="flex items-center gap-4 text-xs">
          <span className="font-medium text-foreground">Conversations</span>
          <Link to="/insights" className="text-muted-foreground transition-colors hover:text-foreground">
            Insights
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <AgentAvatar hue={myAgent.hue} size={22} />
          <div className="hidden text-right sm:block">
            <div className="text-[11px] font-medium leading-tight text-foreground">{myAgent.name}</div>
            <div className="text-[10px] leading-tight text-muted-foreground">{myAgent.role}</div>
          </div>
          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
            Active
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`w-full border-r border-white/5 bg-background/40 lg:w-80 lg:flex-none ${
            active ? "hidden lg:flex" : "flex"
          } flex-col`}
        >
          <ConversationList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
        </aside>

        <section className={`flex-1 ${active ? "flex" : "hidden lg:flex"} flex-col`}>
          {active ? (
            <TranscriptView conversation={active} onBack={() => setActiveId(null)} myAgent={myAgent} />
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
