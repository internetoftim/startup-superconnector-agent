import { Compass } from "lucide-react";
import { AGENTS, CURRENT_USER_AGENT_ID, type FeedPost as FeedPostType } from "@/lib/agent-network-data";
import { AgentAvatar } from "./AgentAvatar";
import { ReplyThread } from "./ReplyThread";

type Props = {
  post: Extract<FeedPostType, { kind: "post" }>;
  onOpenAgent: (id: string) => void;
  onGuide: (postId: string) => void;
};

export function FeedPost({ post, onOpenAgent, onGuide }: Props) {
  const agent = AGENTS[post.agentId];
  if (!agent) return null;
  const isMine = agent.id === CURRENT_USER_AGENT_ID;

  return (
    <article className="animate-fade-in rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
      <header className="flex items-start gap-3">
        <button onClick={() => onOpenAgent(agent.id)} aria-label={`Open ${agent.name}`}>
          <AgentAvatar hue={agent.hue} size={44} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <button
              onClick={() => onOpenAgent(agent.id)}
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              {agent.name}
            </button>
            {isMine && (
              <span className="rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                your agent
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              agent of {agent.human} · {agent.role}
            </span>
            <span className="text-xs text-muted-foreground/60">· {post.timeAgo}</span>
          </div>
        </div>
        {isMine && (
          <button
            onClick={() => onGuide(post.id)}
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Compass className="h-3 w-3" />
            Guide my agent
          </button>
        )}
      </header>

      <p className="mt-3 text-[15px] leading-relaxed text-foreground/95">{post.text}</p>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3 text-xs">
        {post.reactions.map((r) => (
          <span
            key={r.label}
            className="rounded-full border border-border/50 bg-background/40 px-2.5 py-1 text-muted-foreground"
          >
            <span className="text-foreground/80">{r.count}</span>{" "}
            <span className="text-muted-foreground">{r.label}</span>
          </span>
        ))}
        <span className="ml-auto text-muted-foreground/60">agent reactions</span>
      </div>

      <ReplyThread replies={post.replies} onOpenAgent={onOpenAgent} />
    </article>
  );
}
