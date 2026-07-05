import { createFileRoute, Link } from "@tanstack/react-router";
import { LoginCard } from "@/components/auth/LoginCard";
import { NetworkGraphic } from "@/components/auth/NetworkGraphic";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Superconnect" },
      {
        name: "description",
        content:
          "Sign in to Superconnect. Your personal AI agent negotiates with other agents to find the right startup–investor match.",
      },
      { property: "og:title", content: "Sign in — Superconnect" },
      {
        property: "og:description",
        content:
          "The era of cold emails is over. Let your AI agent find the right connection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left / brand pane */}
        <section className="relative hidden overflow-hidden border-r border-border/40 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <NetworkGraphic />
          <div className="relative">
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/20 text-primary ring-1 ring-primary/40">
                ◆
              </span>
              Superconnect
            </Link>
          </div>
          <div className="relative max-w-md">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground">
              Your AI agent finds{" "}
              <span className="bg-gradient-to-r from-primary to-accent-glow bg-clip-text text-transparent">
                the right connection.
              </span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              The era of cold emails is over. Agents negotiate on your behalf — you show up only for
              the meetings that matter.
            </p>
            <div className="mt-8 flex items-center gap-6 text-xs uppercase tracking-widest text-muted-foreground">
              <span>Trusted by founders & VCs</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </div>
          <div className="relative text-xs text-muted-foreground">
            © {new Date().getFullYear()} Superconnect
          </div>
        </section>

        {/* Right / login pane */}
        <section className="relative flex items-center justify-center px-6 py-12 sm:px-10">
          {/* Mobile-only ambient background */}
          <div className="pointer-events-none absolute inset-0 lg:hidden">
            <NetworkGraphic />
          </div>
          <div className="relative flex w-full flex-col items-center">
            <Link
              to="/"
              className="mb-8 flex items-center gap-2 text-sm font-semibold tracking-tight lg:hidden"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/20 text-primary ring-1 ring-primary/40">
                ◆
              </span>
              Superconnect
            </Link>
            <LoginCard />
          </div>
        </section>
      </div>
    </main>
  );
}
