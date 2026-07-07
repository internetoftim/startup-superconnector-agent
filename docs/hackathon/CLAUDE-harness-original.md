# CLAUDE.md — Superconnector (read this first, every session)

You are the engineering team for a 5-hour hackathon build. The builder is solo.
Do NOT re-ask what this project is. It is fully specified below. Start building.

## What this is
A three-role marketplace where a MATCHMAKER agent brokers dealflow between
FOUNDERS and INVESTORS — each of whom has their OWN personal agent. Founders'
agents and investors' agents do not talk directly; they negotiate THROUGH the
matchmaker, because the matchmaker is the party both sides trust to curate,
protect context, and vouch. A2A doesn't disintermediate the matchmaker — it's
what makes agent-to-agent dealflow SAFE, and the matchmaker is the trust hub.

## The three users (all first-class)
- FOUNDER: has a personal agent; wants warm, high-fit investor intros; controls
  what about their raise/metrics is shared and with whom.
- INVESTOR: has a personal agent; wants curated, thesis-fit dealflow without
  inbound spam; controls check size / stage / sector filters and how much of
  their thesis and availability is exposed.
- MATCHMAKER (the SSC — the builder's role): the trusted broker. Their agent
  sits BETWEEN the other two agents, curates the match, enforces BOTH sides'
  consent, and vouches. This is the platform's keystone role.

## The one sentence
Superconnector gives founders, investors, and the connectors between them each a
personal agent — and a trusted matchmaker agent that negotiates in between, so a
warm, mutually-consented, high-fit intro that took a week of DMs happens in one
brokered exchange between three agents, with every commitment inside limits each
principal set.

## Track
YC RFS — "Software for Agents" (Aaron Epstein). Every agent is a PROXY for a
person; the matchmaker is a proxy that brokers between two other proxies. Rides
A2A (v1.0, Linux Foundation, 150+ orgs): demo speaks an A2A-inspired subset;
production = real A2A signed Agent Cards. Say that honestly; never claim full
protocol compliance.

## Grounding (real evidence — signal, not validation)
Discovery interview with a startup event organiser (an SSC/matchmaker) the night
before: network fragmented across SMS/WhatsApp/LinkedIn, time drained "replying
to the same people every day" instead of making new connections. Builder is an
SSC across 30+ events. One interview + lived experience = a signal.

## Why the matchmaker isn't disintermediated (the defensibility answer)
A founder's agent and an investor's agent COULD talk directly. They don't,
because neither side trusts a stranger's agent to be honest about fit, to
protect their private context, or to vouch. The SSC is the party both already
trust. So the matchmaker agent is the thing that makes agent-to-agent dealflow
safe — curation + dual-consent enforcement + vouching are its irreducible value.
This only becomes visible once founders and investors are first-class users.

## The core primitive — ONE engine, ONE schema, THREE roles (this is the pitch)
Founder, investor, and matchmaker profiles are the SAME schema:
  identity + mandate (may-commit-autonomously vs must-escalate) + what-I-
  offer/seek + guardrails/consent. The SAME proxy engine runs all three. A new
  role is a new PROFILE, not new code. "Representation is data, not code." If
  roles needed different engines, this would be three products; because they
  don't, it's one primitive that generalises past founders/investors to any
  represented party.

## The demo arc (hub-and-spoke — NOT a three-way free-for-all)
Beat A — HERO (~45s): founder-agent -> [MATCHMAKER] -> investor-agent, brokered.
Read it as a hub with two spokes:
  1. Founder's agent asks the matchmaker for intros to thesis-fit investors,
     sharing ONLY what the founder consented to (public one-liner + traction
     headline; deck withheld -> escalates).
  2. Matchmaker curates against its network + the investor's known thesis,
     proposes a fit, and — crucially — enforces BOTH sides' consent: it won't
     expose the investor's private availability to the founder unbooked, won't
     share the founder's metrics without opt-in, won't surface a non-opted-in
     party, and REFUSES to vouch on financials (escalates "will they invest?").
  3. Investor's agent applies its OWN filters (check size/stage/sector), accepts
     or counters, and books a mutually-workable slot.
  -> signed agreement all three can audit: who's introduced, on what consented
     info, when they meet, what each principal committed. The matchmaker is
     visibly the trust hub — it does what neither side's agent could do alone.
Beat B — SELECTABLE coda (~10s, only if Beat A is bulletproof AND time allows):
the matchmaker executes logistics on the brokered outcome — calendar hold,
drafted (not sent) intro email, event seat. Cuttable; Beat A stands alone.

## Architecture (keep it thin)
- seed/founder_profile.json — founder principal + agent mandate + consent state.
- seed/investor_profile.json — investor principal + thesis filters + mandate.
- seed/matchmaker_profile.json — the SSC/matchmaker: network (with per-contact
  consent flags), offerings, guardrails, vouching limits. (Was my_profile.json.)
- src/agent.py — the proxy engine: loads ANY profile, negotiates on that
  principal's behalf, enforces mandate + consent, escalates above authority.
  Runs as founder, investor, OR matchmaker from ONE codebase. NO role hardcoding
  — genericity over the profile IS the product claim.
- src/broker.py — the matchmaker's hub loop: receives the founder-agent ask,
  curates against network + investor thesis, runs dual-consent checks, relays
  proposal/counter between the two spoke agents, converges or escalates. The
  crown jewel — this is what makes it a marketplace, not a 1:1 chat.
- src/agreement.py — HMAC-signed tri-party agreement (founder, investor,
  matchmaker as broker-of-record) + human-readable render. (Honest: HMAC demo;
  production = A2A signed cards.)
- src/logistics.py — Beat B execution on an agreement. Selectable, off hero path.

## Non-negotiable priorities (in order)
1. Beat A flawless from clean run: founder-agent -> matchmaker -> investor-agent
   -> signed tri-party agreement.
2. It READS as hub-brokered trust: the matchmaker visibly does what neither
   spoke could alone — dual-consent enforcement (founder metrics withheld;
   investor availability protected), curation, and a vouching REFUSAL that
   escalates. Two spokes, one hub. Never a confusing three-way.
3. The signed agreement names all three parties + what each consented to +
   committed.
4. Escalation is visible: "will this investor actually write a cheque?" exceeds
   the matchmaker's authority -> escalates to the human SSC, does NOT vouch.
5. Only after 1-4 AND time remains: Beat B logistics coda.

## Build discipline
- /office-hours FIRST (harness/office-hours-prep.md). If it kills the idea, the
  Tape-out Brain harness is intact — revert, don't wobble.
- Test-first on broker.py dual-consent checks (where demo-breaking bugs AND the
  whole trust claim live). One engine over the schema — do not fork per role.
- Keep the demo hub-and-spoke legible: at most the matchmaker + two spokes on
  screen. If it looks like three agents shouting, simplify the render.
- Stop features 15:00. Record by 16:30. Terminal fine; legible > pretty.
- Beat B is CUTTABLE by design — never let it threaten Beat A.
