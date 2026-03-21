# massageinalanya.com

This is a Next.js `16.2.1` App Router project for a massage/spa website. The app currently includes:

- a placeholder public landing page
- a public blog index and post detail pages
- a protected admin area
- Google sign-in via Supabase
- a local-file-backed blog post editor powered by Editor.js

## Stack

- Next.js `16.2.1`
- React `19`
- TypeScript
- Tailwind CSS v4
- Supabase SSR auth
- Editor.js
- Vitest

## Package Manager

Use `pnpm`.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm start
```

## Environment Variables

Copy values into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
ADMIN_EMAIL=
```

Optional:

```bash
POSTS_FILE_PATH=
```

`POSTS_FILE_PATH` overrides the default local post storage file at `data/posts.json`.

## App Structure

- `app/page.tsx`: landing page
- `app/posts/page.tsx`: public blog list
- `app/posts/[post_url]/page.tsx`: public blog detail page
- `app/admin/page.tsx`: admin dashboard
- `app/admin/posts/page.tsx`: blog editor and published posts list
- `app/api/posts/route.ts`: admin-only publish endpoint
- `app/auth/*`: Google OAuth login flow
- `lib/posts.ts`: local JSON post persistence
- `lib/supabase/*`: Supabase client helpers

## Important Notes

- This repo uses Next.js 16 conventions. Read the relevant docs in `node_modules/next/dist/docs/` before making framework-level changes.
- Blog posts are currently stored in a local JSON file, not a database.
- `data/*` is gitignored, so published posts are local/runtime state unless the storage layer is changed.
- Admin access is controlled by matching the signed-in user email against `ADMIN_EMAIL`.
- `middleware.ts` currently handles auth/session work, but Next.js 16 warns that `proxy.ts` is the preferred file convention going forward.
- `app/layout.tsx` uses Google fonts through `next/font/google`, so fully offline builds can fail unless those fonts are made local.

## Verification Status

Verified on `2026-03-21`:

- `pnpm test` passes
- `pnpm lint` passes
- `pnpm build` passes

Build warnings currently include:

- `middleware.ts` deprecation in favor of `proxy.ts`
- a Turbopack/NFT tracing warning related to filesystem access in `lib/posts.ts`

## AI Handoff

Canonical AI project context lives in `AGENTS.md`.
