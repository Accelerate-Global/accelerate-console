"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  Bookmark,
  Globe,
  Users,
  Clock,
  Database,
  BookOpen,
  MapPin,
  TrendingUp,
  Copy,
  ExternalLink,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { getEngagementColor, getQualityColor } from "@/lib/status-colors"
import { ENGAGEMENT_STATUS, DATA_QUALITY } from "@/lib/terminology"
import { DATA_SOURCE_NAME } from "@/lib/constants"

// Mock data with canonical labels
const mockResults = [
  {
    id: "1",
    name: "Shaikh (Muslim traditions)",
    axId: "AX-10234",
    countries: ["Bangladesh", "India", "Pakistan"],
    engagementStatus: ENGAGEMENT_STATUS.UNREACHED,
    dataQuality: DATA_QUALITY.HIGH,
    population: 180500000,
    lastUpdated: "2 days ago",
    sources: ["Joshua Project", "IMB"],
  },
  {
    id: "2",
    name: "Yadav (Hindu traditions)",
    axId: "AX-10892",
    countries: ["India", "Nepal"],
    engagementStatus: ENGAGEMENT_STATUS.MINIMALLY_REACHED,
    dataQuality: DATA_QUALITY.HIGH,
    population: 62800000,
    lastUpdated: "5 days ago",
    sources: ["Joshua Project"],
  },
  {
    id: "3",
    name: "Turk",
    axId: "AX-15678",
    countries: ["Turkey", "Germany", "Netherlands"],
    engagementStatus: ENGAGEMENT_STATUS.PARTIALLY_REACHED,
    dataQuality: DATA_QUALITY.MEDIUM,
    population: 58200000,
    lastUpdated: "1 week ago",
    sources: ["Joshua Project", "Operation World"],
  },
  {
    id: "4",
    name: "Bengali (Muslim traditions)",
    axId: "AX-10156",
    countries: ["Bangladesh", "India"],
    engagementStatus: ENGAGEMENT_STATUS.UNREACHED,
    dataQuality: DATA_QUALITY.HIGH,
    population: 145700000,
    lastUpdated: "3 days ago",
    sources: ["IMB", "Joshua Project"],
  },
  {
    id: "5",
    name: "Pashtun (Pathan)",
    axId: "AX-12456",
    countries: ["Afghanistan", "Pakistan"],
    engagementStatus: ENGAGEMENT_STATUS.UNREACHED,
    dataQuality: DATA_QUALITY.MEDIUM,
    population: 49500000,
    lastUpdated: "2 weeks ago",
    sources: ["Joshua Project"],
  },
  {
    id: "6",
    name: "Brahmin (Hill)",
    axId: "AX-11234",
    countries: ["Nepal", "India"],
    engagementStatus: ENGAGEMENT_STATUS.MINIMALLY_REACHED,
    dataQuality: DATA_QUALITY.HIGH,
    population: 32100000,
    lastUpdated: "4 days ago",
    sources: ["Joshua Project", "IMB"],
  },
]

