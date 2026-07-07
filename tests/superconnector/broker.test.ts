/**
 * Dual-consent + guardrail tests — the crown jewel of the build (CLAUDE.md:
 * "Test-first on broker.py dual-consent checks (where demo-breaking bugs AND
 * the whole trust claim live)"). These pin the four guardrail hits the demo
 * must show, plus the PRD §9 hard metric: unauthorized commitments = 0.
 */
import { describe, expect, test } from "bun:test";

import founderProfile from "../../seed/founder_profile.json";
import investorProfile from "../../seed/investor_profile.json";
import matchmakerProfile from "../../seed/matchmaker_profile.json";
import { runScenario } from "../../src/superconnector/run-demo.ts";
import { ProxyAgent } from "../../src/superconnector/agent.ts";
import { MatchmakerBroker, composeIntroAsk } from "../../src/superconnector/broker.ts";
import { Transcript } from "../../src/superconnector/messages.ts";

const profiles = {
  founder: founderProfile,
  investor: investorProfile,
  matchmaker: matchmakerProfile,
};

const FIXED_TIME = "2026-07-05T12:00:00.000Z";

async function run(withLogistics = false) {
  return runScenario(profiles, { withLogistics, createdAt: FIXED_TIME });
}

describe("guardrail 1 — founder deck/metrics withheld without opt-in", () => {
  test("deck request is WITHHELD and escalated to the founder, never fulfilled", async () => {
    const result = await run();
    const withheld = result.transcript.messages.filter(
      (m) => m.performative === "withhold" && m.guardrail?.kind === "consent_withheld",
    );
    expect(withheld.length).toBe(1);
    expect(withheld[0].to).toBe("investor-agent");
    expect(withheld[0].body).toContain("WITHHELD");

    const deckEscalations = result.transcript.escalations.filter(
      (e) => e.principal === "Rin" && e.question.toLowerCase().includes("deck"),
    );
    expect(deckEscalations.length).toBe(1);
    expect(deckEscalations[0].status).toBe("pending");
  });

  test("nothing beyond the consented public summary ever reaches the investor", async () => {
    const result = await run();
    const investorInbox = result.transcript.messages.filter((m) => m.to === "investor-agent");
    const text = JSON.stringify(investorInbox).toLowerCase();
    // Private founder facets that must never cross without opt-in:
    expect(text).not.toContain("cap table");
    expect(text).not.toContain("valuation");
    // The consented public data DOES cross:
    expect(text).toContain("3 paid pilots");
  });
});

describe("guardrail 2 — private availability protected; only the mutual slot crosses", () => {
  test("founder's non-mutual window never appears in any message to the investor", async () => {
    const result = await run();
    const investorVisible = result.transcript.messages.filter((m) => m.to === "investor-agent");
    expect(JSON.stringify(investorVisible)).not.toContain("2026-09-17");
    const proposed = investorVisible.filter((m) => m.performative === "propose_slot");
    expect(proposed.length).toBe(1);
    expect(proposed[0].body).toContain("2026-09-18 AM");
    expect(proposed[0].guardrail?.kind).toBe("availability_protected");
  });

  test("an investor window outside the intersection never reaches the founder", async () => {
    const investorWithExtraWindow = structuredClone(investorProfile) as typeof investorProfile & {
      offerings: { calendar_windows: string[] };
    };
    investorWithExtraWindow.offerings.calendar_windows = ["2026-09-20 PM", "2026-09-18 AM"];
    const result = await runScenario(
      { ...profiles, investor: investorWithExtraWindow },
      { createdAt: FIXED_TIME },
    );
    const founderVisible = result.transcript.messages.filter((m) => m.to === "founder-agent");
    expect(JSON.stringify(founderVisible)).not.toContain("2026-09-20");
    expect(result.agreement.meeting?.when).toBe("2026-09-18 AM");
  });

  test("no mutual window → escalation to the human, calendars still never exposed", () => {
    const transcript = new Transcript();
    const founder = new ProxyAgent(founderProfile, "founder-agent", transcript);
    const investorBusy = structuredClone(investorProfile) as typeof investorProfile & {
      offerings: { calendar_windows: string[] };
    };
    investorBusy.offerings.calendar_windows = ["2026-10-01 AM"];
    const investor = new ProxyAgent(investorBusy, "investor-agent", transcript);
    const matchmaker = new ProxyAgent(matchmakerProfile, "matchmaker", transcript);
    const broker = new MatchmakerBroker(matchmaker, transcript);

    const proposal = broker.proposeMutualSlot(founder, investor, 6);
    expect(proposal.slot).toBeNull();
    expect(proposal.escalation).not.toBeNull();
    expect(JSON.stringify(transcript.messages)).not.toContain("2026-10-01");
  });
});

