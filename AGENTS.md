# AGENTS.md — React TanStack Query — Events

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `vercel env pull .env.local` | Pull `POSTGRES_URL` and `CRON_SECRET` into the gitignored root `.env.local`. |
| `npm ci --prefix backend && npm run db:migrate --prefix backend` | Install the API and apply the idempotent schema + seed. |
| `npm run dev --prefix backend` | Run the API on port 3000 (routes under `/api`). |
| `npm ci && npm run dev` | Run the frontend on port 5173; Vite proxies `/api`. |
| `npm run build` | Verify the production bundle. |
| `npm run lint` | ESLint — fails today because the repo has no ESLint config. |

## Requirements

- Node.js 22 LTS (`backend/package.json` pins `22.x` for the Vercel Function).
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for Vite.

## Environment

- `POSTGRES_URL` (transaction pooler) and `POSTGRES_URL_NON_POOLING` come from the Supabase integration on Vercel. `CRON_SECRET` protects `/api/cron/reset`. Locally they live in the root `.env.local` (gitignored); backend scripts load it with `--env-file-if-exists=../.env.local`.
- The SPA calls the same-origin `/api`; there is no API URL variable.
- Never commit `.env*` files (except `.env.example`), `.vercel/`, database URLs, or credentials.

## Architecture

- `src/utils/http.js` — query client, fetch functions, and mutations.
- `src/App.jsx` — router and `QueryClientProvider`.
- `src/components/Events/NewEventsSection.jsx` — cached list query.
- `src/components/Events/FindEventSection.jsx` — enabled search query.
- `src/components/Events/EventDetails.jsx` — detail query and delete mutation.
- `src/components/Events/EditEvent.jsx` — loader prefetch and update action.
- `vercel.json` — Vercel Services: `frontend` (repo root, Vite, SPA fallback) and `backend` (Express); `/api/*` → backend; nightly cron.
- `backend/app.js` — Express 5 API with search, max, validation and artificial delays; exported for Vercel, `server.js` only listens locally.
- `backend/data/events.js` — SQL; `backend/data/images.js` — the selectable images (files in `public/images`).
- `backend/db/sql.js` — schema + seed and reset SQL (in JS so the function bundle includes it); `db/seed.js` applies them.
- `backend/routes/cron.js` — nightly reset, refuses requests without `Bearer $CRON_SECRET`.

## Commands and build order

- Run both servers; the UI cannot load events or images without the API.
- `npm run build` is the gate; there are no tests and lint has no config yet.
- Schema changes go in `backend/db/sql.js`, must stay idempotent, and need `npm run db:migrate --prefix backend` against the shared database.

## Conventions and gotchas

- Query keys are arrays; a changed key is a different cache entry.
- `enabled: false` prevents a query from running, but the hook still returns a pending state.
- Invalidate with the broad `["events"]` key after mutations that change the list.
- Do not read `error.info` unless the thrown error actually carries it.
- Every API route lives under `/api`, because Vercel passes the original path to the backend service.
- Images are static files in `public/images`; the API only stores the file name.
- Do not read files at runtime in the backend: the Vercel service bundle only includes traced JS.
- Keep `prepare: false` in `db/index.js` (the Supabase pooler has no prepared statements).
- The database is shared with other portfolio apps; only touch the `react_tanstack` schema.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
