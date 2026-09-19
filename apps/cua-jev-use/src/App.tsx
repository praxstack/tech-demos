import { useCallback, useEffect, useMemo, useState } from "react";
import { DocsDrawer } from "./components/DocsDrawer";
import { PrimitiveCard } from "./components/PrimitiveCard";
import { RoutingPanel } from "./components/RoutingPanel";
import { TicketInbox } from "./components/TicketInbox";
import { Timeline } from "./components/Timeline";
import { TRIAGE_QUESTIONS } from "./data/questions";
import { SAMPLE_TICKETS } from "./data/tickets";
import { askJev, fetchApiMode, runFanOutAnimation } from "./lib/client";
import { computeRouting, isQuestionRelevant } from "./lib/routing";
import { DEFAULT_THRESHOLDS } from "./lib/thresholds";
import type {
  ApiMode,
  FanOutStatus,
  SystemOneResponse,
  Thresholds,
  TimelineEvent,
} from "./types";

export default function App() {
  const [selectedId, setSelectedId] = useState(SAMPLE_TICKETS[0].id);
  const [apiMode, setApiMode] = useState<ApiMode>("mock");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SystemOneResponse | null>(null);
  const [fanOutMap, setFanOutMap] = useState<Record<string, FanOutStatus>>({});
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [docsOpen, setDocsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ticket = SAMPLE_TICKETS.find((t) => t.id === selectedId)!;
  const ticketIndex = SAMPLE_TICKETS.findIndex((t) => t.id === selectedId);

  const decision = useMemo(
    () => (response ? computeRouting(response, thresholds) : null),
    [response, thresholds],
  );

  useEffect(() => {
    fetchApiMode().then(setApiMode);
  }, []);

  const resetFanOut = useCallback(() => {
    const pending: Record<string, FanOutStatus> = {};
    for (const q of TRIAGE_QUESTIONS) pending[q.id] = "pending";
    setFanOutMap(pending);
  }, []);

  const handleAskJev = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    resetFanOut();
    setTimeline([
      {
        phase: "observe",
        label: "Ticket ingested",
        detail: ticket.subject,
        at: Date.now(),
      },
    ]);

    try {
      setTimeline((prev) => [
        ...prev,
        {
          phase: "fanout",
          label: "Speculative fan-out — 8 parallel questions",
          detail: "Single POST /v1/systemone",
          at: Date.now(),
        },
      ]);

      const questionIds = TRIAGE_QUESTIONS.map((q) => q.id);
      const animationPromise = runFanOutAnimation(questionIds, (id) => {
        setFanOutMap((prev) => ({ ...prev, [id]: "running" }));
        setTimeout(() => {
          setFanOutMap((prev) => ({ ...prev, [id]: "done" }));
        }, 280);
      });

      const [result] = await Promise.all([
        askJev(ticket.body, ticket.id, apiMode),
        animationPromise,
      ]);

      setResponse(result);
      setTimeline((prev) => [
        ...prev,
        {
          phase: "judgments",
          label: "Typed answers received",
          detail: `${Object.keys(result.answers).length} primitives · ${result.usage.input_tokens} in / ${result.usage.output_tokens} out tokens`,
          at: Date.now(),
        },
      ]);

      const route = computeRouting(result, thresholds);
      setTimeline((prev) => [
        ...prev,
        {
          phase: "route",
          label: route.label,
          detail: route.reason,
          at: Date.now(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [apiMode, resetFanOut, ticket, thresholds]);

  const handleSelectTicket = useCallback(
    (id: string) => {
      setSelectedId(id);
      setResponse(null);
      setError(null);
      resetFanOut();
      setTimeline([]);
    },
    [resetFanOut],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "j" && !loading) {
        e.preventDefault();
        void handleAskJev();
      }
      if (e.key === "?") {
        e.preventDefault();
        setDocsOpen((o) => !o);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = SAMPLE_TICKETS[(ticketIndex + 1) % SAMPLE_TICKETS.length];
        handleSelectTicket(next.id);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev =
          SAMPLE_TICKETS[
            (ticketIndex - 1 + SAMPLE_TICKETS.length) % SAMPLE_TICKETS.length
          ];
        handleSelectTicket(prev.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAskJev, handleSelectTicket, loading, ticketIndex]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">Jev</span>
          <div>
            <h1>Support Triage Cockpit</h1>
            <p>TypeSafe · speculative fan-out · confidence routing</p>
          </div>
        </div>
        <div className="header-actions">
          <span className={`mode-badge ${apiMode}`}>
            {apiMode === "live" ? "● Live" : "○ Mock"}
          </span>
          <button
            type="button"
            className="btn secondary"
            onClick={() => setDocsOpen(true)}
          >
            Docs <kbd>?</kbd>
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => void handleAskJev()}
            disabled={loading}
          >
            {loading ? "Asking Jev…" : "Ask Jev"} <kbd>j</kbd>
          </button>
        </div>
      </header>

      <div className="app-body">
        <TicketInbox
          tickets={SAMPLE_TICKETS}
          selectedId={selectedId}
          onSelect={handleSelectTicket}
        />

        <main className="workspace">
          <section className="ticket-detail">
            <div className="detail-header">
              <h2>{ticket.subject}</h2>
              <span className="detail-from">{ticket.from}</span>
            </div>
            <div className="ticket-body">{ticket.body}</div>
          </section>

          {error && <div className="error-banner">{error}</div>}

          <section className="fanout-section">
            <div className="section-header">
              <h2>Parallel question fan-out</h2>
              <p>
                All 8 questions in one call — speculative ones dim when code
                ignores them
              </p>
            </div>
            {!response && !loading && Object.values(fanOutMap).every((s) => s === "pending") && (
              <div className="empty-state">
                <p>Click <strong>Ask Jev</strong> to fire a speculative fan-out.</p>
                <p className="muted">
                  Watch each Choice / Score / Noul card light up in parallel — no
                  extra round trips.
                </p>
              </div>
            )}
            <div className="primitive-grid">
              {TRIAGE_QUESTIONS.map((meta) => (
                <PrimitiveCard
                  key={meta.id}
                  meta={meta}
                  answer={response?.answers[meta.id]}
                  status={fanOutMap[meta.id] ?? "pending"}
                  relevant={
                    response
                      ? isQuestionRelevant(meta.id, response)
                      : true
                  }
                />
              ))}
            </div>
          </section>

          <div className="bottom-panels">
            <RoutingPanel
              decision={decision}
              thresholds={thresholds}
              onThresholdChange={setThresholds}
            />
            <Timeline events={timeline} />
          </div>
        </main>
      </div>

      <DocsDrawer open={docsOpen} onClose={() => setDocsOpen(false)} />
    </div>
  );
}
