import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Superconnect" },
      { name: "description", content: "Your AI agent is being created." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Building your AI agent…</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This is a placeholder onboarding screen. Real OAuth and agent training flow will live here.
        </p>
        <Link
          to="/auth"
          className="mt-8 inline-flex items-center justify-center rounded-md border border-border bg-secondary/40 px-4 py-2 text-sm font-medium hover:bg-secondary/70"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
