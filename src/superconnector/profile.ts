/**
 * FR-1 — The representation profile: ONE schema, THREE roles.
 *
 * Founder, investor, and matchmaker profiles all validate against this single
 * schema. The shared core is identity + mandate + guardrails; everything
 * role-specific (a raise, a thesis filter, a network) is an optional facet.
 * A new role is a new profile, not new code: the proxy engine reads facets
 * generically and never branches on who it represents.
 */
import { z } from "zod";

export const AgentMandateSchema = z.object({
  speaks_as: z.string(),
  tone: z.string(),
  /** Actions the agent may commit to autonomously, in the principal's words. */
  may_commit_autonomously: z.array(z.string()),
  /** Actions that must go to the human. Ambiguity always resolves here. */
  must_escalate: z.array(z.string()),
});

export const PrincipalSchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  fund: z.string().optional(),
  role: z.string().optional(),
  public_oneliner: z.string().optional(),
  traction_headline: z.string().optional(),
  stage: z.string().optional(),
  agent_mandate: AgentMandateSchema,
});

/** Founder facet: the raise, and the founder's explicit consent state. */
export const RaiseSchema = z.object({
  target: z.string(),
  sector: z.string(),
  wants_investor_traits: z.array(z.string()),
  consent_state: z.string(),
  availability: z.array(z.string()),
  wants_in_person: z.boolean(),
});

/** Investor facet: the thesis filter the investor's agent screens with. */
export const ThesisFilterSchema = z.object({
  sectors: z.array(z.string()),
  stage: z.array(z.string()),
  geo: z.array(z.string()),
  check_size: z.string(),
  hard_pass: z.array(z.string()),
  wants_from_matchmaker: z.string(),
});

/** Matchmaker facet: the network, with per-contact intro consent flags. */
export const NetworkContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.string(),
  role: z.string(),
  warmth: z.enum(["strong", "medium", "weak"]),
  offering: z.string(),
  seeking: z.string(),
  opted_in_to_intros: z.boolean(),
  note: z.string().optional(),
});

export const EventAccessSchema = z.object({
  event: z.string(),
  seats_i_control: z.number().int().nonnegative(),
  founder_meeting_slots: z.boolean(),
});

export const OfferingsSchema = z.object({
  intro_capacity_per_week: z.number().optional(),
  calendar_windows: z.array(z.string()).optional(),
  event_access: EventAccessSchema.optional(),
  advisory_slots_open: z.number().optional(),
  value_add: z.string().optional(),
  intro_calls_per_week: z.number().optional(),
});

export const GuardrailsSchema = z.object({
  hard_no: z.array(z.string()),
  prioritise: z.array(z.string()),
});

export const RepresentationProfileSchema = z.object({
  role: z.string().optional(),
  principal: PrincipalSchema,
  raise: RaiseSchema.optional(),
  thesis_filter: ThesisFilterSchema.optional(),
  network: z.array(NetworkContactSchema).optional(),
  offerings: OfferingsSchema.optional(),
  guardrails: GuardrailsSchema,
});

export type AgentMandate = z.infer<typeof AgentMandateSchema>;
export type Principal = z.infer<typeof PrincipalSchema>;
export type Raise = z.infer<typeof RaiseSchema>;
export type ThesisFilter = z.infer<typeof ThesisFilterSchema>;
export type NetworkContact = z.infer<typeof NetworkContactSchema>;
export type Offerings = z.infer<typeof OfferingsSchema>;
export type Guardrails = z.infer<typeof GuardrailsSchema>;
export type RepresentationProfile = z.infer<typeof RepresentationProfileSchema>;

/** Validate untrusted JSON into a profile. Throws with a legible message on mismatch. */
export function loadProfile(json: unknown): RepresentationProfile {
  const parsed = RepresentationProfileSchema.safeParse(json);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid representation profile:\n${issues}`);
  }
  return parsed.data;
}
