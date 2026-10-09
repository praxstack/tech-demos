# Why Use TypeSafe

## vs traditional LLM integration

| Traditional | TypeSafe |
|-------------|----------|
| Generate JSON in prose | Constrained probability distributions |
| Parse & validate in code | Schema-guaranteed typed answers |
| One prompt per decision | Batch independent questions (fan-out) |
| Opaque "confidence" | Explicit `confidence` + full `probabilities` |
| Model owns workflow | **Code owns workflow** |

## Good fit

- Routing, classification, intent detection
- Guardrails (abuse, jailbreak)
- RAG filtering / reranking
- Verification gates before tool calls

## Poor fit

- Long-form generation (essays, code)
- Multi-step reasoning chains (pair with LLM + TypeSafe verify)
- Multimodal input (Jev: text/JSON only today)

## Measured wins

- **Parallel questions:** 12.2× cheaper, 10× faster (13 Q, large doc)
- **Reranking:** Top-1 accuracy gains on legal retrieval tasks
- **SDE cascade:** Near reasoning-model quality at lower cost
