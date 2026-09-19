interface Props {
  open: boolean;
  onClose: () => void;
}

export function DocsDrawer({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="docs-overlay" onClick={onClose} role="presentation">
      <aside
        className="docs-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="TypeSafe documentation"
      >
        <header>
          <h2>What is System One / Jev?</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="docs-body">
          <section>
            <h3>System One</h3>
            <p>
              TypeSafe models return <strong>calibrated judgments</strong> — not
              prose. You send <em>state</em> (a ticket) + typed{" "}
              <em>questions</em>; Jev returns probability distributions your code
              routes on.
            </p>
          </section>
          <section>
            <h3>Speculative fan-out</h3>
            <p>
              Ask every question you <em>might</em> need in one API call. Questions
              evaluate in parallel — no latency penalty. Your code ignores answers
              on irrelevant branches (e.g. bug severity when category is billing).
            </p>
          </section>
          <section>
            <h3>Three primitives</h3>
            <ul>
              <li>
                <strong>Choice</strong> — pick one option; get probabilities +
                confidence
              </li>
              <li>
                <strong>Score</strong> — graded spectrum; score can land between
                levels
              </li>
              <li>
                <strong>Noul</strong> — yes/no probability (0–1); no separate
                confidence field
              </li>
            </ul>
          </section>
          <section>
            <h3>Confidence-gated routing</h3>
            <p>
              Answer tells you <em>what</em>; confidence tells you{" "}
              <em>whether to act</em>. Low confidence → human. High confidence +
              low stakes → auto-reply. High severity / abuse → escalate regardless.
            </p>
          </section>
          <section>
            <h3>Learn more</h3>
            <ul className="doc-links">
              <li>
                <a
                  href="https://docs.typesafe.ai/patterns/fan-out"
                  target="_blank"
                  rel="noreferrer"
                >
                  Fan-out pattern →
                </a>
              </li>
              <li>
                <a
                  href="https://docs.typesafe.ai/patterns/confidence-routing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Confidence routing →
                </a>
              </li>
              <li>
                <a
                  href="https://console.typesafe.ai/playground"
                  target="_blank"
                  rel="noreferrer"
                >
                  Playground →
                </a>
              </li>
            </ul>
            <p className="muted">
              In-repo shards: <code>apps/cua-jev-use/docs/</code>
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}
