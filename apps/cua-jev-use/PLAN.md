# cua-jev-use — Support Ticket Triage Cockpit

## Pick
- **Tech:** TypeSafe / Jev (System One)
- **Demo angle:** Speculative fan-out + confidence-gated routing on support tickets
- **Monorepo:** `apps/cua-jev-use/` only

## Goal
Playable, visual, interactive cockpit where Prax understands TypeSafe in ~2 minutes by clicking through ticket triage: one API call fans out many typed questions, primitives render as probability bars / confidence meters / Noul gauges, and code routes to Auto-reply | Ask human | Escalate | Tool call.

## MVP scope
- Ticket inbox with 5 sample tickets (billing, bug, abuse, feature, confused)
- **Ask Jev** triggers animated parallel fan-out (8 question cards)
- Visualizations: Choice (prob bars + confidence), Score (spectrum + confidence), Noul (gauge)
- Routing decision panel driven by editable thresholds
- Timeline: observe → typed judgments → action
- Docs drawer (System One / Jev / fan-out / confidence)
- Mock mode default; live mode when `TYPESAFE_API_KEY` set (Vite dev proxy → `POST /v1/systemone`)
- Dark polished UI, keyboard shortcuts (`j` Ask Jev, `?` docs, arrows navigate tickets)

## Non-goals
- Auth, persistence, real ticket backend
- Production deployment config beyond README
- Other monorepo apps / new GitHub repo
- Multimodal input

## File layout
```
apps/cua-jev-use/
  PLAN.md
  README.md
  package.json
  vite.config.ts
  tsconfig*.json
  index.html
  docs/
    FANOUT-SYNTHESIS.md
    shards/*.md
  src/
    main.tsx, App.tsx, index.css
    types/          — API + domain types
    data/           — sample tickets, question defs, mock answers
    lib/            — client, routing, thresholds
    components/     — inbox, fan-out, viz, routing, timeline, docs
```

## Bun scripts
| Script | Purpose |
|--------|---------|
| `dev` | Vite dev server + API proxy |
| `build` | Production bundle |
| `preview` | Preview build |

## Validation
- `bun install && bun run dev` from `apps/cua-jev-use/`
- Screenshot + video of triage flow in PR
- Mock mode demos fan-out animation, probability bars, confidence meters, routing panel
