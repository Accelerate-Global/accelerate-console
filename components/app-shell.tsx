"use client"

import type React from "react"
import { Footer } from "@/components/footer"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Sparkles,
  Compass,
  Bookmark,
  Eye,
  User,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  Globe,
  Users,
  Languages,
  Database,
  BookOpen,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

type MobileTab = "explore" | "saved" | "watchlist" | "account"

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
  {
    id: 4,
    name: "Frontier Peoples Priority",
    description: "No known believers, limited access",
    tags: ["Frontier"],
    lastRun: "Last week",
    resultCount: 312,
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeTab, setActiveTab] = useState<MobileTab | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close sheet when pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveTab(null)
        setSearchFocused(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

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

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const resetState = () => {
    setSearchQuery("")
    setActiveFilters([])
    setActiveTab(null)
  }

  const getEngagementColor = (status: string) => {
    switch (status) {
      case "Unreached":
        return "bg-red-100 text-red-700 border-red-200"
      case "Minimally Engaged":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Superficially Engaged":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Significantly Engaged":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const tabs = [
    { id: "explore" as MobileTab, label: "Explore", icon: Compass },
    { id: "saved" as MobileTab, label: "Saved", icon: Bookmark },
    { id: "watchlist" as MobileTab, label: "Watchlist", icon: Eye },
    { id: "account" as MobileTab, label: "Account", icon: User },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Top Bar */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo - Left */}
          <button onClick={resetState} className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">PeopleGroups</span>
          </button>

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
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-mono">
                <span className="text-xs">⌘</span>K
              </kbd>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Avatar Menu - Right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">JD</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
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
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 z-50 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(isActive ? null : tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-4 min-w-[64px] min-h-[52px] rounded-lg transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Explore Sheet */}
      <Sheet open={activeTab === "explore"} onOpenChange={(open) => !open && setActiveTab(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-2 border-b border-border/50">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg">Explore</SheetTitle>
                <button
                  onClick={() => setActiveTab(null)}
                  className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Mobile Search */}
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search people groups..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Filter Chips */}
              <div>
                <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                  Popular filters
                </p>
                <div className="flex flex-wrap gap-2">
                  {filterChips.map((chip) => {
                    const Icon = chip.icon
                    const isActive = activeFilters.includes(chip.label)
                    return (
                      <button
                        key={chip.label}
                        onClick={() => toggleFilter(chip.label)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all min-h-[36px] ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {chip.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Recent Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent</h3>
                </div>
                <Card className="divide-y divide-border border-border/50">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between px-3 py-3 hover:bg-muted/50 transition-colors text-left min-h-[48px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Search className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{search.query}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{search.timestamp}</span>
                    </button>
                  ))}
                </Card>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 text-center border-border/50">
                  <p className="text-xl font-bold text-foreground">17,446</p>
                  <p className="text-xs text-muted-foreground">People Groups</p>
                </Card>
                <Card className="p-3 text-center border-border/50">
                  <p className="text-xl font-bold text-foreground">234</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </Card>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Saved Views Sheet */}
      <Sheet open={activeTab === "saved"} onOpenChange={(open) => !open && setActiveTab(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg">Saved Views</SheetTitle>
                <button
                  onClick={() => setActiveTab(null)}
                  className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{savedViews.length} saved views</p>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {savedViews.map((view) => (
                <Card key={view.id} className="p-4 border-border/50">
                  <Link href={`/search?view=${view.id}`} className="block" onClick={() => setActiveTab(null)}>
                    <h3 className="font-semibold text-foreground mb-1">{view.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{view.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {view.lastRun}
                      </span>
                      <span>{view.resultCount.toLocaleString()} results</span>
                    </div>
                  </Link>
                </Card>
              ))}
              <Button variant="outline" className="w-full mt-2 bg-transparent" asChild>
                <Link href="/saved-views" onClick={() => setActiveTab(null)}>
                  View All Saved Views
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Watchlist Sheet */}
      <Sheet open={activeTab === "watchlist"} onOpenChange={(open) => !open && setActiveTab(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg">Watchlist</SheetTitle>
                <button
                  onClick={() => setActiveTab(null)}
                  className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {watchedGroups.length} groups · {watchedGroups.filter((g) => g.changes.length > 0).length} with changes
              </p>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {watchedGroups.map((group) => (
                <Card
                  key={group.id}
                  className={`p-4 border-border/50 ${group.changes.length > 0 ? "border-l-4 border-l-accent" : ""}`}
                >
                  <Link href={`/profile/${group.id}`} className="block" onClick={() => setActiveTab(null)}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{group.name}</h3>
                        <span className="text-xs text-muted-foreground font-mono">{group.axId}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getEngagementColor(group.engagementStatus)}`}>
                        {group.engagementStatus}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {group.countries.map((country) => (
                        <Badge key={country} variant="secondary" className="text-xs font-normal">
                          {country}
                        </Badge>
                      ))}
                    </div>
                    {group.changes.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                        <AlertCircle className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs text-muted-foreground">
                          {group.changes.includes("population") && group.populationChange && (
                            <span className="text-emerald-600">+{group.populationChange.toLocaleString()} pop</span>
                          )}
                          {group.changes.includes("engagement") && <span>Engagement changed</span>}
                          {group.changes.includes("updated") && <span>Data updated {group.lastUpdated}</span>}
                        </span>
                      </div>
                    )}
                  </Link>
                </Card>
              ))}
              <Button variant="outline" className="w-full mt-2 bg-transparent" asChild>
                <Link href="/watchlist" onClick={() => setActiveTab(null)}>
                  View Full Watchlist
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Account Sheet */}
      <Sheet open={activeTab === "account"} onOpenChange={(open) => !open && setActiveTab(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg">Account</SheetTitle>
                <button
                  onClick={() => setActiveTab(null)}
                  className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Profile Summary */}
              <div className="flex items-center gap-3 mt-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                  <AvatarFallback className="bg-accent text-accent-foreground">JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Bookmark className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Saved Views</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{savedViews.length}</p>
                </Card>
                <Card className="p-3 border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Watching</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{watchedGroups.length}</p>
                </Card>
              </div>

              {/* Notification Settings Preview */}
              <Card className="p-4 border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Notifications</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground mb-3">Daily digest at 9:00 AM</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/settings/notifications" onClick={() => setActiveTab(null)}>
                    Notification Settings
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </Card>

              {/* Menu Items */}
              <div className="space-y-1">
                <Link
                  href="/saved-views"
                  onClick={() => setActiveTab(null)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted transition-colors min-h-[48px]"
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">Saved Views</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/watchlist"
                  onClick={() => setActiveTab(null)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted transition-colors min-h-[48px]"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">Watchlist</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setActiveTab(null)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted transition-colors min-h-[48px]"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>

              <Separator />

              {/* Sign Out */}
              <button className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors w-full text-left min-h-[48px] text-destructive">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
