<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context

`AGENTS.md` is the canonical AI handoff file for this repo. Keep assistant-specific files such as `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` aligned with it instead of duplicating long project notes everywhere.

## Snapshot

- Project: `massageinalanya.com`
- Current product state: a massage/spa business platform with a multi-language homepage (en/ru/fi), public blog, and a protected admin panel covering blog editing, client/member management, and appointment scheduling
- Framework: Next.js `16.2.1` App Router on React `19.2.4`
- Language/tooling: TypeScript, Tailwind CSS v4, shadcn styling config, Supabase SSR auth + PostgreSQL, Editor.js, Vitest
- Package manager: `pnpm`

## Verified Status

Checked on `2026-03-24` (pre-appointments feature):

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
- `SUPABASE_SERVICE_ROLE_KEY`: required for the admin Supabase client (`lib/supabase/admin.ts`); bypasses RLS for server-side admin operations
- `ADMIN_EMAILS`: comma-separated list of admin email addresses

Also supported:

- `POSTS_FILE_PATH`: optional override for the local post storage file; defaults to `data/posts.json`

Notes:

- `.env.local` is local-only and should stay out of git
- `data/posts.json` is also ignored by git
- `SUPABASE_SERVICE_ROLE_KEY` is a high-privilege key — never expose it to the browser or commit it

## Architecture

### Public Routes

- `/` -> `app/page.tsx`: English homepage (Hero, Marquee, Problems, About, Treatments, Standards, CTA, Footer)
- `/ru` -> `app/ru/page.tsx`: Russian homepage (same sections, Russian translations)
- `/fi` -> `app/fi/page.tsx`: Finnish homepage (same sections, Finnish translations)
- `/posts` -> `app/posts/page.tsx`: public blog index
- `/posts/[post_url]` -> `app/posts/[post_url]/page.tsx`: public blog post page

### Auth Routes

- `/auth/login` -> `app/auth/login/page.tsx`: Google sign-in page (also shows dev login button in `NODE_ENV=development`)
- `/auth/callback` -> `app/auth/callback/route.ts`: OAuth callback
- `/auth/auth-code-error` -> `app/auth/auth-code-error/page.tsx`: login failure page
- `POST /auth/dev-login` -> `app/auth/dev-login/route.ts`: sets dev-admin cookie; only works in development
- `POST /auth/dev-logout` -> `app/auth/dev-logout/route.ts`: clears dev-admin cookie; only works in development

### Admin Routes (protected — require admin auth)

- `/admin` -> `app/admin/page.tsx`: admin dashboard with navigation to sub-sections
- `/admin/posts` -> `app/admin/posts/page.tsx`: blog editor and post list
- `/admin/members` -> `app/admin/members/page.tsx`: client/member list with CRUD and auto-save notes
- `/admin/appointments` -> `app/admin/appointments/page.tsx`: calendar-style appointment scheduler with conflict detection
- `/admin/appointments/[id]` -> `app/admin/appointments/[id]/page.tsx`: appointment detail with session timer and notes

### API Routes (admin-only via `requireAdmin()`)

- `POST /api/posts` -> `app/api/posts/route.ts`: publish a blog post
- `GET/POST/PUT /api/appointments` -> `app/api/appointments/route.ts`: appointment CRUD (fetch by date or ID, create, update notes/status)
- `GET/POST/PATCH/DELETE /api/members` -> `app/api/members/route.ts`: member CRUD
- `GET /api/music` -> `app/api/music/route.ts`: returns list of MP3 files from `public/music/`

### Supporting Modules

- `lib/posts.ts`: file-backed post persistence, sorting, excerpt generation
- `lib/slug.ts`: Turkish-aware slug generation
- `lib/whatsapp.ts`: WhatsApp booking link generator (en/ru/fi)
- `lib/i18n.ts`: full translation dictionary for en/ru/fi covering all homepage sections, nav, metadata
- `lib/admin-auth.ts`: `requireAdmin()` helper used by all API routes; checks Supabase auth or dev-auth cookie
- `lib/dev-auth.ts`: dev-mode authentication helpers; cookie name `dev-admin-session`; gated on `NODE_ENV === "development"`
- `lib/supabase/client.ts`: browser Supabase client
- `lib/supabase/server.ts`: server-side Supabase client
- `lib/supabase/middleware.ts`: session refresh middleware helper
- `lib/supabase/admin.ts`: Supabase admin client using `SUPABASE_SERVICE_ROLE_KEY`; bypasses RLS — only use server-side
- `lib/supabase/config.ts`: shared Supabase project URL/key config
- `lib/utils.ts`: common utilities (clsx/tailwind-merge)

