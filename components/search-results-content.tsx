"use client"

import type React from "react"
import { X, Copy, ExternalLink } from "lucide-react"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Globe,
  Users,
  Languages,
  Database,
  BookOpen,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Bookmark,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ResponsiveTableContainer,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

// Facet filter data
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
      { value: "brazil", label: "Brazil", count: 287 },
      { value: "usa", label: "United States", count: 245 },
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
      { value: "dravidian", label: "Dravidian", count: 432 },
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
      { value: "portuguese", label: "Portuguese", count: 312 },
    ],
  },
  {
    id: "engagement",
    label: "Engagement Status",
    icon: TrendingUp,
    options: [
      { value: "unreached", label: "Unreached", count: 7234 },
      { value: "minimally-reached", label: "Minimally Reached", count: 4521 },
      { value: "engaged", label: "Engaged", count: 2876 },
      { value: "unknown", label: "Unknown", count: 1815 },
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
      { value: "high", label: "High", count: 4521 },
      { value: "medium", label: "Medium", count: 8234 },
      { value: "low", label: "Low", count: 3456 },
      { value: "needs-review", label: "Needs Review", count: 987 },
    ],
  },
  {
    id: "sources",
    label: "Sources",
    icon: BookOpen,
    options: [
      { value: "joshua-project", label: "Joshua Project", count: 12456 },
      { value: "imb", label: "IMB", count: 9876 },
      { value: "ethnologue", label: "Ethnologue", count: 7654 },
      { value: "cppi", label: "CPPI", count: 5432 },
      { value: "peoplegroups-org", label: "PeopleGroups.org", count: 4321 },
    ],
  },
]

// Mock results data
const mockResults = [
  {
    id: "AX-12847",
    name: "Shaikh (Muslim traditions)",
    alias: "Sheikh, Sayyid, Syed",
    countries: ["India", "Pakistan", "Bangladesh", "Nepal"],
    engagementStatus: "Unreached",
    population: 214500000,
    lastUpdated: "Dec 12, 2025",
    sources: ["JP", "IMB", "ETH"],
    dataQuality: "High",
    language: "Urdu",
    family: "Indo-European",
  },
  {
    id: "AX-09234",
    name: "Han Chinese (Mandarin)",
    alias: "Putonghua, Northern Chinese",
    countries: ["China", "Taiwan", "Singapore"],
    engagementStatus: "Minimally Reached",
    population: 920000000,
    lastUpdated: "Dec 10, 2025",
    sources: ["JP", "ETH"],
    dataQuality: "High",
    language: "Mandarin",
    family: "Sino-Tibetan",
  },
  {
    id: "AX-05621",
    name: "Turk",
    alias: "Turkish, Anatolian Turk",
    countries: ["Turkey", "Germany", "Bulgaria"],
    engagementStatus: "Engaged",
    population: 67800000,
    lastUpdated: "Dec 8, 2025",
    sources: ["JP", "IMB"],
    dataQuality: "Medium",
    language: "Turkish",
    family: "Turkic",
  },
  {
    id: "AX-03892",
    name: "Bengali (Muslim traditions)",
    alias: "Bangla, Bangladeshi",
    countries: ["Bangladesh", "India"],
    engagementStatus: "Unreached",
    population: 156000000,
    lastUpdated: "Dec 5, 2025",
    sources: ["JP", "CPPI"],
    dataQuality: "High",
    language: "Bengali",
    family: "Indo-European",
  },
  {
    id: "AX-07456",
    name: "Japanese",
    alias: "Nipponjin, Nihonjin",
    countries: ["Japan", "Brazil", "USA"],
    engagementStatus: "Minimally Reached",
    population: 121000000,
    lastUpdated: "Dec 3, 2025",
    sources: ["JP", "ETH", "IMB"],
    dataQuality: "High",
    language: "Japanese",
    family: "Japonic",
  },
  {
    id: "AX-11234",
    name: "Punjabi (Sikh traditions)",
    alias: "Panjabi, Sikh",
    countries: ["India", "Pakistan", "Canada", "UK"],
    engagementStatus: "Minimally Reached",
    population: 36200000,
    lastUpdated: "Nov 28, 2025",
    sources: ["JP", "IMB"],
    dataQuality: "Medium",
    language: "Punjabi",
    family: "Indo-European",
  },
]

