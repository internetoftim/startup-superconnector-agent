/**
 * FR-5 — The signed TRI-PARTY agreement: founder, investor, and matchmaker
 * (as broker-of-record) each sign the same canonical document, so all three
 * principals can audit exactly who is being introduced, on what consented
 * information, when they meet, what each side committed, and what is still
 * pending a human decision.
 *
 * HONESTY LABEL: demo signing is HMAC-SHA256 over canonical JSON with
 * locally-derived per-party demo keys. Production replaces this with A2A
 * v1.0 signed Agent Cards / real key custody. Never claim otherwise.
 */
import type { Commitment, Escalation, Transcript } from "./messages.ts";
import type { CuratedFit, ProxyAgent } from "./agent.ts";

export interface AgreementParty {
  principal: string;
  agent: string;
  role: "founder" | "investor" | "broker-of-record";
}

export interface TriPartyAgreement {
  id: string;
  kind: "superconnector.tri-party-intro/v0";
  created_at: string;
  parties: AgreementParty[];
  introduction: {
    between: [string, string];
    basis: string;
  };
  meeting: {
    when: string;
    format: string;
    duration: string;
  } | null;
  /** Exactly the information each side consented to share — nothing else. */
  consented_disclosures: Record<string, string[]>;
  commitments: Commitment[];
  open_escalations: { id: string; principal: string; question: string }[];
  audit_note: string;
}

export interface SignedAgreement {
  agreement: TriPartyAgreement;
  /** party principal name → HMAC-SHA256 hex over the canonical agreement. */
  signatures: Record<string, string>;
  signature_scheme: string;
}

/** Stable stringify: object keys sorted recursively so signatures are canonical. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a < b ? -1 : a > b ? 1 : 0,
    );
    return Object.fromEntries(entries.map(([k, v]) => [k, sortValue(v)]));
  }
  return value;
}

async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Demo key derivation — stands in for real per-party key custody. */
export function demoSecretFor(principal: string): string {
  return `superconnector-demo-hmac-key:${principal}`;
}

/**
 * The consent-boundary note appended to the founder's disclosure list. Shared
 * with logistics.ts, which must not treat the meta-line as a disclosure.
 */
export const CONSENT_BOUNDARY_NOTE = "nothing else — deck & metrics pending explicit opt-in";

/** Constant-time hex comparison — no early exit on the first differing byte. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface BuildAgreementInput {
  founder: ProxyAgent;
  investor: ProxyAgent;
  matchmaker: ProxyAgent;
  fit: CuratedFit;
  slot: string;
  transcript: Transcript;
  escalations: Escalation[];
  /** Injectable for deterministic tests; defaults to now. */
  createdAt?: string;
}

export function buildAgreement(input: BuildAgreementInput): TriPartyAgreement {
  const { founder, investor, matchmaker, fit, slot, transcript, escalations } = input;
  const founderSummary = founder.publicSummary();
  const investorSummary = investor.publicSummary();
  const investorThesis = investor.profile.thesis_filter;
  const venue = matchmaker.profile.offerings?.event_access?.event;

  return {
    id: `sc-intro-${slot.replace(/[^0-9A-Za-z]+/g, "").toLowerCase()}-${founder.principalName.replace(/\W+/g, "").toLowerCase()}-${investor.principalName.replace(/\W+/g, "").toLowerCase()}`,
    kind: "superconnector.tri-party-intro/v0",
    created_at: input.createdAt ?? new Date().toISOString(),
    parties: [
      { principal: founder.principalName, agent: founder.id, role: "founder" },
      { principal: investor.principalName, agent: investor.id, role: "investor" },
      { principal: matchmaker.principalName, agent: matchmaker.id, role: "broker-of-record" },
    ],
    introduction: {
      between: [founder.principalName, investor.principalName],
      basis: `curated thesis fit, vouched on fit + timeline-understanding only: ${fit.oneliner}`,
    },
    meeting: {
      when: slot,
      format: `in person, 15 minutes${venue ? ` — ${venue}` : ""}`,
      duration: "15m",
    },
    consented_disclosures: {
      [founder.principalName]: [
        ...(founderSummary.oneliner ? [`public one-liner: "${founderSummary.oneliner}"`] : []),
        ...(founderSummary.traction ? [`traction headline: "${founderSummary.traction}"`] : []),
        CONSENT_BOUNDARY_NOTE,
      ],
      [investor.principalName]: [
        ...(investorSummary.oneliner ? [`public thesis: "${investorSummary.oneliner}"`] : []),
        // The investor's disclosure is the investor's OWN public thesis, read
        // from their profile — never inferred from the founder's ask.
        ...(investorThesis
          ? [
              `public thesis: ${investorThesis.sectors.join("/")} @ ${investorThesis.stage.join("/")} in ${investorThesis.geo.join("/")}`,
            ]
          : []),
        "single mutually-open slot only — full calendar never shared",
      ],
    },
    commitments: transcript.commitments,
    open_escalations: escalations.map((e) => ({
      id: e.id,
      principal: e.principal,
      question: e.question,
    })),
    audit_note: `${transcript.messages.length} messages, ${new Set(transcript.guardrailHits().map((m) => `${m.guardrail?.kind}@${m.step}`)).size} distinct guardrail enforcements, ${escalations.length} escalations — full transcript auditable by all three principals.`,
  };
}

