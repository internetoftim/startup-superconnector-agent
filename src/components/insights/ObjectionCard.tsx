import type { Objection } from "@/lib/insights-data";

export function ObjectionCard({
  objection,
  rank,
}: {
  objection: Objection;
  rank: number;
}) {
  const pct = Math.round((objection.raisedIn / objection.totalConversations) * 100);
  return (
    <article className="relative rounded-lg border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-baseline justify-between gap-6">
        <span className="font-serif text-sm text-muted-foreground">
          No. {String(rank).padStart(2, "0")}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {objection.raisedIn} of {objection.totalConversations} conversations
        </span>
      </div>

      <h3 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
        &ldquo;{objection.headline}&rdquo;
      </h3>

      <div className="mt-6 h-px w-full bg-border">
        <div
          className="h-px bg-primary"
          style={{ width: `${pct}%` }}
          aria-label={`Raised in ${pct}% of conversations`}
        />
      </div>

      <ul className="mt-6 space-y-4">
        {objection.quotes.map((q, i) => (
          <li
            key={i}
            className="border-l-2 border-border pl-4 text-[15px] leading-relaxed text-muted-foreground"
          >
            {q}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm leading-relaxed text-foreground/80">
        <span className="font-medium text-foreground">Why this matters. </span>
        {objection.whyItMatters}
      </p>
    </article>
  );
}
