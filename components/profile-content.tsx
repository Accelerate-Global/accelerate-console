"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  Copy,
  Check,
  Eye,
  GitCompare,
  Share2,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Globe,
  Users,
  Languages,
  MapPin,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
  FileText,
  X,
  Hash,
  Layers,
  BarChart3,
  Clock,
  Database,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getEngagementColor, getQualityColor } from "@/lib/status-colors"

// Mock data for the people group profile
const peopleGroupData = {
  id: "AX-12847",
  primaryName: "Bengali Muslim",
  alternateNames: [
    { name: "Bangali", source: "Joshua Project", lastSeen: "Dec 2024", confidence: "High" },
    { name: "Bangladeshi Muslim", source: "Ethnologue", lastSeen: "Nov 2024", confidence: "High" },
    { name: "Bengali-speaking Muslim", source: "IMB", lastSeen: "Oct 2024", confidence: "Medium" },
    { name: "Bangla Muslim", source: "Wycliffe", lastSeen: "Sep 2024", confidence: "Medium" },
    { name: "Musalman Bangla", source: "ETNO", lastSeen: "Aug 2024", confidence: "Low" },
  ],
  countries: [
    { name: "Bangladesh", population: 156000000, isPrimary: true },
    { name: "India", population: 85000000, isPrimary: false },
    { name: "Pakistan", population: 3500000, isPrimary: false },
    { name: "Saudi Arabia", population: 1200000, isPrimary: false },
    { name: "UAE", population: 800000, isPrimary: false },
  ],
  engagementStatus: "Unreached",
  engagementDetails: {
    status: "Unreached",
    evangelical: "0.1%",
    christianAdherent: "0.3%",
    primaryReligion: "Islam (Sunni)",
    bibleStatus: "Portions",
    jesusFilm: "Yes",
    audioRecordings: "Yes",
    gospelRadio: "Limited",
    missionaryPresence: "Few",
    derivationNote:
      "Engagement status is derived from evangelical percentage (<2%), Christian adherent percentage (<5%), and access to Scripture resources.",
  },
  dataQuality: "High",
  dataQualityBreakdown: {
    overall: 87,
    agreement: { score: 92, label: "High", description: "Strong agreement across 4 sources" },
    recency: { score: 88, label: "High", description: "All sources updated within 12 months" },
    completeness: { score: 85, label: "High", description: "23/25 fields have data" },
    coverage: { score: 82, label: "Medium", description: "Covered by 4 of 6 major sources" },
  },
  lastUpdated: "Dec 12, 2024",
  sources: [
    { code: "JP", name: "Joshua Project", lastSeen: "Dec 2024" },
    { code: "IMB", name: "IMB", lastSeen: "Nov 2024" },
    { code: "ETNO", name: "Ethnologue", lastSeen: "Oct 2024" },
    { code: "AX", name: "Accelerate", lastSeen: "Dec 2024" },
  ],
  family: "Indo-European > Indo-Iranian > Indo-Aryan",
  affiliation: "Bengali Cluster",
  estimatedPopulation: {
    best: 245000000,
    bySource: [
      { source: "Joshua Project", value: 245000000, year: 2024 },
      { source: "Ethnologue", value: 238000000, year: 2023 },
      { source: "IMB", value: 242000000, year: 2024 },
    ],
  },
  primaryLanguages: [
    { name: "Bengali", iso: "ben", speakers: 245000000, isPrimary: true, source: "Ethnologue" },
    { name: "Sylheti", iso: "syl", speakers: 11000000, isPrimary: false, source: "Ethnologue" },
    { name: "Chittagonian", iso: "ctg", speakers: 13000000, isPrimary: false, source: "Ethnologue" },
  ],
  presenceGranularity: "National",
  identityCodes: {
    axId: "AX-12847",
    jpId: "12847",
    imbId: "IMBPE0103",
    rogId: "100001",
  },
  provenanceTable: [
    { field: "Primary Name", value: "Bengali Muslim", source: "Joshua Project", date: "Dec 2024", confidence: "High" },
    { field: "Population", value: "245,000,000", source: "Joshua Project", date: "Dec 2024", confidence: "High" },
    {
      field: "Engagement Status",
      value: "Unreached",
      source: "Joshua Project",
      date: "Dec 2024",
      confidence: "Medium",
    },
    { field: "Primary Language", value: "Bengali", source: "Ethnologue", date: "Nov 2024", confidence: "High" },
    { field: "Primary Religion", value: "Islam (Sunni)", source: "IMB", date: "Oct 2024", confidence: "High" },
    { field: "Countries", value: "Bangladesh, India, +3", source: "Multiple", date: "Dec 2024", confidence: "High" },
    {
      field: "Family/Affiliation",
      value: "Indo-European > Indo-Aryan",
      source: "Ethnologue",
      date: "2023",
      confidence: "High",
    },
    { field: "Bible Status", value: "Portions", source: "Wycliffe", date: "Sep 2024", confidence: "Medium" },
    {
      field: "Presence Granularity",
      value: "National",
      source: "Joshua Project",
      date: "Dec 2024",
      confidence: "High",
    },
    { field: "Evangelical %", value: "0.1%", source: "Joshua Project", date: "Dec 2024", confidence: "Medium" },
  ],
}

