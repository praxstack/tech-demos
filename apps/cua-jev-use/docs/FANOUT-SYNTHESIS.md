# FANOUT Synthesis — TypeSafe for Support Triage

> Synthesized from research pack + [docs.typesafe.ai](https://docs.typesafe.ai) for in-repo reference.

## Core idea

**Speculative fan-out:** Send every question you *might* need in one `POST /v1/systemone` call. Jev evaluates them in parallel — extra questions add token cost, not latency. Your code ignores irrelevant answers after classification.

**Confidence-gated routing:** `choice` / `score` tell you *what*; `confidence` tells you *whether to act*. Noul uses distance from 0.5 as uncertainty. Thresholds scale with stakes.

## Triage question set (this demo)

| ID | Type | Speculative? | Used when |
|----|------|--------------|-----------|
| `category` | Choice | No | Always — routes branch |
| `bug_severity` | Score | Yes | `category == bug_report` |
| `has_reproducible_steps` | Noul | Yes | Bug path |
| `refund_requested` | Noul | Yes | Billing path |
| `abuse_detected` | Noul | Yes | Safety path |
| `frustration` | Score | No | Priority flag (any category) |
| `needs_human` | Noul | No | Low confidence / confused |
| `tool_eligible` | Noul | Yes | Auto-reply via KB lookup |

## Routing tiers

| Tier | Signal | Action |
|------|--------|--------|
| Auto-reply | High confidence + low stakes | Template / tool |
| Ask human | Medium confidence | Confirm with agent |
| Escalate | High severity / abuse / frustration | Priority queue |
| Fallback | Low confidence floor | Human queue |

## Shards

- [`shards/jev-fundamentals.md`](./shards/jev-fundamentals.md) — System One mental model
- [`shards/why-use-typesafe.md`](./shards/why-use-typesafe.md) — vs prompt-and-parse
- [`shards/how-to-use.md`](./shards/how-to-use.md) — integration steps
- [`shards/tech-foundation.md`](./shards/tech-foundation.md) — API, primitives, SDK

## Benchmark anchor

13 parallel questions on a ~54K char document: **12.2× cheaper**, **10.0× faster** vs 13 sequential calls (identical answers) — `cookbooks-parallel_questions`.
