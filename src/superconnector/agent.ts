/**
 * FR-2 — The proxy engine. ONE class runs founder, investor, AND matchmaker:
 * which principal it represents is entirely a property of the profile it
 * loads. There is deliberately no `if (role === ...)` anywhere in this file —
 * genericity over the profile IS the product claim ("representation is data,
 * not code").
 *
 * All policy decisions are deterministic code over profile data, never model
 * output and never free text received from a counterparty (PRD §11).
 */
import type { NetworkContact, RepresentationProfile, ThesisFilter } from "./profile.ts";
import { loadProfile } from "./profile.ts";
import type { AgentId, AuditEntry, Escalation, Transcript } from "./messages.ts";

/**
 * A concrete action the agent is being asked to take, described by keywords
 * that are matched against the principal's own mandate wording. Longer, more
 * specific phrases weigh more, so "thesis-fit investor" beats a bare "intro".
 */
export interface ActionRequest {
  /** Short machine topic, e.g. "share_deck", "book_meeting". */
  topic: string;
  /** Human-legible description used in audit and escalation records. */
  summary: string;
  /** Lowercase keywords/phrases characterising the action. */
  keywords: string[];
}

export interface Decision {
  decision: "autonomous" | "escalate";
  matchedRule: string | null;
  ruleSource: AuditEntry["ruleSource"];
}

/** What the matchmaker proposes to a spoke agent: consented-public info only. */
export interface CuratedFit {
  candidateName: string;
  candidateCompanyOrFund?: string;
  oneliner: string;
  traction?: string;
  sector: string;
  stage: string;
  geo: string;
  wants: string[];
  vouch: string;
}

export interface ScreenVerdict {
  pass: boolean;
  reasons: string[];
}

function scoreRule(rule: string, keywords: string[]): number {
  const haystack = rule.toLowerCase();
  return keywords.reduce(
    (score, kw) => (haystack.includes(kw.toLowerCase()) ? score + kw.length : score),
    0,
  );
}

function bestRule(rules: string[], keywords: string[]): { rule: string | null; score: number } {
  let best: { rule: string | null; score: number } = { rule: null, score: 0 };
  for (const rule of rules) {
    const score = scoreRule(rule, keywords);
    if (score > best.score) best = { rule, score };
  }
  return best;
}

export class ProxyAgent {
  readonly profile: RepresentationProfile;
  readonly id: AgentId;
  private readonly transcript: Transcript;

  constructor(profileJson: unknown, id: AgentId, transcript: Transcript) {
    this.profile = loadProfile(profileJson);
    this.id = id;
    this.transcript = transcript;
  }

  get principalName(): string {
    return this.profile.principal.name;
  }

  /** A2A-inspired agent card: public identity only, never private facets. */
  card(): { name: AgentId; speaks_as: string; tone: string; principal: string } {
    const m = this.profile.principal.agent_mandate;
    return { name: this.id, speaks_as: m.speaks_as, tone: m.tone, principal: this.principalName };
  }

  /**
   * FR-4 — mandate-bounded autonomy. Matches the action against the
   * principal's own may-commit / must-escalate wording AND the profile's
   * hard-no guardrails (US-2: guardrails checked on every outbound
   * commitment). Blocking rules win ties, and NO match at all also escalates:
   * ambiguity always resolves to the human (Product Principle 2). A profile
   * whose phrasing the matcher doesn't recognise therefore degrades to
   * escalation, never to autonomy. Every decision lands in the audit log.
   */
  decide(action: ActionRequest): Decision {
    const mandate = this.profile.principal.agent_mandate;
    const may = bestRule(mandate.may_commit_autonomously, action.keywords);
    const esc = bestRule(mandate.must_escalate, action.keywords);
    const hardNo = bestRule(this.profile.guardrails.hard_no, action.keywords);
    const blocking =
      hardNo.score > esc.score
        ? { ...hardNo, source: "hard_no" as const }
        : { ...esc, source: "must_escalate" as const };

    let result: Decision;
    if (blocking.score > 0 && blocking.score >= may.score) {
      result = { decision: "escalate", matchedRule: blocking.rule, ruleSource: blocking.source };
    } else if (may.score > 0) {
      result = {
        decision: "autonomous",
        matchedRule: may.rule,
        ruleSource: "may_commit_autonomously",
      };
    } else {
      result = { decision: "escalate", matchedRule: null, ruleSource: "default_escalate" };
    }

    this.transcript.recordAudit({
      agent: this.id,
      action: `${action.topic}: ${action.summary}`,
      decision: result.decision,
      matchedRule: result.matchedRule,
      ruleSource: result.ruleSource,
    });
    return result;
  }

  /** Queue a question to the human principal. Nothing is committed meanwhile. */
  escalateToPrincipal(question: string, context: string): Escalation {
    return this.transcript.escalate({
      principal: this.principalName,
      raisedBy: this.id,
      question,
      context,
    });
  }

