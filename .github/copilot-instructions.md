# Development Guidelines for Copilot

> **About this file (v1.2.0):** Lean, always-loaded guidance. Detailed implementation rules live in skill files.
>
> **Architecture:**
>
> - `.github/copilot-instructions.md` (this file): core philosophy + cross-cutting constraints.
> - `.github/skills/`: detailed stack-specific rules:
>   - `react-base.md`
>   - `nextjs-base.md`
>   - `rust-base.md`
>   - `rust-backend.md`
>   - `rust-cli.md`
>   - `testing.md`
>   - `db.md`

## Interaction Style

Before planning, quickly confirm requirements, constraints, and acceptance criteria.

During execution, if a design choice materially affects DX, performance, or safety, present options with trade-offs and ask which path to take.

## Project Context

- Monorepo: Turborepo with Next.js apps and Rust crates.
- Package manager: **pnpm workspaces only**. Never use `npm` or `yarn`.
- Locked dependency policy: follow versions pinned in skill files; do not upgrade unless explicitly requested.

## Cross-cutting Rules

- Naming:
  - `kebab-case` for folders/packages/data-cy.
  - `camelCase` for variables/functions/hooks.
  - `PascalCase` for React components/types/classes.
  - `UPPER_CASE` for constants.
- Control flow:
  - Always use braces for `if` blocks.
  - Prefer early returns over `if/else` nesting.
- File size:
  - Max **300 lines** for `.ts`, `.tsx`, and `.rs` source files.
  - Test files are excluded.
- Function naming:
  - Do not use `handle*` prefixes.
  - Reserve `on*` prefix exclusively for props.
- Imports:
  - Prefer relative imports inside a package/crate.
  - Use path aliases for cross-package TS imports; never deep-import another package’s `src`.
  - Prefer named exports/imports.
- Security:
  - Sanitize untrusted input before HTML/SQL/shell usage.
  - Never log secrets or full tokens.

## React / TypeScript (Summary)

Authoritative details: `.github/skills/react-base.md`

- Components: one component per file, `export const Component: FC<Props> =`, named exports only.
- Data: TanStack Query for async fetching and mutation invalidation.
- State: Zustand + immer for shared state; avoid monolithic stores.
- Forms: React Hook Form v7 + Zod v4; keep form shapes UI-centric and map via DTO mappers.
- Event handlers: avoid inline anonymous listeners in JSX; use named handlers.
- Icons: use icon libraries (`react-icons`/similar); do not handcraft SVG icons unless explicitly requested.

## Next.js (Summary)

Authoritative details: `.github/skills/nextjs-base.md`

- Use App Router conventions and keep route/server boundaries explicit.
- Keep server-only logic out of client bundles.
- Use package-local layout conventions in `apps/web/src/` for `app/`, `components/`, `lib/`, `stores/`, and `server/`.

## Rust (Summary)

Authoritative details: `.github/skills/rust-base.md`, `rust-backend.md`, `rust-cli.md`

- Keep `main.rs` thin; place reusable/core logic in modules or `lib.rs`.
- Organize modules by feature/domain and re-export explicitly from `mod.rs`.
- Use typed errors (`thiserror`) in library code; avoid `unwrap`/`expect` in request paths.
- Prefer safe Rust; document invariants when `unsafe` is necessary.
- Keep router handlers thin and delegate business logic to state/domain modules.

## Database / Prisma (Summary)

Authoritative details: `.github/skills/db.md`

- Single Prisma source of truth in `packages/db` (`schema.prisma`, config, client).
- Keep DB scripts and Docker Compose in `packages/db` (no `db:` script prefix):
  - `generate`
  - `dev:migrate`
  - `prod:migrate`
  - `dev:up`
  - `dev:stop`
  - `dev:reset`
  - `dev:seed`
  - `prod:seed`
- Production credentials must come from environment; never commit secrets.

## Testing (Summary)

Authoritative details: `.github/skills/testing.md`

- Prioritize fast, focused tests on public behavior.
- Next.js: Vitest + React Testing Library, colocated `__tests__/` directories.
- Rust: unit tests in-module; API/integration tests near router assembly or in `tests/`.
- Mock boundaries (network/browser APIs), not internals.

## Workflow & Commits

- Branch naming: `<type>/<ticket-number>` where type is one of `refactor|feat|test|chore|fix`.
- Commit format: `<type>: <ticket-number> <description>` (Conventional Commit semantics).
- Use pre-commit hooks that run `lint`, `test`, and `build` before commit.
- Rebase on `main` before PR; do not merge `main` into feature branches.
- Keep PRs focused and reasonably small; split large changes when needed.

## Living Documentation

Skill files should evolve from repeated feedback and real patterns.

- Propose focused updates to the relevant skill file.
- Keep each proposed update scoped to one concern.
- Wait for approval before treating a new pattern as canonical.
