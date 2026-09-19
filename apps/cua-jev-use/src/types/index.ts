export type PrimitiveType = "choice" | "score" | "noul";

export interface QuestionMeta {
  id: string;
  type: PrimitiveType;
  label: string;
  instructions: string;
  speculative: boolean;
  speculativeNote?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  from: string;
  receivedAt: string;
  preview: string;
  body: string;
  tags: string[];
}

export interface ChoiceAnswer {
  type: "choice";
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface ScoreAnswer {
  type: "score";
  score: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface NoulAnswer {
  type: "noul";
  noul: number;
}

export type Answer = ChoiceAnswer | ScoreAnswer | NoulAnswer;

export interface SystemOneResponse {
  model: string;
  answers: Record<string, Answer>;
  usage: { input_tokens: number; output_tokens: number };
}

export type RoutingAction =
  | "auto_reply"
  | "ask_human"
  | "escalate"
  | "tool_call";

export interface RoutingDecision {
  action: RoutingAction;
  label: string;
  reason: string;
  confidenceFloor: number;
  highlights: string[];
}

export interface Thresholds {
  confidenceFloor: number;
  autoReplyMin: number;
  escalateFrustration: number;
  escalateBugSeverity: number;
  abuseNoul: number;
  refundNoul: number;
  toolEligibleNoul: number;
}

export type TimelinePhase =
  | "idle"
  | "observe"
  | "fanout"
  | "judgments"
  | "route";

export interface TimelineEvent {
  phase: TimelinePhase;
  label: string;
  detail?: string;
  at: number;
}

export type ApiMode = "mock" | "live";

export type FanOutStatus = "pending" | "running" | "done";
