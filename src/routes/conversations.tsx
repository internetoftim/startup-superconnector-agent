import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/conversations")({
  head: () => ({
    meta: [
      { title: "My Agent's Conversations — Superconnect" },
      { name: "robots", content: "noindex" },
    ],
  }),
});
