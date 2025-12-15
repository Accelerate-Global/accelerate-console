"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Compass,
  Bookmark,
  Eye,
  User,
  Clock,
  Search,
  Globe,
  Users,
  Languages,
  Database,
  BookOpen,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export function MobileTabBar() {
  const [activeTab, setActiveTab] = useState<MobileTab | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Close sheet when pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveTab(null)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
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
    <>
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
                aria-label={tab.label}
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
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden" hideCloseButton>
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-2 border-b border-border/50">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-3" />
              <SheetTitle className="text-lg text-center">Explore</SheetTitle>
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
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden" hideCloseButton>
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/50">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-3" />
              <SheetTitle className="text-lg text-center">Saved Views</SheetTitle>
              <p className="text-sm text-muted-foreground text-center">{savedViews.length} saved views</p>
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
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden" hideCloseButton>
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/50">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-3" />
              <SheetTitle className="text-lg text-center">Watchlist</SheetTitle>
              <p className="text-sm text-muted-foreground text-center">
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
                    <div className="flex flex-wrap gap-1 mb-2">
                      {group.countries.slice(0, 2).map((country) => (
                        <Badge key={country} variant="secondary" className="text-xs font-normal">
                          {country}
                        </Badge>
                      ))}
                    </div>
                    {group.changes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {group.changes.includes("engagement") && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                            Engagement changed
                          </Badge>
                        )}
                        {group.changes.includes("population") && (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                            Population updated
                          </Badge>
                        )}
                        {group.changes.includes("updated") && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                            Data refreshed
                          </Badge>
                        )}
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
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden" hideCloseButton>
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/50">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-3" />
              <SheetTitle className="text-lg text-center">Account</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Profile Card */}
              <Card className="p-4 border-border/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                    <AvatarFallback className="bg-accent text-accent-foreground">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">John Doe</p>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="divide-y divide-border border-border/50">
                <Link
                  href="/saved-views"
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  onClick={() => setActiveTab(null)}
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Saved Views</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/watchlist"
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  onClick={() => setActiveTab(null)}
                >
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Watchlist</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Card>

              {/* Notification Settings */}
              <Card className="p-4 border-border/50 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Email notifications</p>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked aria-label="Toggle email notifications" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Watchlist alerts</p>
                    <p className="text-xs text-muted-foreground">Changes to watched groups</p>
                  </div>
                  <Switch defaultChecked aria-label="Toggle watchlist alerts" />
                </div>
                <Link
                  href="/settings/notifications"
                  className="flex items-center justify-center gap-2 text-sm text-accent hover:underline pt-2"
                  onClick={() => setActiveTab(null)}
                >
                  <Settings className="h-4 w-4" />
                  All notification settings
                </Link>
              </Card>

              {/* Sign Out */}
              <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive bg-transparent">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
