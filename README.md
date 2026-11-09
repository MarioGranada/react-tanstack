# React TanStack Query — Events

An events app used to practise server-state management with TanStack Query. Events are fetched, cached, searched, created, edited, and deleted through query and mutation hooks instead of hand-written loading and error state.

A small Express API persists events and image metadata to JSON files and adds artificial delays to some routes so loading and caching behaviour is visible.

> **Follow-along project.** This app was built while following **React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

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
| Backend | Express 4 |
| Styling | Plain CSS |

## Project structure

```text
react-tanstack/
├── backend/
│   ├── app.js                 # Express API (port 3000)
│   ├── data/                  # events.json, images.json
│   └── public/                # Event images
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

- Node.js 18+.
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for Vite.

### 1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd .. && npm install
```

### 2. Run locally

**Start the backend API**

```bash
cd backend && npm start
```

Open http://localhost:3000.

Serves `/events`, `/events/images`, and event images.

**Start the frontend**

```bash
npm run dev
```

Open http://localhost:5173.

The app calls `http://localhost:3000` directly; there is no Vite proxy.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite on port 5173. |
| `npm run build` | Build the frontend into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | Run ESLint over JS/JSX files. |
| `cd backend && npm start` | Start the Express API on port 3000. |

## How it works

`src/utils/http.js` creates the single `queryClient` and exports every API function: `fetchEvents`, `fetchEvent`, `fetchSelectableImages`, `createNewEvent`, `updateEvent`, and `deleteEvent`. Keeping the client and the request functions together makes cache keys and invalidation easy to trace.

`NewEventsSection` uses `useQuery` with the key `["events", { max: 3 }]`, a five-second `staleTime`, and a one-second `gcTime` to show how cached data is reused and then collected.

`FindEventSection` uses the key `["events", { search: searchTerm }]` with `enabled: searchTerm !== undefined`, so no request runs until the user submits a search.

`EventDetails` fetches one event and deletes it with `useMutation`. On success it invalidates all `["events"]` queries with `refetchType: "none"` and navigates back to the list.

`NewEvent` mutates and invalidates `["events"]`. `EditEvent` prefetches through a route loader using `queryClient.fetchQuery`, then submits with a router action that calls `updateEvent` and invalidates the detail key.

The backend filters by `search`, slices the newest `max` events, validates required fields, and delays detail, update, and delete responses by one second to make pending states visible.

## Deployment

- Target: GitHub Actions can build the Vite frontend and publish `dist/` to GitHub Pages.
- The Express API needs a Node host, or replacement with Supabase. JSON files and local images are not durable on serverless hosting.
- Replace the hardcoded `http://localhost:3000` URLs in `src/utils/http.js` and `EventItem.jsx` before deploying.
- A static host needs SPA fallback so deep links such as `/events/123` serve `index.html`.

## Notes and limitations

- `gcTime` is set to 1000 ms in `NewEventsSection`, which is extremely short; cached events disappear quickly after unmount.
- The optimistic-update mutation in `EditEvent` is commented out; editing uses a router action instead.
- The backend adds a one-second delay to detail, update, and delete routes on purpose.
- API URLs are hardcoded in the HTTP helper and in `EventItem.jsx`.
- There are no automated tests.

---

**Author:** Mario Granada
