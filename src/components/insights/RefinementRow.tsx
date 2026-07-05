import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import type { Refinement } from "@/lib/insights-data";

export function RefinementRow({ refinement }: { refinement: Refinement }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="font-serif text-xl leading-snug text-foreground md:text-2xl">
          {refinement.thesis}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="pb-8 pr-10 animate-in fade-in duration-200">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {refinement.reasoning}
          </p>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Supported by
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {refinement.supportingConversations.map((c) => (
                <li
                  key={c}
                  className="rounded-sm border border-border bg-secondary px-2.5 py-1 font-serif text-xs text-foreground"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-6 inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-sm font-medium text-foreground transition-opacity hover:opacity-70">
            <MessageSquare className="h-4 w-4" />
            Discuss with my agent
          </button>
        </div>
      )}
    </div>
  );
}