  /**
   * Consent-filtered disclosure (the serializer the PRD demands tests on).
   * This is an ALLOWLIST: only fields the principal marked public ever leave
   * the agent. Decks, metrics, cap tables, LP lists, and raw calendars are
   * not reachable from here by construction.
   */
  publicSummary(): {
    principal: string;
    company?: string;
    fund?: string;
    oneliner?: string;
    traction?: string;
    stage?: string;
    sector?: string;
    seeking?: string[];
  } {
    const p = this.profile.principal;
    const raise = this.profile.raise;
    const thesis = this.profile.thesis_filter;
    // Explicit precedence for a profile carrying both facets: what the
    // principal actively seeks (the raise) outranks how they screen inbound.
    const sector = raise?.sector ?? (thesis ? thesis.sectors.join("/") : undefined);
    const seeking =
      raise?.wants_investor_traits ?? (thesis ? [thesis.wants_from_matchmaker] : undefined);
    return {
      principal: p.name,
      ...(p.company ? { company: p.company } : {}),
      ...(p.fund ? { fund: p.fund } : {}),
      ...(p.public_oneliner ? { oneliner: p.public_oneliner } : {}),
      ...(p.traction_headline ? { traction: p.traction_headline } : {}),
      ...(p.stage ? { stage: p.stage } : {}),
      ...(sector ? { sector } : {}),
      ...(seeking ? { seeking } : {}),
    };
  }

  /**
   * PRIVATE availability. Only the broker may call this, and the broker never
   * relays the raw windows to a counterparty — it exposes the single mutual
   * slot (see broker.proposeMutualSlot). Founder availability lives on the
   * raise facet; investor/matchmaker pre-cleared windows on offerings.
   */
  availabilityWindows(): string[] {
    return this.profile.raise?.availability ?? this.profile.offerings?.calendar_windows ?? [];
  }

  /**
   * Spoke-side screening: if this profile carries a thesis filter, apply it
   * to a curated fit. Profiles without the facet screen nothing — again, the
   * behaviour difference between roles is data, not code.
   */
  screenOffer(fit: CuratedFit): ScreenVerdict {
    const filter = this.profile.thesis_filter;
    if (!filter) return { pass: true, reasons: ["no thesis filter on this profile"] };
    return applyThesisFilter(filter, fit);
  }

  /** The matchmaker facet: contacts who opted into intros, and only them. */
  introducibleContacts(): { eligible: NetworkContact[]; withheldCount: number } {
    const network = this.profile.network ?? [];
    const eligible = network.filter((c) => c.opted_in_to_intros);
    return { eligible, withheldCount: network.length - eligible.length };
  }
}

function tokensOf(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9-]+/)
      .filter((t) => t.length > 1),
  );
}

/**
 * Whole-token term matching: every token of the term must appear as a token
 * of the text. Substring containment is NOT enough — a thesis sector "ai"
 * must not match a candidate sector "retail".
 */
function textMatchesTerm(text: string, term: string): boolean {
  const textTokens = tokensOf(text);
  const termTokens = [...tokensOf(term)];
  return termTokens.length > 0 && termTokens.every((t) => textTokens.has(t));
}

function applyThesisFilter(filter: ThesisFilter, fit: CuratedFit): ScreenVerdict {
  const reasons: string[] = [];
  let pass = true;

  const sectorHit = filter.sectors.find((s) => textMatchesTerm(fit.sector, s));
  if (sectorHit) reasons.push(`sector "${fit.sector}" matches thesis sector "${sectorHit}"`);
  else {
    pass = false;
    reasons.push(`sector "${fit.sector}" outside thesis [${filter.sectors.join(", ")}]`);
  }

  const stageHit = filter.stage.find((s) => textMatchesTerm(fit.stage, s));
  if (stageHit) reasons.push(`stage "${fit.stage}" matches "${stageHit}"`);
  else {
    pass = false;
    reasons.push(`stage "${fit.stage}" outside thesis [${filter.stage.join(", ")}]`);
  }

  const geoHit = filter.geo.find((g) => textMatchesTerm(fit.geo, g));
  if (geoHit) reasons.push(`geo "${fit.geo}" matches "${geoHit}"`);
  else {
    pass = false;
    reasons.push(`geo "${fit.geo}" outside thesis [${filter.geo.join(", ")}]`);
  }

  const description = `${fit.oneliner} ${fit.sector} ${fit.stage}`.toLowerCase();
  for (const hp of filter.hard_pass) {
    // Literal-phrase guard: an entry fires only when the phrase itself appears
    // in the candidate's public text (e.g. "pure software SaaS"). Judgment
    // entries like "later than Series A" rely on the stage/sector gates above —
    // string matching cannot infer ordering semantics, and pretending it could
    // would manufacture silent false negatives.
    if (description.includes(hp.toLowerCase())) {
      pass = false;
      reasons.push(`hard pass: "${hp}"`);
    }
  }

  return { pass, reasons };
}
