# PRD — Superconnector

**Your network, represented.**

|                   |                                                             |
| ----------------- | ----------------------------------------------------------- |
| **Author**        | Tim Santos (acting CPO)                                     |
| **Status**        | Draft v1.0 — written day-of MVP demo (c0mpiled pt.3, Osaka) |
| **Date**          | 2026-07-05                                                  |
| **Product stage** | MVP (hackathon build) → seed-stage roadmap                  |

---

## 1. Overview

Superconnector is a **three-role marketplace** in which a **matchmaker agent**
brokers dealflow between **founders** and **investors** — each of whom has their
own personal agent. The three roles run **one proxy engine over one profile
schema**; only the mandate and content differ. Founders' and investors' agents
do not negotiate directly — they transact **through** the matchmaker, because the
matchmaker is the party both sides trust to curate fit, protect private context,
and vouch. A warm, mutually-consented, high-fit intro that took a week of DMs
becomes one brokered exchange between three agents, producing a signed,
auditable tri-party agreement.

This is _not_ outbound automation. The core claim is **brokered representation**:
each principal's agent enforces its own mandate, and the matchmaker in the middle
performs the irreducible trust work — curation, dual-consent enforcement, and
bounded vouching — that neither side's agent could do alone.

**Why the matchmaker isn't disintermediated by A2A:** a founder's and an
investor's agent _could_ talk directly; they don't, because neither trusts a
stranger's agent to be honest about fit, protect their context, or vouch. A2A
makes agent-to-agent dealflow possible; the trusted matchmaker is what makes it
_safe_. That is the platform's defensibility, and it only exists once founders
and investors are first-class users.

## 2. Problem

An SSC's value is their network; their bottleneck is their own attention.

**Primary evidence (signal, not validation):** discovery interview with a
startup event organiser recruiting ~200 investors — communications fragmented
across SMS, WhatsApp, and LinkedIn; responses missed; his words: most of his
time went to _"replying to the same people every day"_ instead of _"getting new
people."_ Corroborated by the founder's own experience organising 30+ AI events
and operating as an angel/scout/community builder.

**The structural insight:** a connector's real work is not sending messages —
it is _representing people's interests to each other_ under constraints. That
is a negotiation between two representatives, and it has just become
automatable: A2A v1.0 (Linux Foundation, 150+ member organisations, native in
the major clouds) means the counterparty increasingly has an agent too.

## 3. Target users (three first-class roles)

