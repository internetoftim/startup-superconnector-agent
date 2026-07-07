# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Superconnector is a demo app where founders and investors each get an AI agent that negotiates intros on their behalf. It's a Lovable-generated project built on the TanStack Start template (`tanstack_start_ts_current`): React 19 + TanStack Start (SSR) + TanStack Router (file-based routing) + Tailwind CSS v4 + shadcn/ui, with Supabase for auth/database and the Vercel AI SDK routed through the Lovable AI Gateway.

**Lovable sync warning** (from AGENTS.md): this repo is connected to Lovable. Never rewrite pushed git history (no force-push, rebase, amend, or squash of pushed commits), and keep the connected branch in a working state — commits sync back into the Lovable editor.

## Commands

Bun is the package manager (`bun.lock`, `bunfig.toml`).

- `bun install` — install dependencies. Note: `bunfig.toml` enforces a 24h supply-chain guard (`minimumReleaseAge`); confirm with the user before adding any package to `minimumReleaseAgeExcludes`.
- `bun run dev` — start the Vite dev server (SSR).
- `bun run build` — production build (`build:dev` for a development-mode build).
- `bun run lint` — ESLint (includes Prettier as a lint rule).
- `bun run format` — Prettier write.

There is no test suite or typecheck script; `tsc` runs with `noEmit` via editor tooling only (`npx tsc --noEmit` works if needed).

## Architecture

### Routing (TanStack Start file-based)

Every `.tsx` file in `src/routes/` is a route — see `src/routes/README.md` for the naming conventions (`$param` for dynamic segments, `{-$param}` optional, `$` splat). Do **not** create `src/pages/` or Next.js/Remix-style layouts. `src/routes/__root.tsx` is the only root layout; it registers head meta, the `QueryClientProvider`, `Toaster`, and the global 404/error components — preserve its `<Outlet />`. `src/routeTree.gen.ts` is auto-generated; never edit it.

App flow: `/` (landing) → `/auth` → `/onboarding` (chat-style Q&A with a dual founder/investor persona) → `/confirmation` (persists the profile and calls the AI server function) → `/agent-profile`, `/conversations`, `/insights`. `/demo-video` is a self-contained animated demo page.

### Build config

`vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which already bundles tanstackStart, React, Tailwind, tsconfig paths, nitro, the `@` alias, and env injection — **do not add those plugins manually** (duplicates break the app). Route code-splitting is deliberately disabled there to avoid a TanStack planner bug. `src/server.ts` is a custom SSR entry that wraps TanStack's server entry with error normalization; `src/start.ts` registers global middleware (`attachSupabaseAuth` on every server-function call from the client, plus a catch-all error page).

### Supabase integration (`src/integrations/supabase/`)

Most files here are marked "automatically generated. Do not edit it directly":

- `client.ts` — browser client (lazy proxy), reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` (falls back to non-`VITE_` vars during SSR). Import as `import { supabase } from "@/integrations/supabase/client"`.
- `client.server.ts` — service-role client that bypasses RLS; server-only admin use.
- `auth-attacher.ts` — client middleware that attaches the user's bearer token to serverFn RPCs (registered globally in `src/start.ts`).
- `auth-middleware.ts` — `requireSupabaseAuth`, a server middleware that validates the bearer token and provides `{ supabase, userId, claims }` in context.
- `types.ts` — generated database types.

Database schema lives in `supabase/migrations/`. Currently one user-facing table: `profiles` (keyed to `auth.users.id`, `role` is `'founder' | 'investor'`, with per-user RLS policies). Columns added by pending migrations may not yet exist in `types.ts` (which regenerates after migration approval) — existing code casts such updates with `as never` (see `agent.functions.ts`).

### Server functions and AI

`src/lib/agent.functions.ts` is the pattern for authenticated server functions: `createServerFn({ method: "POST" })` + `.middleware([requireSupabaseAuth])` + a zod `.validator()`. AI calls go through the Lovable AI Gateway (`src/lib/ai-gateway.server.ts`, an OpenAI-compatible provider at `ai.gateway.lovable.dev`) using the `ai` package's `generateText`; the gateway key comes from the server-only `LOVABLE_API_KEY` env var. Server-only modules must be named `*.server.ts` — ESLint blocks the Next.js `server-only` package.

### Demo data vs. real data

Most product screens are demo-driven: `/conversations`, `/insights`, and the agent network render hardcoded fixture data from `src/lib/conversations-data.ts`, `src/lib/agent-network-data.ts`, and `src/lib/insights-data.ts` (typed exports, no backend). Only the onboarding → confirmation flow touches Supabase and the AI gateway. When extending a screen, check whether it's fixture-backed before assuming there's a real data source.

### UI conventions

- shadcn/ui primitives live in `src/components/ui/` (configured via `components.json`, `@/` alias → `src/`). Feature components are grouped per screen: `agent-learning/`, `auth/`, `conversations/`, `insights/`, `onboarding-chat/`.
- Tailwind v4 with no `tailwind.config` — design tokens (colors, radii, fonts) are defined in `src/styles.css` via `@theme`. Fonts: Inter (sans) and Fraunces (serif), loaded in `__root.tsx`.
- `src/lib/utils.ts` exports the standard `cn()` helper.

## Other notes

- Feature specs live in `features/` (e.g. `linkedin-authentication.md` documents the planned LinkedIn OIDC sign-in via Supabase Auth).
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (client) and their non-`VITE_` counterparts (server); `LOVABLE_API_KEY` is a server secret configured outside the repo.
- ESLint disables `@typescript-eslint/no-unused-vars`; Prettier violations are lint errors, so run `bun run format` before committing.
