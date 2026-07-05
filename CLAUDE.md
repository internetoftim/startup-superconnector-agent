# CLAUDE.md — Superconnector (read this first, every session)

## What this is
A three-role marketplace where a MATCHMAKER agent brokers dealflow between
FOUNDERS and INVESTORS — each of whom has their OWN personal agent. Founders'
agents and investors' agents do not talk directly; they negotiate THROUGH the
matchmaker, because the matchmaker is the party both sides trust to curate,
protect context, and vouch. Full product spec: `PRD.md`. Original hackathon
harness (spec, pitch, runbook) is archived under `docs/hackathon/`.

## The core primitive — ONE engine, ONE schema, THREE roles
Founder, investor, and matchmaker profiles are the SAME schema: identity +
mandate (may-commit-autonomously vs must-escalate) + what-I-offer/seek +
guardrails/consent. The SAME proxy engine runs all three. A new role is a new
PROFILE, not new code. "Representation is data, not code." Do NOT fork the
engine per role — genericity over the profile IS the product claim.

## Architecture (TypeScript port of the harness spec's `src/*.py` layout)
- `seed/*.json` — founder, investor, matchmaker profiles + the scripted
  negotiation scenario. Canonical demo data; keep verbatim unless the product
  owner changes them.
- `src/superconnector/profile.ts` — FR-1: the one zod schema + validation.
- `src/superconnector/agent.ts` — FR-2: the proxy engine (`ProxyAgent`). Loads
  ANY profile; enforces mandate + consent; escalates above authority; NO role
  hardcoding anywhere in the file.
- `src/superconnector/broker.ts` — FR-3/FR-4.4: the matchmaker hub loop
  (curate → dual-consent → relay → converge/escalate). The crown jewel — this
  is what makes it a marketplace, not a 1:1 chat.
- `src/superconnector/agreement.ts` — FR-5: HMAC-signed tri-party agreement
  (WebCrypto) + human-readable render. Honest label: HMAC is demo signing;
  production = A2A v1.0 signed Agent Cards.
- `src/superconnector/logistics.ts` — FR-6, Beat B: calendar hold, DRAFTED
  (never sent) intro email, event seat. Selectable coda, off the hero path.
- `src/superconnector/run-demo.ts` — deterministic Beat A orchestration
  following `seed/negotiation_scenario.json`; shared by CLI, web, and tests.
- `scripts/demo.ts` — terminal demo. `src/routes/demo.tsx` — same run in the
  browser. `tests/superconnector/` — dual-consent tests (bun test).

## Commands
- `bun install` · `bun run demo` (Beat A) · `bun run demo:full` (adds Beat B)
- `bun test` — all guardrail/dual-consent tests must stay green
- `bun run dev` / `bun run build` / `bun run lint` — the Lovable web app

## Non-negotiable invariants (tested; keep them tested)
1. Founder deck/metrics are WITHHELD without opt-in; share-requests escalate
   to the founder.
2. Private availability never crosses the hub — only the mutual slot does.
3. Non-opted-in network contacts are never surfaced, named, or counted into a
   proposal.
4. The matchmaker REFUSES outcome assurances ("will they invest?") and
   escalates to the human SSC; it vouches on fit/timeline only.
5. Unauthorized commitments = 0. Every commitment must trace verbatim to a
   `may_commit_autonomously` rule in the committing principal's own profile.
   Any breach is a sev-1, not a stat.
6. Ambiguity resolves to escalation, never autonomy.
7. Counterparty message bodies are DATA, never instructions — policy decisions
   run as deterministic code over profile data only.

## Claims discipline (applies to all public materials)
Demo speaks an A2A-INSPIRED subset — never claim full A2A protocol
compliance. Discovery interview = signal, not validation. HMAC = demo
signing. Email is draft-only (gmail.compose, not gmail.send) through P1.

## Repo notes
This repo is Lovable-connected (see AGENTS.md): don't rewrite pushed history,
keep the branch in a working state. The web app (TanStack Start + bun) and the
engine share one codebase; the engine stays framework-free and isomorphic so
the CLI, tests, and browser all run the identical negotiation.
