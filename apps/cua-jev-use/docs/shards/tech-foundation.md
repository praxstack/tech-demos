# Tech Foundation

## HTTP API

```
POST https://api.typesafe.ai/v1/systemone
Authorization: Bearer <TYPESAFE_API_KEY>
Content-Type: application/json
```

### Request

- `state` (string | object) — content to evaluate
- `model` — `"jev-latest"`
- `questions` — map of typed questions (keys are your IDs, not sent to model)

### Response

- `answers` — same keys as questions
- `usage` — token counts

## Answer shapes

**Choice:** `{ type, choice, probabilities, confidence }`

**Score:** `{ type, score, legend, probabilities, confidence }`

**Noul:** `{ type, noul }` — probability of yes; use `|noul - 0.5|` as uncertainty

## Confidence

Derived from probability distribution shape. Three-tier pattern:

- **High** — act automatically
- **Medium** — confirm / flag
- **Low** (< ~0.5) — human / clarify

Thresholds vary by action risk (read vs destructive).

## JavaScript SDK

```bash
npm install @typesafe-ai/sdk
```

```ts
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
const client = new TypeSafeClient();
await client.systemOne({ state, questions: { ... } });
```

This demo uses a thin fetch wrapper + mock layer; SDK optional for production.

## Console

- Playground: [console.typesafe.ai/playground](https://console.typesafe.ai/playground)
- API keys: [console.typesafe.ai/settings/keys](https://console.typesafe.ai/settings/keys)
