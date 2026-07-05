import { createFileRoute, Link } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import {
  INSIGHTS_META,
  OBJECTIONS,
  DECK_FIXES,
  REFINEMENTS,
} from "@/lib/insights-data";
import { StatsRow } from "@/components/insights/StatsRow";
import { ObjectionCard } from "@/components/insights/ObjectionCard";
import { DeckFixItem } from "@/components/insights/DeckFixItem";
import { RefinementRow } from "@/components/insights/RefinementRow";
import { Sparkline } from "@/components/insights/Sparkline";

export const Route = createFileRoute("/insights")({
  codeSplitGroupings: [],
  head: () => ({
    meta: [
      { title: "Insights — Superconnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-serif text-lg text-foreground">
            Superconnect
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/conversations" className="hover:text-foreground">
              Conversations
            </Link>
            <span className="text-foreground">Insights</span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-32 pt-16 md:pt-24">
        {/* Section 1 — Header */}
        <section>
          <p className="font-serif text-sm italic text-muted-foreground">
            A briefing for {INSIGHTS_META.company}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-6xl">
            What investors are telling your agent
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Synthesized from {INSIGHTS_META.conversationsAnalyzed} conversations
            with investor agents over the last {INSIGHTS_META.periodDays} days.
          </p>

          <StatsRow
            stats={[
              { label: "Conversations analyzed", value: INSIGHTS_META.conversationsAnalyzed },
              { label: "Common objections", value: INSIGHTS_META.commonObjections },
              { label: "Deck issues flagged", value: INSIGHTS_META.deckIssues },
              { label: "Period", value: `${INSIGHTS_META.periodDays} days` },
            ]}
          />
        </section>

        {/* Section 2 — Key objections */}
        <section className="mt-24">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              The big picture
            </h2>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Key objections
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Ranked by how many investor agents raised each one, unprompted.
          </p>

          <div className="mt-10 space-y-6">
            {OBJECTIONS.map((o, i) => (
              <ObjectionCard key={o.id} objection={o} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* Section 3 — Deck fixes */}
        <section className="mt-24">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Fix these in your deck
            </h2>
            <button className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate suggestions
            </button>
          </div>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Slide-level recommendations, ordered by impact on your round narrative.
          </p>

          <ul className="mt-8 border-t border-border">
            {DECK_FIXES.map((f) => (
              <DeckFixItem key={f.id} fix={f} />
            ))}
          </ul>
        </section>

        {/* Section 4 — Business refinements */}
        <section className="mt-24">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            Bigger questions worth considering
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Strategic patterns we noticed across the feedback. Not deck fixes —
            deeper choices about the shape of the business.
          </p>

          <div className="mt-8 border-t border-border">
            {REFINEMENTS.map((r) => (
              <RefinementRow key={r.id} refinement={r} />
            ))}
          </div>
        </section>

        {/* Section 5 — Momentum footer */}
        <section className="mt-24 rounded-lg border border-border bg-card p-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Momentum
              </p>
              <p className="mt-3 font-serif text-xl leading-snug text-foreground md:text-2xl">
                Since your last deck revision, objections about pricing dropped{" "}
                <span className="text-primary">40%</span>.
              </p>
            </div>
            <Sparkline values={[8, 7, 7, 6, 5, 4, 3]} width={120} height={40} />
          </div>
        </section>
      </div>
    </main>
  );
}
