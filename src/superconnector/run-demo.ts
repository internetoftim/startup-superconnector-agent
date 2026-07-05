/**
 * Beat A orchestration — the scripted, DETERMINISTIC hub-and-spoke demo that
 * follows seed/negotiation_scenario.json step by step. The choreography (who
 * asks what, when) lives here; every POLICY decision (consent, mandate,
 * screening, withholding, escalation) lives in the engine and runs the same
 * way no matter who calls it. Shared by the CLI, the web demo, and the tests
 * so a clean run is the same run everywhere.
 */
import { ProxyAgent } from "./agent.ts";
import { MatchmakerBroker, composeIntroAsk } from "./broker.ts";
import { Transcript } from "./messages.ts";
import type { SignedAgreement, TriPartyAgreement } from "./agreement.ts";
import { buildAgreement, signAgreement, verifyAgreement } from "./agreement.ts";
import type { LogisticsResult } from "./logistics.ts";
import { executeLogistics } from "./logistics.ts";

export interface ScenarioProfiles {
  founder: unknown;
  investor: unknown;
  matchmaker: unknown;
}

export interface Scorecard {
  messagesExchanged: number;
  guardrailEnforcements: number;
  escalationsRaised: number;
  /** Re-checked independently against the profiles. Must always be 0. */
  unauthorizedCommitments: number;
  contactsWithheld: number;
}

export interface DemoResult {
  transcript: Transcript;
  agreement: TriPartyAgreement;
  signed: SignedAgreement;
  signaturesVerified: boolean;
  scorecard: Scorecard;
  logistics: LogisticsResult | null;
  agents: { founder: ProxyAgent; investor: ProxyAgent; matchmaker: ProxyAgent };
}

export interface RunOptions {
  /** Beat B — selectable coda, off the hero path. */
  withLogistics?: boolean;
  /** Injectable timestamp for deterministic output. */
  createdAt?: string;
}

