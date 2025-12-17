"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Sparkles,
  Plus,
  FolderHeart,
  MoreHorizontal,
  Eye,
  Trash2,
  Pencil,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  TrendingUp,
  Users,
  GitCompare,
  X,
  Clock,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEngagementColor } from "@/lib/status-colors"

const collections = [
  { id: "all", name: "All Watched", count: 24, icon: Eye, color: "text-muted-foreground" },
  { id: "priority", name: "Priority Focus", count: 8, icon: FolderHeart, color: "text-red-500" },
  { id: "south-asia", name: "South Asia Research", count: 6, icon: FolderHeart, color: "text-blue-500" },
  { id: "unreached", name: "Unreached Tracking", count: 5, icon: FolderHeart, color: "text-amber-500" },
  { id: "language", name: "Language Cluster Study", count: 3, icon: FolderHeart, color: "text-emerald-500" },
  { id: "partner", name: "Partner Interest", count: 2, icon: FolderHeart, color: "text-purple-500" },
]

type ChangeType = "engagement" | "population" | "updated" | "none"

interface PeopleGroup {
  id: string
  name: string
  axId: string
  countries: string[]
  population: number
  populationChange: number | null
  engagementStatus: string
  engagementPrevious: string | null
  lastUpdated: string
  lastViewed: string
  sources: string[]
  changes: ChangeType[]
  collection: string
}

const watchedGroups: PeopleGroup[] = [
  {
    id: "1",
    name: "Shaikh",
    axId: "AX-103847",
    countries: ["India", "Bangladesh", "Pakistan"],
    population: 214500000,
    populationChange: 2300000,
    engagementStatus: "Minimally Engaged",
    engagementPrevious: "Unreached",
    lastUpdated: "2 days ago",
    lastViewed: "1 week ago",
    sources: ["IMB", "Joshua Project"],
    changes: ["engagement", "population", "updated"],
    collection: "priority",
  },
  {
    id: "2",
    name: "Yadav",
    axId: "AX-103921",
    countries: ["India", "Nepal"],
    population: 58200000,
    populationChange: -150000,
    engagementStatus: "Unreached",
    engagementPrevious: null,
    lastUpdated: "1 week ago",
    lastViewed: "3 days ago",
    sources: ["Joshua Project"],
    changes: ["population"],
    collection: "south-asia",
  },
  {
    id: "3",
    name: "Turk",
    axId: "AX-104102",
    countries: ["Turkey", "Germany", "Netherlands"],
    population: 67800000,
    populationChange: null,
    engagementStatus: "Superficially Engaged",
    engagementPrevious: "Minimally Engaged",
    lastUpdated: "3 days ago",
    lastViewed: "2 weeks ago",
    sources: ["IMB", "Operation World"],
    changes: ["engagement", "updated"],
    collection: "priority",
  },
  {
    id: "4",
    name: "Pashtun",
    axId: "AX-102847",
    countries: ["Afghanistan", "Pakistan"],
    population: 49200000,
    populationChange: 800000,
    engagementStatus: "Unreached",
    engagementPrevious: null,
    lastUpdated: "Yesterday",
    lastViewed: "1 month ago",
    sources: ["Joshua Project", "Ethnologue"],
    changes: ["population", "updated"],
    collection: "unreached",
  },
  {
    id: "5",
    name: "Bengali Muslim",
    axId: "AX-103102",
    countries: ["Bangladesh", "India"],
    population: 168500000,
    populationChange: null,
    engagementStatus: "Minimally Engaged",
    engagementPrevious: null,
    lastUpdated: "2 weeks ago",
    lastViewed: "5 days ago",
    sources: ["IMB"],
    changes: [],
    collection: "south-asia",
  },
  {
    id: "6",
    name: "Persian",
    axId: "AX-104521",
    countries: ["Iran", "Afghanistan", "Tajikistan"],
    population: 56700000,
    populationChange: 1200000,
    engagementStatus: "Significantly Engaged",
    engagementPrevious: "Superficially Engaged",
    lastUpdated: "4 days ago",
    lastViewed: "2 weeks ago",
    sources: ["Joshua Project", "Operation World"],
    changes: ["engagement", "population", "updated"],
    collection: "language",
  },
  {
    id: "7",
    name: "Rajput",
    axId: "AX-103456",
    countries: ["India", "Pakistan", "Nepal"],
    population: 43100000,
    populationChange: null,
    engagementStatus: "Unreached",
    engagementPrevious: null,
    lastUpdated: "1 month ago",
    lastViewed: "3 weeks ago",
    sources: ["Joshua Project"],
    changes: [],
    collection: "south-asia",
  },
  {
    id: "8",
    name: "Arab, Iraqi",
    axId: "AX-104892",
    countries: ["Iraq", "Syria", "Jordan"],
    population: 28400000,
    populationChange: -500000,
    engagementStatus: "Minimally Engaged",
    engagementPrevious: null,
    lastUpdated: "5 days ago",
    lastViewed: "1 week ago",
    sources: ["IMB", "Joshua Project"],
    changes: ["population", "updated"],
    collection: "priority",
  },
]

