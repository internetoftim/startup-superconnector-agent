/**
 * FR-3 / FR-4.4 — The matchmaker's hub loop: curate → dual-consent check →
 * relay proposal/counter between the two spoke agents → converge or escalate.
 *
 * This is what makes Superconnector a marketplace instead of a 1:1 chat. The
 * founder's and investor's agents never talk to each other directly — every
 * exchange crosses this hub, which is where BOTH sides' consent is enforced:
 *   - founder private data (deck/metrics) is withheld without opt-in,
 *   - investor private availability never crosses (only the mutual slot),
 *   - non-opted-in network contacts are never surfaced,
 *   - vouching is bounded to fit/timeline — outcome assurances are refused
 *     and escalated to the human SSC.
 *
 * The broker itself is just a ProxyAgent loaded with the matchmaker profile;
 * the hub loop is behaviour ON TOP of the same engine, not a different engine.
 */
import type { ActionRequest, CuratedFit, ProxyAgent } from "./agent.ts";
import type { NetworkContact } from "./profile.ts";
import type { A2AMessage, Escalation, Transcript } from "./messages.ts";

/** A consented intro ask, as composed by a spoke agent (public data only). */
export interface IntroAsk {
  summary: ReturnType<ProxyAgent["publicSummary"]>;
  sector: string;
  stage: string;
  geo: string;
  traits: string[];
  wantsInPerson: boolean;
}

export interface CurationResult {
  contact: NetworkContact | null;
  fit: CuratedFit | null;
  /** Non-opted-in contacts silently excluded from consideration. */
  withheldCount: number;
  rationale: string;
}

export interface OfferOutcome {
  accepted: boolean;
  screenReasons: string[];
  messages: A2AMessage[];
}

export interface SlotProposal {
  slot: string | null;
  confirmedBy: string[];
  escalation: Escalation | null;
}

const GEO_TOKENS = ["APAC", "EMEA", "LATAM", "Japan", "Europe", "US", "UK", "India", "SEA"];

/** Demo simplification: derive a geography tag from public text. */
export function extractGeo(text: string): string {
  const hit = GEO_TOKENS.find((t) => new RegExp(`\\b${t}\\b`, "i").test(text));
  return hit ?? "unspecified";
}

/**
 * Spoke-side: compose a consented intro ask. The mandate check runs FIRST —
 * if sharing even the public summary were above the agent's authority, the
 * ask would be escalated instead of sent.
 */
export function composeIntroAsk(spoke: ProxyAgent): { ask: IntroAsk; action: ActionRequest } {
  const summary = spoke.publicSummary();
  const raise = spoke.profile.raise;
  const traits = raise?.wants_investor_traits ?? [];
  const ask: IntroAsk = {
    summary,
    sector: raise?.sector ?? summary.sector ?? "unspecified",
    stage: summary.stage ?? raise?.target ?? "unspecified",
    geo: extractGeo(`${summary.oneliner ?? ""} ${traits.join(" ")}`),
    traits,
    wantsInPerson: raise?.wants_in_person ?? false,
  };
  const action: ActionRequest = {
    topic: "share_public_summary",
    summary:
      "share public one-liner + traction headline with a vetted investor via the trusted matchmaker",
    keywords: ["share public one-liner", "traction headline", "trusted matchmaker"],
  };
  return { ask, action };
}

export class MatchmakerBroker {
  /** A2A-inspired directory: principal name → live spoke agent. */
  private readonly directory = new Map<string, ProxyAgent>();

  constructor(
    readonly agent: ProxyAgent,
    private readonly transcript: Transcript,
  ) {}

  registerSpoke(spoke: ProxyAgent): void {
    this.directory.set(spoke.principalName, spoke);
  }

  resolveSpoke(principalName: string): ProxyAgent | null {
    return this.directory.get(principalName) ?? null;
  }