const savedFolders = [
  { id: "research", label: "Research", color: "bg-blue-500" },
  { id: "priority", label: "Priority Lists", color: "bg-amber-500" },
  { id: "regional", label: "Regional Focus", color: "bg-emerald-500" },
]

const getEngagementColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "unreached":
      return "bg-rose-100 text-rose-700 border-rose-200"
    case "minimally reached":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "engaged":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

const formatPopulation = (num: number) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B"
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(0) + "K"
  return num.toString()
}

interface SearchResultsContentProps {
  initialQuery?: string
  onBack?: () => void
}

export function SearchResultsContent({ initialQuery = "", onBack }: SearchResultsContentProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<(typeof mockResults)[0] | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSaveViewOpen, setIsSaveViewOpen] = useState(false)
  const [saveViewName, setSaveViewName] = useState("")
  const [saveViewFolder, setSaveViewFolder] = useState("")
  const [saveViewTags, setSaveViewTags] = useState("")

  const { toast } = useToast()

  const toggleFilter = (filterId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterId] || []
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [filterId]: updated }
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
  }

  const totalSelectedFilters = Object.values(selectedFilters).flat().length

  const activeFilterChips = Object.entries(selectedFilters).flatMap(([filterId, values]) =>
    values.map((value) => {
      const filter = facetFilters.find((f) => f.id === filterId)
      const option = filter?.options.find((o) => o.value === value)
      return {
        filterId,
        value,
        label: option?.label || value,
      }
    }),
  )

  const removeFilterChip = (filterId: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: (prev[filterId] || []).filter((v) => v !== value),
    }))
  }

  const openRecordDrawer = (record: (typeof mockResults)[0]) => {
    setSelectedRecord(record)
    setIsDrawerOpen(true)
  }

  const handleSaveView = () => {
    toast({
      title: "View saved",
      description: `"${saveViewName || "Untitled view"}" has been saved`,
    })
    setIsSaveViewOpen(false)
    setSaveViewName("")
    setSaveViewFolder("")
    setSaveViewTags("")
  }

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    toast({
      title: "Copied",
      description: `${id} copied to clipboard`,
    })
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <div className="flex flex-1 min-h-0">
          {/* Left Sidebar - Facet Filters (Desktop) */}
          <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-border/50 bg-card/30">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Filters</h2>
              {totalSelectedFilters > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-7 px-2"
                  onClick={clearAllFilters}
                >
                  Clear all
                </Button>
              )}
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-1">
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
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Search & Controls Bar */}
            <div className="sticky top-0 z-40 bg-background border-b border-border/50 p-4">
              <div className="flex flex-col gap-3">
                {/* Search Row */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by name, alias, country, language, or AX ID"
                      className="pl-10 pr-10 h-11 bg-card border-border/60"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Clear search"
                          >
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Clear search</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {/* Mobile Filters Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="lg:hidden h-11 px-3 bg-card"
                        onClick={() => setIsMobileFiltersOpen(true)}
                        aria-label="Open filters"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        {totalSelectedFilters > 0 && (
                          <Badge className="ml-1.5 h-5 min-w-[20px] px-1 flex items-center justify-center text-xs">
                            {totalSelectedFilters}
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filters</TooltipContent>
                  </Tooltip>
                </div>

                {/* Active Filters & Controls Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Active filter chips */}
                  {activeFilterChips.map((chip) => (
                    <Badge
                      key={`${chip.filterId}-${chip.value}`}
                      variant="secondary"
                      className="px-2.5 py-1 gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                      onClick={() => removeFilterChip(chip.filterId, chip.value)}
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
                        <Button variant="outline" size="sm" className="h-9 gap-2 bg-card">
                          <span className="hidden sm:inline text-muted-foreground">Sort:</span>
                          <span className="capitalize">{sortBy}</span>
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {["relevance", "population", "data quality", "last updated"].map((option) => (
                          <DropdownMenuItem key={option} onClick={() => setSortBy(option)} className="capitalize">
                            {sortBy === option && <Check className="h-4 w-4 mr-2" />}
                            {option}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* View Toggle */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setViewMode("cards")}
                            className={`h-9 w-9 flex items-center justify-center transition-colors ${
                              viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                            }`}
                            aria-label="Card view"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Card view</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setViewMode("table")}
                            className={`h-9 w-9 flex items-center justify-center transition-colors ${
                              viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                            }`}
                            aria-label="Table view"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Table view</TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Save View Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-2 bg-card"
                          onClick={() => setIsSaveViewOpen(true)}
                          aria-label="Save current view"
                        >
                          <Bookmark className="h-4 w-4" />
                          <span className="hidden sm:inline">Save view</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save current search as a view</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="px-4 py-3 border-b border-border/30 bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{mockResults.length.toLocaleString()}</span> of{" "}
                <span className="font-medium text-foreground">17,446</span> results
              </p>
            </div>

            {/* Results Area */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {viewMode === "cards" ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {mockResults.map((result) => (
                      <ResultCard
                        key={result.id}
                        result={result}
                        onClick={() => openRecordDrawer(result)}
                        onCopyId={handleCopyId}
                      />
                    ))}
                  </div>
                ) : (
                  <ResponsiveTableContainer>
                    <ResultsTable results={mockResults} onRowClick={openRecordDrawer} />
                  </ResponsiveTableContainer>
                )}
              </div>
            </ScrollArea>
          </main>
        </div>

        {/* Mobile Filters Sheet */}
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg">Filters</SheetTitle>
                  <div className="flex items-center gap-2">
                    {totalSelectedFilters > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
                        Clear all
                      </Button>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SheetClose
                          className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"
                          aria-label="Close filters"
                        >
                          <X className="h-4 w-4" />
                        </SheetClose>
                      </TooltipTrigger>
                      <TooltipContent>Close</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                {/* Search within facets */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="Search filters..." className="pl-10 h-10 rounded-lg" />
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
                    />
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border/50 bg-card">
                <Button className="w-full h-12 rounded-xl" onClick={() => setIsMobileFiltersOpen(false)}>
                  Show {mockResults.length} results
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Record Drawer */}
        <RecordDrawer
          record={selectedRecord}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onCopyId={handleCopyId}
        />

        {/* Save View Dialog */}
        <Dialog open={isSaveViewOpen} onOpenChange={setIsSaveViewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save View</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="view-name">Name</Label>
                <Input
                  id="view-name"
                  placeholder="My custom view"
                  value={saveViewName}
                  onChange={(e) => setSaveViewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="view-folder">Folder</Label>
                <Select value={saveViewFolder} onValueChange={setSaveViewFolder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedFolders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${folder.color}`} />
                          {folder.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="view-tags">Tags (comma separated)</Label>
                <Input
                  id="view-tags"
                  placeholder="south-asia, priority, 2025"
                  value={saveViewTags}
                  onChange={(e) => setSaveViewTags(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSaveViewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveView}>Save View</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

// Facet Filter Component
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
        <X
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-0.5 pb-3">
          {filter.options.map((option) => (
            <button
              key={option.value}
              onClick={() => onToggle(filter.id, option.value)}
              className="flex items-center justify-between w-full px-2 py-2 text-sm rounded-md hover:bg-muted/50 transition-colors min-h-[40px]"
            >
              <div className="flex items-center gap-2.5">
                <Checkbox checked={selectedValues.includes(option.value)} className="pointer-events-none" />
                <span className="text-foreground/90">{option.label}</span>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{option.count.toLocaleString()}</span>
            </button>
          ))}
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
  onCopyId?: (id: string, e: React.MouseEvent) => void
}) {
  return (
    <Card
      className="p-4 hover:shadow-md hover:border-border transition-all cursor-pointer bg-card border-border/50 rounded-2xl"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base leading-snug">{result.name}</h3>
            <p className="text-sm text-muted-foreground truncate mt-0.5">{result.alias}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="text-xs font-mono shrink-0 bg-muted/30 gap-1 cursor-pointer hover:bg-muted transition-colors"
                onClick={(e) => onCopyId?.(result.id, e)}
                aria-label={`Copy ${result.id} to clipboard`}
              >
                {result.id}
                <Copy className="h-2.5 w-2.5 opacity-50" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Copy ID</TooltipContent>
          </Tooltip>
        </div>

        {/* Country chips */}
        <div className="flex flex-wrap gap-1.5">
          {result.countries.slice(0, 3).map((country) => (
            <Badge key={country} variant="secondary" className="text-xs bg-secondary/80 font-normal">
              {country}
            </Badge>
          ))}
          {result.countries.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-secondary/80 font-normal">
              +{result.countries.length - 3}
            </Badge>
          )}
        </div>

        {/* Engagement badge and population */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`text-xs font-medium border ${getEngagementColor(result.engagementStatus)}`}
          >
            {result.engagementStatus}
          </Badge>
          <span className="text-sm font-medium text-foreground tabular-nums">
            {formatPopulation(result.population)}
          </span>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{result.lastUpdated}</span>
          </div>
          <div className="flex gap-1">
            {result.sources.slice(0, 2).map((source) => (
              <Badge key={source} variant="outline" className="text-[10px] px-1.5 py-0 font-mono bg-muted/20">
                {source}
              </Badge>
            ))}
            {result.sources.length > 2 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono bg-muted/20">
                +{result.sources.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

// Results Table Component
function ResultsTable({
  results,
  onRowClick,
}: {
  results: typeof mockResults
  onRowClick: (result: (typeof mockResults)[0]) => void
}) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
      {/* Mobile scroll hint */}
      <div className="md:hidden px-3 py-2 bg-muted/30 border-b border-border/30 text-xs text-muted-foreground flex items-center gap-1.5">
        <X className="h-3 w-3" />
        <span>Scroll horizontally to see all columns</span>
        <X className="h-3 w-3" />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold sticky left-0 bg-muted/30 z-10 min-w-[180px]">Name</TableHead>
            <TableHead className="font-semibold min-w-[100px]">AX ID</TableHead>
            <TableHead className="font-semibold min-w-[150px]">Countries</TableHead>
            <TableHead className="font-semibold min-w-[120px]">Status</TableHead>
            <TableHead className="font-semibold text-right min-w-[100px]">Population</TableHead>
            <TableHead className="font-semibold min-w-[100px]">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow
              key={result.id}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onRowClick(result)}
            >
              <TableCell className="sticky left-0 bg-card z-10">
                <div>
                  <p className="font-medium text-foreground">{result.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[160px]">{result.alias}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  {result.id}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[140px]">
                  {result.countries.slice(0, 2).map((country) => (
                    <Badge key={country} variant="secondary" className="text-xs font-normal">
                      {country}
                    </Badge>
                  ))}
                  {result.countries.length > 2 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      +{result.countries.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-xs border ${getEngagementColor(result.engagementStatus)}`}>
                  {result.engagementStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatPopulation(result.population)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{result.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Record Drawer Component
function RecordDrawer({
  record,
  isOpen,
  onClose,
  onCopyId,
}: {
  record: (typeof mockResults)[0] | null
  isOpen: boolean
  onClose: () => void
  onCopyId?: (id: string, e: React.MouseEvent) => void
}) {
  if (!record) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-hidden" hideCloseButton>
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between gap-3">
              <SheetTitle className="text-lg font-bold truncate flex-1 min-w-0">{record.name}</SheetTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onClose}
                    className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors shrink-0"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-muted-foreground">{record.alias}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="font-mono text-xs gap-1 cursor-pointer hover:bg-muted transition-colors"
                    onClick={(e) => onCopyId?.(record.id, e)}
                    aria-label="Copy AX ID"
                  >
                    {record.id}
                    <Copy className="h-2.5 w-2.5 opacity-50" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Copy AX ID</TooltipContent>
              </Tooltip>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-5 space-y-6">
              {/* Engagement Status */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Engagement Status
                </h4>
                <Badge variant="outline" className={`border ${getEngagementColor(record.engagementStatus)}`}>
                  {record.engagementStatus}
                </Badge>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Population</p>
                  <p className="text-xl font-bold text-foreground tabular-nums">
                    {formatPopulation(record.population)}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Data Quality</p>
                  <p className="text-xl font-bold text-foreground">{record.dataQuality}</p>
                </div>
              </div>

              {/* Countries */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Countries</h4>
                <div className="flex flex-wrap gap-2">
                  {record.countries.map((country) => (
                    <Badge key={country} variant="secondary" className="font-normal">
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
                  <p className="text-sm font-medium text-foreground">{record.language}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Language Family
                  </h4>
                  <p className="text-sm font-medium text-foreground">{record.family}</p>
                </div>
              </div>

              {/* Sources */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Data Sources
                </h4>
                <div className="flex flex-wrap gap-2">
                  {record.sources.map((source) => (
                    <Badge key={source} variant="outline" className="font-mono text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Updated */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Last Updated
                </h4>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <X className="h-4 w-4 text-muted-foreground" />
                  {record.lastUpdated}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border/50 bg-card safe-area-bottom">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="w-full h-11 rounded-xl gap-2" asChild>
                  <Link href={`/profile/${record.id}`}>
                    Open full profile
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open full profile</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
