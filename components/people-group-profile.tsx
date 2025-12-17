"use client"

import type React from "react"

import { useState } from "react"
import {
  Sparkles,
  Copy,
  Check,
  Eye,
  GitCompare,
  Share2,
  Download,
  ChevronDown,
  ChevronLeft,
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for the people group profile
const peopleGroupData = {
  id: "AX-12847",
  primaryName: "Bengali Muslim",
  alternateNames: [
    { name: "Bangali", source: "Joshua Project", confidence: "High" },
    { name: "Bangladeshi Muslim", source: "Ethnologue", confidence: "High" },
    { name: "Bengali-speaking Muslim", source: "IMB", confidence: "Medium" },
    { name: "Bangla Muslim", source: "Wycliffe", confidence: "Medium" },
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
  },
  dataQuality: "High",
  dataQualityBreakdown: {
    overall: "High",
    populationAccuracy: "High",
    locationAccuracy: "High",
    languageAccuracy: "High",
    religionAccuracy: "Medium",
    engagementAccuracy: "Medium",
    lastVerified: "Oct 2024",
  },
  lastUpdated: "Dec 12, 2024",
  sources: ["Joshua Project", "IMB", "Ethnologue"],
  family: "Indo-European > Indo-Iranian > Indo-Aryan",
  affiliation: "Bengali Cluster",
  estimatedPopulation: [
    { source: "Joshua Project", value: 245000000, year: 2024 },
    { source: "Ethnologue", value: 238000000, year: 2023 },
    { source: "IMB", value: 242000000, year: 2024 },
  ],
  primaryLanguages: [
    { name: "Bengali", iso: "ben", speakers: 245000000, isPrimary: true },
    { name: "Sylheti", iso: "syl", speakers: 11000000, isPrimary: false },
    { name: "Chittagonian", iso: "ctg", speakers: 13000000, isPrimary: false },
  ],
  presenceGranularity: "National",
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
  ],
}