function getConfidenceIcon(confidence: string) {
  switch (confidence.toLowerCase()) {
    case "high":
      return <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
    case "medium":
      return <Info className="h-3.5 w-3.5 text-amber-600" />
    case "low":
      return <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
    default:
      return null
  }
}

function formatPopulation(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B"
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

// Provenance chip shown inline with fields
function ProvenanceChip({ source, date, onClick }: { source: string; date: string; onClick?: () => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
          onClick={onClick}
        >
          {source} · {date}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm text-foreground">{source}</span>
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground">
            <p>Last seen: {date}</p>
            <p className="mt-1">Click to view all source values</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Full provenance panel component
function ProvenancePanel({
  field,
  onClose,
  onNavigate,
}: {
  field: string
  onClose: () => void
  onNavigate: (direction: "prev" | "next") => void
}) {
  const fieldData = peopleGroupData.provenanceTable.find((row) => row.field === field)
  const allFields = peopleGroupData.provenanceTable.map((row) => row.field)
  const currentIndex = allFields.indexOf(field)

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent" />
          <h3 className="font-semibold text-foreground text-sm">Field Provenance</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onNavigate("prev")}
            disabled={currentIndex <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onNavigate("next")}
            disabled={currentIndex >= allFields.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Field</p>
            <p className="font-semibold text-foreground">{field}</p>
          </div>
          {fieldData && (
            <>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Current Value</p>
                <p className="text-foreground font-medium">{fieldData.value}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Primary Source</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {fieldData.source}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{fieldData.date}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Confidence</p>
                <div className="flex items-center gap-2">
                  {getConfidenceIcon(fieldData.confidence)}
                  <span className="text-sm text-foreground">{fieldData.confidence}</span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Values by Source</p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs bg-accent/10 border-accent/30">
                        {fieldData.source}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{fieldData.date}</span>
                    </div>
                    <p className="text-sm text-foreground font-medium">{fieldData.value}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        Ethnologue
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">Nov 2024</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{fieldData.value}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        IMB
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">Oct 2024</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{fieldData.value}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Change History</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div>
                      <p className="text-foreground">Value updated</p>
                      <p className="text-muted-foreground">
                        {fieldData.date} via {fieldData.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Previous value confirmed</p>
                      <p className="text-muted-foreground">Aug 2024 via Ethnologue</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Key fact card component
function KeyFactCard({
  icon: Icon,
  label,
  children,
  source,
  sourceDate,
  provenanceMode,
  fieldName,
  onFieldClick,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
  source?: string
  sourceDate?: string
  provenanceMode?: boolean
  fieldName?: string
  onFieldClick?: (field: string) => void
  className?: string
}) {
  return (
    <Card
      className={`p-4 bg-card border-border/50 transition-all ${
        provenanceMode && fieldName
          ? "cursor-pointer hover:border-accent hover:shadow-sm ring-1 ring-transparent hover:ring-accent/20"
          : ""
      } ${className}`}
      onClick={() => provenanceMode && fieldName && onFieldClick?.(fieldName)}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
            {source && sourceDate && !provenanceMode && <ProvenanceChip source={source} date={sourceDate} />}
          </div>
          <div className="text-foreground">{children}</div>
        </div>
        {provenanceMode && fieldName && <FileText className="h-4 w-4 text-accent shrink-0 mt-1" />}
      </div>
    </Card>
  )
}

// Section component
function ProfileSection({
  id,
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <section id={id} className="scroll-mt-20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full py-3 group">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pb-6 pt-2">{children}</div>
        </CollapsibleContent>
      </Collapsible>
      <Separator />
    </section>
  )
}

export function ProfileContent() {
  const [copied, setCopied] = useState(false)
  const [provenanceMode, setProvenanceMode] = useState(false)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [namesExpanded, setNamesExpanded] = useState(false)
  const [populationViewBySource, setPopulationViewBySource] = useState(false)
  const [provenanceTableExpanded, setProvenanceTableExpanded] = useState(false)

  const copyId = () => {
    navigator.clipboard.writeText(peopleGroupData.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFieldClick = (field: string) => {
    if (provenanceMode) {
      setSelectedField(field)
    }
  }

  const handleNavigateField = (direction: "prev" | "next") => {
    if (!selectedField) return
    const allFields = peopleGroupData.provenanceTable.map((row) => row.field)
    const currentIndex = allFields.indexOf(selectedField)
    if (direction === "prev" && currentIndex > 0) {
      setSelectedField(allFields[currentIndex - 1])
    } else if (direction === "next" && currentIndex < allFields.length - 1) {
      setSelectedField(allFields[currentIndex + 1])
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-full bg-background flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-200 ${provenanceMode && selectedField ? "mr-80" : ""}`}>
          {/* Hero Header */}
          <div className="bg-card border-b border-border/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              {/* Back link */}
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to results
              </Link>

              {/* Name and badges */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance">
                    {peopleGroupData.primaryName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`text-xs ${getEngagementColor(peopleGroupData.engagementStatus)}`}>
                      {peopleGroupData.engagementStatus}
                    </Badge>
                    <Badge className={`text-xs ${getQualityColor(peopleGroupData.dataQuality)}`}>
                      {peopleGroupData.dataQuality} Quality
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Updated {peopleGroupData.lastUpdated}
                    </div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent text-xs">
                    <Eye className="h-3.5 w-3.5" />
                    Watch
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent text-xs">
                    <GitCompare className="h-3.5 w-3.5" />
                    Compare
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent text-xs">
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Country chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {peopleGroupData.countries.map((country) => (
                  <Badge key={country.name} variant={country.isPrimary ? "default" : "secondary"} className="text-xs">
                    {country.name}
                    {country.isPrimary && " (Primary)"}
                  </Badge>
                ))}
              </div>

              {/* Source provenance summary */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Sources:</span>
                {peopleGroupData.sources.slice(0, 3).map((source) => (
                  <Tooltip key={source.code}>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-[10px] font-mono cursor-help">
                        {source.code}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{source.name}</p>
                      <p className="text-xs text-muted-foreground">Last seen: {source.lastSeen}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {peopleGroupData.sources.length > 3 && (
                  <Badge variant="outline" className="text-[10px] font-mono">
                    +{peopleGroupData.sources.length - 3}
                  </Badge>
                )}
                {/* AX ID with copy */}
                <div className="ml-auto">
                  <button
                    onClick={copyId}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors text-xs font-mono"
                  >
                    {peopleGroupData.id}
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Provenance Mode Toggle */}
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={provenanceMode}
                    onCheckedChange={(checked) => {
                      setProvenanceMode(checked)
                      if (!checked) setSelectedField(null)
                    }}
                    id="provenance-mode"
                  />
                  <label htmlFor="provenance-mode" className="text-sm font-medium text-foreground cursor-pointer">
                    Provenance mode
                  </label>
                </div>
                {provenanceMode && (
                  <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent gap-1">
                    <FileText className="h-3 w-3" />
                    Click any field to view sources
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-2">
            {/* Key Facts Grid */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Key Facts</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* AX People Group ID */}
                <KeyFactCard
                  icon={Hash}
                  label="AX People Group ID"
                  source="AX"
                  sourceDate="Dec 2024"
                  provenanceMode={provenanceMode}
                  fieldName="Primary Name"
                  onFieldClick={handleFieldClick}
                >
                  <span className="font-mono text-sm">{peopleGroupData.id}</span>
                </KeyFactCard>

                {/* Primary Name */}
                <KeyFactCard
                  icon={FileText}
                  label="Primary Name"
                  source="JP"
                  sourceDate="Dec 2024"
                  provenanceMode={provenanceMode}
                  fieldName="Primary Name"
                  onFieldClick={handleFieldClick}
                >
                  <span className="font-medium">{peopleGroupData.primaryName}</span>
                </KeyFactCard>

                {/* Engagement Status */}
                <KeyFactCard
                  icon={Users}
                  label="Engagement Status"
                  source="JP"
                  sourceDate="Dec 2024"
                  provenanceMode={provenanceMode}
                  fieldName="Engagement Status"
                  onFieldClick={handleFieldClick}
                >
                  <Badge className={`text-xs ${getEngagementColor(peopleGroupData.engagementStatus)}`}>
                    {peopleGroupData.engagementStatus}
                  </Badge>
                </KeyFactCard>

                {/* Alternate Names - spans full width */}
                <Card
                  className={`p-4 bg-card border-border/50 sm:col-span-2 lg:col-span-3 ${
                    provenanceMode ? "cursor-pointer hover:border-accent" : ""
                  }`}
                  onClick={() => provenanceMode && handleFieldClick("Primary Name")}
                >
                  <Collapsible open={namesExpanded} onOpenChange={setNamesExpanded}>
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                            Alternate / Source Names
                          </p>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {namesExpanded ? "Collapse" : `Show all ${peopleGroupData.alternateNames.length}`}
                              <ChevronDown
                                className={`h-3 w-3 transition-transform ${namesExpanded ? "rotate-180" : ""}`}
                              />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {peopleGroupData.alternateNames.slice(0, namesExpanded ? undefined : 3).map((alt, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-normal">
                              {alt.name}
                            </Badge>
                          ))}
                          {!namesExpanded && peopleGroupData.alternateNames.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{peopleGroupData.alternateNames.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <CollapsibleContent>
                          <div className="mt-3 space-y-1.5">
                            {peopleGroupData.alternateNames.map((alt, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm"
                              >
                                <span className="text-foreground">{alt.name}</span>
                                <div className="flex items-center gap-2">
                                  <ProvenanceChip source={alt.source} date={alt.lastSeen} />
                                  {getConfidenceIcon(alt.confidence)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </div>
                      {provenanceMode && <FileText className="h-4 w-4 text-accent shrink-0 mt-1" />}
                    </div>
                  </Collapsible>
                </Card>

                {/* Countries */}
                <KeyFactCard
                  icon={Globe}
                  label="Countries"
                  source="Multiple"
                  sourceDate="Dec 2024"
                  provenanceMode={provenanceMode}
                  fieldName="Countries"
                  onFieldClick={handleFieldClick}
                >
                  <div className="space-y-1">
                    {peopleGroupData.countries.slice(0, 3).map((country) => (
                      <div key={country.name} className="flex items-center justify-between text-sm">
                        <span className={country.isPrimary ? "font-medium" : ""}>{country.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {formatPopulation(country.population)}
                        </span>
                      </div>
                    ))}
                    {peopleGroupData.countries.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{peopleGroupData.countries.length - 3} more countries
                      </span>
                    )}
                  </div>
                </KeyFactCard>

                {/* Family/Affiliation */}
                <KeyFactCard
                  icon={Users}
                  label="Family / Affiliation"
                  source="ETNO"
                  sourceDate="2023"
                  provenanceMode={provenanceMode}
                  fieldName="Family/Affiliation"
                  onFieldClick={handleFieldClick}
                >
                  <div className="space-y-1">
                    <p className="text-sm">{peopleGroupData.family}</p>
                    <Badge variant="outline" className="text-xs">
                      {peopleGroupData.affiliation}
                    </Badge>
                  </div>
                </KeyFactCard>

                {/* Estimated Population */}
                <KeyFactCard
                  icon={BarChart3}
                  label="Estimated Population"
                  source="JP"
                  sourceDate="Dec 2024"
                  provenanceMode={provenanceMode}
                  fieldName="Population"
                  onFieldClick={handleFieldClick}
                >
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold tabular-nums">
                        {formatPopulation(peopleGroupData.estimatedPopulation.best)}
                      </span>
                      <span className="text-xs text-muted-foreground">best estimate</span>
                    </div>
                    <button
                      className="text-xs text-accent hover:underline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPopulationViewBySource(!populationViewBySource)
                      }}
                    >
                      {populationViewBySource ? "Hide sources" : "View by source"}
                    </button>
                    {populationViewBySource && (
                      <div className="mt-2 space-y-1.5 pt-2 border-t border-border/50">
                        {peopleGroupData.estimatedPopulation.bySource.map((src) => (
                          <div key={src.source} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{src.source}</span>
                            <span className="font-medium tabular-nums">{formatPopulation(src.value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </KeyFactCard>

                {/* Primary Languages */}
                <KeyFactCard
                  icon={Languages}
                  label="Primary Languages"
                  source="ETNO"
                  sourceDate="Nov 2024"
                  provenanceMode={provenanceMode}
                  fieldName="Primary Language"
                  onFieldClick={handleFieldClick}
                >
                  <div className="space-y-1.5">
                    {peopleGroupData.primaryLanguages.map((lang) => (
                      <div key={lang.iso} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className={lang.isPrimary ? "font-medium" : ""}>{lang.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">[{lang.iso}]</span>
                        </div>
                        {lang.isPrimary && (
                          <Badge variant="outline" className="text-[10px]">
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </KeyFactCard>

                {/* Presence Granularity */}
                <KeyFactCard
                  icon={MapPin}
                  label="Presence Granularity"
                  source="JP"
                  sourceDate="Dec 2024"
                  provenanceMode={provenanceMode}
                  fieldName="Presence Granularity"
                  onFieldClick={handleFieldClick}
                >
                  <Badge variant="secondary" className="text-xs">
                    {peopleGroupData.presenceGranularity}
                  </Badge>
                </KeyFactCard>

                {/* Data Confidence */}
                <KeyFactCard
                  icon={Shield}
                  label="Data Quality Indicator"
                  provenanceMode={provenanceMode}
                  fieldName="Data Quality"
                  onFieldClick={handleFieldClick}
                >
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getQualityColor(peopleGroupData.dataQuality)}`}>
                      {peopleGroupData.dataQuality}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {peopleGroupData.dataQualityBreakdown.overall}% confidence
                    </span>
                  </div>
                </KeyFactCard>

                {/* Last Updated */}
                <KeyFactCard
                  icon={Calendar}
                  label="Last Updated"
                  provenanceMode={provenanceMode}
                  fieldName="Last Updated"
                  onFieldClick={handleFieldClick}
                >
                  <span className="text-sm">{peopleGroupData.lastUpdated}</span>
                </KeyFactCard>
              </div>
            </div>

            <Separator />

            {/* Identity & Codes */}
            <ProfileSection id="identity" title="Identity & Codes" icon={Hash}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(peopleGroupData.identityCodes).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                      {key
                        .replace("Id", " ID")
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </p>
                    <p className="font-mono text-sm text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </ProfileSection>

            {/* Geography & Presence */}
            <ProfileSection id="geography" title="Geography & Presence" icon={Globe}>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  {peopleGroupData.countries.map((country) => (
                    <div
                      key={country.name}
                      className={`p-3 rounded-lg border ${
                        country.isPrimary ? "bg-accent/5 border-accent/20" : "bg-muted/30 border-border/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{country.name}</span>
                        {country.isPrimary && (
                          <Badge variant="outline" className="text-[10px] bg-accent/10 border-accent/30">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Population: {formatPopulation(country.population)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Location Granularity</p>
                  <p className="text-sm text-foreground">{peopleGroupData.presenceGranularity}-level data available</p>
                </div>
              </div>
            </ProfileSection>

            {/* Languages & Affiliation */}
            <ProfileSection id="languages" title="Languages & Affiliation" icon={Languages}>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Language Family</p>
                  <p className="text-sm text-foreground">{peopleGroupData.family}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Cluster Affiliation</p>
                  <Badge variant="secondary">{peopleGroupData.affiliation}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Languages Spoken</p>
                  <div className="space-y-2">
                    {peopleGroupData.primaryLanguages.map((lang) => (
                      <div
                        key={lang.iso}
                        className={`p-3 rounded-lg border ${
                          lang.isPrimary ? "bg-accent/5 border-accent/20" : "bg-muted/30 border-border/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{lang.name}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">[{lang.iso}]</span>
                            {lang.isPrimary && (
                              <Badge variant="outline" className="text-[10px]">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground tabular-nums">
                            {formatPopulation(lang.speakers)} speakers
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Population */}
            <ProfileSection id="population" title="Population" icon={BarChart3}>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Best Estimate</p>
                  <p className="text-3xl font-bold text-foreground tabular-nums">
                    {peopleGroupData.estimatedPopulation.best.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Estimates by Source</p>
                  <div className="space-y-2">
                    {peopleGroupData.estimatedPopulation.bySource.map((src) => (
                      <div
                        key={src.source}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {src.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{src.year}</span>
                        </div>
                        <span className="font-medium text-foreground tabular-nums">{src.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Engagement */}
            <ProfileSection id="engagement" title="Engagement" icon={Users}>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                    <Badge className={`text-xs ${getEngagementColor(peopleGroupData.engagementDetails.status)}`}>
                      {peopleGroupData.engagementDetails.status}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Evangelical %</p>
                    <p className="text-lg font-bold text-foreground">{peopleGroupData.engagementDetails.evangelical}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                      Christian Adherent %
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {peopleGroupData.engagementDetails.christianAdherent}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Primary Religion</p>
                    <p className="text-sm font-medium text-foreground">
                      {peopleGroupData.engagementDetails.primaryReligion}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Bible Status</p>
                    <p className="text-sm font-medium text-foreground">
                      {peopleGroupData.engagementDetails.bibleStatus}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Jesus Film</p>
                    <p className="text-sm font-medium text-foreground">{peopleGroupData.engagementDetails.jesusFilm}</p>
                  </div>
                </div>
                {/* How engagement is derived */}
                <Card className="p-4 bg-muted/20 border-border/50">
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">How engagement status is derived</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {peopleGroupData.engagementDetails.derivationNote}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </ProfileSection>

            {/* Data Quality */}
            <ProfileSection id="data-quality" title="Data Quality" icon={Shield}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald-700">
                      {peopleGroupData.dataQualityBreakdown.overall}
                    </span>
                  </div>
                  <div>
                    <Badge className={`text-xs mb-1 ${getQualityColor(peopleGroupData.dataQuality)}`}>
                      {peopleGroupData.dataQuality} Quality
                    </Badge>
                    <p className="text-sm text-muted-foreground">Overall data confidence score</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(peopleGroupData.dataQualityBreakdown)
                    .filter(([key]) => key !== "overall")
                    .map(([key, value]) => {
                      const item = value as { score: number; label: string; description: string }
                      return (
                        <div key={key} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-foreground capitalize">{key}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-foreground">{item.score}</span>
                              <Badge className={`text-[10px] ${getQualityColor(item.label)}`}>{item.label}</Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      )
                    })}
                </div>
              </div>
            </ProfileSection>

            {/* Full Provenance Table */}
            <ProfileSection
              id="provenance"
              title="Full Provenance"
              icon={Database}
              defaultOpen={provenanceTableExpanded}
            >
              <Card className="border-border/50 overflow-hidden">
                {/* Mobile scroll hint */}
                <div className="md:hidden px-3 py-2 bg-muted/30 border-b border-border/30 text-xs text-muted-foreground flex items-center gap-1.5">
                  <ChevronLeft className="h-3 w-3" />
                  <span>Scroll horizontally to see all columns</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold text-xs sticky left-0 bg-muted/30 z-10 min-w-[120px]">
                        Field
                      </TableHead>
                      <TableHead className="font-semibold text-xs min-w-[150px]">Value</TableHead>
                      <TableHead className="font-semibold text-xs min-w-[100px]">Source</TableHead>
                      <TableHead className="font-semibold text-xs min-w-[100px]">Date</TableHead>
                      <TableHead className="font-semibold text-xs min-w-[100px]">Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {peopleGroupData.provenanceTable.map((row) => (
                      <TableRow
                        key={row.field}
                        className={`cursor-pointer hover:bg-muted/30 transition-colors ${
                          provenanceMode && selectedField === row.field ? "bg-accent/10" : ""
                        }`}
                        onClick={() => {
                          setProvenanceMode(true)
                          setSelectedField(row.field)
                        }}
                      >
                        <TableCell className="text-sm font-medium sticky left-0 bg-card z-10">{row.field}</TableCell>
                        <TableCell className="text-sm">{row.value}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {row.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getConfidenceIcon(row.confidence)}
                            <span className="text-xs">{row.confidence}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </ProfileSection>
          </div>
        </main>

        {/* Provenance Panel - Fixed right side */}
        {provenanceMode && selectedField && (
          <aside className="fixed top-0 right-0 w-80 h-screen z-40 shadow-xl">
            <ProvenancePanel
              field={selectedField}
              onClose={() => setSelectedField(null)}
              onNavigate={handleNavigateField}
            />
          </aside>
        )}
      </div>
    </TooltipProvider>
  )
}
