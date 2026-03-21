@AGENTS.md

# Claude Notes

`AGENTS.md` is the canonical project context file for this repo.

Quick reminders:

- The app uses Next.js `16.2.1` App Router and React `19`
- Check `node_modules/next/dist/docs/` before changing framework behavior
- Use `pnpm`
- Public blog content is file-backed via `data/posts.json` / `POSTS_FILE_PATH`
- Admin access is controlled by Supabase auth plus `ADMIN_EMAIL`
- `middleware.ts` is functional today but deprecated in Next 16; prefer a future `proxy.ts` migration

If this file and `AGENTS.md` ever diverge, treat `AGENTS.md` as source of truth.
