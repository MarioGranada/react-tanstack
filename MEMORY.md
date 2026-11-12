# React TanStack Query — Events — Working Memory

_Last updated: 2026-11-12_

## Current status

- Live on Vercel: https://react-tanstack-lemon.vercel.app (pushes to `master` deploy production).
- One Vercel project with Services: `frontend` (Vite SPA at the repo root) + `backend` (Express 5 under `/api`).
- Events live in the `react_tanstack` schema of the shared Supabase Postgres (`portfolio-db`).
- Nightly Vercel Cron (04:00 UTC) calls `/api/cron/reset` to restore the 3 seed events.
- List, search, create, edit, delete and image picker verified in headless Chrome against production.
- No tests; `npm run lint` fails because the repo has no ESLint config (pre-existing).

## Key decisions

- Centralised the query client and request functions in `src/utils/http.js` so keys and invalidation stay consistent.
- Replaced the JSON fixtures with Postgres; the selectable images are a static list (`backend/data/images.js`).
- Images moved to `public/images` so the CDN serves them; the API stores only file names.
- Same-origin `/api` (Vite proxy locally): no CORS, no URL env var.
- Seed and reset SQL live in `backend/db/sql.js`: the Vercel service bundle dropped runtime-read files.
- The leftover "test" event was dropped from the seed; seed dates moved to 2027.

## Known limitations and follow-ups

- `gcTime` is unrealistically short in one section.
- Optimistic updates are commented out.
- No authentication: the public demo is editable by anyone until the nightly reset.

## Mistakes to avoid

- Starting only the frontend leaves the event list empty.
- Changing a query key without updating invalidations leaves stale data.
- Mounting backend routes without the `/api` prefix: Vercel forwards the original path.
- Assuming a mutation refreshes the list automatically without invalidation.

## Next steps

- Add an ESLint flat config so `npm run lint` works.
- Enable and test the optimistic update path.
- Add tests for query keys and mutations.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
