import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AgentAvatar } from "@/components/conversations/AgentAvatar";

export const Route = createFileRoute("/agent-profile")({
  head: () => ({
    meta: [
      { title: "Your Agent Profile — Superconnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgentProfilePage,
});

type UserType = "startup" | "investor";

type StoredOnboarding = {
  userType: UserType;
  answers: Record<string, string>;
};

type AgentProfileData = {
  name: string;
  hue: number;
  headline: string;
  pitch: string;
  tags: string[];
};

function hashHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

function splitTags(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/,| and |\/|;/i)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function buildProfile(stored: StoredOnboarding | null): AgentProfileData {
  if (!stored) {
    return {
      name: "Your Agent",
      hue: 210,
      headline: "Ready to represent you",
      pitch: "Complete onboarding to sharpen what your agent looks for.",
      tags: [],
    };
  }

  const { userType, answers } = stored;

  if (userType === "startup") {
    const sector = answers.sector ?? "your space";
    return {
      name: "Your Agent",
      hue: hashHue(sector),
      headline: `${answers.stage ?? "Early-stage"} founder · raising ${answers.amount ?? "TBD"}`,
      pitch: answers.pitch ?? "Building something worth backing.",
      tags: [...splitTags(sector), answers.support ?? ""].filter(Boolean),
    };
  }

  const sectors = answers.sectors ?? "emerging sectors";
  return {
    name: "Your Agent",
    hue: hashHue(sectors),
    headline: `${answers.stage ?? "Early-stage"} investor · ${answers.check ?? "check size TBD"}`,
    pitch: answers.founder ?? "Looking for founders worth backing.",
    tags: [...splitTags(sectors), answers.handson ?? ""].filter(Boolean),
  };
}

function AgentProfilePage() {
  const navigate = useNavigate();
  const [compiling, setCompiling] = useState(true);
  const [profile, setProfile] = useState<AgentProfileData | null>(null);

  useEffect(() => {
    let stored: StoredOnboarding | null = null;
    try {
      const raw = sessionStorage.getItem("sc:onboardingAnswers");
      if (raw) stored = JSON.parse(raw);
    } catch {}

    const built = buildProfile(stored);
    const t = setTimeout(() => {
      setProfile(built);
      setCompiling(false);
    }, 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md text-center">
        {compiling || !profile ? (
          <>
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10">
              <Sparkles className="h-6 w-6 animate-pulse text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Compiling your agent profile…
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Turning what you shared into something your agent can act on.
            </p>
          </>
        ) : (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Your agent is ready
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Here's how it will represent you in conversations.
            </p>

            <div className="relative mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 text-left shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative flex items-center gap-3">
                <AgentAvatar hue={profile.hue} size={56} pulse />
                <div>
                  <h2 className="text-base font-semibold text-foreground">{profile.name}</h2>
                  <p className="text-xs text-muted-foreground">{profile.headline}</p>
                </div>
              </div>

              <p className="relative mt-5 text-sm leading-relaxed text-foreground/90">
                {profile.pitch}
              </p>

              {profile.tags.length > 0 && (
                <div className="relative mt-5 flex flex-wrap gap-1.5">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted/40 px-2.5 py-1 text-xs text-foreground/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate({ to: "/conversations" })}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
            >
              See my agent's conversations
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/"
              className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground"
            >
              Back home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
