# cua-jev-use — Jev Support Triage Cockpit

Interactive TypeSafe demo: **speculative fan-out** + **confidence-gated routing** on support tickets.

## Quick start

```bash
cd apps/cua-jev-use
bun install
bun run dev
```

Open http://localhost:5173

## How to play

1. Pick a ticket from the inbox (billing, bug, abuse, feature, confused user).
2. Click **Ask Jev** (or press `j`).
3. Watch 8 question cards light up in parallel — Choice, Score, and Noul primitives.
4. Read probability bars, confidence meters, and Noul gauges.
5. Inspect the **Routing decision** panel (Auto-reply · Ask human · Escalate · Tool call).
6. Drag threshold sliders to see routing change in real time.
7. Open **Docs** (`?`) for a System One primer.

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `j` | Ask Jev |
| `?` | Docs drawer |
| `↑` / `↓` | Previous / next ticket |

## Modes

| Mode | When | Behavior |
|------|------|----------|
| **Mock** (default) | No API key | Realistic canned distributions + simulated latency |
| **Live** | `TYPESAFE_API_KEY` set | Proxied `POST /api/systemone` → TypeSafe API |

```bash
export TYPESAFE_API_KEY=ts_your_key_here
bun run dev
```

Get keys at [console.typesafe.ai/settings/keys](https://console.typesafe.ai/settings/keys).

## What this demonstrates

- **Speculative fan-out** — bug severity, refund, abuse questions asked upfront; code ignores irrelevant branches.
- **Confidence-gated routing** — category confidence floor, risk-scaled auto-reply vs escalate.
- **Typed primitives** — visual Choice distributions, Score spectrums, Noul gauges.

## Docs (in-repo)

- [`docs/FANOUT-SYNTHESIS.md`](./docs/FANOUT-SYNTHESIS.md)
- [`docs/shards/`](./docs/shards/) — fundamentals, why TypeSafe, how-to, API reference

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Dev server + API proxy |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |

## Stack

Bun · Vite · React · TypeScript
