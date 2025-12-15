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
  Clock,
  Bookmark,
  ChevronRight,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const filterChips = [
  { label: "Countries", icon: Globe, count: 234 },
  { label: "Engagement Status", icon: Users, count: 12 },
  { label: "Language", icon: Languages, count: 7879 },
  { label: "Family", icon: Users, count: 156 },
  { label: "Data Quality", icon: Database, count: 5 },
  { label: "Sources", icon: BookOpen, count: 28 },
]

const recentSearches = [
  { query: "Unreached in South Asia", timestamp: "2 hours ago" },
  { query: "Mandarin speaking groups", timestamp: "Yesterday" },
  { query: "AX-12847", timestamp: "3 days ago" },
  { query: "Frontier peoples", timestamp: "Last week" },
]

const savedViews = [
  { name: "My Priority List", count: 47, color: "bg-accent" },
  { name: "Southeast Asia Focus", count: 128, color: "bg-primary" },
  { name: "Language Clusters", count: 312, color: "bg-muted-foreground" },
  { name: "Newly Updated", count: 89, color: "bg-accent" },
]

export function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">PeopleGroups</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-foreground">
              Explore
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Reports
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
            Explore People Groups
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-pretty">
            Discover detailed information on over 17,000 people groups worldwide
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              type="text"
              placeholder="Search by name, alias, country, language, or AX ID"
              className="w-full h-14 pl-12 pr-4 text-base md:text-lg rounded-2xl border-border bg-card shadow-sm focus:shadow-md focus:border-ring transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-16">
          <p className="text-sm text-muted-foreground mb-4 font-medium">Popular filters</p>
          <div className="flex flex-wrap gap-3">
            {filterChips.map((chip) => {
              const Icon = chip.icon
              const isActive = activeFilters.includes(chip.label)
              return (
                <button
                  key={chip.label}
                  onClick={() => toggleFilter(chip.label)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {chip.label}
                  <Badge
                    variant="secondary"
                    className={`ml-1 text-xs px-1.5 ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {chip.count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Recent Searches */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Recent Searches</h2>
            </div>
            <Card className="divide-y divide-border bg-card border-border/50">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors text-left group min-h-[52px]"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground group-hover:text-foreground/80">{search.query}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{search.timestamp}</span>
                </button>
              ))}
            </Card>
          </div>

          {/* Saved Views */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Saved Views</h2>
            </div>
            <Card className="divide-y divide-border bg-card border-border/50">
              {savedViews.map((view, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors text-left group min-h-[52px]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${view.color}`} />
                    <span className="text-sm text-foreground group-hover:text-foreground/80">{view.name}</span>
                    <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
                      {view.count}
                    </Badge>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </Card>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-20 pt-8 border-t border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">17,446</p>
              <p className="text-sm text-muted-foreground mt-1">People Groups</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">234</p>
              <p className="text-sm text-muted-foreground mt-1">Countries</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">7,879</p>
              <p className="text-sm text-muted-foreground mt-1">Languages</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">3.2B</p>
              <p className="text-sm text-muted-foreground mt-1">Population</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