export async function signAgreement(agreement: TriPartyAgreement): Promise<SignedAgreement> {
  const canonical = canonicalJson(agreement);
  const signatures: Record<string, string> = {};
  for (const party of agreement.parties) {
    signatures[party.principal] = await hmacSha256Hex(demoSecretFor(party.principal), canonical);
  }
  return {
    agreement,
    signatures,
    signature_scheme:
      "HMAC-SHA256 over canonical JSON (demo) — production: A2A v1.0 signed Agent Cards",
  };
}

/** All three signatures must verify against the canonical document. */
export async function verifyAgreement(signed: SignedAgreement): Promise<boolean> {
  const parties = signed.agreement.parties;
  // A tri-party agreement without three distinctly-named parties has no
  // trust value — an empty or deduplicated party list must NOT verify
  // "vacuously true", and a stray signature is as suspect as a missing one.
  if (parties.length < 3) return false;
  if (new Set(parties.map((p) => p.principal)).size !== parties.length) return false;
  if (Object.keys(signed.signatures).length !== parties.length) return false;

  const canonical = canonicalJson(signed.agreement);
  for (const party of parties) {
    const expected = await hmacSha256Hex(demoSecretFor(party.principal), canonical);
    if (!timingSafeEqualHex(signed.signatures[party.principal] ?? "", expected)) return false;
  }
  return true;
}

/** Human-readable render — Product Principle 4: every outcome is auditable. */
export function renderAgreement(signed: SignedAgreement): string {
  const a = signed.agreement;
  const lines: string[] = [];
  lines.push("=== TRI-PARTY INTRODUCTION AGREEMENT ===");
  lines.push(`id: ${a.id}`);
  lines.push(`created: ${a.created_at}`);
  lines.push("");
  lines.push("PARTIES");
  for (const p of a.parties) lines.push(`  - ${p.principal} (${p.role}) via ${p.agent}`);
  lines.push("");
  lines.push(`INTRODUCTION: ${a.introduction.between[0]} <-> ${a.introduction.between[1]}`);
  lines.push(`  basis: ${a.introduction.basis}`);
  if (a.meeting) {
    lines.push(`MEETING: ${a.meeting.when} — ${a.meeting.format}`);
  }
  lines.push("");
  lines.push("CONSENTED DISCLOSURES");
  for (const [who, items] of Object.entries(a.consented_disclosures)) {
    lines.push(`  ${who}:`);
    for (const item of items) lines.push(`    - ${item}`);
  }
  lines.push("");
  lines.push("COMMITMENTS (each traces to the principal's own mandate rule)");
  for (const c of a.commitments)
    lines.push(`  - ${c.party}: ${c.text}\n      mandate: "${c.mandateRule}"`);
  lines.push("");
  lines.push("OPEN ESCALATIONS (pending a human — nothing committed meanwhile)");
  if (a.open_escalations.length === 0) lines.push("  (none)");
  for (const e of a.open_escalations) lines.push(`  - [${e.id}] ${e.principal}: ${e.question}`);
  lines.push("");
  lines.push(`AUDIT: ${a.audit_note}`);
  lines.push("");
  lines.push(`SIGNATURES (${signed.signature_scheme})`);
  for (const [who, sig] of Object.entries(signed.signatures)) {
    lines.push(`  ${who}: ${sig.slice(0, 16)}…${sig.slice(-8)}`);
  }
  return lines.join("\n");
}
