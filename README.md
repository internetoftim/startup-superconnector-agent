# Superconnector — your network, represented

A three-role marketplace where a **matchmaker agent** brokers dealflow between
**founders** and **investors**, each represented by their own personal agent.
The spokes never talk directly: the matchmaker is the party both sides trust
to curate fit, protect private context, and vouch — so a warm, mutually
consented, high-fit intro that took a week of DMs happens in one brokered
exchange between three agents, ending in a signed, auditable tri-party
agreement.

Full product spec: [PRD.md](./PRD.md) · engineering spec: [CLAUDE.md](./CLAUDE.md) ·
original hackathon harness (pitch, runbook, office-hours prep): [docs/hackathon/](./docs/hackathon/)

## Quickstart

```sh
bun install
bun run demo        # Beat A: founder-agent → [MATCHMAKER] → investor-agent → signed agreement
bun run demo:full   # + Beat B: calendar hold, DRAFTED intro email, event seat
bun test            # dual-consent + guardrail suite
bun run dev         # the web app — the same run renders at /demo
```

The demo is deterministic and fully offline: every policy decision (consent,
mandate, screening, withholding, escalation) is code over the seed profiles,
not model output. The CLI, the browser demo, and the tests all execute the
identical negotiation.

## What the demo shows (and the tests pin)

1. **Consent is structural** — the founder shares a public one-liner +
   traction headline ONLY; the investor's deck request is **withheld** and
   escalated to the founder as a share-request.
2. **Availability is protected** — both raw calendars stay inside the hub;
   only the single mutually-open slot ever crosses.
3. **Non-opted-in contacts are never surfaced** — excluded before matching,
   never named anywhere in the transcript or agreement.
4. **Vouching is bounded** — "will they actually invest?" is **refused** and
   escalated to the human SSC; the matchmaker vouches on fit and
   timeline-understanding only.
5. **Zero unauthorized commitments** — every commitment in the signed
   agreement traces verbatim to a `may_commit_autonomously` rule in that
   principal's own profile. Ambiguity always escalates.

## The core primitive

**One engine, one schema, three roles.** `seed/founder_profile.json`,
`seed/investor_profile.json`, and `seed/matchmaker_profile.json` all validate
against the same representation-profile schema (identity + mandate +
offer/seek + guardrails), and the same `ProxyAgent` engine runs all three. A
new role is a new profile, not new code.

| Module                            | Requirement  | What it does                                                            |
| --------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `src/superconnector/profile.ts`   | FR-1         | one zod schema + validation for all roles                               |
| `src/superconnector/agent.ts`     | FR-2         | generic proxy engine: mandate, consent allowlist serializer, escalation |
| `src/superconnector/broker.ts`    | FR-3, FR-4.4 | matchmaker hub loop: curate → dual-consent → relay → converge/escalate  |
| `src/superconnector/agreement.ts` | FR-5         | HMAC-signed tri-party agreement + human-readable render                 |
| `src/superconnector/logistics.ts` | FR-6         | Beat B: calendar hold, drafted email, seat (mocked)                     |
| `src/superconnector/run-demo.ts`  | —            | deterministic orchestration of `seed/negotiation_scenario.json`         |

## Honesty labels

- The agents speak an **A2A-inspired message subset** — this is not full A2A
  v1.0 protocol compliance; production rides A2A with signed Agent Cards.
- Agreement signatures are **HMAC-SHA256 demo signatures** with locally
  derived keys, standing in for real per-party key custody.
- Logistics integrations are **mocked**; at P1 email ships as
  `gmail.compose` (drafts a human reviews) — never unsolicited sends.
- The discovery interview grounding the problem is **a signal, not
  validation**.
- Mandate matching is **keyword-scored over the principal's own wording** with
  a hard default: unrecognised phrasing degrades to escalation, never to
  autonomy. A mandate DSL replaces it at P1.
- Known P0 simplifications: structured counter-proposals (alternate slots or
  terms relayed spoke-to-spoke) and check-size screening land at P1 — today a
  decline/withhold/refusal always routes through escalation, and asks carry no
  raise amount to screen against.

## Web app

The repo is a Lovable-connected TanStack Start app: `/` is the product
landing, `/demo` runs the brokered negotiation in your browser with the
transcript, guardrail hits, escalation queue, and signed agreement rendered
live. See `AGENTS.md` for Lovable workflow constraints.