// Facet filters with canonical labels
const facetFilters = [
  {
    id: "countries",
    label: "Countries",
    icon: Globe,
    options: [
      { value: "india", label: "India", count: 2341 },
      { value: "bangladesh", label: "Bangladesh", count: 1876 },
      { value: "pakistan", label: "Pakistan", count: 1543 },
      { value: "nepal", label: "Nepal", count: 892 },
      { value: "afghanistan", label: "Afghanistan", count: 654 },
      { value: "turkey", label: "Turkey", count: 421 },
      { value: "iran", label: "Iran", count: 387 },
      { value: "indonesia", label: "Indonesia", count: 356 },
    ],
  },
  {
    id: "family",
    label: "Family / Affiliation",
    icon: Users,
    options: [
      { value: "indo-aryan", label: "Indo-Aryan", count: 4521 },
      { value: "dravidian", label: "Dravidian", count: 2341 },
      { value: "turkic", label: "Turkic", count: 1876 },
      { value: "sino-tibetan", label: "Sino-Tibetan", count: 1234 },
      { value: "austronesian", label: "Austronesian", count: 987 },
    ],
  },
  {
    id: "engagement",
    label: "Engagement Status",
    icon: TrendingUp,
    options: [
      { value: "unreached", label: ENGAGEMENT_STATUS.UNREACHED, count: 7234 },
      { value: "minimally-reached", label: ENGAGEMENT_STATUS.MINIMALLY_REACHED, count: 4521 },
      { value: "partially-reached", label: ENGAGEMENT_STATUS.PARTIALLY_REACHED, count: 2876 },
      { value: "significantly-reached", label: ENGAGEMENT_STATUS.SIGNIFICANTLY_REACHED, count: 1456 },
      { value: "fully-reached", label: ENGAGEMENT_STATUS.FULLY_REACHED, count: 544 },
      { value: "unknown", label: ENGAGEMENT_STATUS.UNKNOWN, count: 815 },
    ],
  },
  {
    id: "presence",
    label: "Presence Granularity",
    icon: MapPin,
    options: [
      { value: "country", label: "Country Level", count: 12456 },
      { value: "region", label: "Region Level", count: 8234 },
      { value: "city", label: "City Level", count: 3421 },
      { value: "neighborhood", label: "Neighborhood Level", count: 987 },
    ],
  },
  {
    id: "quality",
    label: "Data Quality",
    icon: Database,
    options: [
      { value: "high", label: DATA_QUALITY.HIGH, count: 4521 },
      { value: "medium", label: DATA_QUALITY.MEDIUM, count: 8234 },
      { value: "low", label: DATA_QUALITY.LOW, count: 3456 },
      { value: "needs-review", label: DATA_QUALITY.NEEDS_REVIEW, count: 987 },
    ],
  },
  {
    id: "sources",
    label: "Sources",
    icon: BookOpen,
    options: [
      { value: "joshua-project", label: "Joshua Project", count: 16234 },
      { value: "imb", label: "IMB", count: 12456 },
      { value: "operation-world", label: "Operation World", count: 8765 },
      { value: "internal", label: DATA_SOURCE_NAME, count: 5432 },
    ],
  },
]

const TOTAL_RESULTS = 17446
const PAGE_SIZE = 6

