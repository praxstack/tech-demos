import { noulCertainty } from "../lib/routing";
import type { NoulAnswer } from "../types";

interface Props {
  answer: NoulAnswer;
}

export function NoulViz({ answer }: Props) {
  const pct = Math.round(answer.noul * 100);
  const certainty = noulCertainty(answer.noul);
  const tier =
    certainty >= 0.6 ? "high" : certainty >= 0.3 ? "medium" : "low";
  const verdict =
    answer.noul >= 0.65 ? "Yes" : answer.noul <= 0.35 ? "No" : "Uncertain";

  return (
    <div className="viz noul-viz">
      <div className="viz-header">
        <span className="viz-winner">{verdict}</span>
        <span className={`noul-certainty ${tier}`}>
          certainty {(certainty * 100).toFixed(0)}%
        </span>
      </div>
      <div className="noul-gauge">
        <div className="gauge-track">
          <div className="gauge-mid" />
          <div
            className="gauge-fill"
            style={{
              left: answer.noul >= 0.5 ? "50%" : `${pct}%`,
              width: `${Math.abs(answer.noul - 0.5) * 100}%`,
            }}
          />
          <div className="gauge-needle" style={{ left: `${pct}%` }} />
        </div>
        <div className="gauge-labels">
          <span>0 No</span>
          <span>0.5</span>
          <span>1 Yes</span>
        </div>
      </div>
      <div className="noul-value">noul = {answer.noul.toFixed(3)}</div>
    </div>
  );
}
