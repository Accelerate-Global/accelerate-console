// These classes use CSS variables that automatically adapt to light/dark mode

export function getEngagementColor(status: string): string {
  switch (status.toLowerCase()) {
    case "unreached":
      return "status-unreached border"
    case "minimally reached":
    case "minimally engaged":
      return "status-minimally border"
    case "superficially engaged":
    case "engaged":
      return "status-superficially border"
    case "significantly engaged":
    case "established":
      return "status-significantly border"
    case "fully engaged":
      return "status-fully border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getQualityColor(quality: string): string {
  switch (quality.toLowerCase()) {
    case "high":
      return "quality-high border"
    case "medium":
      return "quality-medium border"
    case "low":
      return "quality-low border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getChangeColor(changeType: string): string {
  switch (changeType.toLowerCase()) {
    case "engagement":
      return "change-engagement border"
    case "population":
      return "change-population border"
    case "updated":
    case "data":
      return "change-updated border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

// Map tag color classes to semantic CSS classes
export function getTagDotClass(colorClass: string): string {
  if (colorClass.includes("red")) return "tag-dot-red"
  if (colorClass.includes("orange")) return "tag-dot-orange"
  if (colorClass.includes("amber")) return "tag-dot-amber"
  if (colorClass.includes("emerald")) return "tag-dot-emerald"
  if (colorClass.includes("teal")) return "tag-dot-teal"
  if (colorClass.includes("blue")) return "tag-dot-blue"
  return "tag-dot-gray"
}
