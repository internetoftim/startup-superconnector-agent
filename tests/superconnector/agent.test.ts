/**
 * FR-2 — one engine, one schema, three roles. The SAME ProxyAgent class must
 * run founder, investor, and matchmaker purely from profile data, and the
 * consent-filtered serializer must never leak private facets (PRD §11:
 * "private fields never serialized to counterparty without opt-in; tests on
 * the serializer").
 */
import { describe, expect, test } from "bun:test";

import founderProfile from "../../seed/founder_profile.json";
import investorProfile from "../../seed/investor_profile.json";
import matchmakerProfile from "../../seed/matchmaker_profile.json";
import { ProxyAgent } from "../../src/superconnector/agent.ts";
import { loadProfile } from "../../src/superconnector/profile.ts";
import { Transcript } from "../../src/superconnector/messages.ts";
import { runScenario } from "../../src/superconnector/run-demo.ts";

describe("one schema, three roles (FR-1/FR-2)", () => {
  test("all three seed profiles validate against the single schema", () => {
    expect(() => loadProfile(founderProfile)).not.toThrow();
    expect(() => loadProfile(investorProfile)).not.toThrow();
    expect(() => loadProfile(matchmakerProfile)).not.toThrow();
  });

  test("the SAME engine class runs all three roles", () => {
    const t = new Transcript();
    const agents = [
      new ProxyAgent(founderProfile, "founder-agent", t),
      new ProxyAgent(investorProfile, "investor-agent", t),
      new ProxyAgent(matchmakerProfile, "matchmaker", t),
    ];
    for (const a of agents) {
      const card = a.card();
      expect(card.speaks_as.length).toBeGreaterThan(0);
      expect(card.principal.length).toBeGreaterThan(0);
    }
  });

  test("role is data, not code: stripping the role tag changes nothing", async () => {
    const stripRole = (p: unknown) => {
      const clone = structuredClone(p) as Record<string, unknown>;
      delete clone.role;
      return clone;
    };
    const createdAt = "2026-07-05T12:00:00.000Z";
    const tagged = await runScenario(
      { founder: founderProfile, investor: investorProfile, matchmaker: matchmakerProfile },
      { createdAt },
    );
    const untagged = await runScenario(
      {
        founder: stripRole(founderProfile),
        investor: stripRole(investorProfile),
        matchmaker: stripRole(matchmakerProfile),
      },
      { createdAt },
    );
    expect(JSON.stringify(untagged.signed)).toBe(JSON.stringify(tagged.signed));
  });

  test("malformed profiles are rejected with a legible error", () => {
    expect(() => loadProfile({ principal: { name: "No Mandate" }, guardrails: {} })).toThrow(
      /Invalid representation profile/,
    );
  });
});

describe("consent-filtered serializer (the allowlist)", () => {
  test("founder public summary carries only consented public fields", () => {
    const t = new Transcript();
    const founder = new ProxyAgent(founderProfile, "founder-agent", t);
    const serialized = JSON.stringify(founder.publicSummary());
    expect(serialized).toContain("3 paid pilots");
    expect(serialized).toContain("warehouse manipulation arms");
    // Private facets must be unreachable from the serializer:
    expect(serialized).not.toContain("2026-09-17"); // availability
    expect(serialized).not.toContain("2026-09-18");
    expect(serialized).not.toContain("consent_state");
    expect(serialized.toLowerCase()).not.toContain("deck");
  });

  test("investor public summary exposes thesis, never calendars or guardrails", () => {
    const t = new Transcript();
    const investor = new ProxyAgent(investorProfile, "investor-agent", t);
    const serialized = JSON.stringify(investor.publicSummary());
    expect(serialized).toContain("Kansai Deep Tech");
    expect(serialized).not.toContain("2026-09-18"); // pre-cleared window stays private
    expect(serialized.toLowerCase()).not.toContain("hard_no");
    expect(serialized).not.toContain("$100k"); // check size is thesis-private detail
  });
});

describe("mandate-bounded autonomy (FR-4)", () => {
  test("deck sharing resolves to the founder's must-escalate rule", () => {
    const t = new Transcript();
    const founder = new ProxyAgent(founderProfile, "founder-agent", t);
    const d = founder.decide({
      topic: "share_deck",
      summary: "share the deck",
      keywords: ["sharing the deck", "detailed metrics", "cap table", "deck"],
    });
    expect(d.decision).toBe("escalate");
    expect(d.ruleSource).toBe("must_escalate");
    expect(d.matchedRule).toContain("deck");
  });

  test("ambiguity resolves to escalation, never to autonomy (Principle 2)", () => {
    const t = new Transcript();
    const investor = new ProxyAgent(investorProfile, "investor-agent", t);
    const d = investor.decide({
      topic: "novel_action",
      summary: "do something no mandate rule covers",
      keywords: ["hoverboard rental", "karaoke sponsorship"],
    });
    expect(d.decision).toBe("escalate");
    expect(d.ruleSource).toBe("default_escalate");
    expect(d.matchedRule).toBeNull();
  });

  test("every decision lands in the audit log (FR-9-lite)", () => {
    const t = new Transcript();
    const founder = new ProxyAgent(founderProfile, "founder-agent", t);
    founder.decide({ topic: "a", summary: "audit me", keywords: ["nonexistent"] });
    expect(t.audit.length).toBe(1);
    expect(t.audit[0].action).toContain("audit me");
    expect(t.audit[0].decision).toBe("escalate");
  });
});
