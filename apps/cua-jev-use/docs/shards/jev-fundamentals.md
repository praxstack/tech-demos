# Jev Fundamentals

**Jev** (`jev-latest`) is TypeSafe's flagship **System One** model — trained for calibrated, structured **judgments**, not open-ended generation.

## Mental model

1. **State** — text or JSON you want evaluated (e.g. ticket message)
2. **Questions** — typed primitives (Choice, Score, Noul) you define
3. **Answers** — probability distributions your code routes on

> "Ask for a judgment a knowledgeable person makes in a second given the right context."

## Code owns workflow

The model supplies atomic judgments; your application composes them into decision trees, thresholds, and side effects. No agent loop required for triage.

## Three primitives

| Primitive | Question | Answer highlights |
|-----------|----------|-------------------|
| **Choice** | Pick one of N options | `choice`, `probabilities`, `confidence` |
| **Score** | Position on ordered levels | `score`, `legend`, `probabilities`, `confidence` |
| **Noul** | Yes/no probability | `noul` (0–1, no separate confidence) |

## Key patterns in this demo

- **Speculative fan-out** — ask bug + billing + abuse questions upfront
- **Confidence-gated routing** — act / confirm / escalate by threshold + stakes
