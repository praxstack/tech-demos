import type { Thresholds } from "../types";

export const DEFAULT_THRESHOLDS: Thresholds = {
  confidenceFloor: 0.5,
  autoReplyMin: 0.75,
  escalateFrustration: 1.5,
  escalateBugSeverity: 1.5,
  abuseNoul: 0.7,
  refundNoul: 0.7,
  toolEligibleNoul: 0.65,
};
