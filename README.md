# massageinalanya.com

A clinical massage therapy website for Larisa, built with Next.js 16 App Router. Features a designed homepage (from Figma), a public blog, and a protected admin editor.

## Stack

- Next.js `16.2.1`, React `19`, TypeScript
- Tailwind CSS v4 (CSS-first, no `tailwind.config.ts`)
- Fonts: Inter (body), Libre Caslon Text (serif accents), Federo (logo)
- Supabase SSR auth (Google OAuth)
- Editor.js (blog editor)
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

## App Structure

### Homepage (`/`)
Implemented from Figma design with these sections:
- **Hero** — gold background, heading, therapist image, "Book Now" CTA
- **Marquee** — scrolling address and hours ticker
- **Problems** — "Tired of treating symptoms" with 4 condition cards
- **About** — specialist bio with portrait and credentials
- **Treatments** — 4 service cards with tall rounded images
- **Standards** — clinical practice standards (4-column grid)
- **CTA** — background image with WhatsApp contact
- **Footer** — 3-column links, social icons, large logo

### Blog
- `app/posts/page.tsx` — public blog list
- `app/posts/[post_url]/page.tsx` — public blog detail page

### Admin
- `app/admin/page.tsx` — admin dashboard
- `app/admin/posts/page.tsx` — blog editor and published posts list
- `app/api/posts/route.ts` — admin-only publish endpoint

### Auth
- `app/auth/*` — Google OAuth login flow

## Design

- Color palette: cream (`#fffbef`), gold (`#ffdea3`), brown (`#5f471d`)
- Design tokens defined in `app/globals.css`
- Images stored as optimized WebP in `public/images/`
- Figma source: Massage website (`node-id=45-10`)

## Important Notes

- This repo uses Next.js 16 conventions. Read docs in `node_modules/next/dist/docs/` before framework-level changes.
- Blog posts are stored in a local JSON file (`data/posts.json`), not a database. `data/*` is gitignored.
- Admin access is controlled by matching the signed-in user email against `ADMIN_EMAIL`.
- `middleware.ts` handles auth/session work; Next.js 16 warns that `proxy.ts` is preferred going forward.

## Verification Status

Verified on `2026-03-24`:

- `pnpm test` passes
- `pnpm lint` passes
- `pnpm build` passes

## AI Handoff

Canonical AI project context lives in `AGENTS.md`.
