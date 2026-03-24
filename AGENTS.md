<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context

`AGENTS.md` is the canonical AI handoff file for this repo. Keep assistant-specific files such as `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` aligned with it instead of duplicating long project notes everywhere.

## Snapshot

- Project: `massageinalanya.com`
- Current product state: a massage/spa website with a designed homepage (Figma-based), public blog pages, and a protected admin blog editor
- Framework: Next.js `16.2.1` App Router on React `19.2.4`
- Language/tooling: TypeScript, Tailwind CSS v4, shadcn styling config, Supabase SSR auth, Editor.js, Vitest
- Package manager: `pnpm`

## Verified Status

Checked on `2026-03-24`:

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

- `/` -> `app/page.tsx`: designed homepage with Hero, Marquee, Problems, About, Treatments, Standards, CTA, and Footer sections
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
- `lib/whatsapp.ts`: WhatsApp booking link generator with multi-language support
- `lib/supabase/*`: Supabase browser/server/middleware helpers
- `components/Hero.tsx`: hero section with navigation, heading, and therapist image
- `components/Marquee.tsx`: scrolling address/hours ticker bar
- `components/Problems.tsx`: "Tired of treating symptoms" section with 4 condition cards
- `components/About.tsx`: about the specialist section with portrait and credentials
- `components/Treatments.tsx`: treatment gallery with 4 service cards and tall rounded images
- `components/Standards.tsx`: clinical practice standards (4-column grid)
- `components/CTA.tsx`: call-to-action with background image and WhatsApp link
- `components/Footer.tsx`: footer with 3-column links and large logo
- `components/Star.tsx`: reusable 4-pointed star SVG icon
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
- Visual direction is warm and clinical: cream (#fffbef) background, brown (#5f471d) text, gold (#ffdea3) accents
- Design tokens in `globals.css`: `--color-cream`, `--color-cream-light`, `--color-gold`, `--color-gold-mid`, `--color-brown`
- `app/layout.tsx` uses `Inter` (body), `Libre_Caslon_Text` (serif accents), `Federo` (logo), and `Geist_Mono` via `next/font/google`
- Font CSS variables: `--font-sans`, `--font-serif`, `--font-logo`
- Images are stored locally in `public/images/` as optimized WebP files with JPG fallbacks

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

- Landing/marketing content: `app/page.tsx`, `components/Hero.tsx`, `components/Marquee.tsx`, `components/Problems.tsx`, `components/About.tsx`, `components/Treatments.tsx`, `components/Standards.tsx`, `components/CTA.tsx`, `components/Footer.tsx`
- Global shell, metadata, fonts: `app/layout.tsx`
- Auth flow: `app/auth/*`, `lib/supabase/*`, `middleware.ts`
- Admin gating: `app/admin/*`, `app/api/posts/route.ts`
- Blog persistence: `lib/posts.ts`, `lib/slug.ts`, `data/posts.json`
- Blog UX: `components/posts/*`, `app/posts/*`
- Global styling/theme tokens: `app/globals.css`

## Known Product Gaps

- The public homepage is implemented from Figma design but not yet responsive-tuned for all breakpoints
- Blog publishing is local-file-based and not yet backed by durable storage
- The `Services.tsx` component is now unused (replaced by `Treatments.tsx` and `Problems.tsx`)
- Navigation links use anchor hrefs (`#treatments`, `#about`, etc.) — no client-side smooth scrolling yet
- Language switcher in the header is visual only, not functional
- Figma design source: `https://www.figma.com/design/SJUXZifKEuDMSb5GinpEBH/Massage-website?node-id=45-10`

## If You Update Context

- Update this file first
- Keep `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` as short mirrors that point back here
- If project architecture or setup changes materially, update `README.md` too
