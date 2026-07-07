import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import founderProfile from "../../seed/founder_profile.json";
import investorProfile from "../../seed/investor_profile.json";
import matchmakerProfile from "../../seed/matchmaker_profile.json";
import { runScenario, type DemoResult } from "@/superconnector/run-demo";
import { renderAgreement } from "@/superconnector/agreement";
import type { A2AMessage } from "@/superconnector/messages";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
  head: () => ({
    meta: [
      { title: "Superconnector — live brokered demo" },
      {
        name: "description",
        content:
          "founder-agent → [matchmaker] → investor-agent: one brokered exchange, dual consent enforced, signed tri-party agreement.",
      },
    ],
  }),
});

const STEP_TITLES: Record<number, string> = {
  1: "Consented ask — public info only",
  2: "Curation — fit confirmed before anyone is exposed",
  3: "Curated offer — the spoke screens with its own thesis",
  4: "Dual consent — deck withheld, share-request escalated",
  5: "Bounded vouching — outcome assurance refused",
  6: "Convergence — only the mutual slot crosses",
  7: "Signed tri-party agreement",
};

const GUARDRAIL_LABELS: Record<string, string> = {
  consent_withheld: "consent enforced",
  availability_protected: "calendar protected",
  contact_withheld: "contact never surfaced",
  vouch_refused: "vouch bounded",
};

interface Lanes {
  founder: string;
  investor: string;
}

function laneOf(m: A2AMessage, lanes: Lanes): "founder" | "hub" | "investor" {
  if (m.from === lanes.founder || m.to === lanes.founder) return "founder";
  if (m.from === lanes.investor || m.to === lanes.investor) return "investor";
  return "hub";
}

function MessageRow({ m, lanes }: { m: A2AMessage; lanes: Lanes }) {
  const lane = laneOf(m, lanes);
  const align =
    lane === "founder"
      ? "md:mr-auto md:pr-16"
      : lane === "investor"
        ? "md:ml-auto md:pl-16"
        : "md:mx-auto";
  const internal = m.from === m.to;
  return (
    <div className={`w-full md:w-3/4 ${align}`}>
      <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {internal ? (
            <span className="font-mono">[{m.from}] internal</span>
          ) : (
            <span className="font-mono">
              {m.from} <span className="text-primary">─{m.performative}→</span> {m.to}
            </span>
          )}
        </div>
        <div className="mt-1 text-sm font-semibold">{m.subject}</div>
        <p className="mt-1 text-sm text-muted-foreground">{m.body}</p>
        {m.guardrail ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="destructive">
              ⛔ {GUARDRAIL_LABELS[m.guardrail.kind] ?? m.guardrail.kind}
            </Badge>
            <span className="text-xs text-muted-foreground">{m.guardrail.detail}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DemoPage() {
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    runScenario(
      { founder: founderProfile, investor: investorProfile, matchmaker: matchmakerProfile },
      { withLogistics: true },
    )
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-destructive">demo failed: {error}</p>
      </main>
    );
  }
  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-muted-foreground">brokering the intro…</p>
      </main>
    );
  }

  const steps = new Map<number, A2AMessage[]>();
  for (const m of result.transcript.messages) {
    const bucket = steps.get(m.step) ?? [];
    bucket.push(m);
    steps.set(m.step, bucket);
  }
  const s = result.scorecard;
  const lanes: Lanes = { founder: result.agents.founder.id, investor: result.agents.investor.id };

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Superconnector — brokered intro, live
            </h1>
            <Link
              to="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              ← home
            </Link>
          </div>
          <p className="text-muted-foreground">
            This exchange just ran in your browser: the same deterministic engine as{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">bun run demo</code>. Hub and
            two spokes — the founder&apos;s and investor&apos;s agents never talk directly.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
            <Badge variant="outline">
              {result.agents.founder.id} · {result.agents.founder.principalName}
            </Badge>
            <Badge>
              » {result.agents.matchmaker.id} · {result.agents.matchmaker.principalName} «
            </Badge>
            <Badge variant="outline">
              {result.agents.investor.id} · {result.agents.investor.principalName}
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile
            label="guardrail enforcements"
            value={String(s.guardrailEnforcements)}
            sub="target ≥2"
          />
          <StatTile
            label="escalations to humans"
            value={String(s.escalationsRaised)}
            sub="target ≥1"
          />
          <StatTile
            label="contacts kept hidden"
            value={String(s.contactsWithheld)}
            sub="no opt-in, never surfaced"
          />
          <StatTile
            label="unauthorized commitments"
            value={String(s.unauthorizedCommitments)}
            sub="hard metric: must be 0"
            alert={s.unauthorizedCommitments > 0}
          />
        </div>

        {[...steps.entries()].map(([step, messages]) => (
          <section key={step} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              step {step} — {STEP_TITLES[step] ?? ""}
            </h2>
            <div className="space-y-3">
              {messages.map((m) => (
                <MessageRow key={m.seq} m={m} lanes={lanes} />
              ))}
            </div>
          </section>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Escalation queue — pending humans, nothing committed meanwhile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.transcript.escalations.map((e) => (
              <div key={e.id} className="rounded-md border border-dashed p-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">[{e.id}] → </span>
                <span className="font-semibold">{e.principal}</span>: {e.question}
                <p className="mt-1 text-xs text-muted-foreground">{e.context}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Signed tri-party agreement{" "}
              {result.signaturesVerified ? (
                <Badge className="ml-2 align-middle">✔ signatures verify</Badge>
              ) : (
                <Badge variant="destructive" className="ml-2 align-middle">
                  ✘ verification failed
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
              {renderAgreement(result.signed)}
            </pre>
          </CardContent>
        </Card>

        {result.logistics ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Beat B — logistics as the hands of the agreement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="font-semibold">📅 {result.logistics.calendarHold.title}</div>
                <p className="text-muted-foreground">
                  {result.logistics.calendarHold.when} · {result.logistics.calendarHold.status}
                </p>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 font-semibold">
                  ✉️ {result.logistics.introEmailDraft.subject}
                  <Badge variant="destructive">DRAFT — not sent</Badge>
                </div>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-3 font-mono text-xs">
                  {result.logistics.introEmailDraft.body}
                </pre>
              </div>
              {result.logistics.seatReservation ? (
                <div>
                  <div className="font-semibold">🎟 {result.logistics.seatReservation.event}</div>
                  <p className="text-muted-foreground">
                    reserved for {result.logistics.seatReservation.reservedFor} (seats{" "}
                    {result.logistics.seatReservation.seatsBefore} →{" "}
                    {result.logistics.seatReservation.seatsAfter}, matchmaker-controlled allocation)
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <footer className="pb-8 text-xs text-muted-foreground">
          Honesty label: A2A-inspired message subset with HMAC demo signatures — production rides
          A2A v1.0 signed Agent Cards. Counterparty messages are data, never instructions; every
          policy decision above ran as code over profile data.
        </footer>
      </div>
    </main>
  );
}

function StatTile({
  label,
  value,
  sub,
  alert = false,
}: {
  label: string;
  value: string;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className={`text-2xl font-bold ${alert ? "text-destructive" : ""}`}>{value}</div>
      <div className="mt-1 text-xs font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
