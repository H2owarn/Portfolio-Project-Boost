# Repository Guidelines

## Project Structure & Module Organization
- `apps/boost/` hosts the Expo Router client; screens live in `app/`, shared UI in `components/`, hooks in `hooks/`, and static media under `assets/`.
- `apps/backend/` contains Supabase config, migrations, and edge functions; reusable server logic sits inside `supabase/functions/_shared/`.
- Root-level configs (`package.json`, `tsconfig.json`, `development.md`) steer Bun workspaces. Treat `supabase/.branches/` and `.temp/` as generated state and exclude them from commits.

## Build, Test, and Development Commands
- `bun install` — install all workspace dependencies from the repo root.
- `cd apps/backend && bunx supabase start` — boot the local Supabase stack; pair with `bunx supabase db reset` after schema edits.
- `cd apps/backend && bunx supabase functions serve --env local` — hot-reload edge functions for manual testing.
- `cd apps/boost && bun start [--android|--ios|--web]` — launch the Expo dev server for the chosen target.
- `cd apps/boost && bun run lint` — run the Expo ESLint suite before pushing changes.

## Coding Style & Naming Conventions
- TypeScript everywhere; prefer typed hooks, props, and the `@/` alias for absolute imports.
- Follow `eslint-config-expo`: 2-space indent, single quotes, trailing commas where allowed, sorted imports (via `@trivago/prettier-plugin-sort-imports`).
- Name components with PascalCase (`ProfileHeader.tsx`), hooks with `use` prefixes (`useColorScheme.ts`), and Supabase edge functions with kebab-case directories.

## Testing Guidelines
- Run `bun run lint` for client code and address warnings before merging.
- Validate Supabase changes with `bunx supabase functions serve --env local` and rerun `bunx supabase db reset` to ensure migrations apply cleanly.
- Document manual Expo walkthroughs—note emulator/device, key flows exercised, and auth states touched.

## Commit & Pull Request Guidelines
- Keep commits focused with sentence-case subjects (e.g., `Add supabase client to request params`). Include schema or migration files alongside dependent code.
- Open PRs summarizing backend and client impact, linking issues, and attaching screenshots or terminal output for visible changes.
- Call out follow-up work if deferred and ensure generated artifacts remain untracked.

## Environment & Security Tips
- Store Supabase keys in local env files; never check secrets into the repo.
- Refresh `.env` templates when adding config so other contributors can replicate your setup.
- Confirm local data resets before sharing migrations to prevent drift between environments.
