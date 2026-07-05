import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/confirmation")({
  head: () => ({
    meta: [
      { title: "Setting up your agent — Superconnector" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile created — your agent is being set up
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We're training your AI agent on the details you shared. Hang tight.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Preparing your agent…
        </div>
      </div>
    </main>
  );
}