describe("guardrail 3 — non-opted-in network parties are never surfaced", () => {
  test("the non-opted-in contact appears nowhere in messages or the agreement", async () => {
    const result = await run(true);
    const everythingVisible = JSON.stringify({
      messages: result.transcript.messages,
      agreement: result.agreement,
      logistics: result.logistics,
    });
    expect(everythingVisible).not.toContain("Priya");
    expect(result.scorecard.contactsWithheld).toBe(1);
  });

  test("even a PERFECT-fit contact is excluded from curation without intro opt-in", () => {
    const transcript = new Transcript();
    const custom = structuredClone(matchmakerProfile) as typeof matchmakerProfile;
    custom.network = [
      {
        id: "cx",
        name: "Perfect Fit",
        domain: "robotics",
        role: "angel",
        warmth: "strong",
        offering: "cheques",
        seeking: "seed robotics founders in APAC",
        opted_in_to_intros: false,
      },
    ];
    const matchmaker = new ProxyAgent(custom, "matchmaker", transcript);
    const broker = new MatchmakerBroker(matchmaker, transcript);
    const founder = new ProxyAgent(founderProfile, "founder-agent", transcript);

    const { ask } = composeIntroAsk(founder);
    const curation = broker.curate(ask);
    expect(curation.contact).toBeNull();
    expect(curation.withheldCount).toBe(1);
    expect(JSON.stringify(transcript.messages)).not.toContain("Perfect Fit");
  });
});

describe("dual-consent — a request covered by standing consent shares ONLY the public summary", () => {
  test("requesting the public one-liner resolves autonomously, with a commitment trail", () => {
    const transcript = new Transcript();
    const founder = new ProxyAgent(founderProfile, "founder-agent", transcript);
    const investor = new ProxyAgent(investorProfile, "investor-agent", transcript);
    const matchmaker = new ProxyAgent(matchmakerProfile, "matchmaker", transcript);
    const broker = new MatchmakerBroker(matchmaker, transcript);

    const outcome = broker.handleInfoRequest(investor, founder, "public one-liner", 4);
    expect(outcome.shared).toBe(true);
    // The share leaves a trail: a commitment tracing to the founder's own rule…
    expect(transcript.commitments.length).toBe(1);
    expect(founderProfile.principal.agent_mandate.may_commit_autonomously).toContain(
      transcript.commitments[0].mandateRule,
    );
    // …and the payload is the allowlist serializer's output — no private facets.
    const shared = transcript.messages.find((m) => m.performative === "accept");
    const serialized = JSON.stringify(shared?.data ?? {});
    expect(serialized).toContain("warehouse manipulation arms");
    expect(serialized).not.toContain("2026-09-17");
    expect(serialized.toLowerCase()).not.toContain("deck");
  });
});

describe("curation — the in-sector investor wins regardless of network ordering", () => {
  test("reversing the network array still curates the thesis-fit investor", () => {
    const transcript = new Transcript();
    const reversed = structuredClone(matchmakerProfile) as typeof matchmakerProfile;
    reversed.network = [...reversed.network].reverse();
    const matchmaker = new ProxyAgent(reversed, "matchmaker", transcript);
    const broker = new MatchmakerBroker(matchmaker, transcript);
    const founder = new ProxyAgent(founderProfile, "founder-agent", transcript);

    const curation = broker.curate(composeIntroAsk(founder).ask);
    expect(curation.contact?.name).toBe("Aya N.");
  });
});

