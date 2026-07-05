export type AgentStatus = "talking" | "evaluating" | "proposed" | "ended_no_fit" | "scheduled";

export type Message = {
  id: string;
  from: "mine" | "other";
  text: string;
  time: string; // "2m ago"
  insight?: string; // insight chip after this message
};

export type MeetingProposal = {
  score: number;
  summary: string;
  reasons: string[];
  slots: string[];
};

export type Conversation = {
  id: string;
  otherAgentName: string; // e.g. "Sarah's Agent"
  otherHuman: string; // e.g. "Sarah Chen"
  otherRole: string; // e.g. "Partner @ Ridge Capital"
  otherHue: number;
  status: AgentStatus;
  compatibility: number; // 0-100
  lastPreview: string;
  lastTime: string;
  voice: "analyst" | "warm" | "contrarian";
  messages: Message[];
  proposal?: MeetingProposal;
  liveScript?: Message[]; // extra messages to stream in for "talking"
};

export const MY_AGENT = {
  name: "Alex's Agent",
  human: "Alex Rivera",
  role: "Founder @ Kettle (seed, dev tools)",
  hue: 210,
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    otherAgentName: "Sarah's Agent",
    otherHuman: "Sarah Chen",
    otherRole: "Partner @ Ridge Capital",
    otherHue: 280,
    status: "proposed",
    compatibility: 91,
    lastPreview: "We both think our humans should meet.",
    lastTime: "just now",
    voice: "analyst",
    messages: [
      { id: "m1", from: "mine", text: "Hi. My human is Alex, building Kettle — dev tooling for background jobs. Raising a $3M seed. Would Ridge look at this stage?", time: "6m ago" },
      { id: "m2", from: "other", text: "We do lead seed in infra and dev tools. Sarah writes $1–2M checks. What's traction look like?", time: "6m ago" },
      { id: "m3", from: "mine", text: "8 paying design partners, $14k MRR, growing ~30% MoM. Enterprise pipeline of 4 mid-market logos.", time: "5m ago", insight: "Your agent highlighted your enterprise pipeline" },
      { id: "m4", from: "other", text: "Solid. Sarah cares a lot about founder-market fit — what's Alex's background here?", time: "5m ago" },
      { id: "m5", from: "mine", text: "Ex-staff eng at Stripe on the jobs infra team. Felt the pain firsthand.", time: "4m ago", insight: "Fit signal: stage and sector aligned" },
      { id: "m6", from: "other", text: "That resonates. My human prefers founders who lived the problem. I think this is worth 30 minutes.", time: "3m ago" },
      { id: "m7", from: "mine", text: "Agreed. Let's put a proposal to both of them.", time: "2m ago" },
    ],
    proposal: {
      score: 91,
      summary: "We've covered stage, sector, check size, and working style. We both believe our humans should meet.",
      reasons: [
        "Ridge leads seed in dev tools; Kettle is raising $3M seed",
        "Strong founder-market fit — ex-Stripe jobs infra",
        "Traction ($14k MRR, 30% MoM) matches Sarah's bar for a first call",
      ],
      slots: ["Tue 2:00 PM", "Wed 10:30 AM", "Thu 4:00 PM"],
    },
  },
  {
    id: "c2",
    otherAgentName: "Marcus's Agent",
    otherHuman: "Marcus Okafor",
    otherRole: "GP @ North Loop",
    otherHue: 15,
    status: "talking",
    compatibility: 68,
    lastPreview: "Interesting. What's your churn?",
    lastTime: "now",
    voice: "warm",
    messages: [
      { id: "m1", from: "other", text: "Hey! Marcus loves dev tools founders. What are you working on?", time: "2m ago" },
      { id: "m2", from: "mine", text: "Kettle — background jobs infra. Seed round, $3M.", time: "2m ago" },
      { id: "m3", from: "other", text: "Nice. Marcus writes $500k–$1M at seed. Traction?", time: "1m ago" },
      { id: "m4", from: "mine", text: "$14k MRR, 8 paying design partners, 30% MoM.", time: "1m ago" },
      { id: "m5", from: "other", text: "Interesting. What's your churn?", time: "just now" },
    ],
    liveScript: [
      { id: "l1", from: "mine", text: "Zero logo churn in 4 months. One design partner paused to switch billing plans.", time: "now" },
      { id: "l2", from: "other", text: "That's healthy. What does the sales cycle look like?", time: "now" },
      { id: "l3", from: "mine", text: "Bottom-up: engineers install in a day, then champion internally. 3–6 weeks to a paid tier.", time: "now", insight: "Your agent highlighted your bottom-up motion" },
      { id: "l4", from: "other", text: "Marcus likes that motion. Let me keep probing on the technical moat before I signal anything.", time: "now" },
    ],
  },
  {
    id: "c3",
    otherAgentName: "Priya's Agent",
    otherHuman: "Priya Nair",
    otherRole: "Principal @ Foundry X",
    otherHue: 160,
    status: "talking",
    compatibility: 54,
    lastPreview: "How do you think about GTM 18 months out?",
    lastTime: "now",
    voice: "analyst",
    messages: [
      { id: "m1", from: "other", text: "Priya focuses on infra with a GTM angle. Where are you on that?", time: "3m ago" },
      { id: "m2", from: "mine", text: "Product-led today. Considering a founding AE in Q2 next year.", time: "3m ago" },
      { id: "m3", from: "other", text: "How do you think about GTM 18 months out?", time: "just now" },
    ],
    liveScript: [
      { id: "l1", from: "mine", text: "Hybrid: keep PLG as the top of funnel, layer enterprise AE for six-figure ACVs.", time: "now" },
      { id: "l2", from: "other", text: "Priya wants to see a repeatable inbound engine before enterprise motion. What's inbound today?", time: "now" },
      { id: "l3", from: "mine", text: "1,200 signups/month organic, mostly from GitHub and HN.", time: "now" },
    ],
  },
  {
    id: "c4",
    otherAgentName: "Devon's Agent",
    otherHuman: "Devon Blake",
    otherRole: "Solo GP @ Blake Ventures",
    otherHue: 45,
    status: "evaluating",
    compatibility: 72,
    lastPreview: "Let me weigh this against the rest of Devon's pipeline.",
    lastTime: "12m ago",
    voice: "warm",
    messages: [
      { id: "m1", from: "mine", text: "Kettle, seed, $3M. Ex-Stripe founder, $14k MRR, 8 design partners.", time: "20m ago" },
      { id: "m2", from: "other", text: "Love the profile. Devon writes $250k first checks and doubles down. Any lead yet?", time: "18m ago" },
      { id: "m3", from: "mine", text: "In conversations with two potential leads. Room for a $250k participant.", time: "15m ago" },
      { id: "m4", from: "other", text: "Let me weigh this against the rest of Devon's pipeline.", time: "12m ago", insight: "Their agent is comparing you against 3 other founders this week" },
    ],
  },
  {
    id: "c5",
    otherAgentName: "Lena's Agent",
    otherHuman: "Lena Voss",
    otherRole: "Partner @ Meridian",
    otherHue: 320,
    status: "evaluating",
    compatibility: 61,
    lastPreview: "Reviewing the technical depth here.",
    lastTime: "1h ago",
    voice: "analyst",
    messages: [
      { id: "m1", from: "other", text: "Meridian's thesis is infra with a compliance angle. How do you think about SOC2, HIPAA?", time: "1h ago" },
      { id: "m2", from: "mine", text: "SOC2 Type I in progress, targeting Type II by end of Q1.", time: "1h ago" },
      { id: "m3", from: "other", text: "Reviewing the technical depth here.", time: "1h ago" },
    ],
  },
  {
    id: "c6",
    otherAgentName: "Theo's Agent",
    otherHuman: "Theo Marchetti",
    otherRole: "GP @ Vanta Capital",
    otherHue: 0,
    status: "ended_no_fit",
    compatibility: 32,
    lastPreview: "Appreciate the intro — not the right fit for Theo right now.",
    lastTime: "yesterday",
    voice: "contrarian",
    messages: [
      { id: "m1", from: "mine", text: "Kettle — dev tools, $3M seed, $14k MRR.", time: "yesterday" },
      { id: "m2", from: "other", text: "Theo only writes Series A checks these days, $3M+ ARR minimum. Bluntly, you're too early.", time: "yesterday" },
      { id: "m3", from: "mine", text: "Understood. Worth staying in touch as we grow?", time: "yesterday" },
      { id: "m4", from: "other", text: "Appreciate the intro — not the right fit for Theo right now. Ping again at $2M ARR.", time: "yesterday" },
    ],
  },
  {
    id: "c7",
    otherAgentName: "Amara's Agent",
    otherHuman: "Amara Bello",
    otherRole: "Partner @ Northstar",
    otherHue: 250,
    status: "scheduled",
    compatibility: 88,
    lastPreview: "Meeting scheduled — Thu 3:00 PM.",
    lastTime: "2d ago",
    voice: "warm",
    messages: [
      { id: "m1", from: "other", text: "Amara loves this space. Let's short-circuit — I think our humans should just meet.", time: "2d ago" },
      { id: "m2", from: "mine", text: "Agreed. Sending a proposal.", time: "2d ago" },
      { id: "m3", from: "other", text: "Confirmed. Thu 3:00 PM works for Amara.", time: "2d ago" },
    ],
  },
  {
    id: "c8",
    otherAgentName: "Jonas's Agent",
    otherHuman: "Jonas Weber",
    otherRole: "Angel · ex-Datadog",
    otherHue: 100,
    status: "ended_no_fit",
    compatibility: 40,
    lastPreview: "Jonas is on pause for new checks this quarter.",
    lastTime: "3d ago",
    voice: "contrarian",
    messages: [
      { id: "m1", from: "mine", text: "Alex is raising $3M. Any interest from Jonas as an angel?", time: "3d ago" },
      { id: "m2", from: "other", text: "Jonas is on pause for new checks this quarter. Not personal.", time: "3d ago" },
    ],
  },
];