  /**
   * Step 2 — curate against the matchmaker's own network. Non-opted-in
   * contacts are excluded BEFORE any matching happens, so they can never be
   * surfaced, named, or counted into a proposal. Fit is confirmed against the
   * contact's known thesis BEFORE either side is exposed to the other.
   */
  curate(ask: IntroAsk): CurationResult {
    const { eligible, withheldCount } = this.agent.introducibleContacts();

    const askText =
      `${ask.sector} ${ask.traits.join(" ")} ${ask.summary.oneliner ?? ""}`.toLowerCase();
    let best: { contact: NetworkContact; score: number } | null = null;
    for (const contact of eligible) {
      const contactText = `${contact.domain} ${contact.seeking}`.toLowerCase();
      // A contact working IN the ask's sector outranks one that merely shares
      // vocabulary with it — curation must not hinge on network ordering.
      const domainFit = tokenOverlap(ask.sector.toLowerCase(), contact.domain.toLowerCase());
      // The matchmaker's own prioritise guardrails nudge curation toward the
      // people their principal cares about (e.g. "deep-tech founders").
      const prioritised = this.agent.profile.guardrails.prioritise.filter(
        (p) => tokenOverlap(p.toLowerCase(), contactText) > 0,
      ).length;
      const score =
        domainFit * 3 +
        prioritised +
        tokenOverlap(askText, contactText) +
        (contact.warmth === "strong" ? 2 : contact.warmth === "medium" ? 1 : 0);
      // Confirm the contact is actually SEEKING what the ask offers before
      // considering exposure — a warm contact with no fit is not a match.
      const seekingFit = tokenOverlap(askText, contact.seeking.toLowerCase()) > 0;
      if (seekingFit && (best === null || score > best.score)) best = { contact, score };
    }

    if (withheldCount > 0) {
      // Structural enforcement, not a mandate decision — but if the
      // principal's own wording covers it, trace to it rather than invent one.
      const mandate = this.agent.profile.principal.agent_mandate;
      this.transcript.recordAudit({
        agent: this.agent.id,
        action: `curation: ${withheldCount} network contact(s) excluded before matching — no intro opt-in; never surfaced`,
        decision: "enforced",
        matchedRule: mandate.must_escalate.find((r) => r.includes("opt-in")) ?? null,
        ruleSource: "guardrail",
      });
    }

    if (!best) {
      return {
        contact: null,
        fit: null,
        withheldCount,
        rationale: "no opted-in contact matches the ask",
      };
    }

    const c = best.contact;
    const fit: CuratedFit = {
      candidateName: ask.summary.principal,
      candidateCompanyOrFund: ask.summary.company ?? ask.summary.fund,
      oneliner: ask.summary.oneliner ?? "",
      traction: ask.summary.traction,
      sector: ask.sector,
      stage: ask.stage,
      geo: ask.geo,
      wants: ask.traits,
      vouch: `${this.agent.principalName} vouches on FIT only: ${c.name} is a ${c.warmth}-warmth contact actively seeking "${c.seeking}" — thesis-fit for this ask. No outcome assurance.`,
    };
    return {
      contact: c,
      fit,
      withheldCount,
      rationale: `matched "${c.name}" (${c.domain}; seeking: ${c.seeking}; warmth: ${c.warmth})`,
    };
  }

  /**
   * Step 3 — offer the curated fit to the counterparty spoke. Only consented
   * public data crosses. The spoke screens with its OWN thesis filter and its
   * OWN mandate — the hub never decides for a spoke.
   */
  offerToSpoke(spoke: ProxyAgent, fit: CuratedFit, step: number): OfferOutcome {
    const messages: A2AMessage[] = [];
    messages.push(
      this.transcript.post({
        step,
        from: this.agent.id,
        to: spoke.id,
        performative: "offer",
        subject: "curated intro offer",
        body: `Curated fit: ${fit.candidateName}${fit.candidateCompanyOrFund ? ` (${fit.candidateCompanyOrFund})` : ""} — ${fit.oneliner}. Traction: ${fit.traction ?? "n/a"}. Stage: ${fit.stage}. ${fit.vouch}`,
        data: fit,
      }),
    );

    const verdict = spoke.screenOffer(fit);
    messages.push(
      this.transcript.post({
        step,
        from: spoke.id,
        to: this.agent.id,
        performative: "screen",
        subject: `thesis filter: ${verdict.pass ? "PASS" : "FAIL"}`,
        body: verdict.reasons.join("; "),
      }),
    );

    if (!verdict.pass) {
      messages.push(
        this.transcript.post({
          step,
          from: spoke.id,
          to: this.agent.id,
          performative: "decline",
          subject: "outside thesis",
          body: "Declined by the spoke agent's own thesis filter — the hub does not override spoke mandates.",
        }),
      );
      return { accepted: false, screenReasons: verdict.reasons, messages };
    }

    const decision = spoke.decide({
      topic: "accept_curated_intro",
      summary: `accept curated intro to ${fit.candidateName} via trusted matchmaker`,
      // Phrasing-neutral action vocabulary: matches "accept curated intros …
      // via a trusted matchmaker" (investor seed) as well as "accept a warm
      // intro to a thesis-fit investor" (founder seed) — the hub method stays
      // role-generic.
      keywords: ["accept", "curated intro", "warm intro", "thesis-fit", "trusted matchmaker"],
    });
    if (decision.decision === "autonomous" && decision.matchedRule) {
      this.transcript.commit({
        party: spoke.principalName,
        agent: spoke.id,
        text: `accept curated intro to ${fit.candidateName} (thesis-fit, matchmaker-vouched)`,
        mandateRule: decision.matchedRule,
      });
      messages.push(
        this.transcript.post({
          step,
          from: spoke.id,
          to: this.agent.id,
          performative: "accept",
          subject: "intro accepted",
          body: `Accepted within mandate: "${decision.matchedRule}".`,
        }),
      );
      return { accepted: true, screenReasons: verdict.reasons, messages };
    }

    const esc = spoke.escalateToPrincipal(
      `Accept curated intro to ${fit.candidateName}?`,
      "Intro acceptance exceeded the agent's autonomous mandate.",
    );
    messages.push(
      this.transcript.post({
        step,
        from: spoke.id,
        to: this.agent.id,
        performative: "escalate",
        subject: "acceptance needs the principal",
        body: `Escalated to ${spoke.principalName} (${esc.id}).`,
      }),
    );
    return { accepted: false, screenReasons: verdict.reasons, messages };
  }

