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
| Backend | Express 4 | JSON-backed event API with search and image endpoints. |
| Styling | Plain CSS | Keeps the focus on query behaviour. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project for learning TanStack Query. It is intentionally a small CRUD app; authentication, pagination, and production persistence are out of scope.

### 2. Environment Isolation

- This project has no runtime secrets. Do not introduce `.env` files unless a real secret or environment-specific URL appears.
- If configuration is added, use environment variables and document them in the README.
- Never commit keys, tokens, database URLs, or credentials.

### 3. Architecture

- All server-state access goes through `src/utils/http.js`; components should not call `fetch` directly.
- Query keys are part of the API: keep them consistent across queries, loaders, and invalidations.
- The Express API stays a small JSON fixture.

### 4. Data and State

- TanStack Query owns the client cache; the backend JSON files are the source of truth.
- Mutations must invalidate the affected query keys.
- Artificial delays exist to exercise loading states; do not remove them without updating the UI expectations.

### 5. Styling and UX

- Plain CSS in `src/index.css`; keep list, modal, and form styles shared.
- Loading and error blocks should occupy the same space as the content they replace.
- Do not add a UI library for this course project.

### 6. Quality Gates

- `npm run lint` and `npm run build` are the gates.
- Manually test initial load, search, create, edit, delete, cancel, API down, and slow responses.
- Confirm cached data appears immediately on back-navigation and is invalidated after mutations.

### 7. Deployment

- Frontend: static build for GitHub Pages with SPA fallback.
- Backend: a Node host or a Supabase replacement; JSON files are not durable hosting storage.
- Move API URLs into environment variables before deploying.

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
