# AGENTS.md — React TanStack Query — Events

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `cd backend && npm install && npm start` | Run the API on port 3000. |
| `npm install && npm run dev` | Run the frontend on port 5173. |
| `npm run build` | Verify the production bundle. |
| `npm run lint` | Run ESLint. |

## Requirements

- Node.js 18+.
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for Vite.

## Environment

- No environment variables are used. API URLs are hardcoded.
- The backend must run from `backend/` so its relative data and public paths resolve.

## Architecture

- `src/utils/http.js` — query client, fetch functions, and mutations.
- `src/App.jsx` — router and `QueryClientProvider`.
- `src/components/Events/NewEventsSection.jsx` — cached list query.
- `src/components/Events/FindEventSection.jsx` — enabled search query.
- `src/components/Events/EventDetails.jsx` — detail query and delete mutation.
- `src/components/Events/EditEvent.jsx` — loader prefetch and update action.
- `backend/app.js` — JSON API with search, max, and artificial delays.

## Commands and build order

- Run both servers; the UI cannot load events or images without the API.
- `npm run lint` and `npm run build` are the gates; there are no tests.

## Conventions and gotchas

- Query keys are arrays; a changed key is a different cache entry.
- `enabled: false` prevents a query from running, but the hook still returns a pending state.
- Invalidate with the broad `["events"]` key after mutations that change the list.
- Do not read `error.info` unless the thrown error actually carries it.
- Starting the API from the repository root breaks `./data` and `./public` paths.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
