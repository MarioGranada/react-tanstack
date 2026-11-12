# React TanStack Query — Events

An events app used to practise server-state management with TanStack Query. Events are fetched, cached, searched, created, edited, and deleted through query and mutation hooks instead of hand-written loading and error state.

A small Express API stores events in a `react_tanstack` schema of a hosted Supabase Postgres database and adds artificial delays to some routes so loading and caching behaviour is visible. The SPA and the API deploy together as one Vercel project.

> **Follow-along project.** This app was built while following **React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Live demo

| | |
| --- | --- |
| **Live site** | https://react-tanstack-lemon.vercel.app |
| **Repository** | https://github.com/MarioGranada/react-tanstack |
| **Portfolio summary** | Events app built around TanStack Query: cached and searchable lists, mutations with cache invalidation and loader prefetching, backed by an Express API and Supabase Postgres on Vercel. |

The demo is public: anyone can add, edit, or delete events. The data is reset to three sample events every night (04:00 UTC).

## Features

- QueryClient provider with a shared cache.
- Cached event list with `staleTime` and `gcTime` control.
- Search query that stays disabled until a term is submitted.
- Mutations for create, update, and delete with cache invalidation.
- Loader prefetching for the edit route through `queryClient.fetchQuery`.
- Image picker populated from a separate query.
- Loading, error, and modal states for each operation.
- React Router routes for list, detail, create, and edit.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite |
| Server state | TanStack Query v5 |
| Routing | React Router 6 |
| Backend | Express 5 (Vercel Function in production) |
| Persistence | Supabase Postgres via postgres.js |
| Hosting | Vercel Services (frontend + backend in one project), nightly Vercel Cron |
| Styling | Plain CSS |

## Project structure

```text
react-tanstack/
├── vercel.json                # Services (frontend, backend), /api routing, nightly cron
├── backend/
│   ├── app.js                 # Express API; every route under /api
│   ├── server.js              # Local dev server (port 3000)
│   ├── data/                  # events.js (SQL), images.js (selectable images)
│   ├── db/                    # postgres.js client, schema + seed SQL, reset helper
│   ├── routes/cron.js         # GET /api/cron/reset (needs CRON_SECRET)
│   └── scripts/db.js          # npm run db:migrate | db:reset
├── public/images/             # Event images (served by the frontend)
├── src/
│   ├── components/
│   │   ├── Events/            # Events, lists, detail, form, create, edit
│   │   ├── UI/                # Modal, loading, error
│   │   ├── Header.jsx
│   │   └── ImagePicker.jsx
│   ├── utils/http.js          # queryClient and all API functions
│   ├── App.jsx                # Router + QueryClientProvider
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Getting started

### Requirements

- Node.js 22 LTS.
- npm (lockfiles are committed for both apps).
- The Vercel CLI, linked to the project, to pull the database URL (`vercel link`, then `vercel env pull .env.local` in the repo root).
- Two terminals: one for the API and one for Vite.

### 1. Install dependencies

```bash
npm ci
npm ci --prefix backend
```

### 2. Configure the database

```bash
vercel env pull .env.local            # POSTGRES_URL, POSTGRES_URL_NON_POOLING, CRON_SECRET
npm run db:migrate --prefix backend   # idempotent: creates the schema and seed events
```

`.env.local` is gitignored. Any Postgres works locally: set `POSTGRES_URL` to it instead.

### 3. Run locally

```bash
npm run dev --prefix backend   # API on http://localhost:3000/api
npm run dev                    # Vite on http://localhost:5173
```

Vite proxies `/api` to the backend, so the SPA uses the same relative URLs as in production. Event images are served from `public/images`.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite on port 5173. |
| `npm run build` | Build the frontend into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | ESLint (currently fails: the repo has no ESLint config). |
| `npm run dev --prefix backend` | API with `--watch` on port 3000. |
| `npm run db:migrate --prefix backend` | Apply the schema and seed (idempotent). |
| `npm run db:reset --prefix backend` | Empty the events table and restore the seed. |

## How it works

`src/utils/http.js` creates the single `queryClient` and exports every API function: `fetchEvents`, `fetchEvent`, `fetchSelectableImages`, `createNewEvent`, `updateEvent`, and `deleteEvent`. Keeping the client and the request functions together makes cache keys and invalidation easy to trace.

`NewEventsSection` uses `useQuery` with the key `["events", { max: 3 }]`, a five-second `staleTime`, and a one-second `gcTime` to show how cached data is reused and then collected.

`FindEventSection` uses the key `["events", { search: searchTerm }]` with `enabled: searchTerm !== undefined`, so no request runs until the user submits a search.

`EventDetails` fetches one event and deletes it with `useMutation`. On success it invalidates all `["events"]` queries with `refetchType: "none"` and navigates back to the list.

`NewEvent` mutates and invalidates `["events"]`. `EditEvent` prefetches through a route loader using `queryClient.fetchQuery`, then submits with a router action that calls `updateEvent` and invalidates the detail key.

The backend filters by `search`, returns the newest `max` events, validates required fields (the image must be one of the selectable images), and delays detail, update, and delete responses by one second to make pending states visible. Server errors return a generic message; database errors are only logged on the server.

## Deployment

- **Live:** https://react-tanstack-lemon.vercel.app
- One Vercel project with two [Services](https://vercel.com/docs/services) defined in `vercel.json`: `frontend` (Vite static build from the repo root, with SPA fallback) and `backend` (Express as a Vercel Function). `/api/*` routes to the backend, everything else to the frontend.
- Pushing to `master` deploys production.
- The database comes from the Supabase integration on Vercel, which injects `POSTGRES_URL` into every environment. `CRON_SECRET` protects the reset endpoint.
- A daily Vercel Cron calls `/api/cron/reset` at 04:00 UTC to restore the seed events.

## Notes and limitations

- `gcTime` is set to 1000 ms in `NewEventsSection`, which is extremely short; cached events disappear quickly after unmount.
- The optimistic-update mutation in `EditEvent` is commented out; editing uses a router action instead.
- The backend adds a one-second delay to detail, update, and delete routes on purpose.
- There is no authentication: every visitor shares and can change the same events until the nightly reset.
- `npm run lint` has no ESLint config to run against (pre-existing).
- There are no automated tests.

---

**Author:** Mario Granada
