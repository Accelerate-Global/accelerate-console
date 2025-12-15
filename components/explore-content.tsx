"use client"

import { TooltipProvider } from "@/components/ui/tooltip"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Globe,
  Users,
  Languages,
  Database,
  BookOpen,
  Clock,
  Bookmark,
  ChevronRight,
  X,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/components/icon-button"

const filterData = {
  Countries: {
    icon: Globe,
    count: 234,
    options: [
      { label: "India", count: 2847 },
      { label: "China", count: 1253 },
      { label: "Indonesia", count: 782 },
      { label: "Pakistan", count: 456 },
      { label: "Bangladesh", count: 398 },
      { label: "Nigeria", count: 312 },
      { label: "Brazil", count: 287 },
      { label: "United States", count: 245 },
      { label: "Russia", count: 198 },
      { label: "Japan", count: 167 },
    ],
  },
  "Engagement Status": {
    icon: Users,
    count: 5,
    options: [
      { label: "Unreached", count: 7234 },
      { label: "Minimally Engaged", count: 4521 },
      { label: "Superficially Engaged", count: 2987 },
      { label: "Significantly Engaged", count: 1876 },
      { label: "Fully Engaged", count: 828 },
    ],
  },
  Language: {
    icon: Languages,
    count: 7879,
    options: [
      { label: "Mandarin Chinese", count: 234 },
      { label: "Hindi", count: 198 },
      { label: "Arabic", count: 176 },
      { label: "Bengali", count: 145 },
      { label: "Portuguese", count: 123 },
      { label: "Russian", count: 112 },
      { label: "Japanese", count: 98 },
      { label: "Punjabi", count: 87 },
    ],
  },
  Family: {
    icon: Users,
    count: 156,
    options: [
      { label: "Indo-European", count: 3421 },
      { label: "Sino-Tibetan", count: 1876 },
      { label: "Afro-Asiatic", count: 1234 },
      { label: "Niger-Congo", count: 987 },
      { label: "Austronesian", count: 876 },
      { label: "Dravidian", count: 654 },
    ],
  },
  "Data Quality": {
    icon: Database,
    count: 5,
    options: [
      { label: "High", count: 4521 },
      { label: "Medium", count: 8234 },
      { label: "Low", count: 3456 },
      { label: "Needs Review", count: 987 },
      { label: "Unverified", count: 248 },
    ],
  },
  Sources: {
    icon: BookOpen,
    count: 28,
    options: [
      { label: "Joshua Project", count: 12456 },
      { label: "IMB", count: 9876 },
      { label: "Ethnologue", count: 7654 },
      { label: "CPPI", count: 5432 },
      { label: "PeopleGroups.org", count: 4321 },
      { label: "World Christian Database", count: 3210 },
    ],
  },
}

type FilterKey = keyof typeof filterData

const recentSearches = [
  { query: "Unreached in South Asia", timestamp: "2 hours ago" },
  { query: "Mandarin speaking groups", timestamp: "Yesterday" },
  { query: "AX-12847", timestamp: "3 days ago" },
  { query: "Frontier peoples", timestamp: "Last week" },
]

const savedViews = [
  { id: 1, name: "My Priority List", count: 47, color: "bg-accent" },
  { id: 2, name: "Southeast Asia Focus", count: 128, color: "bg-primary" },
  { id: 3, name: "Language Clusters", count: 312, color: "bg-muted-foreground" },
  { id: 4, name: "Newly Updated", count: 89, color: "bg-accent" },
]

