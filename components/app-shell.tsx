"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Globe,
  Users,
  Languages,
  Database,
  BookOpen,
  Clock,
  ChevronRight,
  Sparkles,
  Bookmark,
  Eye,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { getEngagementColor } from "@/lib/status-colors"

// Filter chips data
const filterChips = [
  { label: "Countries", icon: Globe, count: 234 },
  { label: "Engagement Status", icon: Users, count: 12 },
  { label: "Language", icon: Languages, count: 7879 },
  { label: "Family", icon: Users, count: 156 },
  { label: "Data Quality", icon: Database, count: 5 },
  { label: "Sources", icon: BookOpen, count: 28 },
]

// Recent searches
const recentSearches = [
  { query: "Unreached in South Asia", timestamp: "2 hours ago" },
  { query: "Mandarin speaking groups", timestamp: "Yesterday" },
  { query: "AX-12847", timestamp: "3 days ago" },
  { query: "Frontier peoples", timestamp: "Last week" },
]

// Saved views data
const savedViews = [
  {
    id: 1,
    name: "Unreached in South Asia",
    description: "Focus on unreached in India, Pakistan",
    tags: ["Unreached"],
    lastRun: "2 hours ago",
    resultCount: 847,
  },
  {
    id: 2,
    name: "Mandarin Language Cluster",
    description: "Mandarin primary or secondary language",
    tags: ["Language"],
    lastRun: "Yesterday",
    resultCount: 234,
  },
  {
    id: 3,
    name: "Southeast Asia Engagement",
    description: "Tracking engagement in SE Asia",
    tags: ["Engagement"],
    lastRun: "3 days ago",
    resultCount: 1289,
  },
]

// Watchlist data
const watchedGroups = [
  {
    id: "1",
    name: "Shaikh (Muslim traditions)",
    axId: "AX-12847",
    countries: ["India", "Pakistan"],
    population: 215400000,
    engagementStatus: "Unreached",
    changes: ["population", "updated"],
    populationChange: 2400000,
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    name: "Yadav (Hindu traditions)",
    axId: "AX-10293",
    countries: ["India", "Nepal"],
    population: 68200000,
    engagementStatus: "Minimally Engaged",
    changes: ["engagement"],
    lastUpdated: "1 week ago",
  },
  {
    id: "3",
    name: "Turk",
    axId: "AX-15782",
    countries: ["Turkey", "Germany"],
    population: 67800000,
    engagementStatus: "Superficially Engaged",
    changes: [],
    lastUpdated: "3 days ago",
  },
  {
    id: "4",
    name: "Bengali Shaikh",
    axId: "AX-11456",
    countries: ["Bangladesh", "India"],
    population: 45600000,
    engagementStatus: "Unreached",
    changes: ["updated"],
    lastUpdated: "5 days ago",
  },
]

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Desktop Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <TooltipProvider>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Logo - Left */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2 shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Go to Explore"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-foreground hidden sm:inline">PeopleGroups</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="tooltip-content">
                <p>Go to Explore</p>
              </TooltipContent>
            </Tooltip>

            {/* Centered Omnibox Search */}
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, alias, country, language, or AX ID"
                  className="w-full h-10 pl-10 pr-16 text-sm rounded-full border-border bg-secondary/50 focus:bg-card focus:shadow-md focus:border-ring transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search people groups"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-mono">
                  <span className="text-xs">⌘</span>K
                </kbd>
                {searchQuery && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-12 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear search</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Avatar Menu - Right */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="shrink-0 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label="Account menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                        <AvatarFallback className="bg-accent text-accent-foreground text-xs">JD</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account menu</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/saved-views" className="gap-2 cursor-pointer">
                    <Bookmark className="h-4 w-4" />
                    Saved Views
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/watchlist" className="gap-2 cursor-pointer">
                    <Eye className="h-4 w-4" />
                    Watchlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings/notifications" className="gap-2 cursor-pointer">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}

// Explore Content Component
export function ExploreContent() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4 text-balance">
          Explore People Groups
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Discover detailed information on over 17,000 people groups worldwide
        </p>
      </div>

      {/* Large Search */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, alias, country, language, or AX ID"
            className="w-full h-14 pl-12 pr-4 text-base rounded-2xl border-border bg-card shadow-sm focus:shadow-md focus:border-ring transition-all"
            aria-label="Search people groups"
          />
        </div>
      </div>

      {/* Popular Filters */}
      <div className="mb-12">
        <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wide text-center">
          Popular filters
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {filterChips.map((chip) => {
            const Icon = chip.icon
            const isActive = activeFilters.includes(chip.label)
            return (
              <button
                key={chip.label}
                onClick={() => toggleFilter(chip.label)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {chip.label}
                <span className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {chip.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Two Column Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {/* Recent Searches */}
        <Card className="border-border/50">
          <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Recent Searches</h2>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {recentSearches.map((search, idx) => (
              <button
                key={idx}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{search.query}</span>
                </div>
                <span className="text-xs text-muted-foreground">{search.timestamp}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Saved Views */}
        <Card className="border-border/50">
          <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Saved Views</h2>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {savedViews.map((view) => (
              <Link
                key={view.id}
                href={`/search?view=${view.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{view.name}</p>
                  <p className="text-xs text-muted-foreground">{view.resultCount.toLocaleString()} results</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Story Numbers Strip */}
      <div className="border-t border-border/50 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-foreground">17,446</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">People Groups</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-foreground">234</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Countries</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-foreground">7,879</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Languages</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-foreground">8.1B</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Population</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Watchlist Content Component
export function WatchlistContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
        <Badge variant="secondary" className="text-xs">
          {watchedGroups.filter((g) => g.changes.length > 0).length} with changes
        </Badge>
      </div>
      <div className="space-y-3">
        {watchedGroups.map((group) => (
          <Card
            key={group.id}
            className={`p-4 border-border/50 ${group.changes.length > 0 ? "border-l-4 border-l-accent" : ""}`}
          >
            <Link href={`/profile/${group.id}`} className="block">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate">{group.name}</h3>
                  <span className="text-xs text-muted-foreground font-mono">{group.axId}</span>
                </div>
                <Badge variant="outline" className={`text-xs shrink-0 ${getEngagementColor(group.engagementStatus)}`}>
                  {group.engagementStatus}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {group.countries.map((country) => (
                  <Badge key={country} variant="secondary" className="text-xs font-normal">
                    {country}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{group.population.toLocaleString()} people</span>
                <span>Updated {group.lastUpdated}</span>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
