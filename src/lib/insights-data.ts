export type Severity = "Critical" | "Important" | "Polish";

export type Objection = {
  id: string;
  headline: string;
  raisedIn: number;
  totalConversations: number;
  quotes: string[];
  whyItMatters: string;
};

export type DeckFix = {
  id: string;
  slide: string;
  problem: string;
  fix: string;
  severity: Severity;
};

export type Refinement = {
  id: string;
  thesis: string;
  reasoning: string;
  supportingConversations: string[];
};

export const INSIGHTS_META = {
  conversationsAnalyzed: 14,
  commonObjections: 4,
  deckIssues: 11,
  periodDays: 30,
  company: "Freightline — B2B SaaS for mid-market logistics",
};

export const OBJECTIONS: Objection[] = [
  {
    id: "market-size",
    headline: "Market size feels unproven",
    raisedIn: 9,
    totalConversations: 14,
    quotes: [
      "The top-down TAM math is doing a lot of work here — I'd want to see it built from actual customer contracts.",
      "Logistics is huge, sure, but the addressable slice for a 20-person company is much smaller than the deck implies.",
    ],
    whyItMatters:
      "Nearly every partner-tier agent stalled on the same slide. Without a defensible bottom-up number, the round narrative reads as speculative.",
  },
  {
    id: "pricing",
    headline: "The pricing model doesn't match the buyer",
    raisedIn: 7,
    totalConversations: 14,
    quotes: [
      "Per-shipment pricing is a procurement nightmare for the exact ops leaders you're selling to.",
      "I'd expect a seat-based or platform fee — the current model punishes your best customers for growing.",
    ],
    whyItMatters:
      "Pricing objections tend to compound: they slow diligence and push valuation conversations down. Fixing this unlocks faster term sheets.",
  },
  {
    id: "founder-market-fit",
    headline: "Founder–market fit isn't obvious",
    raisedIn: 6,
    totalConversations: 14,
    quotes: [
      "Neither founder has operated a freight brokerage. Who's the customer whisperer here?",
      "Great product instincts, but I want to know why this team wins in a relationship-driven industry.",
    ],
    whyItMatters:
      "Investors are pattern-matching. A one-line answer about domain access — an advisor, a design partner, a prior role — usually neutralizes this in the first meeting.",
  },
  {
    id: "incumbents",
    headline: "Underestimates the incumbents",
    raisedIn: 5,
    totalConversations: 14,
    quotes: [
      "You're framing project44 and FourKites as legacy. They're not — they're funded and moving.",
      "What stops the incumbent from bundling this feature into their next release?",
    ],
    whyItMatters:
      "The competitive slide invites skepticism rather than closing it. A clearer wedge — and a candid read on incumbents — signals maturity.",
  },
];

export const DECK_FIXES: DeckFix[] = [
  {
    id: "f1",
    slide: "Slide 4 — Market",
    problem:
      "Investors' agents consistently questioned your top-down TAM methodology.",
    fix: "Replace top-down TAM with a bottom-up build from your current pipeline: number of shippers × average freight spend × your take rate.",
    severity: "Critical",
  },
  {
    id: "f2",
    slide: "Slide 7 — Pricing",
    problem: "Per-shipment pricing was flagged as misaligned with buyer psychology.",
    fix: "Show a two-tier structure: platform fee + optional per-shipment for overages. Include a worked example for a 500-shipment/month customer.",
    severity: "Critical",
  },
  {
    id: "f3",
    slide: "Slide 2 — Team",
    problem: "Founder–market fit is implied, not stated.",
    fix: "Add one line under each founder connecting them to logistics: prior role, design partner, or named advisor from the industry.",
    severity: "Critical",
  },
  {
    id: "f4",
    slide: "Slide 9 — Competition",
    problem: "The 2×2 positions incumbents as sleepy. Agents pushed back on this framing.",
    fix: "Reframe the axes around your actual wedge (real-time exception routing) and acknowledge incumbents by name with a specific differentiator.",
    severity: "Important",
  },
  {
    id: "f5",
    slide: "Slide 5 — Product",
    problem: "The product demo screenshots are dense and hard to parse in 30 seconds.",
    fix: "Cut to a single before/after workflow. One customer, one KPI (dwell time), one number that moved.",
    severity: "Important",
  },
  {
    id: "f6",
    slide: "Slide 6 — Traction",
    problem: "MRR chart looks impressive but hides churn.",
    fix: "Show net revenue retention and logo retention alongside MRR. Investors' agents specifically asked for this three times.",
    severity: "Important",
  },
  {
    id: "f7",
    slide: "Slide 10 — GTM",
    problem: "GTM reads as 'hire more AEs' without a repeatable motion.",
    fix: "Describe your best-performing channel with specifics: CAC, payback, and why it works for this ICP.",
    severity: "Important",
  },
  {
    id: "f8",
    slide: "Slide 11 — Financials",
    problem: "Burn multiple isn't shown; agents inferred it and flagged it as high.",
    fix: "Add burn multiple and gross margin trend. If the numbers are still finding their level, say so directly.",
    severity: "Important",
  },
  {
    id: "f9",
    slide: "Slide 3 — Problem",
    problem: "Problem statement is founder-voice rather than customer-voice.",
    fix: "Open with a direct quote from a design partner. Two lines is enough.",
    severity: "Polish",
  },
  {
    id: "f10",
    slide: "Slide 8 — Roadmap",
    problem: "Roadmap has 12-month ambitions that dilute the near-term story.",
    fix: "Cut to a 6-month roadmap tied to the round. Move the rest to an appendix slide.",
    severity: "Polish",
  },
  {
    id: "f11",
    slide: "Slide 1 — Cover",
    problem: "Tagline is generic ('The future of logistics').",
    fix: "Replace with a specific claim in your customer's language — e.g. 'Cut exception handling from 40 minutes to 4.'",
    severity: "Polish",
  },
];

export const REFINEMENTS: Refinement[] = [
  {
    id: "r1",
    thesis: "Consider leading with the enterprise segment.",
    reasoning:
      "Seven of your fourteen conversations circled back to the same theme: your product's exception-routing workflow is most valuable to shippers doing more than 2,000 loads a month. The mid-market pitch works, but the enterprise pitch is what excited investors. Repositioning the round narrative — even if you keep serving mid-market — would let you anchor to a bigger number and a clearer buyer.",
    supportingConversations: [
      "Redwood Ventures · Partner agent",
      "Meridian Capital · Principal agent",
      "Northline · Partner agent",
    ],
  },
  {
    id: "r2",
    thesis: "Reframe the product as a system of record, not a workflow tool.",
    reasoning:
      "Workflow tools compress in a downturn; systems of record compound. Multiple investor agents drew this distinction unprompted. If your data — shipment exceptions, carrier performance, resolution notes — is the durable asset, the story becomes about accumulation rather than automation. This affects your pricing model, your defensibility slide, and the shape of your roadmap.",
    supportingConversations: [
      "Foundry Group · GP agent",
      "Ironclad Ventures · Partner agent",
    ],
  },
  {
    id: "r3",
    thesis: "The channel story is stronger than the product story right now.",
    reasoning:
      "Four separate investor agents highlighted your partnership with a mid-tier TMS as more interesting than the standalone product. There may be a version of this business that ships as an embedded layer inside three or four TMS platforms rather than as a direct-sold app. Worth pressure-testing with a design partner before the next round.",
    supportingConversations: [
      "Coastal Partners · Partner agent",
      "Wavelength · Principal agent",
    ],
  },
];
