import type { RoutingDecision, RoutingAction, Thresholds } from "../types";

interface Props {
  decision: RoutingDecision | null;
  thresholds: Thresholds;
  onThresholdChange: (t: Thresholds) => void;
}

const ACTION_ICONS: Record<RoutingAction, string> = {
  auto_reply: "✉",
  ask_human: "👤",
  escalate: "⚡",
  tool_call: "🔧",
};

export function RoutingPanel({
  decision,
  thresholds,
  onThresholdChange,
}: Props) {
  return (
    <section className="routing-panel">
      <h2>Routing decision</h2>
      {!decision ? (
        <div className="routing-empty">
          <p>Run <strong>Ask Jev</strong> to see confidence-gated routing.</p>
          <p className="muted">
            Code reads typed answers + thresholds → Auto-reply | Ask human |
            Escalate | Tool call
          </p>
        </div>
      ) : (
        <div className={`routing-result action-${decision.action}`}>
          <div className="routing-icon">{ACTION_ICONS[decision.action]}</div>
          <div>
            <div className="routing-label">{decision.label}</div>
            <div className="routing-reason">{decision.reason}</div>
            {decision.highlights.length > 0 && (
              <ul className="routing-highlights">
                {decision.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <details className="thresholds-editor" open>
        <summary>Editable thresholds</summary>
        <div className="threshold-grid">
          <ThresholdSlider
            label="Confidence floor"
            value={thresholds.confidenceFloor}
            min={0.3}
            max={0.9}
            step={0.05}
            onChange={(v) =>
              onThresholdChange({ ...thresholds, confidenceFloor: v })
            }
          />
          <ThresholdSlider
            label="Auto-reply min conf"
            value={thresholds.autoReplyMin}
            min={0.5}
            max={0.95}
            step={0.05}
            onChange={(v) =>
              onThresholdChange({ ...thresholds, autoReplyMin: v })
            }
          />
          <ThresholdSlider
            label="Escalate frustration"
            value={thresholds.escalateFrustration}
            min={0.5}
            max={2.5}
            step={0.1}
            onChange={(v) =>
              onThresholdChange({ ...thresholds, escalateFrustration: v })
            }
          />
          <ThresholdSlider
            label="Escalate bug severity"
            value={thresholds.escalateBugSeverity}
            min={0.5}
            max={2.5}
            step={0.1}
            onChange={(v) =>
              onThresholdChange({ ...thresholds, escalateBugSeverity: v })
            }
          />
          <ThresholdSlider
            label="Abuse noul"
            value={thresholds.abuseNoul}
            min={0.5}
            max={0.95}
            step={0.05}
            onChange={(v) =>
              onThresholdChange({ ...thresholds, abuseNoul: v })
            }
          />
          <ThresholdSlider
            label="Refund noul"
            value={thresholds.refundNoul}
            min={0.5}
            max={0.95}
            step={0.05}
            onChange={(v) =>
              onThresholdChange({ ...thresholds, refundNoul: v })
            }
          />
        </div>
      </details>
    </section>
  );
}

function ThresholdSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="threshold-row">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="threshold-val">{value.toFixed(2)}</span>
    </label>
  );
}
