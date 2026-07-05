import { useState } from "react";
import { AgentAvatar } from "@/components/conversations/AgentAvatar";
import type { Conversation } from "@/lib/conversations-data";
import { MY_AGENT } from "@/lib/conversations-data";
import { Check, X, Sparkles } from "lucide-react";

type State =
  | { kind: "pending" }
  | { kind: "accepted"; slot: string }
  | { kind: "declining" }
  | { kind: "declined"; reason: string };

const DECLINE_REASONS = ["Not the right stage", "Sector mismatch", "Timing", "Other"];

export function MeetingProposalCard({ conversation }: { conversation: Conversation }) {
  const [state, setState] = useState<State>({ kind: "pending" });
  const p = conversation.proposal!;

  return (
    <div className="relative mt-4">
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-70 blur-md"
        style={{
          background: `conic-gradient(from 90deg at 50% 50%, hsl(${conversation.otherHue} 80% 55% / 0.5), hsl(${MY_AGENT.hue} 90% 60% / 0.5), hsl(${conversation.otherHue} 80% 55% / 0.5))`,
        }}
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-center gap-3">
          <AgentAvatar hue={MY_AGENT.hue} size={44} />
          <div className="flex flex-col items-center">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{p.score}% fit</div>
          </div>
          <AgentAvatar hue={conversation.otherHue} size={44} />
        </div>

        <div className="text-center text-sm font-medium text-foreground">
          Meeting Proposal
        </div>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-foreground/75">{p.summary}</p>

        <ul className="mx-auto mt-4 max-w-md space-y-1.5 text-sm text-foreground/80">
          {p.reasons.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        {state.kind === "pending" && (
          <>
            <div className="mt-5">
              <div className="mb-2 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
                Suggested times
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {p.slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setState({ kind: "accepted", slot: s })}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-foreground/80 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={() => setState({ kind: "declining" })}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground/80 transition hover:bg-white/[0.06]"
              >
                <X className="h-4 w-4" /> Decline
              </button>
              <button
                onClick={() => setState({ kind: "accepted", slot: p.slots[0] })}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
              >
                <Check className="h-4 w-4" /> Accept & schedule
              </button>
            </div>
          </>
        )}

        {state.kind === "accepted" && (
          <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-center text-sm text-emerald-200">
            <div className="font-semibold">Meeting scheduled — {state.slot}</div>
            <div className="mt-1 text-emerald-200/80">
              Calendar invite sent to both humans.
            </div>
          </div>
        )}

        {state.kind === "declining" && (
          <div className="mt-5">
            <div className="mb-2 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
              Why not?
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {DECLINE_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setState({ kind: "declined", reason: r })}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-foreground/80 transition hover:bg-white/[0.08]"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.kind === "declined" && (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-foreground/80">
            Got it — "{state.reason}". Your agent will learn from this and refine future matches.
          </div>
        )}
      </div>
    </div>
  );
}
