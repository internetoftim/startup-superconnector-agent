/**
 * FR-5 — the signed tri-party agreement: canonical, verifiable, tamper-evident,
 * and human-readable (Product Principle 4).
 */
import { describe, expect, test } from "bun:test";

import founderProfile from "../../seed/founder_profile.json";
import investorProfile from "../../seed/investor_profile.json";
import matchmakerProfile from "../../seed/matchmaker_profile.json";
import {
  canonicalJson,
  renderAgreement,
  signAgreement,
  verifyAgreement,
} from "../../src/superconnector/agreement.ts";
import { runScenario } from "../../src/superconnector/run-demo.ts";

const profiles = {
  founder: founderProfile,
  investor: investorProfile,
  matchmaker: matchmakerProfile,
};

async function signedRun() {
  return runScenario(profiles, { createdAt: "2026-07-05T12:00:00.000Z" });
}

describe("canonical JSON", () => {
  test("key order does not change the canonical form", () => {
    expect(canonicalJson({ b: 1, a: { d: 2, c: [{ f: 3, e: 4 }] } })).toBe(
      canonicalJson({ a: { c: [{ e: 4, f: 3 }], d: 2 }, b: 1 }),
    );
  });
});

describe("tri-party signing", () => {
  test("all three parties sign and verify", async () => {
    const { signed } = await signedRun();
    expect(Object.keys(signed.signatures).sort()).toEqual(["Aya N.", "Rin", "Tim (SSC)"]);
    expect(await verifyAgreement(signed)).toBe(true);
  });

  test("tampering with the meeting slot after signing breaks verification", async () => {
    const { signed } = await signedRun();
    const tampered = structuredClone(signed);
    tampered.agreement.meeting = { when: "2026-09-19 PM", format: "in person", duration: "15m" };
    expect(await verifyAgreement(tampered)).toBe(false);
  });

  test("tampering with a commitment breaks verification", async () => {
    const { signed } = await signedRun();
    const tampered = structuredClone(signed);
    tampered.agreement.commitments[0].text = "wire $500k immediately";
    expect(await verifyAgreement(tampered)).toBe(false);
  });
});

describe("human-readable render", () => {
  test("names all three parties, the consented info, and the open escalations", async () => {
    const { signed } = await signedRun();
    const rendered = renderAgreement(signed);
    expect(rendered).toContain("Rin (founder)");
    expect(rendered).toContain("Aya N. (investor)");
    expect(rendered).toContain("Tim (SSC) (broker-of-record)");
    expect(rendered).toContain("2026-09-18 AM");
    expect(rendered).toContain("3 paid pilots");
    expect(rendered).toContain("deck & metrics pending explicit opt-in");
    expect(rendered).toContain("OPEN ESCALATIONS");
    expect(rendered).toContain("HMAC-SHA256");
    // The honesty label ships in the artifact itself:
    expect(rendered).toContain("production: A2A v1.0");
  });
});
