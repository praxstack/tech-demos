import type { ScoreAnswer } from "../types";

interface Props {
  answer: ScoreAnswer;
}

export function ScoreViz({ answer }: Props) {
  const maxLevel = Math.max(
    ...Object.keys(answer.legend).map((k) => Number(k)),
  );
  const pct = (answer.score / maxLevel) * 100;

  return (
    <div className="viz score-viz">
      <div className="viz-header">
        <span className="viz-winner">score {answer.score.toFixed(2)}</span>
        <ConfidenceMeter value={answer.confidence} />
      </div>
      <div className="score-spectrum">
        <div className="spectrum-track">
          <div className="spectrum-marker" style={{ left: `${pct}%` }} />
        </div>
        <div className="spectrum-labels">
          {Object.entries(answer.legend).map(([level, label]) => (
            <span key={level} className="spectrum-label" title={label}>
              {level}: {label.slice(0, 28)}
              {label.length > 28 ? "…" : ""}
            </span>
          ))}
        </div>
      </div>
      <div className="prob-bars compact">
        {Object.entries(answer.probabilities)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([level, prob]) => (
            <div key={level} className="prob-row">
              <span className="prob-label">L{level}</span>
              <div className="prob-track">
                <div
                  className="prob-fill score-fill"
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
    <div className={`confidence-meter ${tier}`} title="Score confidence">
      <span className="conf-label">conf</span>
      <div className="conf-track">
        <div className="conf-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="conf-value">{pct}%</span>
    </div>
  );
}
