import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateAgentProfile } from "@/lib/agent.functions";

export const Route = createFileRoute("/confirmation")({
  head: () => ({
    meta: [
      { title: "Setting up your agent — Superconnector" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const generate = useServerFn(generateAgentProfile);
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState<unknown>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generate({ data: {} });
      setAgent(result.agentProfile);
      toast.success("Your agent is ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile created — your agent is being set up
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Click below to train your AI agent on the details you shared.
        </p>

        <div className="mt-8">
          <Button onClick={handleGenerate} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate My Agent
              </>
            )}
          </Button>
        </div>

        {agent ? (
          <div className="mt-8 text-left">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">
              Your agent profile
            </h2>
            <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/40 p-4 text-xs text-foreground">
              {JSON.stringify(agent, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </main>
  );
}
