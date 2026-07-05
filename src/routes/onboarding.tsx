import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ChatBubble } from "@/components/onboarding-chat/ChatBubble";
import { TypingIndicator } from "@/components/onboarding-chat/TypingIndicator";
import { QuickReplyChips } from "@/components/onboarding-chat/QuickReplyChips";
import { ProgressIndicator } from "@/components/onboarding-chat/ProgressIndicator";
import { Sparkles, ArrowRight, SendHorizontal } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Superconnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingChat,
});

type UserType = "startup" | "investor";

type Question = {
  id: string;
  prompt: string;
  type: "text" | "choice";
  options?: string[];
  placeholder?: string;
};

const STARTUP_QUESTIONS: Question[] = [
  {
    id: "stage",
    prompt: "First things first — what stage is your company at?",
    type: "choice",
    options: ["Pre-seed", "Seed", "Series A", "Series B+"],
  },
  {
    id: "amount",
    prompt: "How much are you looking to raise?",
    type: "choice",
    options: ["< $500K", "$500K–$2M", "$2M–$10M", "$10M+"],
  },
  {
    id: "sector",
    prompt: "What industry or sector are you building in?",
    type: "text",
    placeholder: "e.g. AI infrastructure, fintech, climate…",
  },
  {
    id: "support",
    prompt: "Beyond capital, what kind of support matters most to you?",
    type: "choice",
    options: ["Mentorship", "Intros to customers", "Hiring help", "Just capital"],
  },
  {
    id: "pitch",
    prompt: "Give me your one-line pitch — how would you describe what you do?",
    type: "text",
    placeholder: "We help X do Y so they can Z.",
  },
];

const INVESTOR_QUESTIONS: Question[] = [
  {
    id: "stage",
    prompt: "Which stages do you typically invest in?",
    type: "choice",
    options: ["Pre-seed", "Seed", "Series A", "Growth"],
  },
  {
    id: "check",
    prompt: "What's your typical check size?",
    type: "choice",
    options: ["< $100K", "$100K–$500K", "$500K–$2M", "$2M+"],
  },
  {
    id: "sectors",
    prompt: "Which sectors are you most excited about right now?",
    type: "text",
    placeholder: "e.g. AI, dev tools, consumer health…",
  },
  {
    id: "handson",
    prompt: "How hands-on do you like to be with portfolio companies?",
    type: "choice",
    options: ["Very hands-on", "Available when asked", "Mostly hands-off"],
  },
  {
    id: "founder",
    prompt: "What do you look for in a founder?",
    type: "text",
    placeholder: "Traits, background, signals you weight most…",
  },
];

type Message =
  | { id: string; role: "agent"; text: string }
  | { id: string; role: "user"; text: string };

function OnboardingChat() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>("startup");
  const [messages, setMessages] = useState<Message[]>([]);
  const [index, setIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initedRef = useRef(false);

  const questions = userType === "startup" ? STARTUP_QUESTIONS : INVESTOR_QUESTIONS;
  const total = questions.length;
  const current = questions[index];

  // Load user type from login
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sc:userType");
      if (stored === "investor" || stored === "startup") setUserType(stored);
    } catch {}
  }, []);

  // Kick off intro + first question
  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const intro =
      userType === "startup"
        ? "Hey — I've got a good sense of who you are from your profile. Now I just need a bit more from you to know exactly what to look for."
        : "Hey — I've read through your profile. Now let me ask a few questions so I know exactly what deals to bring you.";

    const t1 = setTimeout(() => {
      setMessages([{ id: "intro", role: "agent", text: intro }]);
      setTyping(true);
    }, 700);
    const t2 = setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `q-${questions[0].id}`, role: "agent", text: questions[0].prompt },
      ]);
    }, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [userType, questions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const advance = (answer: string) => {
    setAnswers((a) => ({ ...a, [current.id]: answer }));
    setMessages((m) => [...m, { id: `a-${current.id}`, role: "user", text: answer }]);
    setInput("");

    const nextIdx = index + 1;
    if (nextIdx >= total) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: "outro",
            role: "agent",
            text:
              "Got it — I have a much clearer picture of what you're looking for now. Let me put together your agent profile.",
          },
        ]);
        setDone(true);
      }, 1200);
      setIndex(nextIdx);
      return;
    }

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `q-${questions[nextIdx].id}`, role: "agent", text: questions[nextIdx].prompt },
      ]);
      setIndex(nextIdx);
    }, 1000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v || typing || done || !current) return;
    advance(v);
  };

  const showChoices = !done && !typing && current?.type === "choice";
  const showTextInput = !done && current?.type === "text";

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            Superconnect
          </div>
          <ProgressIndicator current={done ? total : index + 1} total={total} />
        </div>
      </header>

      {/* Chat */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        <div className="flex-1 space-y-4">
          {messages.map((m) => (
            <ChatBubble key={m.id} role={m.role}>
              {m.text}
            </ChatBubble>
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10">
                <span className="text-xs text-primary">◆</span>
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="sticky bottom-0 mt-6 space-y-3 bg-background/80 pt-4 pb-6 backdrop-blur-md">
          {showChoices && current && (
            <QuickReplyChips options={current.options ?? []} onSelect={advance} />
          )}

          {done ? (
            <button
              onClick={() => navigate({ to: "/agent-profile" })}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
            >
              See my agent profile
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            showTextInput && (
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={current?.placeholder ?? "Type your answer…"}
                  disabled={typing}
                  className="flex-1 rounded-full border border-border/60 bg-card/60 px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-md focus:border-primary/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  aria-label="Send"
                >
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </main>
  );
}
