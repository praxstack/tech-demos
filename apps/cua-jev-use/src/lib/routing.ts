import type {
  Answer,
  ChoiceAnswer,
  NoulAnswer,
  RoutingDecision,
  ScoreAnswer,
  SystemOneResponse,
  Thresholds,
} from "../types";

function isChoice(a: Answer): a is ChoiceAnswer {
  return a.type === "choice";
}

function isScore(a: Answer): a is ScoreAnswer {
  return a.type === "score";
}

function isNoul(a: Answer): a is NoulAnswer {
  return a.type === "noul";
}

function noulCertainty(n: number): number {
  return Math.abs(n - 0.5) * 2;
}

export function computeRouting(
  response: SystemOneResponse,
  thresholds: Thresholds,
): RoutingDecision {
  const { answers } = response;
  const category = answers.category;
  const frustration = answers.frustration;
  const abuse = answers.abuse_detected;
  const needsHuman = answers.needs_human;
  const toolEligible = answers.tool_eligible;
  const refund = answers.refund_requested;
  const bugSeverity = answers.bug_severity;

  const highlights: string[] = [];

  if (isNoul(abuse) && abuse.noul >= thresholds.abuseNoul) {
    highlights.push(`Abuse detected (noul ${abuse.noul.toFixed(2)})`);
    return {
      action: "escalate",
      label: "Escalate — Trust & Safety",
      reason: "Abuse/toxicity threshold exceeded. Route to specialized queue immediately.",
      confidenceFloor: thresholds.confidenceFloor,
      highlights,
    };
  }

  if (isNoul(needsHuman) && needsHuman.noul >= 0.6) {
    highlights.push(`Ambiguous request (needs_human ${needsHuman.noul.toFixed(2)})`);
    return {
      action: "ask_human",
      label: "Ask human — clarify intent",
      reason: "Ticket is too vague for automated routing. Agent should gather context first.",
      confidenceFloor: thresholds.confidenceFloor,
      highlights,
    };
  }

  if (isChoice(category) && category.confidence < thresholds.confidenceFloor) {
    highlights.push(`Low category confidence (${category.confidence.toFixed(2)})`);
    return {
      action: "ask_human",
      label: "Ask human — low confidence",
      reason: `Category confidence below floor (${thresholds.confidenceFloor}). Do not guess.`,
      confidenceFloor: thresholds.confidenceFloor,
      highlights,
    };
  }

  if (isScore(frustration) && frustration.score >= thresholds.escalateFrustration) {
    highlights.push(`High frustration (score ${frustration.score.toFixed(1)})`);
  }

  if (isChoice(category)) {
    const cat = category.choice;

    if (cat === "bug_report" && isScore(bugSeverity)) {
      highlights.push(`Bug severity ${bugSeverity.score.toFixed(1)}`);
      if (
        bugSeverity.score >= thresholds.escalateBugSeverity &&
        isNoul(answers.has_reproducible_steps) &&
        answers.has_reproducible_steps.noul > 0.6
      ) {
        return {
          action: "escalate",
          label: "Escalate — Engineering P0",
          reason: "Blocking bug with reproducible steps. Skip backlog.",
          confidenceFloor: thresholds.confidenceFloor,
          highlights,
        };
      }
      if (bugSeverity.score >= thresholds.escalateBugSeverity) {
        return {
          action: "escalate",
          label: "Escalate — Engineering",
          reason: "High severity bug report warrants priority engineering review.",
          confidenceFloor: thresholds.confidenceFloor,
          highlights,
        };
      }
      return {
        action: "tool_call",
        label: "Tool call — Create bug ticket",
        reason: "Standard bug path: file in backlog via integration.",
        confidenceFloor: thresholds.confidenceFloor,
        highlights,
      };
    }

    if (cat === "billing") {
      if (isNoul(refund) && refund.noul >= thresholds.refundNoul) {
        highlights.push(`Refund likely (noul ${refund.noul.toFixed(2)})`);
        if (category.confidence >= thresholds.autoReplyMin) {
          return {
            action: "auto_reply",
            label: "Auto-reply — Refund workflow",
            reason: "High-confidence billing + refund signal. Trigger refund template.",
            confidenceFloor: thresholds.confidenceFloor,
            highlights,
          };
        }
      }
      return {
        action: "ask_human",
        label: "Ask human — Billing review",
        reason: "Route to billing team for manual verification.",
        confidenceFloor: thresholds.confidenceFloor,
        highlights,
      };
    }

    if (cat === "feature_request") {
      if (
        isNoul(toolEligible) &&
        toolEligible.noul >= thresholds.toolEligibleNoul &&
        category.confidence >= thresholds.autoReplyMin
      ) {
        highlights.push(`KB eligible (noul ${toolEligible.noul.toFixed(2)})`);
        return {
          action: "auto_reply",
          label: "Auto-reply — Feature roadmap KB",
          reason: "Send roadmap article + log feature vote automatically.",
          confidenceFloor: thresholds.confidenceFloor,
          highlights,
        };
      }
      return {
        action: "tool_call",
        label: "Tool call — Log feature request",
        reason: "File feature request in product tracker.",
        confidenceFloor: thresholds.confidenceFloor,
        highlights,
      };
    }

    if (cat === "abuse") {
      return {
        action: "escalate",
        label: "Escalate — Trust & Safety",
        reason: "Abuse category classification.",
        confidenceFloor: thresholds.confidenceFloor,
        highlights,
      };
    }
  }

  if (
    isNoul(toolEligible) &&
    toolEligible.noul >= thresholds.toolEligibleNoul &&
    isChoice(category) &&
    category.confidence >= thresholds.autoReplyMin
  ) {
    return {
      action: "auto_reply",
      label: "Auto-reply — Knowledge base",
      reason: "High confidence + KB match. Send templated answer.",
      confidenceFloor: thresholds.confidenceFloor,
      highlights,
    };
  }

  if (isScore(frustration) && frustration.score >= thresholds.escalateFrustration) {
    return {
      action: "escalate",
      label: "Escalate — Priority response",
      reason: "Frustration score triggers VIP queue regardless of category.",
      confidenceFloor: thresholds.confidenceFloor,
      highlights,
    };
  }

  return {
    action: "ask_human",
    label: "Ask human — Default queue",
    reason: "No automatic path met thresholds. Agent triage required.",
    confidenceFloor: thresholds.confidenceFloor,
    highlights,
  };
}

export function isQuestionRelevant(
  questionId: string,
  response: SystemOneResponse,
): boolean {
  const category = response.answers.category;
  if (!isChoice(category)) return true;

  switch (questionId) {
    case "bug_severity":
    case "has_reproducible_steps":
      return category.choice === "bug_report";
    case "refund_requested":
      return category.choice === "billing";
    case "tool_eligible":
      return ["feature_request", "account", "other"].includes(category.choice);
    default:
      return true;
  }
}

export { noulCertainty };
