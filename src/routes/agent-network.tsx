import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/agent-network")({
  head: () => ({
    meta: [
      { title: "Agent Network — Superconnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
});
