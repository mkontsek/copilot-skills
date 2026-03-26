# React / TypeScript Skill

## Scope

These instructions apply to all React + TypeScript UI packages in this monorepo, including Next.js client components and shared component libraries.

## Locked Versions

Use exact latest supported versions — do not upgrade unless explicitly requested.
Example:

| Package | Version |
|---|---|
| `react` / `react-dom` | 19.2.4 |
| `@tanstack/react-query` | 5.90.21 |
| `zustand` | 5.0.11 |
| `zod` | 4.3.6 |
| `framer-motion` | 12.38.0 |
| `typescript` | 5.9.3 |

## Components

- One component per file. Use `export const Component: FC<Props> =` pattern.
- All exports are **named exports** — never use `export default` or `export *`.
- Extract non-component helpers (pure functions, formatters, fetchers) to service/utility modules, not inline in component files.
- Do not use nested ternaries, use explicit branching (`if` / early-return) or a dedicated service function when logic is non-trivial.

## Hooks

- Each `use*` hook gets its own dedicated file named `use-<action>.ts`.
- **Do not use a `handle*` prefix for functions.** Name functions after the action they perform.
- **Reserve the `on*` prefix exclusively for props** (e.g. `onClose`, `onChange`).
- **Never pass anonymous arrow functions as event listeners** in JSX. Define named functions and reference them in props. For mapped lists, use named curried factories or extract a child component.

## Data Fetching

- Use **TanStack Query** (`@tanstack/react-query` v5) for client-side fetching.
- One `useQuery` or `useMutation` per file; use `use-<entity>-query.ts` or `use-<entity>-mutation.ts`.
- On mutation success, call `queryClient.invalidateQueries({ queryKey })` for affected keys.
- Use `onMutate` / `onError` for optimistic updates when immediate feedback is needed.

## State Management

- Use **Zustand** + **immer** for shared app state.
- One store per concern.
- Avoid a single global "god" store.
- Access Zustand state outside React hooks via `useMyStore.getState()`.
- Use React Context only for cross-cutting concerns (theme, auth session), exposed via typed hooks that throw when used outside providers.

## Forms & Validation

- Use **React Hook Form v7** for form state.
- Use **Zod** v4 for schema definitions.
- Keep form value shapes flat and UI-centric; map to/from API DTOs via mapper functions.
- Use `useWatch` for cross-field derived logic.

## Styling & Icons

- Prefer utility-first styling and local primitives consistent with package conventions.
- Use icon libraries such as `react-icons` (or equivalent, e.g. `lucide-react`) for UI icons.
- **Do not create custom SVG icons** unless explicitly requested.

## Performance

- Avoid deep nested `React.lazy` usage.
- Use `useMemo` / `useCallback` only when profiling shows benefit.

## Testing

- Use **React Testing Library** for component behavior; do not test implementation details.
- Mock network/browser boundaries, not internals.
- When refactoring branching logic (e.g., nested ternaries) into a service/utility function, add focused unit tests for that extracted function.

## Workflow

- Use pre-commit hooks to run quality gates before each commit.
- Pre-commit hooks must run `lint`, `test`, and `build` for the affected workspace/package scope.