### Homepage Components (all accept `locale` prop for i18n)

- `components/Hero.tsx`: hero section with navigation, heading, and therapist image
- `components/Marquee.tsx`: scrolling address/hours ticker bar
- `components/Problems.tsx`: "Tired of treating symptoms" section with 4 condition cards
- `components/About.tsx`: about the specialist section with portrait and credentials
- `components/Treatments.tsx`: treatment gallery with 4 service cards and tall rounded images
- `components/Standards.tsx`: clinical practice standards (4-column grid)
- `components/CTA.tsx`: call-to-action with background image and WhatsApp link
- `components/Footer.tsx`: footer with 3-column links and large logo
- `components/Star.tsx`: reusable 4-pointed star SVG icon
- `components/LanguageSwitcher.tsx`: language selector UI (visual only — see Known Product Gaps)
- `components/MobileMenu.tsx`: mobile navigation drawer
- `components/SetLocale.tsx`: client component that sets the HTML `lang` attribute based on locale

### Admin Components

- `components/admin/appointments-client.tsx`: calendar grid, appointment creation with conflict detection, session timer, music player integration
- `components/admin/appointment-detail.tsx`: detail view, notes, session management
- `components/admin/members-client.tsx`: member list with search/filter, add/delete, contact type selector
- `components/admin/auto-save-notes.tsx`: debounced textarea that auto-saves member notes via PATCH `/api/members`

### Blog Components

- `components/posts/post-editor.tsx`: client-side Editor.js post editor
- `components/posts/post-renderer.tsx`: renderer for stored Editor.js blocks

### Auth Components

- `components/auth/sign-out-button.tsx`: Supabase sign-out button
- `app/auth/login/google-sign-in-button.tsx`: Google OAuth initiation button
- `app/auth/login/dev-login-button.tsx`: dev-only login button (shown when `NODE_ENV=development`)

### Infrastructure

- `middleware.ts`: refreshes Supabase sessions and redirects unauthenticated `/admin*` to `/auth/login?next=...`; slated for future `proxy.ts` migration
- `supabase/migrations/001_appointments.sql`: creates `members` and `appointments` tables with RLS enabled (authenticated users only)
- `public/music/alarm.mp3`: session timer sound used by the appointments client
- `nginx.example.conf`: example reverse-proxy config for production deployment

## Auth And Authorization

- Authentication uses Supabase Google OAuth with `@supabase/ssr`
- In `NODE_ENV=development`, a dev-auth cookie (`dev-admin-session`) can substitute for real Supabase auth — set via `POST /auth/dev-login` and cleared via `POST /auth/dev-logout`; both routes are no-ops in production
- Admin access is based on email membership in a comma-separated list:
  - `ADMIN_EMAILS` env var holds allowed emails; `isAdminEmail()` in `lib/admin-auth.ts` checks membership
- `lib/admin-auth.ts` exports `requireAdmin()` and `isAdminEmail()` — used by all API routes and admin pages; checks Supabase session first, falls back to dev cookie in development; returns `NextResponse` with 401/403 on failure or `null` on success
- `middleware.ts` currently refreshes Supabase sessions and redirects unauthenticated `/admin*` requests to `/auth/login?next=...`
- Authorization is re-checked inside server components and all `app/api/*` route handlers
- Do not rely on middleware/proxy alone for admin authorization; keep server-side checks in place
- Supabase helper comments are important: do not move the clients into globals
- `lib/supabase/admin.ts` creates a service-role client that bypasses RLS — only call this server-side and only for admin operations

## Internationalization

