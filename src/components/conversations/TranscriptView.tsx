import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Compass } from "lucide-react";
import { AgentAvatar } from "@/components/conversations/AgentAvatar";
import { AgentBubble, InsightChip, TypingBubble } from "./AgentBubble";
import { CompatibilityMeter } from "./CompatibilityMeter";
import { MeetingProposalCard } from "./MeetingProposalCard";
import { GuideAgentPanel } from "./GuideAgentPanel";
import type { Conversation, Message } from "@/lib/conversations-data";
import { MY_AGENT } from "@/lib/conversations-data";

type Props = {
  conversation: Conversation;
  onBack?: () => void;
};

export function TranscriptView({ conversation, onBack }: Props) {
  const [live, setLive] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [compatibility, setCompatibility] = useState(conversation.compatibility);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);

  // Reset when switching conversations
  useEffect(() => {
    setLive([]);
    setTyping(false);
    setCompatibility(conversation.compatibility);
    idxRef.current = 0;
  }, [conversation.id]);

  // Live streaming for "talking" conversations
  useEffect(() => {
    if (conversation.status !== "talking" || !conversation.liveScript?.length) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      const script = conversation.liveScript!;
      if (idxRef.current >= script.length) return;
      setTyping(true);
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setTyping(false);
        const msg = script[idxRef.current];
        setLive((l) => [...l, { ...msg, id: `${msg.id}-${Date.now()}` }]);
        setCompatibility((c) => Math.min(95, c + Math.round(Math.random() * 4)));
        idxRef.current += 1;
        timeoutId = setTimeout(tick, 3500 + Math.random() * 2000);
      }, 1400);
    };

    timeoutId = setTimeout(tick, 2000);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [conversation.id, conversation.status, conversation.liveScript]);

  // Auto-scroll on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [live.length, typing, conversation.id]);

  const allMessages = useMemo(() => [...conversation.messages, ...live], [conversation.messages, live]);
  const showProposal = conversation.status === "proposed" && conversation.proposal;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/5 bg-background/60 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="rounded-full p-1.5 text-muted-foreground hover:bg-white/5 lg:hidden">
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <AgentAvatar hue={MY_AGENT.hue} size={32} />
            <div className="h-px w-6 bg-gradient-to-r from-primary/60 to-transparent" />
            <AgentAvatar hue={conversation.otherHue} size={32} pulse={conversation.status === "talking"} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-foreground">
              {MY_AGENT.name} × {conversation.otherAgentName}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {MY_AGENT.human} · {conversation.otherHuman} ({conversation.otherRole})
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <CompatibilityMeter score={compatibility} />
            <button
              onClick={() => setGuideOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-foreground/80 hover:bg-white/[0.08]"
            >
              <Compass className="h-3.5 w-3.5" /> Guide my agent
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between md:hidden">
          <CompatibilityMeter score={compatibility} />
          <button
            onClick={() => setGuideOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-foreground/80"
          >
            <Compass className="h-3 w-3" /> Guide
          </button>
        </div>
      </div>

      {/* Pending proposal banner */}
      {showProposal && (
        <div className="border-b border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-center text-xs text-emerald-200">
          Your agent thinks you should meet {conversation.otherHuman}. Review the proposal below.
        </div>
      )}

      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {allMessages.map((m) => (
            <div key={m.id} className="flex flex-col gap-2">
              <AgentBubble
                from={m.from}
                name={m.from === "mine" ? MY_AGENT.name : conversation.otherAgentName}
                text={m.text}
                time={m.time}
                hue={m.from === "mine" ? MY_AGENT.hue : conversation.otherHue}
              />
              {m.insight && (
                <div className="flex justify-center">
                  <InsightChip text={m.insight} />
                </div>
              )}
            </div>
          ))}
          {typing && <TypingBubble name={conversation.otherAgentName} hue={conversation.otherHue} />}

          {conversation.status === "ended_no_fit" && (
            <div className="mx-auto mt-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-xs text-muted-foreground">
              Conversation ended. Your agent noted the reasoning and will use it next time.
            </div>
          )}

          {conversation.status === "scheduled" && (
            <div className="mx-auto mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-xs text-emerald-200">
              ✓ Meeting on the calendar. You'll get a reminder 15 minutes before.
            </div>
          )}

          {showProposal && <MeetingProposalCard conversation={conversation} />}
        </div>
      </div>

      <GuideAgentPanel
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        agentName={conversation.otherAgentName}
      />
    </div>
  );
}
