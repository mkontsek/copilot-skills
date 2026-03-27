# Database / Prisma Skill

## Scope

This skill defines database conventions for Prisma and Postgres across this monorepo.

## Location & Ownership

- Keep all Prisma source-of-truth data in `packages/db`:
    - `packages/db/prisma/schema.prisma`
    - `packages/db/prisma.config.ts`
    - `packages/db/src/` for Prisma client setup/export
- Do not create duplicate Prisma schemas in app packages.

## Canonical DB Scripts (`packages/db`)

Keep DB scripts in `packages/db/package.json` (not at the repo root), and use script names without a `db:` prefix:

- `generate`
- `dev:migrate`
- `prod:migrate`
- `dev:up`
- `dev:stop`
- `dev:reset`
- `dev:seed`
- `prod:seed`

Run them from the repo root with a package filter (for example: `pnpm --filter ./packages/db run dev:up`).

## Local Development DB (Docker)

- Keep Docker Compose files for local PostgreSQL lifecycle in `packages/db` (alongside DB scripts).
- Start local DB + apply dev schema with:
    - `pnpm --filter ./packages/db run dev:up`
- Stop local DB container with:
    - `pnpm --filter ./packages/db run dev:stop`
- If port `55432` is occupied, override host port at runtime:
    - `POSTGRES_HOST_PORT=55440 pnpm --filter ./packages/db run dev:up`
- Keep local Docker DB settings development-only; production should use managed or separately provisioned Postgres.

## Environment Conventions

- `.env.example` contains development-safe defaults, including dev `DATABASE_URL`.
- `.env.prod.example` contains production placeholder values only.
- App-specific templates follow the same split:
    - `apps/web/.env.example` for dev values.
    - `apps/web/.env.prod.example` for production placeholders.
- Never commit real credentials or production secrets.
- Resolve DB URLs from environment files (`.env`, `.env.prod`) and process env only.
- `packages/db/prisma.config.ts` should resolve `DATABASE_URL` from env files:
    - development: `.env` (or app/local equivalents)
    - production: `.env.prod`
  Use `PRISMA_ENV=production` only to select production env file resolution mode, not to pass credentials inline.

## Migration / Seeding Guidance

- Use `dev:migrate` for local development schema iteration.
- Use `prod:migrate` for production deploy migrations.
- Seed through `dev:seed` and `prod:seed`; keep seeds idempotent where possible.
- When introducing seed data, prefer realistic defaults that match shared domain constants (e.g., supported pairs/exchanges).
