# How to Use (This Demo)

## Mock mode (default)

```bash
cd apps/cua-jev-use
bun install && bun run dev
```

Open the app → pick a ticket → **Ask Jev** (or `j`). Canned distributions simulate live API latency and fan-out animation.

## Live mode

```bash
export TYPESAFE_API_KEY=ts_...
bun run dev
```

The Vite dev server proxies `POST /api/systemone` → `https://api.typesafe.ai/v1/systemone`. UI shows **Live** badge when key is present.

## Play flow

1. Select ticket from inbox (arrow keys)
2. Click **Ask Jev** — watch 8 question cards light up in parallel
3. Read primitive visualizations (Choice bars, Score spectrum, Noul gauge)
4. Inspect **Routing decision** — Auto-reply | Ask human | Escalate | Tool call
5. Adjust thresholds in the panel to see routing change
6. Open **Docs** (`?`) for System One primer

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `j` | Ask Jev |
| `?` | Toggle docs drawer |
| `↑` / `↓` | Previous / next ticket |

## API shape (live)

```json
{
  "state": "<ticket message>",
  "model": "jev-latest",
  "questions": { "...": { "type": "choice|score|noul", ... } }
}
```

See [`tech-foundation.md`](./tech-foundation.md) for full request/response types.
