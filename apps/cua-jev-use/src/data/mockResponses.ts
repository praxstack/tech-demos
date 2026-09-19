import type { SystemOneResponse } from "../types";
import {
  BUG_SEVERITY_LEVELS,
  CATEGORY_CRITERIA,
  FRUSTRATION_LEVELS,
} from "./questions";

function choice(
  choiceVal: string,
  probs: Record<string, number>,
  confidence: number,
) {
  return { type: "choice" as const, choice: choiceVal, probabilities: probs, confidence };
}

function score(
  scoreVal: number,
  levels: string[],
  probs: Record<string, number>,
  confidence: number,
) {
  const legend = Object.fromEntries(levels.map((l, i) => [String(i), l]));
  return {
    type: "score" as const,
    score: scoreVal,
    legend,
    probabilities: probs,
    confidence,
  };
}

function noul(val: number) {
  return { type: "noul" as const, noul: val };
}

const MOCK_BY_TICKET: Record<string, SystemOneResponse> = {
  "TK-98423": {
    model: "jev-latest (mock)",
    answers: {
      category: choice(
        "billing",
        { billing: 0.82, bug_report: 0.06, feature_request: 0.04, account: 0.03, abuse: 0.01, other: 0.04 },
        0.79,
      ),
      bug_severity: score(0.4, BUG_SEVERITY_LEVELS, { "0": 0.55, "1": 0.35, "2": 0.1 }, 0.42),
      has_reproducible_steps: noul(0.12),
      refund_requested: noul(0.91),
      abuse_detected: noul(0.04),
      frustration: score(1.7, FRUSTRATION_LEVELS, { "0": 0.08, "1": 0.52, "2": 0.4 }, 0.71),
      needs_human: noul(0.22),
      tool_eligible: noul(0.35),
    },
    usage: { input_tokens: 412, output_tokens: 96 },
  },
  "TK-98401": {
    model: "jev-latest (mock)",
    answers: {
      category: choice(
        "bug_report",
        { bug_report: 0.88, billing: 0.03, feature_request: 0.02, account: 0.05, abuse: 0.0, other: 0.02 },
        0.86,
      ),
      bug_severity: score(2.1, BUG_SEVERITY_LEVELS, { "0": 0.02, "1": 0.18, "2": 0.8 }, 0.84),
      has_reproducible_steps: noul(0.94),
      refund_requested: noul(0.03),
      abuse_detected: noul(0.01),
      frustration: score(1.2, FRUSTRATION_LEVELS, { "0": 0.15, "1": 0.68, "2": 0.17 }, 0.62),
      needs_human: noul(0.08),
      tool_eligible: noul(0.18),
    },
    usage: { input_tokens: 458, output_tokens: 96 },
  },
  "TK-98388": {
    model: "jev-latest (mock)",
    answers: {
      category: choice(
        "abuse",
        { abuse: 0.76, billing: 0.08, bug_report: 0.05, account: 0.06, feature_request: 0.02, other: 0.03 },
        0.74,
      ),
      bug_severity: score(0.8, BUG_SEVERITY_LEVELS, { "0": 0.4, "1": 0.45, "2": 0.15 }, 0.38),
      has_reproducible_steps: noul(0.05),
      refund_requested: noul(0.15),
      abuse_detected: noul(0.96),
      frustration: score(2.3, FRUSTRATION_LEVELS, { "0": 0.02, "1": 0.15, "2": 0.83 }, 0.88),
      needs_human: noul(0.72),
      tool_eligible: noul(0.04),
    },
    usage: { input_tokens: 389, output_tokens: 96 },
  },
  "TK-98372": {
    model: "jev-latest (mock)",
    answers: {
      category: choice(
        "feature_request",
        { feature_request: 0.91, billing: 0.02, bug_report: 0.02, account: 0.03, abuse: 0.0, other: 0.02 },
        0.89,
      ),
      bug_severity: score(0.2, BUG_SEVERITY_LEVELS, { "0": 0.78, "1": 0.18, "2": 0.04 }, 0.55),
      has_reproducible_steps: noul(0.02),
      refund_requested: noul(0.01),
      abuse_detected: noul(0.01),
      frustration: score(0.3, FRUSTRATION_LEVELS, { "0": 0.82, "1": 0.15, "2": 0.03 }, 0.76),
      needs_human: noul(0.06),
      tool_eligible: noul(0.88),
    },
    usage: { input_tokens: 356, output_tokens: 96 },
  },
  "TK-98355": {
    model: "jev-latest (mock)",
    answers: {
      category: choice(
        "other",
        { other: 0.41, account: 0.28, bug_report: 0.15, billing: 0.08, feature_request: 0.05, abuse: 0.03 },
        0.38,
      ),
      bug_severity: score(1.0, BUG_SEVERITY_LEVELS, { "0": 0.25, "1": 0.5, "2": 0.25 }, 0.35),
      has_reproducible_steps: noul(0.08),
      refund_requested: noul(0.12),
      abuse_detected: noul(0.03),
      frustration: score(0.6, FRUSTRATION_LEVELS, { "0": 0.55, "1": 0.35, "2": 0.1 }, 0.41),
      needs_human: noul(0.87),
      tool_eligible: noul(0.22),
    },
    usage: { input_tokens: 334, output_tokens: 96 },
  },
};

export function getMockResponse(ticketId: string): SystemOneResponse {
  const response = MOCK_BY_TICKET[ticketId];
  if (!response) {
    throw new Error(`No mock for ticket ${ticketId}`);
  }
  return structuredClone(response);
}

export function getCategoryLabels(): string[] {
  return Object.keys(CATEGORY_CRITERIA);
}