export function SearchResultsContent() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [selectedResult, setSelectedResult] = useState<(typeof mockResults)[0] | null>(null)
  const [facetSearchQueries, setFacetSearchQueries] = useState<Record<string, string>>({})

  const toggleFilter = useCallback((filterId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterId] || []
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [filterId]: updated }
    })
  }, [])

  const clearFilterGroup = useCallback((filterId: string) => {
    setSelectedFilters((prev) => ({ ...prev, [filterId]: [] }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({})
    setFacetSearchQueries({})
  }, [])

  const activeFilterCount = Object.values(selectedFilters).flat().length

  const handleSaveView = () => {
    toast({
      title: "View saved",
      description: "Your current search and filters have been saved.",
    })
  }

  const copyAxId = (axId: string) => {
    navigator.clipboard.writeText(axId)
    toast({
      title: "Copied",
      description: `${axId} copied to clipboard`,
    })
  }

  // Calculate displayed range
  const startIndex = 1
  const endIndex = Math.min(PAGE_SIZE, mockResults.length)

  return (
    <div className="min-h-screen bg-background">
      <TooltipProvider>
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            {/* Desktop Facet Panel */}
            <aside className="hidden lg:block w-72 border-r border-border/50 bg-card/30">
              <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-foreground">Filters</h2>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear all ({activeFilterCount})
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  {facetFilters.map((filter) => (
                    <FacetFilter
                      key={filter.id}
                      filter={filter}
                      selectedValues={selectedFilters[filter.id] || []}
                      onToggle={toggleFilter}
                      onClear={() => clearFilterGroup(filter.id)}
                      searchQuery={facetSearchQueries[filter.id] || ""}
                      onSearchChange={(query) => setFacetSearchQueries((prev) => ({ ...prev, [filter.id]: query }))}
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Sticky Controls Bar */}
              <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-sm border-b border-border/50">
                <div className="px-4 md:px-6 py-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        type="text"
                        placeholder="Refine results..."
                        className="pl-10 h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Refine search results"
                      />
                      {searchQuery && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setSearchQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label="Clear search"
                            >
                              <X className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Clear search</TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      {/* Mobile Filters */}
                      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SheetTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="lg:hidden h-10 w-10 relative bg-transparent"
                                aria-label="Open filters"
                              >
                                <Filter className="h-4 w-4" aria-hidden="true" />
                                {activeFilterCount > 0 && (
                                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                                    {activeFilterCount}
                                  </span>
                                )}
                              </Button>
                            </SheetTrigger>
                          </TooltipTrigger>
                          <TooltipContent>Filters</TooltipContent>
                        </Tooltip>
                        <SheetContent side="left" className="w-80 p-0 flex flex-col" hideCloseButton>
                          <SheetHeader className="p-4 border-b border-border/50">
                            <div className="flex items-center justify-between">
                              <SheetTitle>Filters</SheetTitle>
                              {activeFilterCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">
                                  Clear all
                                </Button>
                              )}
                            </div>
                          </SheetHeader>
                          <ScrollArea className="flex-1 p-4">
                            <div className="space-y-1">
                              {facetFilters.map((filter) => (
                                <FacetFilter
                                  key={filter.id}
                                  filter={filter}
                                  selectedValues={selectedFilters[filter.id] || []}
                                  onToggle={toggleFilter}
                                  onClear={() => clearFilterGroup(filter.id)}
                                  searchQuery={facetSearchQueries[filter.id] || ""}
                                  onSearchChange={(query) =>
                                    setFacetSearchQueries((prev) => ({ ...prev, [filter.id]: query }))
                                  }
                                />
                              ))}
                            </div>
                          </ScrollArea>
                          <div className="p-4 border-t border-border/50 bg-card safe-area-bottom">
                            <Button className="w-full h-12 rounded-xl" onClick={() => setIsMobileFiltersOpen(false)}>
                              Show {mockResults.length} results
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>

                      {/* Sort */}
                      <Select defaultValue="relevance">
                        <SelectTrigger className="w-[140px] h-10">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="population-desc">Population ↓</SelectItem>
                          <SelectItem value="population-asc">Population ↑</SelectItem>
                          <SelectItem value="updated">Recently Updated</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* View Toggle */}
                      <div
                        className="flex items-center border border-border rounded-lg p-0.5 bg-muted/30"
                        role="group"
                        aria-label="View mode"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setViewMode("cards")}
                              className={`h-9 w-9 rounded-md flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                viewMode === "cards"
                                  ? "bg-background shadow-sm text-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              aria-label="Card view"
                              aria-pressed={viewMode === "cards"}
                            >
                              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Card view</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setViewMode("table")}
                              className={`h-9 w-9 rounded-md flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                viewMode === "table"
                                  ? "bg-background shadow-sm text-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              aria-label="Table view"
                              aria-pressed={viewMode === "table"}
                            >
                              <List className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Table view</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Save View */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 bg-transparent"
                            onClick={handleSaveView}
                            aria-label="Save current view"
                          >
                            <Bookmark className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save this view</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Active Filter Chips */}
                  {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3" role="list" aria-label="Active filters">
                      {Object.entries(selectedFilters).map(([filterId, values]) =>
                        values.map((value) => {
                          const filter = facetFilters.find((f) => f.id === filterId)
                          const option = filter?.options.find((o) => o.value === value)
                          return (
                            <Badge
                              key={`${filterId}-${value}`}
                              variant="secondary"
                              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                              onClick={() => toggleFilter(filterId, value)}
                              role="listitem"
                            >
                              {option?.label || value}
                              <X className="h-3 w-3 ml-1" aria-hidden="true" />
                              <span className="sr-only">Remove filter</span>
                            </Badge>
                          )
                        }),
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Results Count - Updated to "Showing 1–N of X" format */}
              <div className="px-4 md:px-6 py-3 border-b border-border/30 bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {startIndex}–{endIndex}
                  </span>{" "}
                  of <span className="font-medium text-foreground">{TOTAL_RESULTS.toLocaleString()}</span> results
                </p>
              </div>

              {/* Results Area */}
              <div className="p-4 md:p-6">
                {viewMode === "cards" ? (
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    role="list"
                    aria-label="Search results"
                  >
                    {mockResults.map((result) => (
                      <ResultCard
                        key={result.id}
                        result={result}
                        onClick={() => setSelectedResult(result)}
                        onCopyId={() => copyAxId(result.axId)}
                      />
                    ))}
                  </div>
                ) : (
                  <ResultsTable results={mockResults} onRowClick={setSelectedResult} onCopyId={copyAxId} />
                )}
              </div>
            </main>
          </div>
        </div>

        {/* Record Preview Drawer */}
        <Sheet open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
          <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col" hideCloseButton>
            {selectedResult && (
              <>
                <SheetHeader className="p-4 md:p-6 border-b border-border/50 shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <SheetTitle className="text-xl font-bold text-foreground truncate">
                        {selectedResult.name}
                      </SheetTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => copyAxId(selectedResult.axId)}
                            className="inline-flex items-center gap-1 mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            aria-label={`Copy ${selectedResult.axId}`}
                          >
                            {selectedResult.axId}
                            <Copy className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Copy AX ID</TooltipContent>
                      </Tooltip>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedResult(null)}
                          className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Close preview"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Close</TooltipContent>
                    </Tooltip>
                  </div>
                </SheetHeader>

                <ScrollArea className="flex-1">
                  <div className="p-4 md:p-6 space-y-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Engagement</div>
                        <Badge variant="outline" className={getEngagementColor(selectedResult.engagementStatus)}>
                          {selectedResult.engagementStatus}
                        </Badge>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Data Quality</div>
                        <Badge variant="outline" className={getQualityColor(selectedResult.dataQuality)}>
                          {selectedResult.dataQuality}
                        </Badge>
                      </div>
                    </div>

                    {/* Countries */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">Countries</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedResult.countries.map((country) => (
                          <Badge key={country} variant="secondary">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Population */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">Population</h3>
                      <p className="text-2xl font-bold text-foreground">{selectedResult.population.toLocaleString()}</p>
                    </div>

                    {/* Sources */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">Sources</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedResult.sources.map((source) => (
                          <Badge key={source} variant="outline" className="bg-muted/50">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      Last updated {selectedResult.lastUpdated}
                    </div>
                  </div>
                </ScrollArea>

                {/* Footer CTA */}
                <div className="p-4 md:p-6 border-t border-border/50 bg-card shrink-0 safe-area-bottom">
                  <Button asChild className="w-full h-12 rounded-xl gap-2">
                    <Link href={`/profile/${selectedResult.id}`}>
                      Open full profile
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </TooltipProvider>
    </div>
  )
}

function FacetFilter({
  filter,
  selectedValues,
  onToggle,
  onClear,
  searchQuery,
  onSearchChange,
}: {
  filter: (typeof facetFilters)[0]
  selectedValues: string[]
  onToggle: (filterId: string, value: string) => void
  onClear: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const Icon = filter.icon

  const INITIAL_SHOW_COUNT = 5

  // Filter options based on search
  const filteredOptions = filter.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Limit displayed options
  const displayedOptions = showAll ? filteredOptions : filteredOptions.slice(0, INITIAL_SHOW_COUNT)
  const hasMore = filteredOptions.length > INITIAL_SHOW_COUNT

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{filter.label}</span>
          {selectedValues.length > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 bg-primary/10 text-primary">
              {selectedValues.length}
            </Badge>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-3">
          {filter.options.length > INITIAL_SHOW_COUNT && (
            <div className="relative mb-2">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="text"
                placeholder={`Search ${filter.label.toLowerCase()}...`}
                className="h-8 pl-8 text-xs"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label={`Search within ${filter.label}`}
              />
            </div>
          )}

          {selectedValues.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-accent hover:text-accent/80 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Clear selection
            </button>
          )}

          <div className="space-y-0.5">
            {displayedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onToggle(filter.id, option.value)}
                className="flex items-center justify-between w-full px-2 py-2 text-sm rounded-md hover:bg-muted/50 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    className="pointer-events-none"
                    aria-hidden="true"
                  />
                  <span className="text-foreground/90">{option.label}</span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{option.count.toLocaleString()}</span>
              </button>
            ))}
          </div>

          {hasMore && !searchQuery && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 mt-2 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {showAll ? <>Show less</> : <>Show {filteredOptions.length - INITIAL_SHOW_COUNT} more</>}
              <ChevronRight
                className={`h-3 w-3 transition-transform ${showAll ? "rotate-90" : ""}`}
                aria-hidden="true"
              />
            </button>
          )}

          {filteredOptions.length === 0 && <p className="text-xs text-muted-foreground px-2 py-2">No matches found</p>}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Result Card Component
function ResultCard({
  result,
  onClick,
  onCopyId,
}: {
  result: (typeof mockResults)[0]
  onClick: () => void
  onCopyId: () => void
}) {
  return (
    <Card
      role="listitem"
      className="p-4 hover:shadow-md transition-all cursor-pointer group focus-within:ring-2 focus-within:ring-ring"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
            {result.name}
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCopyId()
                }}
                className="text-xs text-muted-foreground hover:text-foreground font-mono mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                aria-label={`Copy ${result.axId}`}
              >
                {result.axId}
              </button>
            </TooltipTrigger>
            <TooltipContent>Copy AX ID</TooltipContent>
          </Tooltip>
        </div>
        <Badge variant="outline" className={`shrink-0 ${getEngagementColor(result.engagementStatus)}`}>
          {result.engagementStatus}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {result.countries.slice(0, 3).map((country) => (
          <Badge key={country} variant="secondary" className="text-xs px-1.5 py-0">
            {country}
          </Badge>
        ))}
        {result.countries.length > 3 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            +{result.countries.length - 3}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {result.population.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {result.lastUpdated}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/50">
        {result.sources.map((source) => (
          <Badge key={source} variant="outline" className="text-xs px-1.5 py-0 bg-muted/30">
            {source}
          </Badge>
        ))}
      </div>
    </Card>
  )
}

// Results Table Component
function ResultsTable({
  results,
  onRowClick,
  onCopyId,
}: {
  results: typeof mockResults
  onRowClick: (result: (typeof mockResults)[0]) => void
  onCopyId: (axId: string) => void
}) {
  return (
    <div className="px-4 md:px-6 pb-24 md:pb-6">
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold min-w-[200px] sticky left-0 bg-muted/30">Name</TableHead>
                <TableHead className="font-semibold min-w-[100px]">AX ID</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Countries</TableHead>
                <TableHead className="font-semibold min-w-[140px]">Engagement</TableHead>
                <TableHead className="font-semibold text-right min-w-[120px]">Population</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => onRowClick(result)}
                >
                  <TableCell className="font-medium sticky left-0 bg-card">{result.name}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onCopyId(result.axId)
                          }}
                          className="text-xs font-mono text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          aria-label={`Copy ${result.axId}`}
                        >
                          {result.axId}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Copy AX ID</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {result.countries.slice(0, 2).map((country) => (
                        <Badge key={country} variant="secondary" className="text-xs px-1.5 py-0">
                          {country}
                        </Badge>
                      ))}
                      {result.countries.length > 2 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          +{result.countries.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getEngagementColor(result.engagementStatus)}>
                      {result.engagementStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{result.population.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{result.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
