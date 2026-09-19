import type { ChoiceAnswer } from "../types";

interface Props {
  answer: ChoiceAnswer;
}

export function ChoiceViz({ answer }: Props) {
  const entries = Object.entries(answer.probabilities).sort(
    ([, a], [, b]) => b - a,
  );

  return (
    <div className="viz choice-viz">
      <div className="viz-header">
        <span className="viz-winner">{answer.choice.replace(/_/g, " ")}</span>
        <ConfidenceMeter value={answer.confidence} />
      </div>
      <div className="prob-bars">
        {entries.map(([label, prob]) => (
          <div key={label} className="prob-row">
            <span className="prob-label">{label.replace(/_/g, " ")}</span>
            <div className="prob-track">
              <div
                className={`prob-fill ${label === answer.choice ? "winner" : ""}`}
                style={{ width: `${prob * 100}%` }}
              />
            </div>
            <span className="prob-value">{(prob * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tier =
    value >= 0.75 ? "high" : value >= 0.5 ? "medium" : "low";

  return (
    <div className={`confidence-meter ${tier}`} title="Choice confidence">
      <span className="conf-label">conf</span>
      <div className="conf-track">
        <div className="conf-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="conf-value">{pct}%</span>
    </div>
  );
}
