"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeft, X, Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getEngagementColor, getQualityColor } from "@/lib/status-colors"

// Mock data - in a real app this would come from an API
const mockGroupsData: Record<
  string,
  {
    id: string
    axId: string
    name: string
    alternateNames: string[]
    countries: string[]
    familyAffiliation: string
    population: number
    primaryLanguages: string[]
    engagementStatus: string
    presenceGranularity: string
    dataQuality: string
    lastUpdated: string
    sources: string[]
  }
> = {
  "AX-10234": {
    id: "1",
    axId: "AX-10234",
    name: "Shaikh (Muslim traditions)",
    alternateNames: ["Sheikh", "Sayyid", "Shaykh"],
    countries: ["Bangladesh", "India"],
    familyAffiliation: "Indo-Aryan",
    population: 180500000,
    primaryLanguages: ["Bengali", "Hindi", "Urdu"],
    engagementStatus: "Unreached",
    presenceGranularity: "Country",
    dataQuality: "High",
    lastUpdated: "2 days ago",
    sources: ["Joshua Project", "IMB"],
  },
  "AX-10892": {
    id: "2",
    axId: "AX-10892",
    name: "Yadav (Hindu traditions)",
    alternateNames: ["Ahir", "Gwala"],
    countries: ["India", "Nepal"],
    familyAffiliation: "Indo-Aryan",
    population: 62800000,
    primaryLanguages: ["Hindi", "Bhojpuri"],
    engagementStatus: "Minimally Reached",
    presenceGranularity: "State/Province",
    dataQuality: "Medium",
    lastUpdated: "5 days ago",
    sources: ["Joshua Project"],
  },
  "AX-15678": {
    id: "3",
    axId: "AX-15678",
    name: "Turk",
    alternateNames: ["Turkish", "Anatolian Turk"],
    countries: ["Turkey", "Germany", "Netherlands"],
    familyAffiliation: "Turkic",
    population: 58200000,
    primaryLanguages: ["Turkish"],
    engagementStatus: "Partially Reached",
    presenceGranularity: "Country",
    dataQuality: "High",
    lastUpdated: "1 week ago",
    sources: ["Joshua Project", "Operation World"],
  },
  "AX-10156": {
    id: "4",
    axId: "AX-10156",
    name: "Bengali (Muslim traditions)",
    alternateNames: ["Bangali", "Bangladeshi"],
    countries: ["Bangladesh", "India"],
    familyAffiliation: "Indo-Aryan",
    population: 145700000,
    primaryLanguages: ["Bengali"],
    engagementStatus: "Unreached",
    presenceGranularity: "District",
    dataQuality: "High",
    lastUpdated: "3 days ago",
    sources: ["IMB", "Joshua Project"],
  },
  "AX-12456": {
    id: "5",
    axId: "AX-12456",
    name: "Pashtun (Pathan)",
    alternateNames: ["Pathan", "Pakhtun", "Afghan"],
    countries: ["Afghanistan", "Pakistan"],
    familyAffiliation: "Iranian",
    population: 49500000,
    primaryLanguages: ["Pashto"],
    engagementStatus: "Unreached",
    presenceGranularity: "Country",
    dataQuality: "Medium",
    lastUpdated: "2 weeks ago",
    sources: ["Joshua Project"],
  },
}

const comparisonFields = [
  { key: "axId", label: "AX ID" },
  { key: "name", label: "Primary Name" },
  { key: "alternateNames", label: "Alternate Names" },
  { key: "countries", label: "Countries" },
  { key: "familyAffiliation", label: "Family / Affiliation" },
  { key: "population", label: "Population" },
  { key: "primaryLanguages", label: "Primary Languages" },
  { key: "engagementStatus", label: "Engagement Status" },
  { key: "presenceGranularity", label: "Presence Granularity" },
  { key: "dataQuality", label: "Data Quality" },
  { key: "lastUpdated", label: "Last Updated" },
  { key: "sources", label: "Sources" },
] as const

type FieldKey = (typeof comparisonFields)[number]["key"]