**Matchmaker — the SSC (keystone role, and the builder's own):** ecosystem
builders whose job is connection — angels, VC scouts, accelerator/community
leads, event organisers. High inbound ask volume, high channel-switching cost,
reputational stakes on every intro. Their agent is the trusted hub.

**Founder:** raising or hiring; wants warm, high-fit investor intros without
blasting a deck to the world. Their agent controls what about the raise/metrics
is shared, and with whom, via explicit consent.

**Investor:** wants curated, thesis-fit dealflow without inbound spam. Their
agent enforces check-size / stage / sector filters and protects private thesis
and availability until a fit is confirmed.

All three run the **same proxy engine over the same profile schema** — a new
role is a new profile, not new code. The marketplace is two-sided (founders ↔
investors) intermediated by the matchmaker, and remains useful before universal
agent adoption via graceful degradation (FR-4.3).

## 4. User stories (product owner input) & acceptance criteria

**US-1** — _As an SSC, I want a single point-of-contact agent that manages my
social network so that I don't waste time switching._
✅ AC: one agent surface; network, offerings, and preferences unified in one
representation profile; no per-channel context re-entry.

**US-2** — _As an SSC, I want the agent to represent me and be the intermediary
to other agents._
✅ AC: agent negotiates 1:1 with a counterparty agent on the principal's
behalf; enforces the principal's guardrails on every outbound commitment;
escalates anything above its mandate; produces a signed agreement.

**US-3** — _As an SSC, I want the agent to be able to easily create an event
and automatically do the necessary steps such as booking, email blasting, and
calendar coordination._
✅ AC (P1, reframed — see §6 Product Principles): given a brokered outcome or
an organiser instruction, the agent executes logistics — calendar holds,
**drafted** emails, seat reservations — as the _hands_ of an agreement, never
as unsolicited outbound.

> **CPO note on US-3:** "email blasting" is deliberately downgraded to
> _drafted, consent-based communications_. Positioning Superconnector as a
> blast tool would (a) collapse it into the crowded SDR category, (b) violate
> Product Principle 1, and (c) create platform/deliverability risk. The
> capability ships; the framing does not.

**US-4 (Founder)** — _As a founder, I want my own agent to get me warm,
high-fit investor intros through a trusted matchmaker, without exposing my deck
or metrics to people I haven't approved._
✅ AC: founder profile encodes consent state (public one-liner + traction
shareable; deck/metrics opt-in only); the matchmaker withholds anything
unconsented and escalates share-requests to the founder; the founder's agent
never auto-commits to amount, valuation, or terms.

**US-5 (Investor)** — _As an investor, I want curated, thesis-fit dealflow
through a matchmaker I trust, without inbound spam, and without exposing my
private availability or committing capital via an agent._
✅ AC: investor profile encodes a thesis filter (sector/stage/geo/check size);
the matchmaker only surfaces passing fits; the investor's agent protects private
availability (only a mutual slot is exposed) and escalates any "will you invest"
/ commitment question to the human.

**US-6 (Matchmaker/SSC)** — _As the matchmaker, I want my agent to broker
between founders' and investors' agents — curating fit, enforcing both sides'
consent, and vouching only within bounds._
✅ AC: matchmaker agent runs the hub loop (curate → dual-consent → relay →
converge); vouches on FIT/timeline-understanding only; REFUSES to assure
investment outcome and escalates it; produces a signed tri-party agreement
naming the matchmaker as broker-of-record.

## 5. Goals & non-goals

**Goals (this quarter)**

1. Prove the representation primitive: two proxies, two mandates, one signed
   agreement.
2. Make autonomy limits and consent _visible product behaviour_, not policy
   text.
3. Establish the portable representation profile as the data asset.

**Non-goals (explicitly out)**

- ❌ Outbound prospecting / cold outreach at any scale
- ❌ Full CRM replacement
- ❌ Multi-party (3+ principals) brokering (P2)
- ❌ Payments or investment execution of any kind
- ❌ Building a proprietary agent-comms protocol (we ride A2A)

## 6. Product principles

1. **Representation over automation.** The agent reconciles two principals'
   interests; it is never a one-sided blaster.
2. **Mandate-bounded autonomy.** Every profile declares what the agent may
   commit autonomously vs must escalate. Ambiguity resolves to escalation.
3. **Consent is structural.** Contacts carry opt-in flags; private details
   never cross without them. Enforced in code, not tone.
4. **Every outcome is auditable.** Agreements are signed and human-readable;
   both principals can verify what was committed.
5. **Degrade gracefully.** No counterparty agent → same proxy drafts for human
   channels. Single-player value from day one.
6. **Ride open standards.** A2A v1.0 for inter-agent transport and identity;
   we build the representation layer, not the plumbing.

## 7. Scope & phasing

### P0 — MVP (hackathon build, today) — status: **built (mocked integrations)**

- Representation profile as seeded JSON (identity, mandate, network with
  consent flags, offerings, guardrails)
- Hub-brokered negotiation: founder-agent → **matchmaker** → investor-agent
  over an **A2A-inspired message subset** (honest label: not full protocol
  compliance); matchmaker enforces dual-consent + bounded vouching
- Guardrail enforcement on every outbound commitment; visible escalation path
- HMAC-signed agreement with human-readable render
- CLI surfaces; selectable logistics coda (calendar proposal, drafted intro,
  seat reservation) against seed data

### P1 — Productionise the primitive (weeks 1–4)

- **GBrain as the profile memory layer:** the representation profile persists
  in GBrain; negotiation history enriches it (warmth, outcomes, follow-ups).
  GBrain is the natural home — the profile _is_ an organisational-brain
  fragment for one person.
- **GSuite as the execution layer (the agent's hands, post-agreement):**
  - Google Calendar: free/busy read + event creation for brokered meetings
  - Gmail: **`gmail.compose` (drafts) only — not `gmail.send`** at P1. The
    human reviews and sends. Graduation to send is a P2 decision gated on
    escalation-precision metrics (§9).
  - Google Contacts: read-only import as a network source for the profile
  - Minimal OAuth scopes; each scope tied to a named FR
- A2A v1.0 conformance for transport + signed Agent Cards (replacing HMAC)
- Graceful degradation: human-channel draft queue when no counterparty agent

### P2 — Expand the wedge (months 2–6)

- Event orchestration (US-3 full): agent stands up an event and runs
  attendance negotiation against invitee agents
- Multi-party brokering; discovery via an Agent Card directory
- Agreements with production-grade signatures; multi-tenant SaaS

## 8. Functional requirements (abridged)

| ID     | Requirement                                                                                                                                                             | Priority          | Status       |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
| FR-1   | Representation profile schema + validation (mandate, consent flags, guardrails)                                                                                         | P0                | Built        |
| FR-2   | Proxy engine runs as founder, investor, OR matchmaker from one codebase over one schema (no role hardcoding)                                                            | P0                | Built        |
| FR-3   | Matchmaker hub loop: curate → dual-consent check → relay proposal/counter between spoke agents → converge/escalate                                                      | P0                | Built        |
| FR-4   | Escalation queue; zero auto-commits above mandate                                                                                                                       | P0                | Built        |
| FR-4.3 | Human-channel draft fallback when counterparty has no agent                                                                                                             | P1                | Planned      |
| FR-4.4 | Dual-consent enforcement: neither side's private data (deck/metrics, availability) crosses without opt-in; matchmaker vouches on fit only, escalates outcome assurances | P0                | Built        |
| FR-5   | Signed TRI-PARTY agreement (founder, investor, matchmaker as broker-of-record; consented info; each commitment)                                                         | P0                | Built (HMAC) |
| FR-6   | Logistics execution post-agreement (calendar/draft/reserve)                                                                                                             | P0 coda / P1 real | Mocked       |
| FR-7   | GBrain profile persistence + history enrichment                                                                                                                         | P1                | Planned      |
| FR-8   | GSuite OAuth (calendar, gmail.compose, contacts.readonly)                                                                                                               | P1                | Planned      |
| FR-9   | Full audit log of negotiation turns + guardrail decisions                                                                                                               | P1                | Planned      |

## 9. Success metrics

**Demo day:** clean-run negotiation → agreement; ≥2 visible guardrail
enforcements (consent refusal, non-opted-in contact withheld); ≥1 visible
escalation; zero unauthorized commitments.

**Product (post-launch):**

- Time-to-brokered-intro: ~1 week of DMs → **< 1 hour**
- % of inbound asks resolved with zero SSC touches
- **Escalation precision**: share of escalations the SSC judges necessary
  (target > 80%; this metric gates any autonomy expansion, incl. gmail.send)
- Double-opt-in intro acceptance rate (both founder AND investor accept)
- Marketplace liquidity: brokered intros per matchmaker per week; founder→
  investor match rate; repeat usage by both sides
- Weekly represented asks per SSC (engagement north star)
- **Hard guardrail metric: unauthorized commitments = 0.** Any breach is a
  sev-1 incident, not a stat.

## 10. Competitive positioning

- **vs AI SDR / outbound tools:** they act _on_ humans, push one agenda. We
  broker between founders and investors and enforce BOTH sides' guardrails
  through a trusted matchmaker.
- **vs CRM:** stores a network; doesn't transact on your behalf.
- **vs RSVP/chat form tools:** a human still spends the minutes; we remove the
  conversation where both sides have agents.
- **vs scheduling tools (Calendly et al.):** availability ≠ representation; no
  mandate, no consent model, no agreement.
- **vs a direct founder-agent↔investor-agent world:** agents can connect, but
  neither side trusts a stranger's agent on fit, privacy, or vouching. The
  trusted matchmaker is the safety layer A2A alone doesn't provide.
- **Moat:** the matchmaker's curated network + reputation compounds with every
  brokered deal (GBrain-backed); dual-consent + bounded-vouching trust
  enforcement is an asset a blast tool or a raw directory cannot retrofit.

## 11. Risks & mitigations

| Risk                                           | Mitigation                                                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Counterparty agents scarce (cold start)        | Graceful degradation (FR-4.3) gives single-player value; A2A adoption is the tailwind                                                |
| Over-delegation / trust failure                | Conservative default mandates; escalate on ambiguity; audit log; hard zero-breach metric                                             |
| **Prompt injection via counterparty messages** | Inbound agent messages are _data, never instructions_; guardrail checks run outside the model; mandate is immutable within a session |
| Privacy breach (contact data)                  | Consent flags enforced structurally; private fields never serialized to counterparty without opt-in; tests on the serializer         |
| Read as an SDR tool                            | Positioning discipline: hero demo is representation; email is draft-only at P1                                                       |
| Platform ToS (Gmail/LinkedIn)                  | Owned channels + drafts first; no scraping; scope-minimal OAuth                                                                      |

## 12. Open questions

1. Pricing: per-SSC seat vs per-brokered-outcome (bias: seat + usage hybrid)
2. Who hosts discovery (Agent Card directory) — us, or ride an emerging registry?
3. Legal weight of signed agreements — memorandum vs enforceable?
4. Autonomy graduation policy: what escalation-precision threshold unlocks
   gmail.send and larger calendar authority?
5. Multi-party sequencing: broker chains (A→B→C) vs true 3-way negotiation?

## 13. Appendix

- Demo runbook: `docs/hackathon/runbook/RUNBOOK-DELTA.md` · Video script:
  `docs/hackathon/pitch/video-script.md`
- Seed profiles: `seed/founder_profile.json`, `seed/investor_profile.json`,
  `seed/matchmaker_profile.json` · Scenario: `seed/negotiation_scenario.json`
- Claims discipline (applies to all public materials): interview = signal, not
  validation; demo = A2A-inspired subset, production = A2A v1.0; all founder
  claims CV-verifiable.
