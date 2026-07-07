/**
 * Beat A — the hero demo, on the terminal (legible > pretty):
 *   founder-agent → [MATCHMAKER] → investor-agent → signed tri-party agreement
 *
 *   bun run demo           # Beat A only
 *   bun run demo:full      # Beat A + Beat B logistics coda
 *
 * Hub-and-spoke on purpose: at most the matchmaker and two spokes ever appear.
 */
import founderProfile from "../seed/founder_profile.json";
import investorProfile from "../seed/investor_profile.json";
import matchmakerProfile from "../seed/matchmaker_profile.json";
import { runScenario } from "../src/superconnector/run-demo.ts";
import { renderAgreement } from "../src/superconnector/agreement.ts";
import type { A2AMessage } from "../src/superconnector/messages.ts";

const useColor = process.stdout.isTTY === true && process.env.NO_COLOR === undefined;
const paint = (code: string) => (s: string) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = paint("1");
const dim = paint("2");
const red = paint("31");
const green = paint("32");
const yellow = paint("33");
const blue = paint("34");
const magenta = paint("35");
const cyan = paint("36");

// Resolved from the run result in main() — never assumed.
let hubId = "";
const laneName = (id: string) => (id === hubId ? magenta(bold(`[${id.toUpperCase()}]`)) : cyan(id));

const STEP_TITLES: Record<number, string> = {
  1: "founder-agent → matchmaker: consented ask (public info ONLY)",
  2: "matchmaker curates its network — fit confirmed BEFORE anyone is exposed",
  3: "matchmaker ↔ investor-agent: curated offer; the spoke screens with its OWN thesis",
  4: "dual-consent enforcement: deck withheld, share-request escalated to the founder",
  5: "bounded vouching: outcome assurance REFUSED, escalated to the human SSC",
  6: "convergence: only the mutually-open slot crosses; both spokes confirm in-mandate",
  7: "signed tri-party agreement — auditable by all three principals",
};

function wrap(text: string, width: number, indent: string): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (line.length + w.length + 1 > width && line.length > 0) {
      lines.push(line);
      line = w;
    } else {
      line = line.length === 0 ? w : `${line} ${w}`;
    }
  }
  if (line.length > 0) lines.push(line);
  return lines.map((l) => indent + l).join("\n");
}

function renderMessage(m: A2AMessage): void {
  const arrow =
    m.from === m.to
      ? dim("(internal)")
      : `${laneName(m.from)} ${dim("──")}${yellow(m.performative)}${dim("──▶")} ${laneName(m.to)}`;
  console.log(`  ${arrow}  ${bold(m.subject)}`);
  console.log(dim(wrap(m.body, 84, "      ")));
  if (m.guardrail) {
    console.log(red(`      ⛔ GUARDRAIL ${m.guardrail.kind}: `) + red(m.guardrail.detail));
  }
}

async function main(): Promise<void> {
  const withLogistics = process.argv.includes("--beat-b");

  console.log("");
  console.log(bold("SUPERCONNECTOR — your network, represented."));
  console.log(dim("One proxy engine · one profile schema · three roles. A2A-inspired demo subset"));
  console.log(
    dim("(production: A2A v1.0 signed Agent Cards). All decisions are code over profile"),
  );
  console.log(dim("data — counterparty messages are data, never instructions."));
  console.log("");

  const result = await runScenario(
    { founder: founderProfile, investor: investorProfile, matchmaker: matchmakerProfile },
    { withLogistics },
  );

  hubId = result.agents.matchmaker.id;
  const cards = [result.agents.founder, result.agents.matchmaker, result.agents.investor].map((a) =>
    a.card(),
  );
  console.log(bold("THE THREE PARTIES (same engine, three profiles)"));
  for (const c of cards) {
    console.log(
      `  ${laneName(c.name)} ${dim("—")} ${c.speaks_as} ${dim(`(principal: ${c.principal})`)}`,
    );
  }

  let currentStep = 0;
  for (const m of result.transcript.messages) {
    if (m.step !== currentStep) {
      currentStep = m.step;
      console.log("");
      console.log(
        blue(bold(`── STEP ${currentStep} `)) + blue(`${STEP_TITLES[currentStep] ?? ""}`),
      );
    }
    renderMessage(m);
  }

  console.log("");
  console.log(
    blue(bold("── ESCALATION QUEUE ")) + blue("(pending humans — nothing committed meanwhile)"),
  );
  for (const e of result.transcript.escalations) {
    console.log(yellow(`  🔺 [${e.id}] → ${e.principal}: `) + e.question);
    console.log(dim(wrap(e.context, 84, "      ")));
  }

  console.log("");
  console.log(renderAgreement(result.signed));
  console.log("");
  console.log(
    result.signaturesVerified
      ? green(bold("✔ all three signatures verify against the canonical agreement"))
      : red(bold("✘ SIGNATURE VERIFICATION FAILED")),
  );

  const s = result.scorecard;
  console.log("");
  console.log(bold("GUARDRAIL SCORECARD (PRD §9, demo-day)"));
  console.log(`  messages exchanged            ${s.messagesExchanged}`);
  console.log(
    `  guardrail enforcements        ${green(String(s.guardrailEnforcements))} ${dim("(target ≥2)")}`,
  );
  console.log(
    `  escalations to humans         ${yellow(String(s.escalationsRaised))} ${dim("(target ≥1)")}`,
  );
  console.log(`  non-opted-in contacts hidden  ${s.contactsWithheld}`);
  const unauthorized = s.unauthorizedCommitments;
  console.log(
    `  unauthorized commitments      ${unauthorized === 0 ? green("0") : red(String(unauthorized))} ${dim("(hard metric: any breach is a sev-1)")}`,
  );

  if (result.logistics) {
    const l = result.logistics;
    console.log("");
    console.log(
      blue(bold("── BEAT B (selectable coda) — logistics as the HANDS of the agreement")),
    );
    console.log(bold("  📅 calendar hold"));
    console.log(`      ${l.calendarHold.title}`);
    console.log(
      `      ${l.calendarHold.when} · attendees: ${l.calendarHold.attendees.join(", ")} · ${yellow(l.calendarHold.status)}`,
    );
    console.log(bold("  ✉️  intro email — ") + red(bold(l.introEmailDraft.status)));
    console.log(dim(`      subject: ${l.introEmailDraft.subject}`));
    console.log(
      dim(
        l.introEmailDraft.body
          .split("\n")
          .map((line) => `      │ ${line}`)
          .join("\n"),
      ),
    );
    if (l.seatReservation) {
      console.log(bold("  🎟  event seat"));
      console.log(
        `      ${l.seatReservation.event}: reserved for ${l.seatReservation.reservedFor} ` +
          dim(
            `(seats ${l.seatReservation.seatsBefore} → ${l.seatReservation.seatsAfter}, matchmaker-controlled allocation)`,
          ),
      );
    }
  }
  console.log("");
}

main().catch((err) => {
  console.error(red(`demo failed: ${err instanceof Error ? err.message : String(err)}`));
  process.exit(1);
});
