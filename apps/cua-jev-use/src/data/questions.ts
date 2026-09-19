import type { QuestionMeta } from "../types";

export const TRIAGE_QUESTIONS: QuestionMeta[] = [
  {
    id: "category",
    type: "choice",
    label: "Category",
    instructions: "Determine the broad category of this support ticket",
    speculative: false,
  },
  {
    id: "bug_severity",
    type: "score",
    label: "Bug severity",
    instructions: "How severe is the reported issue",
    speculative: true,
    speculativeNote: "Only used if category is bug_report",
  },
  {
    id: "has_reproducible_steps",
    type: "noul",
    label: "Repro steps",
    instructions: "The user describes specific steps to reproduce the issue",
    speculative: true,
    speculativeNote: "Only used for bug reports",
  },
  {
    id: "refund_requested",
    type: "noul",
    label: "Refund requested",
    instructions: "The user is explicitly asking for a refund or credit",
    speculative: true,
    speculativeNote: "Most relevant for billing",
  },
  {
    id: "abuse_detected",
    type: "noul",
    label: "Abuse / toxicity",
    instructions: "The message contains harassment, threats, or policy violations",
    speculative: true,
    speculativeNote: "Safety gate — any category",
  },
  {
    id: "frustration",
    type: "score",
    label: "Frustration",
    instructions: "How frustrated the user appears",
    speculative: false,
  },
  {
    id: "needs_human",
    type: "noul",
    label: "Needs human",
    instructions: "The request is too ambiguous for automated handling",
    speculative: false,
  },
  {
    id: "tool_eligible",
    type: "noul",
    label: "KB tool eligible",
    instructions: "A knowledge-base lookup can likely resolve this without a human",
    speculative: true,
    speculativeNote: "Auto-reply path when confidence is high",
  },
];

export const CATEGORY_CRITERIA: Record<string, string> = {
  bug_report: "Something is broken or producing errors",
  billing: "Charges, invoices, refunds, subscriptions",
  feature_request: "User is requesting new functionality",
  account: "Login, permissions, profile, security",
  abuse: "Harassment, spam, or policy violation report",
  other: "Does not clearly fit other categories",
};

export const BUG_SEVERITY_LEVELS = [
  "Cosmetic; no impact to functionality",
  "Broken or degraded feature; workaround exists",
  "Blocking issue; no workaround exists",
];

export const FRUSTRATION_LEVELS = [
  "Calm, matter-of-fact",
  "Frustrated but civil",
  "Very angry, strong language",
];

export function buildQuestionsPayload() {
  return {
    category: {
      type: "choice" as const,
      instructions: TRIAGE_QUESTIONS[0].instructions,
      criteria: CATEGORY_CRITERIA,
    },
    bug_severity: {
      type: "score" as const,
      instructions: TRIAGE_QUESTIONS[1].instructions,
      criteria: BUG_SEVERITY_LEVELS,
    },
    has_reproducible_steps: {
      type: "noul" as const,
      instructions: TRIAGE_QUESTIONS[2].instructions,
    },
    refund_requested: {
      type: "noul" as const,
      instructions: TRIAGE_QUESTIONS[3].instructions,
    },
    abuse_detected: {
      type: "noul" as const,
      instructions: TRIAGE_QUESTIONS[4].instructions,
    },
    frustration: {
      type: "score" as const,
      instructions: TRIAGE_QUESTIONS[5].instructions,
      criteria: FRUSTRATION_LEVELS,
    },
    needs_human: {
      type: "noul" as const,
      instructions: TRIAGE_QUESTIONS[6].instructions,
    },
    tool_eligible: {
      type: "noul" as const,
      instructions: TRIAGE_QUESTIONS[7].instructions,
    },
  };
}
