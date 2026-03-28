# Gemini Notes

Use `AGENTS.md` as the canonical project context file for this repository.

High-signal reminders:

- This repo is on Next.js `16.2.1` App Router, not older Next.js conventions
- Read the relevant docs in `node_modules/next/dist/docs/` before making framework changes
- Use `pnpm`, not npm-by-default assumptions
- Blog posts are stored in a local JSON file via `lib/posts.ts`, not a database
- Admin auth is Supabase Google OAuth plus `ADMIN_EMAILS` (comma-separated) email matching
- `middleware.ts` currently works but Next 16 warns to migrate to `proxy.ts`

If anything here conflicts with `AGENTS.md`, follow `AGENTS.md`.
