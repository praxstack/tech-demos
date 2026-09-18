# Tech Demos monorepo

Sticky playground for one-app-per-pick demos from X bookmarks.

## Layout
- `apps/<slug>/` — one self-contained demo app (Bun: `bun install && bun run dev`)
- `skills/project-planning/` — vendored planning skill; use before coding
- `tracking/seen-bookmarks.json` — proposed / built / skipped bookmark ids

## Rules for cloud agents
1. Only add/update `apps/<kebab-slug>/` for the assigned pick.
2. Never create a new GitHub repository.
3. Plan with `skills/project-planning/` and write `apps/<slug>/PLAN.md` first.
4. Open one PR. Attach **both** at least one screenshot **and** at least one video of the running app.
5. Prefer model `claude-fable-5` (Fable 5) unless the owner overrides.
6. Cloudflare preview: one Pages project for this repo (path per app), not one project per app.
