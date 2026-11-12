# Project Constitution — React TanStack Query — Events

This document defines the non-negotiable foundations for this repository. Read it before adding or changing features.

## Guiding Principles

- **Simplicity first** — prefer the smallest solution that solves the problem. If a change needs a long explanation, it is probably over-engineered.
- **No hardcoded secrets or endpoints** — configuration belongs in environment variables; visual design tokens belong in styles, not in `.env` files.
- **Traceability** — every value, dependency, and route should make its origin and purpose obvious.
- **Debuggability** — fail loudly and visibly; avoid silent fallbacks that hide broken data.
- **Official patterns** — use the documented API of each framework and library before inventing a workaround.
- **Portfolio clarity** — this repository is part of a public portfolio. Code should read as clean, intentional, and easy for a reviewer to follow. As a follow-along project, its purpose is to demonstrate the concepts practised in the course, not to imitate production scale.

## Technology Stack Foundations

| Layer | Choice | Rationale |
| --- | --- | --- |
| Frontend | React 18 + Vite | Fast iteration for the course project. |
| Server state | TanStack Query v5 | Caching, background refetching, mutations, and invalidation. |
| Routing | React Router 6 | Routes and a loader/action pair for editing. |
| Backend | Express 5 | Event API with search and image endpoints; runs as a Vercel Function. |
| Persistence | Supabase Postgres (postgres.js) | Durable storage on serverless hosting; one schema (`react_tanstack`) in the shared portfolio database. |
| Hosting | Vercel Services + Cron | SPA and API ship together on one origin; nightly demo reset. |
| Styling | Plain CSS | Keeps the focus on query behaviour. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project for learning TanStack Query. It is intentionally a small CRUD app; authentication and pagination are out of scope. The public demo is kept clean by a nightly reset, not by moderation.

### 2. Environment Isolation

- Runtime configuration comes from environment variables: `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` (Supabase integration) and `CRON_SECRET`. Locally they live in the gitignored root `.env.local` (`vercel env pull .env.local`).
- Document every variable in the README and `AGENTS.md`.
- Never commit keys, tokens, database URLs, or credentials, and never log them or send database errors to the browser.

### 3. Architecture

- All server-state access goes through `src/utils/http.js`; components should not call `fetch` directly.
- Query keys are part of the API: keep them consistent across queries, loaders, and invalidations.
- The Express API stays small: every route lives under `/api`, validates input, and never reads files at runtime (SQL lives in `backend/db/sql.js`).
- The reset endpoint refuses any request without `Authorization: Bearer $CRON_SECRET`.

### 4. Data and State

- TanStack Query owns the client cache; the `react_tanstack.events` table is the source of truth. Schema and seed changes stay idempotent.
- Only touch the `react_tanstack` schema; the database is shared with other portfolio apps.
- Mutations must invalidate the affected query keys.
- Artificial delays exist to exercise loading states; do not remove them without updating the UI expectations.

### 5. Styling and UX

- Plain CSS in `src/index.css`; keep list, modal, and form styles shared.
- Loading and error blocks should occupy the same space as the content they replace.
- Do not add a UI library for this course project.

### 6. Quality Gates

- `npm run build` is the gate (`npm run lint` needs an ESLint config first).
- Manually test initial load, search, create, edit, delete, cancel, API down, and slow responses.
- Confirm cached data appears immediately on back-navigation and is invalidated after mutations.

### 7. Deployment

- One Vercel project (Services in `vercel.json`): `frontend` serves the Vite build with SPA fallback, `backend` runs Express. Pushing to `master` deploys production.
- The nightly cron `/api/cron/reset` restores the seed data.
- Delete any test data written to production after verifying.

## What to Avoid

- Duplicating request functions outside `src/utils/http.js`.
- Forgetting to invalidate `["events"]` after a mutation.
- Using component state for server data that the query cache already owns.
- Assuming the backend is fast; the artificial delays are intentional.
- Adding authentication to a server-state exercise.

## Checklist Before Adding Anything New

- Does this solve a real problem for this project, or am I adding scope for its own sake?
- Is every new value configuration-driven rather than hardcoded?
- Does the change follow the existing folder and naming patterns?
- Is there a clear failure path when data, the network, or the environment is unavailable?
- Have I run the available lint/build/test command and fixed what it reports?
- Did I update `README.md` and `MEMORY.md` if behaviour or setup changed?

## Philosophy Statement

This repository exists to show thoughtful front-end engineering: clear structure, readable code, and deliberate trade-offs. The goal is not to use every tool available, but to make every file explain itself. Simplicity is the feature.
