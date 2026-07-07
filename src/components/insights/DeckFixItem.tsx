import type { DeckFix, Severity } from "@/lib/insights-data";

const severityStyles: Record<Severity, string> = {
  Critical: "border-primary/40 bg-primary/8 text-primary",
  Important: "border-border bg-secondary text-foreground",
  Polish: "border-border bg-transparent text-muted-foreground",
};

export function DeckFixItem({ fix }: { fix: DeckFix }) {
  return (
    <li className="grid grid-cols-1 gap-4 border-b border-border py-6 last:border-b-0 md:grid-cols-[180px_1fr_auto] md:items-start md:gap-8">
      <div>
        <span className="inline-flex items-center rounded-sm border border-border bg-secondary px-2 py-1 font-serif text-xs text-foreground">
          {fix.slide}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-[15px] leading-relaxed text-foreground">
          <span className="font-medium">The problem. </span>
          <span className="text-muted-foreground">{fix.problem}</span>
        </p>
        <p className="text-[15px] leading-relaxed text-foreground">
          <span className="font-medium">The fix. </span>
          {fix.fix}
        </p>
      </div>

      <div className="md:pt-1">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] ${severityStyles[fix.severity]}`}
        >
          {fix.severity}
        </span>
      </div>
    </li>
  );
}
