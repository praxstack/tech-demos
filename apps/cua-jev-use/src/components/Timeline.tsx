import type { TimelineEvent } from "../types";

interface Props {
  events: TimelineEvent[];
}

const PHASE_LABELS: Record<string, string> = {
  observe: "Observe",
  fanout: "Fan-out",
  judgments: "Judgments",
  route: "Route",
};

export function Timeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <section className="timeline">
        <h2>Timeline</h2>
        <p className="timeline-empty">
          observe → typed judgments → action
        </p>
      </section>
    );
  }

  return (
    <section className="timeline">
      <h2>Timeline</h2>
      <ol className="timeline-list">
        {events.map((ev, i) => (
          <li key={`${ev.phase}-${ev.at}`} className={`tl-item phase-${ev.phase}`}>
            <span className="tl-dot" />
            <div className="tl-content">
              <span className="tl-phase">{PHASE_LABELS[ev.phase] ?? ev.phase}</span>
              <span className="tl-label">{ev.label}</span>
              {ev.detail && <span className="tl-detail">{ev.detail}</span>}
            </div>
            {i < events.length - 1 && <span className="tl-connector" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
