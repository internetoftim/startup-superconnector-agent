import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/agent-profile")({
  head: () => ({
    meta: [
      { title: "Your Agent Profile — Superconnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgentProfilePage,
});

function AgentProfilePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Your agent is ready
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This is where your agent's profile will live — coming soon.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