function getEngagementColor(status: string): string {
  switch (status.toLowerCase()) {
    case "unreached":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "minimally reached":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "engaged":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "established":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

function getQualityColor(quality: string): string {
  switch (quality.toLowerCase()) {
    case "high":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    case "medium":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "low":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

function getConfidenceIcon(confidence: string) {
  switch (confidence.toLowerCase()) {
    case "high":
      return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    case "medium":
      return <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
    case "low":
      return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
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

function ProvenancePanel({ field, onClose }: { field: string; onClose: () => void }) {
  const fieldData = peopleGroupData.provenanceTable.find((row) => row.field === field)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Field Provenance</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Field</p>
          <p className="font-medium text-foreground">{field}</p>
        </div>
        {fieldData && (
          <>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Value</p>
              <p className="text-foreground">{fieldData.value}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Source</p>
              <Badge variant="outline">{fieldData.source}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Last Updated</p>
              <p className="text-foreground">{fieldData.date}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Confidence</p>
              <div className="flex items-center gap-2">
                {getConfidenceIcon(fieldData.confidence)}
                <span className="text-foreground">{fieldData.confidence}</span>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">History</p>
              <div className="space-y-2">
                <div className="p-2 rounded bg-secondary/50 text-sm">
                  <p className="text-foreground">{fieldData.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fieldData.source} - {fieldData.date}
                  </p>
                </div>
                <div className="p-2 rounded bg-secondary/30 text-sm">
                  <p className="text-muted-foreground">Previous value</p>
                  <p className="text-xs text-muted-foreground mt-1">Ethnologue - Aug 2024</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function KeyFactCard({
  icon: Icon,
  label,
  children,
  onFieldClick,
  provenanceMode,
  fieldName,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
  onFieldClick?: (field: string) => void
  provenanceMode?: boolean
  fieldName?: string
}) {
  return (
    <Card
      className={`p-4 bg-card border-border/50 transition-all ${
        provenanceMode && fieldName ? "cursor-pointer hover:border-accent hover:shadow-sm" : ""
      }`}
      onClick={() => provenanceMode && fieldName && onFieldClick?.(fieldName)}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">{label}</p>
          <div className="text-foreground">{children}</div>
        </div>
        {provenanceMode && fieldName && <FileText className="h-4 w-4 text-accent shrink-0" />}
      </div>
    </Card>
  )
}

export function PeopleGroupProfile() {
  const [copied, setCopied] = useState(false)
  const [provenanceMode, setProvenanceMode] = useState(false)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [namesExpanded, setNamesExpanded] = useState(false)

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/search"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Back to results</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground hidden sm:inline">Accelerate Global</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all ${provenanceMode && selectedField ? "mr-80" : ""}`}>
          {/* Hero Header */}
          <div className="bg-card border-b border-border/50">
            <div className="max-w-[1000px] mx-auto px-4 py-8">
              {/* Top row: Name and Actions */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
                    {peopleGroupData.primaryName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* AX ID with copy */}
                    <button
                      onClick={copyId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary hover:bg-muted transition-colors text-sm font-mono min-h-[36px]"
                    >
                      {peopleGroupData.id}
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                    {/* Engagement badge */}
                    <Badge className={`text-sm ${getEngagementColor(peopleGroupData.engagementStatus)}`}>
                      {peopleGroupData.engagementStatus}
                    </Badge>
                    {/* Data quality badge */}
                    <Badge className={`text-sm ${getQualityColor(peopleGroupData.dataQuality)}`}>
                      {peopleGroupData.dataQuality} Quality
                    </Badge>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="h-10 gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    Watch
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 gap-2 bg-transparent">
                    <GitCompare className="h-4 w-4" />
                    Compare
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Country chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {peopleGroupData.countries.map((country) => (
                  <Badge key={country.name} variant={country.isPrimary ? "default" : "secondary"} className="text-sm">
                    {country.name}
                    {country.isPrimary && " (Primary)"}
                  </Badge>
                ))}
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {peopleGroupData.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Sources:</span>
                  {peopleGroupData.sources.map((source) => (
                    <Badge key={source} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Provenance Mode Toggle */}
          <div className="max-w-[1000px] mx-auto px-4 py-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={provenanceMode} onCheckedChange={setProvenanceMode} id="provenance-mode" />
                <label htmlFor="provenance-mode" className="text-sm font-medium text-foreground cursor-pointer">
                  Provenance Mode
                </label>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Click any field to view source details
                </span>
              </div>
              {provenanceMode && (
                <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
                  <FileText className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="max-w-[1000px] mx-auto px-4 py-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Key Facts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Alternate Names */}
              <Card
                className={`p-4 bg-card border-border/50 sm:col-span-2 lg:col-span-3 ${
                  provenanceMode ? "cursor-pointer hover:border-accent" : ""
                }`}
              >
                <Collapsible open={namesExpanded} onOpenChange={setNamesExpanded}>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                          Alternate / Source Names
                        </p>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                            {namesExpanded ? "Collapse" : "Expand"}
                            <ChevronDown
                              className={`h-3 w-3 transition-transform ${namesExpanded ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {peopleGroupData.alternateNames.slice(0, namesExpanded ? undefined : 2).map((alt, i) => (
                          <Badge key={i} variant="secondary" className="text-sm">
                            {alt.name}
                          </Badge>
                        ))}
                        {!namesExpanded && peopleGroupData.alternateNames.length > 2 && (
                          <Badge variant="outline" className="text-sm">
                            +{peopleGroupData.alternateNames.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <CollapsibleContent>
                        <div className="mt-4 space-y-2">
                          {peopleGroupData.alternateNames.map((alt, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded bg-secondary/30 text-sm"
                            >
                              <span className="text-foreground">{alt.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {alt.source}
                                </Badge>
                                {getConfidenceIcon(alt.confidence)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </div>
                </Collapsible>
              </Card>

              {/* Countries */}
              <KeyFactCard
                icon={Globe}
                label="Countries"
                provenanceMode={provenanceMode}
                fieldName="Countries"
                onFieldClick={handleFieldClick}
              >
                <div className="space-y-1">
                  {peopleGroupData.countries.slice(0, 3).map((country) => (
                    <div key={country.name} className="flex items-center justify-between text-sm">
                      <span>{country.name}</span>
                      <span className="text-muted-foreground">{formatPopulation(country.population)}</span>
                    </div>
                  ))}
                  {peopleGroupData.countries.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{peopleGroupData.countries.length - 3} more countries
                    </p>
                  )}
                </div>
              </KeyFactCard>

              {/* Family/Affiliation */}
              <KeyFactCard
                icon={Users}
                label="Family / Affiliation"
                provenanceMode={provenanceMode}
                fieldName="Family/Affiliation"
                onFieldClick={handleFieldClick}
              >
                <div className="space-y-1 text-sm">
                  <p>{peopleGroupData.family}</p>
                  <p className="text-muted-foreground">{peopleGroupData.affiliation}</p>
                </div>
              </KeyFactCard>

              {/* Estimated Population */}
              <KeyFactCard
                icon={Users}
                label="Estimated Population"
                provenanceMode={provenanceMode}
                fieldName="Population"
                onFieldClick={handleFieldClick}
              >
                <div className="space-y-1">
                  {peopleGroupData.estimatedPopulation.map((pop, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{pop.source}</span>
                      <span className="font-medium">{formatPopulation(pop.value)}</span>
                    </div>
                  ))}
                </div>
              </KeyFactCard>

              {/* Primary Languages */}
              <KeyFactCard
                icon={Languages}
                label="Primary Languages"
                provenanceMode={provenanceMode}
                fieldName="Primary Language"
                onFieldClick={handleFieldClick}
              >
                <div className="space-y-1">
                  {peopleGroupData.primaryLanguages.map((lang, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{lang.name}</span>
                        {lang.isPrimary && (
                          <Badge variant="secondary" className="text-[10px] px-1">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground font-mono text-xs">{lang.iso}</span>
                    </div>
                  ))}
                </div>
              </KeyFactCard>

              {/* Presence Granularity */}
              <KeyFactCard
                icon={MapPin}
                label="Presence Granularity"
                provenanceMode={provenanceMode}
                fieldName="Presence Granularity"
                onFieldClick={handleFieldClick}
              >
                <Badge variant="secondary" className="text-sm">
                  {peopleGroupData.presenceGranularity}
                </Badge>
              </KeyFactCard>
            </div>
          </div>

          <Separator className="max-w-[1000px] mx-auto" />

          {/* Engagement Details Section */}
          <div className="max-w-[1000px] mx-auto px-4 py-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Engagement Details</h2>
            <Card className="p-6 bg-card border-border/50">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                  <Badge className={`${getEngagementColor(peopleGroupData.engagementDetails.status)}`}>
                    {peopleGroupData.engagementDetails.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Evangelical</p>
                  <p className="text-lg font-semibold text-foreground">
                    {peopleGroupData.engagementDetails.evangelical}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Christian Adherent</p>
                  <p className="text-lg font-semibold text-foreground">
                    {peopleGroupData.engagementDetails.christianAdherent}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Primary Religion</p>
                  <p className="text-foreground">{peopleGroupData.engagementDetails.primaryReligion}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Bible Status</p>
                  <p className="text-foreground">{peopleGroupData.engagementDetails.bibleStatus}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Jesus Film</p>
                  <p className="text-foreground">{peopleGroupData.engagementDetails.jesusFilm}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Audio Recordings</p>
                  <p className="text-foreground">{peopleGroupData.engagementDetails.audioRecordings}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Gospel Radio</p>
                  <p className="text-foreground">{peopleGroupData.engagementDetails.gospelRadio}</p>
                </div>
              </div>
            </Card>
          </div>

          <Separator className="max-w-[1000px] mx-auto" />

          {/* Data Quality Breakdown Section */}
          <div className="max-w-[1000px] mx-auto px-4 py-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Data Quality Breakdown</h2>
            <Card className="p-6 bg-card border-border/50">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Overall", value: peopleGroupData.dataQualityBreakdown.overall },
                  { label: "Population Accuracy", value: peopleGroupData.dataQualityBreakdown.populationAccuracy },
                  { label: "Location Accuracy", value: peopleGroupData.dataQualityBreakdown.locationAccuracy },
                  { label: "Language Accuracy", value: peopleGroupData.dataQualityBreakdown.languageAccuracy },
                  { label: "Religion Accuracy", value: peopleGroupData.dataQualityBreakdown.religionAccuracy },
                  { label: "Engagement Accuracy", value: peopleGroupData.dataQualityBreakdown.engagementAccuracy },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {getConfidenceIcon(item.value)}
                      <Badge className={`${getQualityColor(item.value)}`}>{item.value}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Last verified: {peopleGroupData.dataQualityBreakdown.lastVerified}</span>
              </div>
            </Card>
          </div>

          <Separator className="max-w-[1000px] mx-auto" />

          {/* Full Provenance Table Section */}
          <div className="max-w-[1000px] mx-auto px-4 py-8 pb-16">
            <h2 className="text-lg font-semibold text-foreground mb-4">Full Provenance</h2>
            <Card className="bg-card border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Field</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Source</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold text-center">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {peopleGroupData.provenanceTable.map((row, i) => (
                    <TableRow
                      key={i}
                      className={`${provenanceMode ? "cursor-pointer hover:bg-accent/5" : ""}`}
                      onClick={() => handleFieldClick(row.field)}
                    >
                      <TableCell className="font-medium">{row.field}</TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {row.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.date}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {getConfidenceIcon(row.confidence)}
                          <span className="text-sm">{row.confidence}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>

        {/* Provenance Side Panel */}
        {provenanceMode && selectedField && (
          <aside className="fixed right-0 top-[57px] w-80 h-[calc(100vh-57px)] bg-card border-l border-border z-40">
            <ProvenancePanel field={selectedField} onClose={() => setSelectedField(null)} />
          </aside>
        )}
      </div>
    </div>
  )
}