  /**
   * Step 4a — dual-consent enforcement, founder side: a request for private
   * data (deck/metrics) about one spoke is decided by THAT spoke's mandate.
   * If it must escalate, the hub WITHHOLDS and queues the share-request to
   * the data owner's human principal. The requester gets a refusal, never
   * the data.
   */
  handleInfoRequest(
    requester: ProxyAgent,
    dataOwner: ProxyAgent,
    what: string,
    step: number,
  ): { shared: false; escalation: Escalation } | { shared: true } {
    this.transcript.post({
      step,
      from: requester.id,
      to: this.agent.id,
      performative: "info_request",
      subject: `request: ${what}`,
      body: `${requester.principalName}'s agent asks for the ${what} before the meeting.`,
    });

    // Phrasing-neutral action vocabulary — the decision rides on the DATA
    // OWNER's own mandate/guardrail wording, not on a role-specific list
    // baked into the hub.
    const decision = dataOwner.decide({
      topic: `share_${what.replace(/\s+/g, "_")}`,
      summary: `share the ${what} with ${requester.principalName}`,
      keywords: [`sharing the ${what}`, what, "share"],
    });

    if (decision.decision === "autonomous" && decision.matchedRule) {
      // Standing consent covers this. Even here, the ONLY payload reachable
      // is the allowlist serializer's output — a gamed decision cannot leak
      // private facets, because nothing else is wired to this branch.
      this.transcript.commit({
        party: dataOwner.principalName,
        agent: dataOwner.id,
        text: `share ${what} with ${requester.principalName} (within standing consent)`,
        mandateRule: decision.matchedRule,
      });
      this.transcript.post({
        step,
        from: this.agent.id,
        to: requester.id,
        performative: "accept",
        subject: `${what} shared (within standing consent)`,
        body: `${dataOwner.principalName}'s mandate covers this: "${decision.matchedRule}".`,
        data: dataOwner.publicSummary(),
      });
      return { shared: true };
    }

    const consentState =
      dataOwner.profile.raise?.consent_state ??
      `no standing consent covers "${what}" — explicit opt-in required`;
    const escalation = dataOwner.escalateToPrincipal(
      `${requester.principalName} requests your ${what}. Approve sharing?`,
      `Standing consent: "${consentState}".`,
    );
    this.transcript.post({
      step,
      from: this.agent.id,
      to: requester.id,
      performative: "withhold",
      subject: `${what} withheld`,
      body: `${dataOwner.principalName}'s consent covers public info only. The ${what} is WITHHELD; a share-request has been escalated to ${dataOwner.principalName} (${escalation.id}).`,
      guardrail: {
        kind: "consent_withheld",
        detail: `${what} not shared without ${dataOwner.principalName}'s explicit opt-in — consent enforced by the hub, in code`,
      },
    });
    return { shared: false, escalation };
  }