describe("guardrail 4 — vouching is bounded; outcome assurances are refused + escalated", () => {
  test('"will they actually invest?" → REFUSE + escalation to the human SSC', async () => {
    const result = await run();
    const refusals = result.transcript.messages.filter(
      (m) => m.performative === "refuse" && m.guardrail?.kind === "vouch_refused",
    );
    expect(refusals.length).toBe(1);
    expect(refusals[0].to).toBe("founder-agent");

    const sscEscalations = result.transcript.escalations.filter(
      (e) => e.principal === "Tim (SSC)" && e.question.toLowerCase().includes("invest"),
    );
    expect(sscEscalations.length).toBe(1);
  });

  test("the bounded vouch covers fit/timeline only — no outcome language", async () => {
    const result = await run();
    const vouches = result.transcript.messages.filter((m) => m.performative === "vouch");
    expect(vouches.length).toBe(1);
    expect(vouches[0].body).toContain("Nothing about outcomes");
    expect(vouches[0].body.toLowerCase()).not.toContain("will invest");
  });
});

describe("spoke autonomy — the hub never overrides a spoke's own filter", () => {
  test("an out-of-thesis fit is declined by the investor agent's own screen", () => {
    const transcript = new Transcript();
    const investor = new ProxyAgent(investorProfile, "investor-agent", transcript);
    const matchmaker = new ProxyAgent(matchmakerProfile, "matchmaker", transcript);
    const broker = new MatchmakerBroker(matchmaker, transcript);

    const outcome = broker.offerToSpoke(
      investor,
      {
        candidateName: "SaaS Sam",
        oneliner: "a pure software SaaS dashboard for sales teams",
        sector: "software",
        stage: "Series B",
        geo: "US",
        wants: [],
        vouch: "n/a",
      },
      3,
    );
    expect(outcome.accepted).toBe(false);
    expect(
      transcript.messages.some((m) => m.performative === "decline" && m.from === "investor-agent"),
    ).toBe(true);
    expect(transcript.commitments.length).toBe(0);
  });
});

describe("PRD §9 hard metric — zero unauthorized commitments", () => {
  test("every commitment traces verbatim to the principal's own may-commit rule", async () => {
    const result = await run();
    expect(result.scorecard.unauthorizedCommitments).toBe(0);
    expect(result.transcript.commitments.length).toBeGreaterThanOrEqual(3);
    const mandates: Record<string, string[]> = {
      "founder-agent": (
        founderProfile as { principal: { agent_mandate: { may_commit_autonomously: string[] } } }
      ).principal.agent_mandate.may_commit_autonomously,
      "investor-agent": (
        investorProfile as { principal: { agent_mandate: { may_commit_autonomously: string[] } } }
      ).principal.agent_mandate.may_commit_autonomously,
      matchmaker: (
        matchmakerProfile as { principal: { agent_mandate: { may_commit_autonomously: string[] } } }
      ).principal.agent_mandate.may_commit_autonomously,
    };
    for (const c of result.transcript.commitments) {
      expect(mandates[c.agent]).toContain(c.mandateRule);
    }
  });

  test("demo-day scorecard: ≥2 guardrail enforcements, ≥1 escalation, all signatures verify", async () => {
    const result = await run();
    expect(result.scorecard.guardrailEnforcements).toBeGreaterThanOrEqual(2);
    // Distinct events only — the per-spoke slot annotations and the audit
    // mirror of the contact-withholding must not inflate the headline metric.
    expect(result.scorecard.guardrailEnforcements).toBe(4);
    expect(result.scorecard.escalationsRaised).toBeGreaterThanOrEqual(1);
    expect(result.signaturesVerified).toBe(true);
    expect(result.agreement.parties.map((p) => p.role).sort()).toEqual([
      "broker-of-record",
      "founder",
      "investor",
    ]);
    expect(result.agreement.meeting?.when).toBe("2026-09-18 AM");
    expect(result.agreement.open_escalations.length).toBe(2);
  });
});

describe("determinism — a clean run is the same run every time", () => {
  test("two runs with a pinned timestamp produce byte-identical signed agreements", async () => {
    const [a, b] = await Promise.all([run(), run()]);
    expect(JSON.stringify(a.signed)).toBe(JSON.stringify(b.signed));
  });
});
