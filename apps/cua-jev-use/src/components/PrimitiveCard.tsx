import type { Answer, FanOutStatus, QuestionMeta } from "../types";
import { ChoiceViz } from "./ChoiceViz";
import { NoulViz } from "./NoulViz";
import { ScoreViz } from "./ScoreViz";

interface Props {
  meta: QuestionMeta;
  answer?: Answer;
  status: FanOutStatus;
  relevant: boolean;
}

export function PrimitiveCard({ meta, answer, status, relevant }: Props) {
  const lit = status === "done";
  const running = status === "running";

  return (
    <article
      className={`primitive-card type-${meta.type} ${lit ? "lit" : ""} ${running ? "running" : ""} ${!relevant ? "ignored" : ""}`}
    >
      <header className="card-header">
        <span className={`type-badge ${meta.type}`}>{meta.type}</span>
        <h3>{meta.label}</h3>
        {meta.speculative && (
          <span className="speculative-badge" title={meta.speculativeNote}>
            speculative
          </span>
        )}
        {!relevant && lit && (
          <span className="ignored-badge">ignored by code</span>
        )}
      </header>
      <p className="card-instructions">{meta.instructions}</p>
      {running && (
        <div className="card-pulse">
          <span className="pulse-ring" />
          Evaluating in parallel…
        </div>
      )}
      {lit && answer && (
        <div className="card-answer">
          {answer.type === "choice" && <ChoiceViz answer={answer} />}
          {answer.type === "score" && <ScoreViz answer={answer} />}
          {answer.type === "noul" && <NoulViz answer={answer} />}
        </div>
      )}
      {status === "pending" && (
        <div className="card-empty">Waiting for fan-out…</div>
      )}
    </article>
  );
}
