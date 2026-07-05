import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";

const SYSTEM_PROMPT = `You are extracting a structured profile from unstructured founder/investor text.

Given the role (founder or investor), one-liner, and raw pasted text, output ONLY valid JSON, no preamble, no markdown fences, matching this schema:

If role is 'founder':
{
  "sector": string,
  "stage": string (pre-seed/seed/series-a/etc),
  "traction": string (short summary),
  "ask": string (funding amount + use of funds, or 'not specified'),
  "pitch_summary": string (2 sentences max)
}

If role is 'investor':
{
  "sector_focus": [array of strings],
  "stage_focus": [array of strings],
  "check_size": string (or 'not specified'),
  "thesis_summary": string (2 sentences max)
}`;

function stripFences(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return (fence ? fence[1] : trimmed).trim();
}

export const generateAgentProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({}).parse(input ?? {}))
  .handler(async ({ context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const { supabase, userId } = context;

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("role, one_liner, raw_text")
      .eq("id", userId)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);
    if (!profile) throw new Error("Profile not found. Please complete onboarding first.");

    const userMessage = `Role: ${profile.role}\nOne-liner: ${profile.one_liner}\n\nRaw text:\n${profile.raw_text ?? ""}`;

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-2.5-pro");

    const { text } = await generateText({
      model,
      system: SYSTEM_PROMPT,
      prompt: userMessage,
    });

    let agentProfile: Record<string, string | string[]>;
    try {
      agentProfile = JSON.parse(stripFences(text));
    } catch {
      throw new Error("AI returned invalid JSON. Please try again.");
    }

    const { error: updateError } = await supabase
      .from("profiles")
      // agent_profile column is added by migration; types regenerate after approval
      .update({ agent_profile: agentProfile } as never)
      .eq("id", userId);

    if (updateError) throw new Error(updateError.message);

    return { agentProfile };
  });
