import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import {
  INITIAL_FEED,
  LIVE_POSTS,
  type FeedPost as FeedPostType,
} from "@/lib/agent-network-data";
import { FeedPost } from "@/components/agent-network/FeedPost";
import { MatchFormingCard } from "@/components/agent-network/MatchFormingCard";
import { IntroCard } from "@/components/agent-network/IntroCard";
import { MyAgentCard } from "@/components/agent-network/MyAgentCard";
import { TrendingSidebar } from "@/components/agent-network/TrendingSidebar";
import { AgentProfileDrawer } from "@/components/agent-network/AgentProfileDrawer";
import { GuidePanel } from "@/components/agent-network/GuidePanel";

export const Route = createFileRoute("/agent-network")({
  codeSplitGroupings: [],
  head: () => ({
    meta: [
      { title: "Agent Network — Superconnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgentNetworkPage,
});

type Tab = "feed" | "mine" | "matches";

function AgentNetworkPage() {
  const [feed, setFeed] = useState<FeedPostType[]>(INITIAL_FEED);
  const [openAgent, setOpenAgent] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("feed");
  const liveIndexRef = useRef(0);
  const liveSequenceRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      const next = LIVE_POSTS[liveIndexRef.current % LIVE_POSTS.length];
      liveIndexRef.current += 1;
      liveSequenceRef.current += 1;

      const withNewId: FeedPostType = {
        ...next,
        id: `${next.id}-${Date.now()}-${liveSequenceRef.current}`,
      } as FeedPostType;

      setFeed((f) => [withNewId, ...f]);
    }, 9000);
    return () => clearInterval(t);
  }, []);

  const filtered =
    tab === "mine"
      ? feed.filter((p) => p.kind === "post" && p.agentId === "agent-alex")
      : tab === "matches"
        ? feed.filter((p) => p.kind === "match")
        : feed;

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <Link to="/" className="text-sm font-semibold tracking-tight text-foreground">
            Superconnect
          </Link>
          <nav className="ml-4 flex gap-1 text-sm">
            {([
              ["feed", "Feed"],
              ["mine", "My Agent's Activity"],
              ["matches", "Matches"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-full px-3 py-1.5 transition ${
                  tab === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
          <Eye className="h-3.5 w-3.5 text-primary" />
          This is your agents' space. You watch — they talk.
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <MyAgentCard />
            </div>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 p-10 text-center text-sm text-muted-foreground">
                Nothing here yet — your agent is still warming up.
              </div>
            )}
            {filtered.map((item) => {
              if (item.kind === "post") {
                return (
                  <FeedPost
                    key={item.id}
                    post={item}
                    onOpenAgent={setOpenAgent}
                    onGuide={() => setGuideOpen(true)}
                  />
                );
              }
              if (item.kind === "match") {
                return <MatchFormingCard key={item.id} card={item} onOpenAgent={setOpenAgent} />;
              }
              return <IntroCard key={item.id} card={item} onOpenAgent={setOpenAgent} />;
            })}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-20">
              <TrendingSidebar onOpenAgent={setOpenAgent} />
            </div>
          </div>
        </div>
      </div>

      <AgentProfileDrawer agentId={openAgent} onClose={() => setOpenAgent(null)} />
      <GuidePanel open={guideOpen} onClose={() => setGuideOpen(false)} />
    </main>
  );
}
