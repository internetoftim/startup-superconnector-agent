# RUNBOOK DELTA — Guestlist (same skeleton/timings as tapeout runbook)

Golden rules unchanged: features stop 15:00 · record by 16:30 · one working
thing beats five half-things · Tape-out Brain harness = intact fallback.

## 10:00–12:00 — head start
- [ ] 10:00 Cold-start Conductor/Claude Code: "Read CLAUDE.md and
      harness/office-hours-prep.md, confirm understanding, run /office-hours."
- [ ] 10:05 /office-hours. If the idea DIES here → revert to tapeout-brain,
      no drama. If it survives → commit fully, stop second-guessing.
- [ ] 10:25 /plan-eng-review on the architecture.
- [ ] 10:45 `event_server.py`: serve agent card + get_event_info +
      check_availability from seed/event.json. Test: card and slots print.
- [ ] 11:15 `negotiate_attendance` TEST-FIRST. The policy checks are the crown
      jewel: +1 cap (approve 1st, decline 2nd), slot decrement per track,
      dietary capture. Write the failing tests, then implement.
- [ ] 11:50 Checkpoint: a scripted (non-LLM) client can complete a full
      negotiation → confirm_rsvp → signed receipt. If yes, you're ahead.

## 12:30–15:00 — the two beats
- [ ] 12:30 `investor_agent.py` with seed/investor-persona.md (Claude API).
      Full live negotiation against the server.
- [ ] 13:15 Receipt rendering: signed JSON → clean human-readable confirmation.
- [ ] 13:45 `organiser.py`: triage dashboard from invitees.json →
      4 agent-resolved / 4 drafts-ready / 2 needs-you, plus channel drafts for
      the human-only invitees. (Simulate inv-01/03/04 outcomes cheaply — inv-02
      is the live one; inv-04 declines-with-reason for honesty texture.)
- [ ] 14:20 /review both demo paths; fix what it flags.
- [ ] 14:40 "Before" contrast asset: WhatsApp/LinkedIn/SMS treadmill screenshot
      mock for the video's status-quo beat.
- [ ] 15:00 HARD STOP.

## 15:00–17:30 — unchanged from tapeout runbook
/qa clean-run both beats · freeze known-good seed states · rehearse 3× ·
16:30 RECORD (script: pitch/video-script.md) · 17:05 submit fields · 17:20 SUBMIT.
+ At breaks: grab 1–2 more organiser quotes on the treadmill (30 seconds each) —
  fresh evidence for Q&A, and this venue is full of your users.

## Solo triage
- LLM negotiation flaky live → pre-record Beat A; the scripted client from 11:50
  is your deterministic backup path.
- Dashboard math wrong → it must match seed/invitees.json expected_dashboard
  exactly; that block is the test oracle.
- Everything on fire at 14:00 → cut Beat B to a static render of the triage
  table; Beat A + receipt alone still beats the room.