export function ComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const idsParam = searchParams.get("ids") || ""
  const [selectedIds, setSelectedIds] = useState<string[]>(idsParam.split(",").filter(Boolean))
  const [highlightDifferences, setHighlightDifferences] = useState(false)

  const groups = useMemo(() => {
    return selectedIds.map((id) => mockGroupsData[id]).filter(Boolean)
  }, [selectedIds])

  const removeGroup = (axId: string) => {
    const newIds = selectedIds.filter((id) => id !== axId)
    setSelectedIds(newIds)
    // Update URL
    if (newIds.length > 0) {
      router.replace(`/compare?ids=${newIds.join(",")}`)
    } else {
      router.push("/watchlist")
    }
  }

  const handleExport = () => {
    toast({
      title: "Export not available",
      description: "Export functionality coming soon.",
    })
  }

  const copyCompareLink = () => {
    const url = `${window.location.origin}/compare?ids=${selectedIds.join(",")}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "Comparison link copied to clipboard.",
    })
  }

  // Determine if values differ across groups for highlighting
  const getValuesDiffer = (fieldKey: FieldKey): boolean => {
    if (groups.length < 2) return false
    const values = groups.map((g) => {
      const val = g[fieldKey]
      if (Array.isArray(val)) return val.sort().join(",")
      return String(val)
    })
    return new Set(values).size > 1
  }

  const formatValue = (value: unknown, fieldKey: FieldKey) => {
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    if (fieldKey === "population" && typeof value === "number") {
      return value.toLocaleString()
    }
    return String(value)
  }

  const renderFieldValue = (group: (typeof groups)[0], fieldKey: FieldKey) => {
    const value = group[fieldKey]

    if (fieldKey === "engagementStatus") {
      return (
        <Badge variant="outline" className={`${getEngagementColor(String(value))} text-xs`}>
          {String(value)}
        </Badge>
      )
    }

    if (fieldKey === "dataQuality") {
      return (
        <Badge variant="outline" className={`${getQualityColor(String(value))} text-xs`}>
          {String(value)}
        </Badge>
      )
    }

    if (fieldKey === "countries" || fieldKey === "primaryLanguages" || fieldKey === "sources") {
      return (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).map((item) => (
            <Badge key={item} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      )
    }

    if (fieldKey === "alternateNames") {
      return <span className="text-sm text-muted-foreground">{(value as string[]).join(", ")}</span>
    }

    return <span className="text-sm">{formatValue(value, fieldKey)}</span>
  }

  if (groups.length === 0) {
    return (
      <AppLayout>
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-semibold mb-4">No Groups to Compare</h1>
            <p className="text-muted-foreground mb-6">
              Select groups from your watchlist to compare them side by side.
            </p>
            <Button onClick={() => router.push("/watchlist")}>
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Watchlist
            </Button>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="container max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/watchlist")}
                    aria-label="Back to Watchlist"
                  >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to Watchlist</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-semibold">Compare</h1>
                <p className="text-sm text-muted-foreground">
                  Comparing {groups.length} people group{groups.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={copyCompareLink} aria-label="Copy comparison link">
                    <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span className="hidden sm:inline">Copy Link</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy comparison link</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExport} aria-label="Export comparison">
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export comparison</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Highlight Toggle */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg">
            <Switch
              id="highlight-differences"
              checked={highlightDifferences}
              onCheckedChange={setHighlightDifferences}
              aria-describedby="highlight-desc"
            />
            <Label htmlFor="highlight-differences" className="text-sm font-medium cursor-pointer">
              Highlight differences
            </Label>
            <span id="highlight-desc" className="text-xs text-muted-foreground hidden sm:inline">
              Emphasize values that differ between groups
            </span>
          </div>

          {/* Desktop: Columns */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" role="table">
                <thead>
                  <tr>
                    <th className="text-left p-3 bg-muted/50 font-medium text-sm border-b sticky left-0 bg-background z-10 min-w-[160px]">
                      Field
                    </th>
                    {groups.map((group) => (
                      <th
                        key={group.axId}
                        className="text-left p-3 bg-muted/50 font-medium text-sm border-b min-w-[200px]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{group.name}</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => removeGroup(group.axId)}
                                className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label={`Remove ${group.name} from comparison`}
                              >
                                <X className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Remove from comparison</TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field) => {
                    const differs = getValuesDiffer(field.key)
                    return (
                      <tr
                        key={field.key}
                        className={`border-b ${highlightDifferences && differs ? "bg-accent/10" : ""}`}
                      >
                        <td className="p-3 font-medium text-sm text-muted-foreground sticky left-0 bg-background z-10 border-r">
                          {field.label}
                        </td>
                        {groups.map((group) => (
                          <td key={group.axId} className="p-3 align-top">
                            {renderFieldValue(group, field.key)}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: Stacked Cards with horizontal scroll */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
              {groups.map((group) => (
                <Card key={group.axId} className="flex-shrink-0 w-[85vw] max-w-[320px] snap-start">
                  {/* Card Header */}
                  <div className="flex items-start justify-between p-4 border-b">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base truncate">{group.name}</h3>
                      <p className="text-xs text-muted-foreground">{group.axId}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => removeGroup(group.axId)}
                          className="p-1.5 rounded hover:bg-muted transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`Remove ${group.name} from comparison`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Remove from comparison</TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Card Fields */}
                  <div className="p-4 space-y-3">
                    {comparisonFields.slice(2).map((field) => {
                      const differs = getValuesDiffer(field.key)
                      return (
                        <div
                          key={field.key}
                          className={`${highlightDifferences && differs ? "bg-accent/10 -mx-2 px-2 py-1 rounded" : ""}`}
                        >
                          <dt className="text-xs font-medium text-muted-foreground mb-1">{field.label}</dt>
                          <dd>{renderFieldValue(group, field.key)}</dd>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">Swipe to see more groups</p>
          </div>
        </div>
      </TooltipProvider>
    </AppLayout>
  )
}
