import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AgentOrb } from "@/components/agent-learning/AgentOrb";
import { ProgressBar } from "@/components/agent-learning/ProgressBar";
import { StatusRotator } from "@/components/agent-learning/StatusRotator";

export const Route = createLazyFileRoute("/agent-l")({
  component: AgentLearningPage,
});

function AgentLearningPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 9000;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        setTimeout(() => navigate({ to: "/onboarding" }), 600);
      }
    }, 80);
    return () => clearInterval(id);
  }, [navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Initializing agent
        </div>

        <AgentOrb progress={progress} />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Building your{" "}
            <span className="bg-gradient-to-r from-primary to-accent-glow bg-clip-text text-transparent">
              AI agent
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            We're learning from your profile to represent you accurately.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <StatusRotator />
          <ProgressBar progress={progress} />
          <p className="text-xs text-muted-foreground">This usually takes less than a minute.</p>
        </div>
      </div>
    </main>
  );
}