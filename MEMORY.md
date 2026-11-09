# React TanStack Query — Events — Working Memory

_Last updated: 2026-11-02_

## Current status

- List, detail, search, create, edit, and delete flows work against the local API.
- TanStack Query caching, mutations, invalidation, and loader prefetching are implemented.
- No tests or deployment workflow yet.

## Key decisions

- Centralised the query client and request functions in `src/utils/http.js` so keys and invalidation stay consistent.
- Kept the backend as a JSON fixture with deliberate delays to make query states observable.

## Known limitations and follow-ups

- API URLs are hardcoded.
- `gcTime` is unrealistically short in one section.
- Optimistic updates are commented out.
- JSON persistence is local to the API machine.

## Mistakes to avoid

- Starting only the frontend leaves the event list empty.
- Changing a query key without updating invalidations leaves stale data.
- Running the API from the repository root breaks its relative paths.
- Assuming a mutation refreshes the list automatically without invalidation.

## Next steps

- Move API URLs into environment variables.
- Enable and test the optimistic update path.
- Add a deployment workflow and SPA fallback.
- Add tests for query keys and mutations.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
