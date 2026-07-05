import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Hackathon Project" },
      { name: "description", content: "A fresh project ready for your next hackathon idea." },
    ],
  }),
});

function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Hackathon Project
        </h1>
        <p className="text-lg text-muted-foreground">
          A blank canvas for your next big idea. Start building something amazing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/auth"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </a>
          <a
            href="https://docs.lovable.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Read the docs
          </a>
        </div>
      </div>
    </main>
  );
}
