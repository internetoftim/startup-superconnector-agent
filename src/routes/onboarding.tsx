import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Rocket, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Superconnector" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

type Role = "founder" | "investor";

function OnboardingPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("founder");
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [rawText, setRawText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth" });
      } else {
        setUserId(data.user.id);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!name.trim() || !oneLiner.trim()) {
      toast.error("Please fill in your name and one-liner.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        role,
        name: name.trim(),
        one_liner: oneLiner.trim(),
        profile_link: profileLink.trim() || null,
        raw_text: rawText.trim() || null,
      });
      if (error) throw error;
      navigate({ to: "/confirmation" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile";
      toast.error(message);
      setSaving(false);
    }
  };

  const roleOptions: { value: Role; label: string; icon: React.ReactNode }[] = [
    { value: "founder", label: "I'm a Founder", icon: <Rocket className="h-4 w-4" /> },
    { value: "investor", label: "I'm an Investor", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          Superconnector
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Tell us about you
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your AI agent will use this to represent you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label>Your role</Label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((opt) => {
                  const active = role === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setRole(opt.value)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background text-foreground hover:bg-accent",
                      )}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="one-liner">One-liner</Label>
              <Input
                id="one-liner"
                required
                maxLength={150}
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                placeholder="What you do or what you invest in, in one sentence"
              />
              <p className="text-right text-xs text-muted-foreground">
                {oneLiner.length}/150
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-link">Pitch deck / profile link</Label>
              <Input
                id="profile-link"
                type="url"
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                placeholder="https://notion.so/... or LinkedIn URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="raw-text">Paste your pitch, thesis, or background here</Label>
              <Textarea
                id="raw-text"
                rows={8}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Anything your agent should know — company overview, investment thesis, past experience, etc."
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving || !userId}>
              {saving ? "Saving…" : "Create My Agent Profile"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