- Supported locales: `en` (default), `ru`, `fi`
- Translation dictionary: `lib/i18n.ts` — exports a `translations` object keyed by locale, then section (`nav`, `hero`, `marquee`, `problems`, `about`, `treatments`, `standards`, `cta`, `footer`, `metadata`)
- All homepage section components accept a `locale` prop and call `t(locale)` to get translated strings
- Locale-specific homepages live at `app/ru/page.tsx` and `app/fi/page.tsx`; they mirror `app/page.tsx` but pass the locale down
- `components/SetLocale.tsx` is a client component that sets the HTML `lang` attribute to the current locale
- `lib/whatsapp.ts` also generates locale-aware WhatsApp booking messages
- The `LanguageSwitcher` header component is visual only — it does not yet navigate to `/ru` or `/fi` (see Known Product Gaps)

## Appointments And Members

The admin panel includes a full appointment scheduling and client management system backed by Supabase PostgreSQL.

### Database Schema

Migration: `supabase/migrations/001_appointments.sql`

```
members
  id            uuid  primary key
  name          text
  contact_type  'phone' | 'telegram' | 'whatsapp' | 'instagram' | 'other'
  contact_value text
  notes         text  (auto-saved from admin UI)
  created_at    timestamptz

appointments
  id            uuid  primary key
  member_id     uuid  → members.id
  date          date
  start_time    time
  duration      60 | 90  (minutes)
  skip_cleanup  boolean  (waive the 15-min buffer between sessions)
  notes         text
  created_at    timestamptz
```

RLS is enabled on both tables; only authenticated users can read or write.

### Key Behaviors

- **Conflict detection**: `appointments-client.tsx` validates that a new appointment's time slot (including a 15-min cleanup buffer unless `skip_cleanup`) does not overlap any existing slot on the same date
- **Session timer**: appointment detail page has a countdown/stopwatch with `alarm.mp3` from `public/music/` as an alert sound
- **Auto-save notes**: `auto-save-notes.tsx` debounces textarea input and PATCHes `/api/members` automatically; no save button needed
- The music route `GET /api/music` lists files from `public/music/` so the client can pick tracks dynamically

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
- appointments API (conflict detection, CRUD)
- members API (CRUD)
- dev-auth flow
- i18n translation completeness
- auto-save debounce behavior

## Safe Change Map

- Landing/marketing content: `app/page.tsx`, `app/ru/page.tsx`, `app/fi/page.tsx`, `components/Hero.tsx`, `components/Marquee.tsx`, `components/Problems.tsx`, `components/About.tsx`, `components/Treatments.tsx`, `components/Standards.tsx`, `components/CTA.tsx`, `components/Footer.tsx`
- Translations: `lib/i18n.ts`
- Global shell, metadata, fonts: `app/layout.tsx`
- Auth flow: `app/auth/*`, `lib/supabase/*`, `lib/dev-auth.ts`, `middleware.ts`
- Admin gating: `lib/admin-auth.ts`, `app/admin/*`, `app/api/*`
- Appointments & members: `components/admin/*`, `app/api/appointments/route.ts`, `app/api/members/route.ts`, `supabase/migrations/`
- Blog persistence: `lib/posts.ts`, `lib/slug.ts`, `data/posts.json`
- Blog UX: `components/posts/*`, `app/posts/*`
- Global styling/theme tokens: `app/globals.css`

## Known Product Gaps

- The public homepage is implemented from Figma design but not yet responsive-tuned for all breakpoints
- Blog publishing is local-file-based and not yet backed by durable storage
- The `Services.tsx` component is now unused (replaced by `Treatments.tsx` and `Problems.tsx`)
- Navigation links use anchor hrefs (`#treatments`, `#about`, etc.) — no client-side smooth scrolling yet
- `LanguageSwitcher` in the header is visual only — does not navigate to `/ru` or `/fi`
- Appointment notes and member notes are stored separately with no consolidated activity log
- No database backup or export mechanism for appointments/members data
- Figma design source: `https://www.figma.com/design/SJUXZifKEuDMSb5GinpEBH/Massage-website?node-id=45-10`

## If You Update Context

- Update this file first
- Keep `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` as short mirrors that point back here
- If project architecture or setup changes materially, update `README.md` too
