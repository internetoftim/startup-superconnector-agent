/**
 * FR-6 — Beat B: logistics execution ON a signed agreement (selectable coda,
 * off the hero path). The agent acts as the HANDS of an agreement, never as
 * unsolicited outbound: the email is a DRAFT the human reviews and sends
 * (P1 ships gmail.compose, not gmail.send — see PRD §7), the calendar entry
 * is a hold, and the seat comes from allocation the matchmaker controls.
 * All integrations are mocked at P0.
 */
import type { RepresentationProfile } from "./profile.ts";
import type { SignedAgreement } from "./agreement.ts";

export interface CalendarHold {
  title: string;
  when: string;
  attendees: string[];
  organizer: string;
  status: "HOLD — pending human confirmation";
}

export interface IntroEmailDraft {
  from: string;
  to: string[];
  subject: string;
  body: string;
  status: "DRAFT — NOT SENT (human reviews and sends; gmail.compose only at P1)";
}

export interface SeatReservation {
  event: string;
  reservedFor: string;
  seatsBefore: number;
  seatsAfter: number;
  status: "reserved from matchmaker-controlled allocation";
}

export interface LogisticsResult {
  calendarHold: CalendarHold;
  introEmailDraft: IntroEmailDraft;
  seatReservation: SeatReservation | null;
}

export function executeLogistics(
  signed: SignedAgreement,
  matchmakerProfile: RepresentationProfile,
): LogisticsResult {
  const a = signed.agreement;
  const [founderName, investorName] = a.introduction.between;
  const broker = a.parties.find((p) => p.role === "broker-of-record");
  const brokerName = broker?.principal ?? "matchmaker";
  const when = a.meeting?.when ?? "TBD";

  const calendarHold: CalendarHold = {
    title: `Intro: ${founderName} <> ${investorName} (brokered by ${brokerName})`,
    when,
    attendees: [founderName, investorName],
    organizer: brokerName,
    status: "HOLD — pending human confirmation",
  };

  // The draft references ONLY information already consented to in the
  // agreement — the same consent boundary the negotiation enforced.
  const founderDisclosures = a.consented_disclosures[founderName] ?? [];
  const introEmailDraft: IntroEmailDraft = {
    from: brokerName,
    to: [founderName, investorName],
    subject: `Intro: ${founderName} <> ${investorName} — ${when}`,
    body: [
      `${investorName}, meet ${founderName}.`,
      ``,
      ...founderDisclosures.filter((d) => !d.startsWith("nothing else")).map((d) => `- ${d}`),
      ``,
      `You're both confirmed for ${when} (15 minutes, in person).`,
      `Anything not listed above hasn't been shared — and won't be without an explicit opt-in.`,
      ``,
      `— drafted by ${brokerName}'s agent under the signed agreement ${a.id}`,
    ].join("\n"),
    status: "DRAFT — NOT SENT (human reviews and sends; gmail.compose only at P1)",
  };

  const eventAccess = matchmakerProfile.offerings?.event_access;
  const seatReservation: SeatReservation | null = eventAccess
    ? {
        event: eventAccess.event,
        reservedFor: founderName,
        seatsBefore: eventAccess.seats_i_control,
        seatsAfter: Math.max(0, eventAccess.seats_i_control - 1),
        status: "reserved from matchmaker-controlled allocation",
      }
    : null;

  return { calendarHold, introEmailDraft, seatReservation };
}
