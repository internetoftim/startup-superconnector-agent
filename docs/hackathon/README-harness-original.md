# Guestlist — Hackathon Harness (c0mpiled pt.3, pivot build)

The event as an agent-native service: an invitee's agent negotiates attendance
with the event's agent in seconds (policy-enforced, signed receipt); everything
that can't go agent-to-agent gets triaged and drafted for the organiser.
Track: Software for Agents. Grounded in a real discovery interview + the
builder's 30+ organised events.

## Zero new setup
The pivot costs no installs: same Claude Code/Conductor/GStack stack as
SETUP_TONIGHT.md in the tapeout harness. Only the Anthropic API key must be
usable from code for investor_agent.py — verify `ANTHROPIC_API_KEY` works once.

## Structure
```
CLAUDE.md                      ← THE spec (auto-read by Claude Code)
seed/ (founder_profile · investor_profile · matchmaker_profile · negotiation_scenario)
  matchmaker/founder/investor profiles          ← Beat A counterparty (incl. the +1 policy trigger)
harness/office-hours-prep.md   ← six answers, interview evidence baked in
pitch/
  video-script.md              ← v4: opens on the real quote; two beats
  deck.md                      ← 6 slides
  founder-narrative.md         ← Q&A ammo + the Garry one-liner delta
runbook/RUNBOOK-DELTA.md       ← new checkpoints on the same timing skeleton
```

## What you BUILD tomorrow
`src/event_server.py` (endpoint + policy checks) · `src/investor_agent.py`
(Claude persona) · `src/organiser.py` (triage CLI) · `src/receipts.py` (HMAC
sign + render). Beat A flawless first; policy-decline moment stays in.

## The fallback (this is a feature, not a hedge)
`/home/claude/tapeout-brain/` remains complete and battle-ready. /office-hours
at 10:05 arbitrates: if Guestlist survives the grilling, commit and never look
back; if it dies, revert to Tape-out Brain and you've lost 25 minutes, not the
hackathon.

## Claims discipline (short version)
Interview = signal, not validation. Demo = A2A-inspired subset, production =
A2A v1.0. Founder facts = CV-verifiable only. Get the organiser's OK (or
anonymise) before using his quote on camera.
