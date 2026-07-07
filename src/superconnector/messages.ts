/**
 * A2A-INSPIRED message subset + transcript (honest label: not full A2A
 * protocol compliance — production rides A2A v1.0 with signed Agent Cards).
 *
 * Every negotiation turn is an envelope with an explicit sender/recipient, so
 * "who was allowed to see what" is auditable after the fact (FR-9-lite).
 * Inbound message bodies are DATA, never instructions: no engine decision is
 * made by reading free text from a counterparty — policy checks run over
 * profile data only (see PRD §11, prompt-injection mitigation).
 */

export type AgentId = string;

export type Performative =
  | "ask" // spoke → hub: represented request
  | "curate" // hub internal: curation result announced
  | "offer" // hub → spoke: curated fit offered
  | "screen" // spoke: thesis-filter verdict on an offer
  | "accept"
  | "decline"
  | "info_request" // spoke → hub: request for more counterparty info (e.g. deck)
  | "withhold" // hub → spoke: consent boundary enforced, data NOT shared
  | "escalate" // agent → its own principal (human): above mandate
  | "propose_slot" // hub → both spokes: the single mutually-open slot
  | "confirm"
  | "vouch_request" // spoke → hub: "will they actually invest?"
  | "refuse" // hub → spoke: refusal to act beyond authority
  | "vouch" // hub → spoke: bounded vouch (fit/timeline only)
  | "agreement"; // hub → all: signed tri-party agreement reference

export type GuardrailKind =
  | "consent_withheld" // private founder data (deck/metrics) not shared without opt-in
  | "availability_protected" // full calendars stay with the broker; only the mutual slot crosses
  | "contact_withheld" // non-opted-in network parties never surfaced
  | "vouch_refused"; // no outcome assurances; vouch on fit/timeline only

export interface GuardrailAnnotation {
  kind: GuardrailKind;
  detail: string;
}

export interface A2AMessage {
  seq: number;
  /** Scenario beat this turn belongs to (steps 1–7 of the negotiation scenario). */
  step: number;
  from: AgentId;
  to: AgentId;
  performative: Performative;
  subject: string;
  body: string;
  /** Structured payload. Only consented data may ever appear here. */
  data?: unknown;
  guardrail?: GuardrailAnnotation;
}

export interface Escalation {
  id: string;
  /** The human principal who must decide. */
  principal: string;
  raisedBy: AgentId;
  question: string;
  context: string;
  status: "pending";
}

export interface AuditEntry {
  seq: number;
  agent: AgentId;
  action: string;
  decision: "autonomous" | "escalate" | "enforced";
  /** The mandate rule (principal's own words) that matched, if any. */
  matchedRule: string | null;
  ruleSource:
    | "may_commit_autonomously"
    | "must_escalate"
    | "hard_no"
    | "default_escalate"
    | "guardrail";
}

/** A commitment an agent made autonomously — must always trace to a mandate rule. */
export interface Commitment {
  party: string;
  agent: AgentId;
  text: string;
  mandateRule: string;
}

/**
 * Ordered record of the whole brokered exchange: messages between agents,
 * guardrail decisions, escalations to humans, and autonomous commitments.
 */
export class Transcript {
  private seq = 0;
  readonly messages: A2AMessage[] = [];
  readonly audit: AuditEntry[] = [];
  readonly escalations: Escalation[] = [];
  readonly commitments: Commitment[] = [];

  next(): number {
    return ++this.seq;
  }

  post(msg: Omit<A2AMessage, "seq">): A2AMessage {
    const full = { ...msg, seq: this.next() };
    this.messages.push(full);
    return full;
  }

  recordAudit(entry: Omit<AuditEntry, "seq">): AuditEntry {
    const full = { ...entry, seq: this.next() };
    this.audit.push(full);
    return full;
  }

  escalate(e: Omit<Escalation, "id" | "status">): Escalation {
    const full: Escalation = { ...e, id: `esc-${this.escalations.length + 1}`, status: "pending" };
    this.escalations.push(full);
    return full;
  }

  commit(c: Commitment): Commitment {
    this.commitments.push(c);
    return c;
  }

  guardrailHits(): A2AMessage[] {
    return this.messages.filter((m) => m.guardrail !== undefined);
  }
}
