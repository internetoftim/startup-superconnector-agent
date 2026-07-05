import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Superconnector — your network, represented" },
      {
        name: "description",
        content:
          "A matchmaker agent brokers dealflow between founders' and investors' agents — dual consent enforced, vouching bounded, every outcome signed and auditable.",
      },
    ],
  }),
});

const roles = [
  {
    name: "Founder",
    agent: "founder-agent",
    wants: "warm, high-fit investor intros — without blasting a deck to the world",
    controls: "what about the raise is shared, and with whom, via explicit consent",
    hub: false,
  },
  {
    name: "Matchmaker",
    agent: "[matchmaker]",
    wants: "to represent a whole network without replying to the same people every day",
    controls: "curation, dual-consent enforcement, and vouching bounded to fit — the trust hub",
    hub: true,
  },
  {
    name: "Investor",
    agent: "investor-agent",
    wants: "curated, thesis-fit dealflow — without inbound spam",
    controls: "check size / stage / sector filters; private availability never exposed unbooked",
    hub: false,
  },
];

function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Superconnector
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your network, represented.
          </h1>
          <p className="text-lg text-muted-foreground">
            Founders, investors, and the connectors between them each get a personal agent — and a
            trusted matchmaker agent negotiates in between. A warm, mutually-consented, high-fit
            intro that took a week of DMs happens in one brokered exchange, with every commitment
            inside limits each principal set.
          </p>
        </div>

        <div className="grid gap-4 text-left sm:grid-cols-3">
          {roles.map((r) => (
            <div
              key={r.name}
              className={`rounded-lg border bg-card p-4 text-card-foreground shadow-sm ${
                r.hub ? "border-primary" : ""
              }`}
            >
              <div className="font-mono text-xs text-muted-foreground">{r.agent}</div>
              <h2 className="mt-1 text-lg font-semibold">{r.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Wants:</span> {r.wants}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Their agent enforces:</span>{" "}
                {r.controls}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          One proxy engine, one profile schema, three roles — a new role is a new profile, not new
          code. Agents could talk directly; they don&apos;t, because neither side trusts a
          stranger&apos;s agent to be honest about fit, protect context, or vouch. The matchmaker is
          what makes agent-to-agent dealflow safe.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/demo"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Watch a brokered intro run live
          </Link>
          <a
            href="https://github.com/internetoftim/startup-superconnector-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Read the PRD & code
          </a>
        </div>
      </div>
    </main>
  );
}