export function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollection, setSelectedCollection] = useState("all")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("changes")
  const [createCollectionDialog, setCreateCollectionDialog] = useState(false)
  const [renameCollectionDialog, setRenameCollectionDialog] = useState<{
    open: boolean
    collection: (typeof collections)[0] | null
  }>({ open: false, collection: null })
  const [deleteCollectionDialog, setDeleteCollectionDialog] = useState<{
    open: boolean
    collection: (typeof collections)[0] | null
  }>({ open: false, collection: null })
  const [removeFromWatchlistDialog, setRemoveFromWatchlistDialog] = useState<{
    open: boolean
    group: PeopleGroup | null
  }>({ open: false, group: null })

  const filteredGroups = watchedGroups
    .filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.axId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.countries.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCollection = selectedCollection === "all" || group.collection === selectedCollection
      return matchesSearch && matchesCollection
    })
    .sort((a, b) => {
      if (sortBy === "changes") {
        return b.changes.length - a.changes.length
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "population") {
        return b.population - a.population
      } else if (sortBy === "updated") {
        return 0 // Would need proper date comparison
      }
      return 0
    })

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const toggleAllSelection = () => {
    if (selectedGroups.length === filteredGroups.length) {
      setSelectedGroups([])
    } else {
      setSelectedGroups(filteredGroups.map((g) => g.id))
    }
  }

  const groupsWithChanges = filteredGroups.filter((g) => g.changes.length > 0).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Accelerate Global</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Search
            </Link>
            <Link href="/saved-views" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Saved Views
            </Link>
            <Link href="/watchlist" className="text-sm font-medium text-foreground">
              Watchlist
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden flex items-center gap-2 mb-4 bg-transparent">
                <Filter className="h-4 w-4" />
                Collections
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Collections</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <CollectionsSidebar
                  collections={collections}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                  onCreateCollection={() => setCreateCollectionDialog(true)}
                  onRenameCollection={(c) => setRenameCollectionDialog({ open: true, collection: c })}
                  onDeleteCollection={(c) => setDeleteCollectionDialog({ open: true, collection: c })}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <CollectionsSidebar
                collections={collections}
                selectedCollection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
                onCreateCollection={() => setCreateCollectionDialog(true)}
                onRenameCollection={(c) => setRenameCollectionDialog({ open: true, collection: c })}
                onDeleteCollection={(c) => setDeleteCollectionDialog({ open: true, collection: c })}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Watchlist</h1>
                <p className="text-muted-foreground mt-1">
                  {filteredGroups.length} people {filteredGroups.length === 1 ? "group" : "groups"}
                  {groupsWithChanges > 0 && <span className="text-accent"> · {groupsWithChanges} with changes</span>}
                </p>
              </div>
              <Button className="gap-2 min-h-[44px]" onClick={() => setCreateCollectionDialog(true)}>
                <Plus className="h-4 w-4" />
                New Collection
              </Button>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search watched groups..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-44 h-11 bg-transparent">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="changes">Most Changes</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="population">Population</SelectItem>
                  <SelectItem value="updated">Recently Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selection Bar */}
            {selectedGroups.length > 0 && (
              <div className="flex items-center justify-between bg-accent/10 border border-accent/20 rounded-lg px-4 py-3 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedGroups([])}
                    className="h-8 w-8 rounded-md bg-background flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-foreground">{selectedGroups.length} selected</span>
                </div>
                <Button className="gap-2 min-h-[40px]">
                  <GitCompare className="h-4 w-4" />
                  Compare Selected
                </Button>
              </div>
            )}

            {/* Select All Row */}
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <Checkbox
                checked={selectedGroups.length === filteredGroups.length && filteredGroups.length > 0}
                onCheckedChange={toggleAllSelection}
                className="h-5 w-5"
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </div>

            {/* Groups List */}
            <div className="space-y-3">
              {filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className={`p-4 md:p-5 hover:shadow-md transition-all border-border/50 group ${
                    selectedGroups.includes(group.id) ? "ring-2 ring-accent bg-accent/5" : ""
                  } ${group.changes.length > 0 ? "border-l-4 border-l-accent" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <Checkbox
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={() => toggleGroupSelection(group.id)}
                        className="h-5 w-5"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/profile/${group.id}`}
                              className="text-lg font-semibold text-foreground hover:text-accent transition-colors"
                            >
                              {group.name}
                            </Link>
                            <span className="text-xs text-muted-foreground font-mono">{group.axId}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {group.countries.slice(0, 3).map((country) => (
                              <Badge key={country} variant="secondary" className="text-xs font-normal">
                                {country}
                              </Badge>
                            ))}
                            {group.countries.length > 3 && (
                              <Badge variant="secondary" className="text-xs font-normal">
                                +{group.countries.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" className="gap-1.5 min-h-[36px] bg-transparent" asChild>
                            <Link href={`/profile/${group.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="gap-2">
                                <ArrowUpRight className="h-4 w-4" />
                                Open Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <GitCompare className="h-4 w-4" />
                                Add to Compare
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setRemoveFromWatchlistDialog({ open: true, group })}
                                className="gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove from Watchlist
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3">
                        <Badge variant="outline" className={`${getEngagementColor(group.engagementStatus)}`}>
                          {group.engagementStatus}
                        </Badge>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {group.population.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          Updated {group.lastUpdated}
                        </span>
                      </div>

                      {/* Change Indicators */}
                      {group.changes.length > 0 && (
                        <div className="bg-muted/50 rounded-lg p-3 mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium text-foreground">Changes since you last viewed</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.changes.includes("engagement") && group.engagementPrevious && (
                              <div className="flex items-center gap-2 bg-background rounded-md px-3 py-1.5 border border-border/50">
                                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-xs">
                                  <span className="text-muted-foreground">Engagement:</span>{" "}
                                  <span className="line-through text-muted-foreground/60">
                                    {group.engagementPrevious}
                                  </span>{" "}
                                  <span className="font-medium text-foreground">{group.engagementStatus}</span>
                                </span>
                              </div>
                            )}
                            {group.changes.includes("population") && group.populationChange !== null && (
                              <div className="flex items-center gap-2 bg-background rounded-md px-3 py-1.5 border border-border/50">
                                {group.populationChange > 0 ? (
                                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                                )}
                                <span className="text-xs">
                                  <span className="text-muted-foreground">Population:</span>{" "}
                                  <span
                                    className={`font-medium ${
                                      group.populationChange > 0 ? "text-emerald-600" : "text-red-600"
                                    }`}
                                  >
                                    {group.populationChange > 0 ? "+" : ""}
                                    {group.populationChange.toLocaleString()}
                                  </span>
                                </span>
                              </div>
                            )}
                            {group.changes.includes("updated") && (
                              <div className="flex items-center gap-2 bg-background rounded-md px-3 py-1.5 border border-border/50">
                                <RefreshCw className="h-3.5 w-3.5 text-blue-500" />
                                <span className="text-xs">
                                  <span className="text-muted-foreground">Data updated</span>{" "}
                                  <span className="font-medium text-foreground">{group.lastUpdated}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Source Chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">Sources:</span>
                        {group.sources.map((source) => (
                          <Badge key={source} variant="outline" className="text-xs font-normal">
                            {source}
                          </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto">Last viewed {group.lastViewed}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredGroups.length === 0 && (
                <div className="text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No watched groups found</h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedCollection === "all"
                      ? "Start watching people groups to track changes"
                      : "No groups in this collection match your search"}
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/search">Browse People Groups</Link>
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={createCollectionDialog} onOpenChange={setCreateCollectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>Create a new collection to organize your watched people groups.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Name</Label>
              <Input id="collection-name" placeholder="e.g., Field Research 2024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description">Description (optional)</Label>
              <Textarea id="collection-description" placeholder="Add a description..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {["red", "blue", "amber", "emerald", "purple", "pink"].map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-offset-2 hover:ring-${color}-500 transition-all`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCollectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateCollectionDialog(false)}>Create Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Collection Dialog */}
      <Dialog
        open={renameCollectionDialog.open}
        onOpenChange={(open) => setRenameCollectionDialog({ open, collection: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Collection</DialogTitle>
            <DialogDescription>Update the name for this collection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-name">Name</Label>
              <Input id="rename-name" defaultValue={renameCollectionDialog.collection?.name} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameCollectionDialog({ open: false, collection: null })}>
              Cancel
            </Button>
            <Button onClick={() => setRenameCollectionDialog({ open: false, collection: null })}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog
        open={deleteCollectionDialog.open}
        onOpenChange={(open) => setDeleteCollectionDialog({ open, collection: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteCollectionDialog.collection?.name}"? The watched groups will be
              moved to "All Watched".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCollectionDialog({ open: false, collection: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setDeleteCollectionDialog({ open: false, collection: null })}>
              Delete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove from Watchlist Dialog */}
      <Dialog
        open={removeFromWatchlistDialog.open}
        onOpenChange={(open) => setRemoveFromWatchlistDialog({ open, group: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Watchlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to stop watching "{removeFromWatchlistDialog.group?.name}"? You can always add it
              back later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveFromWatchlistDialog({ open: false, group: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setRemoveFromWatchlistDialog({ open: false, group: null })}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CollectionsSidebar({
  collections,
  selectedCollection,
  setSelectedCollection,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection,
}: {
  collections: typeof import("./watchlist-page").collections
  selectedCollection: string
  setSelectedCollection: (id: string) => void
  onCreateCollection: () => void
  onRenameCollection: (c: (typeof collections)[0]) => void
  onDeleteCollection: (c: (typeof collections)[0]) => void
}) {
  const [expandedCollections, setExpandedCollections] = useState(true)

  return (
    <div className="space-y-6">
      {/* Collections */}
      <div>
        <button
          onClick={() => setExpandedCollections(!expandedCollections)}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3"
        >
          Collections
          {expandedCollections ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {expandedCollections && (
          <div className="space-y-1">
            {collections.map((collection) => {
              const Icon = collection.icon
              const isSelected = selectedCollection === collection.id
              const isAllWatched = collection.id === "all"

              return (
                <div
                  key={collection.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors group ${
                    isSelected
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setSelectedCollection(collection.id)}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Icon className={`h-4 w-4 flex-shrink-0 ${isAllWatched ? "" : collection.color}`} />
                    <span className="text-sm truncate">{collection.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {collection.count}
                    </span>
                    {!isAllWatched && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="h-6 w-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-background transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onRenameCollection(collection)
                            }}
                            className="gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteCollection(collection)
                            }}
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Collection Button */}
      <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={onCreateCollection}>
        <Plus className="h-4 w-4" />
        New Collection
      </Button>

      {/* Legend */}
      <div className="pt-4 border-t border-border/50">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Change Indicators</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span>Engagement improved</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            <span>Population increased</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
            <span>Population decreased</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5 text-blue-500" />
            <span>Data updated</span>
          </div>
        </div>
      </div>
    </div>
  )
}
