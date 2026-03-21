<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context

`AGENTS.md` is the canonical AI handoff file for this repo. Keep assistant-specific files such as `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` aligned with it instead of duplicating long project notes everywhere.

## Snapshot

- Project: `massageinalanya.com`
- Current product state: a massage/spa website with a placeholder landing page, public blog pages, and a protected admin blog editor
- Framework: Next.js `16.2.1` App Router on React `19.2.4`
- Language/tooling: TypeScript, Tailwind CSS v4, shadcn styling config, Supabase SSR auth, Editor.js, Vitest
- Package manager: `pnpm`

## Verified Status

Checked on `2026-03-21`:

- `pnpm test` passes
- `pnpm lint` passes
- `pnpm build` passes

Current build warnings:

- Next.js warns that the `middleware.ts` file convention is deprecated in favor of `proxy.ts`
- Turbopack/NFT warns about broad tracing because `lib/posts.ts` uses filesystem access with `process.cwd()`
- Offline/sandboxed builds can fail if Google Fonts cannot be fetched for `next/font/google`

## Commands

- `pnpm dev`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm start`

## Environment Variables

Tracked in `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_EMAIL`

Also supported:

- `POSTS_FILE_PATH`: optional override for the local post storage file; defaults to `data/posts.json`

Notes:

- `.env.local` is local-only and should stay out of git
- `data/posts.json` is also ignored by git

## Architecture

Main routes:

- `/` -> `app/page.tsx`: placeholder landing page
- `/posts` -> `app/posts/page.tsx`: public blog index
- `/posts/[post_url]` -> `app/posts/[post_url]/page.tsx`: public blog post page
- `/admin` -> `app/admin/page.tsx`: admin dashboard
- `/admin/posts` -> `app/admin/posts/page.tsx`: admin blog editor and post list
- `/auth/login` -> `app/auth/login/page.tsx`: Google sign-in page
- `/auth/callback` -> `app/auth/callback/route.ts`: OAuth callback
- `/auth/auth-code-error` -> `app/auth/auth-code-error/page.tsx`: login failure page
- `/api/posts` -> `app/api/posts/route.ts`: admin-only POST endpoint for publishing posts

Supporting modules:

- `lib/posts.ts`: file-backed post persistence, sorting, excerpt generation
- `lib/slug.ts`: Turkish-aware slug generation
- `lib/supabase/*`: Supabase browser/server/middleware helpers
- `components/posts/post-editor.tsx`: client-side Editor.js post editor
- `components/posts/post-renderer.tsx`: renderer for stored Editor.js blocks
- `middleware.ts`: current auth/session entry point, slated for future `proxy.ts` migration

## Auth And Authorization

- Authentication uses Supabase Google OAuth with `@supabase/ssr`
- Admin access is based only on email equality:
  - `user.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()`
- `middleware.ts` currently refreshes Supabase sessions and redirects unauthenticated `/admin*` requests to `/auth/login?next=...`
- Authorization is re-checked inside server components and `app/api/posts/route.ts`
- Do not rely on middleware/proxy alone for admin authorization; keep server-side checks in place
- Supabase helper comments are important: do not move the clients into globals

## Blog Data Model And Persistence

- Posts are not stored in a database yet; they live in a local JSON file
- Default storage file: `data/posts.json`
- Tests override storage with `POSTS_FILE_PATH`
- `createPost()` generates:
  - a UUID `id`
  - a unique slug from the title
  - an excerpt derived from paragraph/header/list blocks
  - `createdAt` and `updatedAt` timestamps
- `listPosts()` sorts posts newest-first using `createdAt`

Important persistence caveat:

- Because posts are saved to the local filesystem and `data/*` is gitignored, blog content is local/runtime state, not source-controlled content
- This approach is acceptable for local development or a single persistent server, but it is a weak fit for serverless, read-only, or ephemeral deployments
- If the blog becomes production-critical, migrate posts to a durable data store

## Next.js 16 Notes

- Read the relevant files in `node_modules/next/dist/docs/` before changing framework behavior
- This repo already uses several Next 16 patterns:
  - Promise-based `params` / `searchParams` in route components
  - `connection()` in blog pages to force runtime rendering
  - Route Handlers in `app/api/*`
- Do not remove `await connection()` from `app/posts/page.tsx` or `app/posts/[post_url]/page.tsx` unless you intentionally want the blog to become statically rendered/cached
- The current `middleware.ts` still works, but Next 16 deprecates that file convention in favor of `proxy.ts`

## UI And Styling

- Tailwind CSS v4 is configured via CSS imports in `app/globals.css`; there is no `tailwind.config.ts`
- `components.json` shows shadcn is configured with the `radix-mira` style and `hugeicons`
- The live UI mostly uses hand-written components instead of generated `components/ui/*`
- Visual direction is calm and neutral: heavy use of `zinc` tokens, rounded cards, spa-like language
- `app/layout.tsx` currently uses `Inter`, `Geist`, and `Geist Mono` via `next/font/google`

## Editor.js Details

- The editor page uses Editor.js in a client component
- Explicitly configured tools:
  - `header`
  - `list`
- Paragraph blocks still work via Editor.js defaults
- The renderer also supports `quote` and `delimiter` blocks, but the editor does not currently expose tools for them

Security note:

- `components/posts/post-renderer.tsx` renders saved block HTML with `dangerouslySetInnerHTML`
- That is only tolerable because publishing is currently admin-only and trusted
- If untrusted authors or imported content are introduced, add sanitization before rendering

## Testing

- Test runner: Vitest in Node mode
- Config: `vitest.config.mts`
- Current coverage is limited to `__tests__/posts-publication.test.ts`
- That test covers:
  - unauthenticated publish rejection
  - non-admin publish rejection
  - successful admin publish and Turkish slug generation

Untested areas include:

- auth page behavior
- middleware/proxy behavior
- page rendering
- post renderer safety

## Safe Change Map

- Landing/marketing content: `app/page.tsx`
- Global shell, metadata, fonts: `app/layout.tsx`
- Auth flow: `app/auth/*`, `lib/supabase/*`, `middleware.ts`
- Admin gating: `app/admin/*`, `app/api/posts/route.ts`
- Blog persistence: `lib/posts.ts`, `lib/slug.ts`, `data/posts.json`
- Blog UX: `components/posts/*`, `app/posts/*`
- Global styling/theme tokens: `app/globals.css`

## Known Product Gaps

- `app/layout.tsx` still has default metadata from Create Next App
- `README.md` was originally scaffold text and should stay aligned with the real project state
- The public homepage is still an under-development placeholder
- Blog publishing is local-file-based and not yet backed by durable storage

## If You Update Context

- Update this file first
- Keep `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` as short mirrors that point back here
- If project architecture or setup changes materially, update `README.md` too