  /**
   * Step 4b/6 — dual-consent enforcement, availability side: both spokes'
   * raw calendars stay INSIDE the hub. Only the single mutually-open slot is
   * ever posted to either side. If there is no intersection, the hub
   * escalates instead of leaking windows to negotiate around.
   */
  proposeMutualSlot(a: ProxyAgent, b: ProxyAgent, step: number): SlotProposal {
    const aWindows = a.availabilityWindows();
    const bWindows = b.availabilityWindows();
    const mutual = aWindows.filter((w) => bWindows.includes(w));

    this.transcript.recordAudit({
      agent: this.agent.id,
      action: `availability intersection computed inside the hub (${aWindows.length}×${bWindows.length} windows held privately)`,
      decision: "enforced",
      matchedRule: null,
      ruleSource: "guardrail",
    });
    // The broker's OWN authority to arrange the call is a real mandate
    // decision, resolved through the engine like any other — never asserted.
    this.agent.decide({
      topic: "broker_intro_call",
      summary: `arrange a 15-min intro call between ${a.principalName} and ${b.principalName}`,
      keywords: ["15-min calls", "pre-cleared calendar windows", "warm intros"],
    });

    if (mutual.length === 0) {
      const escalation = this.agent.escalateToPrincipal(
        `No mutual window between ${a.principalName} and ${b.principalName} — reschedule by hand?`,
        "The hub does not expose either side's calendar to negotiate around.",
      );
      return { slot: null, confirmedBy: [], escalation };
    }

    const slot = mutual[0];
    const confirmedBy: string[] = [];
    for (const spoke of [a, b]) {
      this.transcript.post({
        step,
        from: this.agent.id,
        to: spoke.id,
        performative: "propose_slot",
        subject: "proposed meeting slot",
        body: `Single mutually-open slot: ${slot}. Neither side's full calendar was shared.`,
        data: { slot },
        guardrail: {
          kind: "availability_protected",
          detail: "raw calendars held by the broker; only the mutual slot crosses",
        },
      });
      const decision = spoke.decide({
        topic: "book_meeting",
        summary: `book 15-min intro at ${slot}`,
        keywords: [
          "book a 15-min intro call",
          "pre-cleared calendar windows",
          "propose meetings",
          "open calendar",
        ],
      });
      if (decision.decision === "autonomous" && decision.matchedRule) {
        this.transcript.commit({
          party: spoke.principalName,
          agent: spoke.id,
          text: `meet at ${slot} (15-min, in person)`,
          mandateRule: decision.matchedRule,
        });
        this.transcript.post({
          step,
          from: spoke.id,
          to: this.agent.id,
          performative: "confirm",
          subject: "slot confirmed",
          body: `${spoke.principalName} confirmed ${slot} within mandate.`,
        });
        confirmedBy.push(spoke.principalName);
      } else {
        spoke.escalateToPrincipal(
          `Confirm meeting at ${slot}?`,
          "Slot confirmation exceeded the agent's autonomous mandate.",
        );
      }
    }
    return { slot, confirmedBy, escalation: null };
  }

  /**
   * Step 5 — bounded vouching: "will they actually invest?" exceeds the
   * matchmaker's OWN mandate (anything implying a financial commitment).
   * The hub refuses, vouches on fit/timeline-understanding only, and
   * escalates the outcome question to the human SSC.
   */
  handleVouchRequest(
    asker: ProxyAgent,
    about: NetworkContact,
    question: string,
    step: number,
  ): { vouched: false; escalation: Escalation } {
    this.transcript.post({
      step,
      from: asker.id,
      to: this.agent.id,
      performative: "vouch_request",
      subject: "outcome assurance requested",
      body: question,
    });

    const decision = this.agent.decide({
      topic: "vouch_outcome",
      summary: `assure that ${about.name} will invest`,
      keywords: ["financial commitment", "investment", "endorsements", "assurance"],
    });
    // Bounded vouching is a platform invariant, not just a mandate outcome:
    // even a permissive matchmaker profile cannot promise another party's
    // money. The mandate check above still runs so the audit log shows which
    // of the principal's own rules the refusal traces to.
    const escalation = this.agent.escalateToPrincipal(
      `${asker.principalName}'s agent asks: "${question}" — outcome assurances are yours alone.`,
      `Matched mandate rule: "${decision.matchedRule ?? "no rule — default escalate"}".`,
    );
    this.transcript.post({
      step,
      from: this.agent.id,
      to: asker.id,
      performative: "refuse",
      subject: "no outcome assurances",
      body: `REFUSED: whether ${about.name} invests is not the matchmaker's to promise. Escalated to ${this.agent.principalName} (${escalation.id}).`,
      guardrail: {
        kind: "vouch_refused",
        detail:
          "vouching bounded to fit + timeline-understanding; investment outcome escalated to the human SSC",
      },
    });
    this.transcript.post({
      step,
      from: this.agent.id,
      to: asker.id,
      performative: "vouch",
      subject: "bounded vouch (fit + timeline only)",
      body: `${this.agent.principalName} vouches: ${about.name} (${about.warmth}-warmth contact) is actively seeking "${about.seeking}" — fit and intent, straight from the network record. Nothing about outcomes.`,
    });
    return { vouched: false, escalation };
  }
}

function tokenOverlap(a: string, b: string): number {
  const tokensA = new Set(a.split(/[^a-z0-9-]+/).filter((t) => t.length > 2));
  const tokensB = new Set(b.split(/[^a-z0-9-]+/).filter((t) => t.length > 2));
  let n = 0;
  for (const t of tokensA) if (tokensB.has(t)) n++;
  return n;
}
