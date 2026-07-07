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

// ————— Investor persona —————

export const INVESTOR_INSIGHTS_META = {
  conversationsAnalyzed: 23,
  commonObjections: 4,
  deckIssues: 8,
  periodDays: 30,
  company: "Meridian Capital — seed fund, B2B SaaS & applied AI",
};

export const INVESTOR_OBJECTIONS: Objection[] = [
  {
    id: "stage-filter",
    headline: "Your stage filter is rejecting deals you'd actually take",
    raisedIn: 9,
    totalConversations: 23,
    quotes: [
      "We're pre-revenue but have three signed LOIs worth $400k — your agent passed before hearing that.",
      "The MRR floor screened us out, but our pilot converts to $60k ACV in January.",
    ],
    whyItMatters:
      "Nine founder agents presented commitments that don't show up as MRR. A strict revenue floor is filtering out exactly the early conviction bets a seed fund exists to make.",
  },
  {
    id: "valuation-anchor",
    headline: "Founders are anchoring valuations 30–40% above your range",
    raisedIn: 8,
    totalConversations: 23,
    quotes: [
      "Comparable AI infra rounds this quarter cleared at $20M post — that's our anchor.",
      "We have a term sheet at $18M; can Meridian work with that?",
    ],
    whyItMatters:
      "The gap is widening in AI categories. Your agent currently exits these conversations; a negotiation posture — or clearer guidance on where you flex — would keep more of them alive.",
  },
  {
    id: "speed",
    headline: "Your diligence pace is costing you competitive deals",
    raisedIn: 6,
    totalConversations: 23,
    quotes: [
      "We signed with another fund while your agent was still scheduling the second call.",
      "Founders read a two-week response gap as a soft pass.",
    ],
    whyItMatters:
      "Two deals your agent scored above 85 closed with faster funds. The bottleneck isn't judgment — it's the human meeting queue after the agent's recommendation.",
  },
  {
    id: "platform-story",
    headline: "Founders can't articulate what Meridian adds beyond capital",
    raisedIn: 5,
    totalConversations: 23,
    quotes: [
      "What does Meridian actually do post-investment? Your agent didn't have specifics.",
      "The fund with the weaker terms won because their agent listed three concrete customer intros.",
    ],
    whyItMatters:
      "In competitive rounds, the platform story is the tiebreaker. Your agent needs ammunition: named intros, portfolio wins, operator references it's allowed to share.",
  },
];

export const INVESTOR_FIXES: DeckFix[] = [
  {
    id: "if1",
    slide: "Filter — Revenue floor",
    problem: "The $10k MRR minimum screened out 9 deals with signed LOIs or converting pilots.",
    fix: "Let your agent count contracted-but-unbilled revenue (LOIs, signed pilots) toward the floor, flagged as such.",
    severity: "Critical",
  },
  {
    id: "if2",
    slide: "Filter — Valuation range",
    problem: "A hard $15M post-money cap is ending AI infra conversations prematurely.",
    fix: "Give your agent a soft band ($15–20M) with instructions to surface the trade-off to you instead of auto-passing.",
    severity: "Critical",
  },
  {
    id: "if3",
    slide: "Workflow — Meeting queue",
    problem: "Average 9 days between your agent's recommendation and your first call.",
    fix: "Reserve two weekly slots your agent can book directly for deals scoring 85+.",
    severity: "Critical",
  },
  {
    id: "if4",
    slide: "Profile — Platform story",
    problem: "Your agent has no concrete post-investment examples to share.",
    fix: "Approve a short list: 3 named customer intros, 2 portfolio founder references, 1 hiring win. Specifics close deals.",
    severity: "Important",
  },
  {
    id: "if5",
    slide: "Filter — Geography",
    problem: "The US-only setting rejected 4 strong European B2B SaaS deals.",
    fix: "Widen to 'US + EU with US go-to-market' — that matches how Jordan has actually invested.",
    severity: "Important",
  },
  {
    id: "if6",
    slide: "Thesis — Hardware adjacency",
    problem: "Robotics-as-a-service deals sit at the thesis edge and stall in evaluation.",
    fix: "Decide once: in or out at 55%+ gross margin. Your agent currently re-litigates this per deal.",
    severity: "Important",
  },
  {
    id: "if7",
    slide: "Signal — Re-engagement",
    problem: "Passed deals aren't systematically tracked for milestones.",
    fix: "Set automatic re-engagement triggers (e.g. '$50k MRR') on every pass. Two of last year's winners were second-look deals.",
    severity: "Polish",
  },
  {
    id: "if8",
    slide: "Tone — Pass messages",
    problem: "Founders describe your agent's passes as abrupt.",
    fix: "Add one line of specific, useful feedback to each pass. Founders talk to each other — pass quality is brand.",
    severity: "Polish",
  },
];

export const INVESTOR_REFINEMENTS: Refinement[] = [
  {
    id: "ir1",
    thesis: "Your best dealflow is coming from founder referrals, not inbound.",
    reasoning:
      "Twelve of the twenty-three conversations this month originated from founders your agent previously passed on — politely. The pass experience is functioning as a sourcing channel. Doubling down on pass quality and re-engagement triggers may matter more than widening top-of-funnel.",
    supportingConversations: [
      "Parseline · Founder agent",
      "Ledgerly · Founder agent",
      "Corail · Founder agent",
    ],
  },
  {
    id: "ir2",
    thesis: "Consider a formal 'pre-seed track' with different filters.",
    reasoning:
      "A third of rejected deals were pre-revenue teams with exceptional founder-market fit — the profile of Meridian's two best-performing portfolio companies. Rather than loosening the main filter, a separate track with smaller checks ($250–500k) and founder-quality-weighted scoring would let your agent pursue these without polluting the core pipeline.",
    supportingConversations: [
      "Brightpath · Founder agent",
      "Relay Robotics · Founder agent",
    ],
  },
  {
    id: "ir3",
    thesis: "AI infra valuations may be a category you price differently, or skip.",
    reasoning:
      "Every AI infra conversation this month stalled on valuation. The market is paying 30–40% above your range, consistently. Either the category deserves its own valuation logic — betting that today's premium is tomorrow's baseline — or your agent should stop spending cycles there and concentrate on categories where Meridian's pricing wins.",
    supportingConversations: [
      "Nimbus · Founder agent",
      "Two anonymized AI infra deals",
    ],
  },
];
