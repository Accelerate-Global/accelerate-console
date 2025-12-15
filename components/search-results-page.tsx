"use client"

import { useState } from "react"
import {
  Search,
  Globe,
  Users,
  Languages,
  Database,
  Sparkles,
  BookOpen,
  X,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  TableIcon,
  Bookmark,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Mock data for facet filters
const facetFilters = [
  {
    id: "countries",
    label: "Countries",
    icon: Globe,
    options: [
      { value: "india", label: "India", count: 2847 },
      { value: "china", label: "China", count: 1523 },
      { value: "indonesia", label: "Indonesia", count: 892 },
      { value: "pakistan", label: "Pakistan", count: 756 },
      { value: "bangladesh", label: "Bangladesh", count: 412 },
      { value: "nigeria", label: "Nigeria", count: 389 },
    ],
  },
  {
    id: "family",
    label: "Family / Affiliation",
    icon: Users,
    options: [
      { value: "indo-european", label: "Indo-European", count: 4521 },
      { value: "sino-tibetan", label: "Sino-Tibetan", count: 2134 },
      { value: "austronesian", label: "Austronesian", count: 1876 },
      { value: "afro-asiatic", label: "Afro-Asiatic", count: 987 },
      { value: "niger-congo", label: "Niger-Congo", count: 654 },
    ],
  },
  {
    id: "language",
    label: "Primary Language",
    icon: Languages,
    options: [
      { value: "mandarin", label: "Mandarin", count: 1234 },
      { value: "hindi", label: "Hindi", count: 892 },
      { value: "arabic", label: "Arabic", count: 756 },
      { value: "bengali", label: "Bengali", count: 521 },
      { value: "urdu", label: "Urdu", count: 412 },
    ],
  },
  {
    id: "engagement",
    label: "Engagement Status",
    icon: Users,
    options: [
      { value: "unreached", label: "Unreached", count: 7234 },
      { value: "minimally-reached", label: "Minimally Reached", count: 3421 },
      { value: "engaged", label: "Engaged", count: 2156 },
      { value: "established", label: "Established", count: 1892 },
    ],
  },
  {
    id: "presence",
    label: "Presence Granularity",
    icon: MapPin,
    options: [
      { value: "national", label: "National", count: 5234 },
      { value: "regional", label: "Regional", count: 3421 },
      { value: "local", label: "Local", count: 2156 },
    ],
  },
  {
    id: "quality",
    label: "Data Quality",
    icon: Database,
    options: [
      { value: "high", label: "High", count: 4521 },
      { value: "medium", label: "Medium", count: 8234 },
      { value: "low", label: "Low", count: 2891 },
      { value: "unverified", label: "Unverified", count: 1800 },
    ],
  },
  {
    id: "sources",
    label: "Sources",
    icon: BookOpen,
    options: [
      { value: "joshua-project", label: "Joshua Project", count: 12456 },
      { value: "ethnologue", label: "Ethnologue", count: 8234 },
      { value: "wycliffe", label: "Wycliffe", count: 4521 },
      { value: "imb", label: "IMB", count: 3892 },
    ],
  },
]

// Mock data for results
const mockResults = [
  {
    id: "AX-12847",
    name: "Bengali Muslim",
    alias: "Bangali, Bangladeshi",
    countries: ["Bangladesh", "India", "Pakistan"],
    engagementStatus: "Unreached",
    population: 245000000,
    language: "Bengali",
    family: "Indo-European",
    lastUpdated: "Dec 12, 2024",
    sources: ["Joshua Project", "IMB"],
    dataQuality: "High",
    religion: "Islam",
    primaryReligion: "Islam (Sunni)",
  },
  {
    id: "AX-08934",
    name: "Shaikh",
    alias: "Sheikh, Syed",
    countries: ["India", "Pakistan", "Bangladesh"],
    engagementStatus: "Minimally Reached",
    population: 182000000,
    language: "Hindi",
    family: "Indo-European",
    lastUpdated: "Dec 10, 2024",
    sources: ["Joshua Project", "Ethnologue"],
    dataQuality: "High",
    religion: "Islam",
    primaryReligion: "Islam (Sunni)",
  },
  {
    id: "AX-15623",
    name: "Yadav",
    alias: "Ahir, Gwala",
    countries: ["India", "Nepal"],
    engagementStatus: "Engaged",
    population: 58000000,
    language: "Hindi",
    family: "Indo-European",
    lastUpdated: "Dec 8, 2024",
    sources: ["Joshua Project"],
    dataQuality: "Medium",
    religion: "Hinduism",
    primaryReligion: "Hinduism",
  },
  {
    id: "AX-22741",
    name: "Turk",
    alias: "Turkish, Turkiye",
    countries: ["Turkey", "Germany", "Bulgaria"],
    engagementStatus: "Minimally Reached",
    population: 67000000,
    language: "Turkish",
    family: "Turkic",
    lastUpdated: "Dec 5, 2024",
    sources: ["Joshua Project", "IMB"],
    dataQuality: "High",
    religion: "Islam",
    primaryReligion: "Islam (Sunni)",
  },
  {
    id: "AX-31892",
    name: "Japanese",
    alias: "Nihonjin, Nippon",
    countries: ["Japan", "Brazil", "United States"],
    engagementStatus: "Unreached",
    population: 121000000,
    language: "Japanese",
    family: "Japonic",
    lastUpdated: "Dec 3, 2024",
    sources: ["Joshua Project", "Ethnologue", "Wycliffe"],
    dataQuality: "High",
    religion: "Buddhism/Shinto",
    primaryReligion: "Buddhism / Shintoism",
  },
  {
    id: "AX-45123",
    name: "Han Chinese, Mandarin",
    alias: "Putonghua, Northern Chinese",
    countries: ["China", "Taiwan", "Singapore"],
    engagementStatus: "Minimally Reached",
    population: 920000000,
    language: "Mandarin Chinese",
    family: "Sino-Tibetan",
    lastUpdated: "Dec 1, 2024",
    sources: ["Joshua Project", "Ethnologue"],
    dataQuality: "High",
    religion: "Non-religious",
    primaryReligion: "Non-religious / Atheism",
  },
]

const activeFilterChips = [
  { label: "Unreached", type: "engagement" },
  { label: "Asia", type: "region" },
]

function formatPopulation(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B"
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
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

function FacetFilter({
  filter,
  selectedValues,
  onToggle,
}: {
  filter: (typeof facetFilters)[0]
  selectedValues: string[]
  onToggle: (filterId: string, value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const Icon = filter.icon

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors min-h-[44px]">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{filter.label}</span>
          {selectedValues.length > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 bg-primary/10 text-primary">
              {selectedValues.length}
            </Badge>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "" : "-rotate-90"}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-1 pb-3">
          {filter.options.map((option) => (
            <button
              key={option.value}
              onClick={() => onToggle(filter.id, option.value)}
              className="flex items-center justify-between w-full px-2 py-2 text-sm rounded-md hover:bg-muted/50 transition-colors min-h-[40px]"
            >
              <div className="flex items-center gap-2">
                <Checkbox checked={selectedValues.includes(option.value)} className="pointer-events-none" />
                <span className="text-foreground/90">{option.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{option.count.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ResultCard({
  result,
  onClick,
}: {
  result: (typeof mockResults)[0]
  onClick: () => void
}) {
  return (
    <Card
      className="p-4 hover:shadow-md hover:border-border transition-all cursor-pointer bg-card border-border/50"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base truncate">{result.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{result.alias}</p>
          </div>
          <Badge variant="outline" className="text-xs font-mono shrink-0">
            {result.id}
          </Badge>
        </div>

        {/* Country chips */}
        <div className="flex flex-wrap gap-1.5">
          {result.countries.slice(0, 3).map((country) => (
            <Badge key={country} variant="secondary" className="text-xs bg-secondary/80">
              {country}
            </Badge>
          ))}
          {result.countries.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-secondary/80">
              +{result.countries.length - 3}
            </Badge>
          )}
        </div>

        {/* Engagement badge and population */}
        <div className="flex items-center justify-between">
          <Badge className={`text-xs font-medium ${getEngagementColor(result.engagementStatus)}`}>
            {result.engagementStatus}
          </Badge>
          <span className="text-sm font-medium text-foreground">{formatPopulation(result.population)} pop.</span>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{result.lastUpdated}</span>
          </div>
          <div className="flex gap-1">
            {result.sources.slice(0, 2).map((source) => (
              <Badge key={source} variant="outline" className="text-[10px] px-1.5 py-0.5">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function RecordDrawer({
  record,
  isOpen,
  onClose,
}: {
  record: (typeof mockResults)[0] | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!record) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl font-bold">{record.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">{record.alias}</p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {record.id}
            </Badge>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Engagement Status */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Engagement Status
            </h4>
            <Badge className={`${getEngagementColor(record.engagementStatus)}`}>{record.engagementStatus}</Badge>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Population</p>
              <p className="text-lg font-semibold text-foreground">{formatPopulation(record.population)}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Data Quality</p>
              <p className="text-lg font-semibold text-foreground">{record.dataQuality}</p>
            </div>
          </div>

          {/* Countries */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Countries</h4>
            <div className="flex flex-wrap gap-2">
              {record.countries.map((country) => (
                <Badge key={country} variant="secondary">
                  {country}
                </Badge>
              ))}
            </div>
          </div>

          {/* Language & Family */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Primary Language
              </h4>
              <p className="text-sm text-foreground">{record.language}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Language Family
              </h4>
              <p className="text-sm text-foreground">{record.family}</p>
            </div>
          </div>

          {/* Religion */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Primary Religion
            </h4>
            <p className="text-sm text-foreground">{record.primaryReligion}</p>
          </div>

          {/* Sources */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Data Sources</h4>
            <div className="flex flex-wrap gap-2">
              {record.sources.map((source) => (
                <Badge key={source} variant="outline">
                  {source}
                </Badge>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {record.lastUpdated}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-border">
          <Button className="w-full h-12 text-base" size="lg">
            Open Full Profile
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function SearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState("Unreached peoples")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [selectedRecord, setSelectedRecord] = useState<(typeof mockResults)[0] | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const toggleFilter = (filterId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterId] || []
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [filterId]: updated }
    })
  }

  const openRecordDrawer = (record: (typeof mockResults)[0]) => {
    setSelectedRecord(record)
    setIsDrawerOpen(true)
  }

  const totalSelectedFilters = Object.values(selectedFilters).flat().length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground hidden sm:inline">PeopleGroups</span>
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="/" className="text-sm font-medium text-foreground">
              Explore
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Reports
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex">
        {/* Left Sidebar - Facet Filters (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-border/50 bg-card/30">
          <ScrollArea className="h-[calc(100vh-57px)]">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Filters</h2>
                {totalSelectedFilters > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground h-8"
                    onClick={() => setSelectedFilters({})}
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <div className="space-y-1 divide-y divide-border/50">
                {facetFilters.map((filter) => (
                  <FacetFilter
                    key={filter.id}
                    filter={filter}
                    selectedValues={selectedFilters[filter.id] || []}
                    onToggle={toggleFilter}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search & Controls Bar */}
          <div className="sticky top-[57px] z-40 bg-background border-b border-border/50 p-4">
            <div className="flex flex-col gap-3">
              {/* Search Row */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name, alias, country, language, or AX ID"
                    className="pl-10 h-11 bg-card"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {/* Mobile Filters Button */}
                <Button
                  variant="outline"
                  className="lg:hidden h-11 px-3 bg-transparent"
                  onClick={() => setIsMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {totalSelectedFilters > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {totalSelectedFilters}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Active Filters & Controls Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Active filter chips */}
                {activeFilterChips.map((chip) => (
                  <Badge
                    key={chip.label}
                    variant="secondary"
                    className="px-3 py-1.5 gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}

                <div className="flex-1" />

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent">
                        <span className="hidden sm:inline">Sort:</span>
                        <span className="capitalize">{sortBy}</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {["relevance", "population", "name", "updated"].map((option) => (
                        <DropdownMenuItem key={option} onClick={() => setSortBy(option)} className="capitalize">
                          {sortBy === option && <Check className="h-4 w-4 mr-2" />}
                          {option}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* View Toggle */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`h-9 w-9 flex items-center justify-center transition-colors ${
                        viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`h-9 w-9 flex items-center justify-center transition-colors ${
                        viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                      }`}
                    >
                      <TableIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Save View Button */}
                  <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent">
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Save view</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{mockResults.length.toLocaleString()}</span> of{" "}
              <span className="font-medium text-foreground">7,234</span> results
            </p>
          </div>

          {/* Results Grid */}
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {mockResults.map((result) => (
                <ResultCard key={result.id} result={result} onClick={() => openRecordDrawer(result)} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Record Drawer */}
      <RecordDrawer record={selectedRecord} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Mobile Filters Sheet */}
      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <SheetContent side="left" className="w-full sm:max-w-sm p-0">
          <SheetHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle>Filters</SheetTitle>
              {totalSelectedFilters > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedFilters({})}>
                  Clear all
                </Button>
              )}
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 space-y-1 divide-y divide-border/50">
              {facetFilters.map((filter) => (
                <FacetFilter
                  key={filter.id}
                  filter={filter}
                  selectedValues={selectedFilters[filter.id] || []}
                  onToggle={toggleFilter}
                />
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
