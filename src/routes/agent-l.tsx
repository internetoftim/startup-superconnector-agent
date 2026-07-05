import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/agent-l")({
  head: () => ({
    meta: [
      { title: "Building your AI agent — Superconnect" },
      {
        name: "description",
        content:
          "Your personal AI agent is learning from your profile to represent you in high-signal matches.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});
