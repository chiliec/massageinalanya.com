# Copilot Instructions

Use `AGENTS.md` as the canonical source of project context for this repository.

Critical reminders for this codebase:

- The app runs on Next.js `16.2.1` App Router and React `19`
- Read the relevant docs in `node_modules/next/dist/docs/` before changing framework behavior
- Use `pnpm`
- Tailwind is v4 and configured from `app/globals.css`, not a traditional `tailwind.config.*`
- Blog posts are file-backed through `lib/posts.ts` and `data/posts.json`
- Admin auth uses Supabase Google OAuth and `ADMIN_EMAILS` (comma-separated)
- `middleware.ts` works today but Next 16 warns that `proxy.ts` is the forward-looking file convention

When in doubt, follow `AGENTS.md`.