export function ExploreContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [expandedFilter, setExpandedFilter] = useState<FilterKey | null>(null)
  const [pendingSelections, setPendingSelections] = useState<string[]>([])
  const [filterSearchQuery, setFilterSearchQuery] = useState("")

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const handleFilterClick = (filter: FilterKey) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setPendingSelections(selectedOptions[filter] || [])
      setFilterSearchQuery("")
      setOpenFilter(filter)
    } else {
      setExpandedFilter(expandedFilter === filter ? null : filter)
    }
  }

  const toggleOption = (filter: string, option: string) => {
    setSelectedOptions((prev) => {
      const current = prev[filter] || []
      const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
      return { ...prev, [filter]: updated }
    })
  }

  const getSelectedCount = (filter: string) => {
    return (selectedOptions[filter] || []).length
  }

  const clearFilterSelections = (filter: string) => {
    setSelectedOptions((prev) => ({ ...prev, [filter]: [] }))
  }

  const togglePendingOption = (option: string) => {
    setPendingSelections((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]))
  }

  const applyPendingSelections = () => {
    if (openFilter) {
      setSelectedOptions((prev) => ({ ...prev, [openFilter]: pendingSelections }))
    }
    setOpenFilter(null)
  }

  const clearPendingSelections = () => {
    setPendingSelections([])
  }

  const getFilteredOptions = (filter: FilterKey) => {
    const options = filterData[filter].options
    if (!filterSearchQuery.trim()) return options
    return options.filter((opt) => opt.label.toLowerCase().includes(filterSearchQuery.toLowerCase()))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
          Explore People Groups
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-pretty leading-relaxed">
          Discover detailed information on over 17,000 people groups worldwide
        </p>
      </div>

      <div className="mb-10 md:mb-14">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            type="text"
            placeholder="Search by name, alias, country, language, or AX ID"
            className="w-full h-14 md:h-16 pl-14 pr-14 text-base md:text-lg rounded-2xl border-border/60 bg-card shadow-sm focus:shadow-lg focus:border-ring/50 transition-all placeholder:text-muted-foreground/70"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Clear search</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <kbd className="absolute right-5 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary text-xs text-muted-foreground font-mono">
              <span className="text-sm">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      <div className="mb-12 md:mb-16">
        <p className="text-sm text-muted-foreground mb-4 font-medium">Popular filters</p>
        <div className="flex flex-wrap gap-2.5 md:gap-3">
          {(Object.keys(filterData) as FilterKey[]).map((filterKey) => {
            const filter = filterData[filterKey]
            const Icon = filter.icon
            const selectedCount = getSelectedCount(filterKey)
            const isActive = selectedCount > 0 || expandedFilter === filterKey

            return (
              <button
                key={filterKey}
                onClick={() => handleFilterClick(filterKey)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground border-border/60 hover:bg-secondary hover:border-border"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{filterKey}</span>
                <Badge
                  variant="secondary"
                  className={`ml-0.5 text-xs px-1.5 py-0 ${
                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {selectedCount > 0 ? selectedCount : filter.count}
                </Badge>
              </button>
            )
          })}
        </div>

        {expandedFilter && (
          <Card className="mt-4 p-4 border-border/60 bg-card/50 hidden md:block animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{expandedFilter}</h3>
              <div className="flex items-center gap-2">
                {getSelectedCount(expandedFilter) > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilterSelections(expandedFilter)}
                    className="text-muted-foreground hover:text-foreground h-8"
                  >
                    Clear
                  </Button>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedFilter(null)}
                        className="h-8 w-8 p-0"
                        aria-label="Close filter panel"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {filterData[expandedFilter].options.map((option) => {
                const isSelected = (selectedOptions[expandedFilter] || []).includes(option.label)
                return (
                  <button
                    key={option.label}
                    onClick={() => toggleOption(expandedFilter, option.label)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                      isSelected
                        ? "bg-primary/10 text-foreground border border-primary/30"
                        : "bg-secondary/50 text-foreground hover:bg-secondary border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? "bg-primary border-primary" : "border-border bg-background"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{option.count.toLocaleString()}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
              <Button size="sm" onClick={() => setExpandedFilter(null)}>
                Apply Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
        {/* Recent Searches Card */}
        <Card className="border-border/50 bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border/50 bg-secondary/30">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Recent Searches</h2>
          </div>
          <div className="divide-y divide-border/50">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left group min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground group-hover:text-foreground/80">{search.query}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{search.timestamp}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Saved Views Card */}
        <Card className="border-border/50 bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border/50 bg-secondary/30">
            <Bookmark className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Saved Views</h2>
          </div>
          <div className="divide-y divide-border/50">
            {savedViews.map((view) => (
              <Link
                key={view.id}
                href={`/search?view=${view.id}`}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left group min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${view.color} shrink-0`} />
                  <span className="text-sm text-foreground group-hover:text-foreground/80">{view.name}</span>
                  <Badge variant="secondary" className="text-xs bg-secondary/80 text-muted-foreground">
                    {view.count}
                  </Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="border-t border-border/50 pt-10 md:pt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center">
            <p className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">17,446</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wide font-medium">
              People Groups
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">234</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wide font-medium">
              Countries
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">7,879</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wide font-medium">
              Languages
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">3.2B</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wide font-medium">
              Population
            </p>
          </div>
        </div>
      </div>

      <Sheet open={openFilter !== null} onOpenChange={(open) => !open && setOpenFilter(null)}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl p-0 flex flex-col" hideCloseButton>
          {openFilter && (
            <>
              {/* Header with single close button */}
              <SheetHeader className="px-5 pt-5 pb-0 shrink-0">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-semibold">{openFilter}</SheetTitle>
                  <IconButton
                    tooltip="Close"
                    aria-label="Close filter sheet"
                    onClick={() => setOpenFilter(null)}
                    className="h-9 w-9 rounded-full bg-secondary hover:bg-muted flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </IconButton>
                </div>
                {/* Selected count indicator */}
                {pendingSelections.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">{pendingSelections.length} selected</p>
                )}
              </SheetHeader>

              {/* Search within filter - sticky under header */}
              <div className="px-5 py-3 border-b border-border/50 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={`Search ${openFilter.toLowerCase()}...`}
                    value={filterSearchQuery}
                    onChange={(e) => setFilterSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-xl bg-secondary/50 border-border/50"
                  />
                  {filterSearchQuery && (
                    <IconButton
                      tooltip="Clear search"
                      aria-label="Clear search"
                      onClick={() => setFilterSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </IconButton>
                  )}
                </div>
              </div>

              {/* Scrollable options list */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="px-5 py-3 space-y-1.5 pb-safe">
                  {getFilteredOptions(openFilter).map((option) => {
                    const isSelected = pendingSelections.includes(option.label)
                    return (
                      <button
                        key={option.label}
                        onClick={() => togglePendingOption(option.label)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-colors min-h-[52px] ${
                          isSelected
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-secondary/50 text-foreground hover:bg-secondary border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected ? "bg-primary border-primary" : "border-border bg-background"
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                          </div>
                          <span>{option.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {option.count.toLocaleString()}
                        </span>
                      </button>
                    )
                  })}
                  {getFilteredOptions(openFilter).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No {openFilter.toLowerCase()} match your search
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Sticky bottom action bar */}
              <div className="px-5 py-4 border-t border-border/50 bg-card shrink-0 pb-safe flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={clearPendingSelections}
                      disabled={pendingSelections.length === 0}
                      className="h-12 px-5 rounded-xl bg-transparent"
                      aria-label="Clear all selections"
                    >
                      Clear
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear all selections</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={applyPendingSelections}
                      className="flex-1 h-12 rounded-xl"
                      aria-label="Apply filters"
                    >
                      Apply filters
                      {pendingSelections.length > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-primary-foreground/20 text-primary-foreground">
                          {pendingSelections.length}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Apply selected filters</TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