export async function runScenario(
  profiles: ScenarioProfiles,
  options: RunOptions = {},
): Promise<DemoResult> {
  const transcript = new Transcript();
  const founder = new ProxyAgent(profiles.founder, "founder-agent", transcript);
  const investor = new ProxyAgent(profiles.investor, "investor-agent", transcript);
  const matchmaker = new ProxyAgent(profiles.matchmaker, "matchmaker", transcript);
  const broker = new MatchmakerBroker(matchmaker, transcript);
  broker.registerSpoke(founder);
  broker.registerSpoke(investor);

  // ── Step 1: founder-agent → matchmaker — consented ask, public data only ──
  const { ask, action } = composeIntroAsk(founder);
  const shareDecision = founder.decide(action);
  if (shareDecision.decision !== "autonomous" || !shareDecision.matchedRule) {
    throw new Error("seeded founder mandate must allow sharing the public summary");
  }
  transcript.commit({
    party: founder.principalName,
    agent: founder.id,
    text: "share public one-liner + traction headline via the trusted matchmaker",
    mandateRule: shareDecision.matchedRule,
  });
  transcript.post({
    step: 1,
    from: founder.id,
    to: matchmaker.id,
    performative: "ask",
    subject: "intro ask (consented public info only)",
    body: `${founder.principalName} is ${ask.stage} in ${ask.sector}; wants: ${ask.traits.join(", ")}. Shared: public one-liner + "${ask.summary.traction ?? ""}" ONLY — deck & metrics stay private.`,
    data: ask,
  });

  // ── Step 2: matchmaker curates its network — fit confirmed before exposure ──
  const curation = broker.curate(ask);
  if (!curation.contact || !curation.fit) {
    throw new Error(`curation found no opted-in match: ${curation.rationale}`);
  }
  transcript.post({
    step: 2,
    from: matchmaker.id,
    to: matchmaker.id,
    performative: "curate",
    subject: "curation (internal)",
    body: `${curation.rationale}. ${curation.withheldCount} non-opted-in contact(s) excluded before matching — never surfaced.`,
    guardrail:
      curation.withheldCount > 0
        ? {
            kind: "contact_withheld",
            detail: `${curation.withheldCount} non-opted-in network contact(s) never surfaced`,
          }
        : undefined,
  });

  const counterpart = broker.resolveSpoke(curation.contact.name);
  if (!counterpart) {
    // FR-4.3 (P1): no live counterparty agent → draft for human channels.
    throw new Error(
      `no live agent for ${curation.contact.name} — graceful-degradation drafts land at P1`,
    );
  }

  // ── Step 3: matchmaker ↔ investor-agent — offer; spoke screens with its own thesis ──
  const offer = broker.offerToSpoke(counterpart, curation.fit, 3);
  if (!offer.accepted) {
    throw new Error(
      `seeded scenario expects a thesis PASS; got: ${offer.screenReasons.join("; ")}`,
    );
  }

  // ── Step 4: dual-consent — investor side asks for the deck; hub withholds + escalates ──
  broker.handleInfoRequest(counterpart, founder, "deck", 4);

  // ── Step 5: bounded vouching — "will they actually invest?" is refused + escalated ──
  broker.handleVouchRequest(
    founder,
    curation.contact,
    `Will ${curation.contact.name} actually invest?`,
    5,
  );

  // ── Step 6: converge — only the mutual slot crosses; both spokes confirm in-mandate ──
  const proposal = broker.proposeMutualSlot(founder, counterpart, 6);
  if (!proposal.slot || proposal.confirmedBy.length !== 2) {
    throw new Error("seeded scenario expects a mutual slot confirmed by both spokes");
  }

  // ── Step 7: signed tri-party agreement, auditable by all three principals ──
  const agreement = buildAgreement({
    founder,
    investor: counterpart,
    matchmaker,
    fit: curation.fit,
    slot: proposal.slot,
    transcript,
    escalations: transcript.escalations,
    createdAt: options.createdAt,
  });
  const signed = await signAgreement(agreement);
  const signaturesVerified = await verifyAgreement(signed);
  for (const spoke of [founder, counterpart]) {
    transcript.post({
      step: 7,
      from: matchmaker.id,
      to: spoke.id,
      performative: "agreement",
      subject: "signed tri-party agreement",
      body: `Agreement ${agreement.id} signed by ${agreement.parties.map((p) => p.principal).join(", ")} (${matchmaker.principalName} as broker-of-record).`,
      data: { id: agreement.id },
    });
  }

  const logistics = options.withLogistics ? executeLogistics(signed, matchmaker.profile) : null;

  return {
    transcript,
    agreement,
    signed,
    signaturesVerified,
    scorecard: buildScorecard(transcript, {
      founder,
      investor: counterpart,
      matchmaker,
      contactsWithheld: curation.withheldCount,
    }),
    logistics,
    agents: { founder, investor: counterpart, matchmaker },
  };
}

function buildScorecard(
  transcript: Transcript,
  ctx: {
    founder: ProxyAgent;
    investor: ProxyAgent;
    matchmaker: ProxyAgent;
    contactsWithheld: number;
  },
): Scorecard {
  const agentsById = new Map(
    [ctx.founder, ctx.investor, ctx.matchmaker].map((a) => [a.id, a] as const),
  );
  // Independent re-check (PRD §9 hard guardrail metric): every commitment must
  // literally be one of the principal's own may-commit rules.
  const unauthorized = transcript.commitments.filter((c) => {
    const agent = agentsById.get(c.agent);
    if (!agent) return true;
    return !agent.profile.principal.agent_mandate.may_commit_autonomously.includes(c.mandateRule);
  });

  const enforcedAudits = transcript.audit.filter((e) => e.decision === "enforced").length;

  return {
    messagesExchanged: transcript.messages.length,
    guardrailEnforcements: transcript.guardrailHits().length + enforcedAudits,
    escalationsRaised: transcript.escalations.length,
    unauthorizedCommitments: unauthorized.length,
    contactsWithheld: ctx.contactsWithheld,
  };
}
