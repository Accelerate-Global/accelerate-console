// Canonical engagement status labels (used across all pages)
export const ENGAGEMENT_STATUS = {
  UNREACHED: "Unreached",
  MINIMALLY_REACHED: "Minimally Reached",
  PARTIALLY_REACHED: "Partially Reached",
  SIGNIFICANTLY_REACHED: "Significantly Reached",
  FULLY_REACHED: "Fully Reached",
  UNKNOWN: "Unknown",
} as const

export type EngagementStatus = (typeof ENGAGEMENT_STATUS)[keyof typeof ENGAGEMENT_STATUS]

// Map legacy/variant labels to canonical ones
export function normalizeEngagementStatus(status: string): EngagementStatus {
  const normalized = status.toLowerCase().trim()

  if (normalized.includes("unreached")) return ENGAGEMENT_STATUS.UNREACHED
  if (normalized.includes("minimally")) return ENGAGEMENT_STATUS.MINIMALLY_REACHED
  if (normalized.includes("partially") || normalized.includes("engaged")) return ENGAGEMENT_STATUS.PARTIALLY_REACHED
  if (normalized.includes("significantly") || normalized.includes("established"))
    return ENGAGEMENT_STATUS.SIGNIFICANTLY_REACHED
  if (normalized.includes("fully")) return ENGAGEMENT_STATUS.FULLY_REACHED

  return ENGAGEMENT_STATUS.UNKNOWN
}

// Canonical data quality labels
export const DATA_QUALITY = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  NEEDS_REVIEW: "Needs Review",
} as const

export type DataQuality = (typeof DATA_QUALITY)[keyof typeof DATA_QUALITY]

// Map legacy quality scores to canonical labels
export function normalizeDataQuality(quality: string): DataQuality {
  const normalized = quality.toLowerCase().trim()

  if (normalized === "a" || normalized === "high") return DATA_QUALITY.HIGH
  if (normalized === "b" || normalized === "medium") return DATA_QUALITY.MEDIUM
  if (normalized === "c" || normalized === "low") return DATA_QUALITY.LOW

  return DATA_QUALITY.NEEDS_REVIEW
}
