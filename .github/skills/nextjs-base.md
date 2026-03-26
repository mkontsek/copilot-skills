# Next.js Skill

## Scope

These instructions apply to Next.js app packages in this monorepo.
For shared React + TypeScript UI conventions, use `.github/skills/react-base.md`.

## Locked Versions

Use exact latest supported versions — do not upgrade unless explicitly requested. 
Example:

| Package | Version |
|---|---|
| `next` | 16.1.6 |
| `prisma` / `@prisma/client` | 7.4.2 |
| `react` / `react-dom` | See `react-base.md` |
| `@tanstack/react-query` | See `react-base.md` |
| `zustand` | See `react-base.md` |
| `zod` | See `react-base.md` |
| `framer-motion` | See `react-base.md` |
| `typescript` | See `react-base.md` |

## Layout & App Router Conventions

- Actual folder structure in `apps/web/src/`:
    - `app/` — Next.js App Router pages and API routes.
    - `components/<feature>/` — all UI for that feature; split into subfolders when a feature grows (e.g., `geo-map/`, `pnl/`, `config-panel/`).
    - `lib/` — pure utility/service functions (no React). Name files `<noun>-service.ts` for domain services (e.g., `geo-service.ts`, `bot-data-service.ts`) and `<noun>.ts` for utilities (e.g., `fetch-json.ts`, `timestamp.ts`).
    - `stores/` — Zustand stores, one file per store (e.g., `engine-store.ts`).
    - `server/` — server-only helpers (never imported by client components).
- Keep server-only logic in API routes or `server/` modules — no secrets on the client.
- **Max 300 lines per file** for `.ts` and `.tsx` source files (enforced by `scripts/check-file-lines.sh`). When a file approaches the limit, split by extracting hooks, service helpers, or sub-components into their own files.
- **Always use braces for `if` blocks**, even for single-line branches.
- Do not use nested ternaries, use explicit branching, and extract non-trivial branch/decision logic into `lib/` or `server/` service functions.

## Server / Client Boundaries

- Keep server-only logic in API routes or `server/` modules — no secrets on the client.
- For server components, call backend APIs or Rust services via typed clients in `server/`.
- Keep route handlers thin; delegate business logic to `lib/` or `server/` service modules.

## Data Fetching in Next.js

- Use **TanStack Query** (`@tanstack/react-query` v5) for client-side fetching:
    - One `useQuery` or `useMutation` per file; name the file `use-<entity>-query.ts` or `use-<entity>-mutation.ts`.
    - Use `refetchInterval` for polling (see `BOT_REFETCH_INTERVAL_MS` in `bot-data-service.ts`).
    - On mutation success, call `queryClient.invalidateQueries({ queryKey })` for affected keys.
    - Use `onMutate` / `onError` for optimistic updates when immediate feedback is needed.
- For server components, call backend APIs or Rust services via typed clients in `server/`.

## Styling & Components

- Use ShadCN components as baseline, wrapped in local primitives when customization repeats.
- Prefer **Tailwind CSS v4** utility classes over inline styles.
- Use `cn()` from `lib/utils.ts` (based on `clsx` + `tailwind-merge`) for conditional class merging.

## Performance

- Lazy-load only top-level route segments or clearly isolated heavy features.
- Avoid deep nested `React.lazy` usage.
- Use `useMemo` / `useCallback` only when profiling shows benefit.

## Testing

- Tests live in a `__tests__/` subfolder beside the code they test (e.g., `components/dashboard/__tests__/`, `lib/__tests__/`). File names match the source: `use-strategy-mutation.test.ts`, `geo-service.test.ts`.
- Use **Vitest** (not Jest) — run with `pnpm test` in `apps/web`.
- Use **React Testing Library** for component behavior; do not test implementation details.
- For data-fetching hooks, mock the network boundary (i.e., `fetch`) not internal helpers.
- Test files are excluded from the 300-line rule.
- When nested ternary logic is extracted into a service helper, add unit tests for the extracted service in the colocated `__tests__/` folder.

## Related Skills

- For shared React conventions (components, hooks, state, forms, icons), use `.github/skills/react-base.md`.
