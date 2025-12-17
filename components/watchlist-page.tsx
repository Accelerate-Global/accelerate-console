"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Users,
  Clock,
  GitCompare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Info,
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
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { AppLayout } from "@/components/app-layout"
import { getEngagementColor } from "@/lib/status-colors"
import { normalizeEngagementStatus } from "@/lib/terminology"

// Mock data
const mockCollections = [
  { id: "all", name: "All Watched", count: 24, color: "bg-primary" },
  { id: "priority", name: "Priority Focus", count: 8, color: "bg-amber-500" },
  { id: "south-asia", name: "South Asia", count: 12, color: "bg-emerald-500" },
  { id: "unreached", name: "Unreached UPGs", count: 15, color: "bg-red-500" },
]

const mockWatchedGroups = [
  {
    id: "1",
    name: "Shaikh (Muslim traditions)",
    axId: "AX-10234",
    countries: ["Bangladesh", "India"],
    engagementStatus: "Unreached",
    engagementPrevious: null,
    population: 180500000,
    populationChange: 2500000,
    lastUpdated: "2 days ago",
    lastViewed: "1 week ago",
    sources: ["Joshua Project", "IMB"],
    collection: "priority",
    changes: ["population", "updated"],
  },
  {
    id: "2",
    name: "Yadav (Hindu traditions)",
    axId: "AX-10892",
    countries: ["India", "Nepal"],
    engagementStatus: "Minimally Reached",
    engagementPrevious: "Unreached",
    population: 62800000,
    populationChange: null,
    lastUpdated: "5 days ago",
    lastViewed: "2 weeks ago",
    sources: ["Joshua Project"],
    collection: "south-asia",
    changes: ["engagement"],
  },
  {
    id: "3",
    name: "Turk",
    axId: "AX-15678",
    countries: ["Turkey", "Germany", "Netherlands"],
    engagementStatus: "Partially Reached",
    engagementPrevious: null,
    population: 58200000,
    populationChange: -150000,
    lastUpdated: "1 week ago",
    lastViewed: "3 days ago",
    sources: ["Joshua Project", "Operation World"],
    collection: "all",
    changes: [],
  },
  {
    id: "4",
    name: "Bengali (Muslim traditions)",
    axId: "AX-10156",
    countries: ["Bangladesh", "India"],
    engagementStatus: "Unreached",
    engagementPrevious: null,
    population: 145700000,
    populationChange: 1200000,
    lastUpdated: "3 days ago",
    lastViewed: "1 month ago",
    sources: ["IMB", "Joshua Project"],
    collection: "priority",
    changes: ["population", "updated"],
  },
  {
    id: "5",
    name: "Pashtun (Pathan)",
    axId: "AX-12456",
    countries: ["Afghanistan", "Pakistan"],
    engagementStatus: "Unreached",
    engagementPrevious: null,
    population: 49500000,
    populationChange: null,
    lastUpdated: "2 weeks ago",
    lastViewed: "2 weeks ago",
    sources: ["Joshua Project"],
    collection: "unreached",
    changes: [],
  },
]

export function WatchlistPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [collections, setCollections] = useState(mockCollections)
  const [selectedCollection, setSelectedCollection] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  // Dialogs
  const [createCollectionDialog, setCreateCollectionDialog] = useState(false)
  const [renameCollectionDialog, setRenameCollectionDialog] = useState<{
    open: boolean
    collection: (typeof collections)[0] | null
  }>({ open: false, collection: null })
  const [deleteCollectionDialog, setDeleteCollectionDialog] = useState<{
    open: boolean
    collection: (typeof collections)[0] | null
  }>({ open: false, collection: null })
  const [removeGroupDialog, setRemoveGroupDialog] = useState<{
    open: boolean
    group: (typeof mockWatchedGroups)[0] | null
  }>({ open: false, group: null })

  const [newCollectionName, setNewCollectionName] = useState("")

  const filteredGroups = mockWatchedGroups.filter((group) => {
    const matchesCollection = selectedCollection === "all" || group.collection === selectedCollection
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.axId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCollection && matchesSearch
  })

  const groupsWithChanges = filteredGroups.filter((g) => g.changes.length > 0).length

  const toggleGroupSelection = useCallback((groupId: string) => {
    setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }, [])

  const toggleAllSelection = useCallback(() => {
    if (selectedGroups.length === filteredGroups.length) {
      setSelectedGroups([])
    } else {
      setSelectedGroups(filteredGroups.map((g) => g.id))
    }
  }, [selectedGroups.length, filteredGroups])

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return
    const newCollection = {
      id: `collection-${Date.now()}`,
      name: newCollectionName,
      count: 0,
      color: "bg-blue-500",
    }
    setCollections([...collections, newCollection])
    setNewCollectionName("")
    setCreateCollectionDialog(false)
    toast({
      title: "Collection created",
      description: `"${newCollectionName}" has been created.`,
    })
  }

  const handleRenameCollection = () => {
    if (!renameCollectionDialog.collection || !newCollectionName.trim()) return
    setCollections(
      collections.map((c) => (c.id === renameCollectionDialog.collection!.id ? { ...c, name: newCollectionName } : c)),
    )
    setNewCollectionName("")
    setRenameCollectionDialog({ open: false, collection: null })
    toast({
      title: "Collection renamed",
      description: `Collection has been renamed to "${newCollectionName}".`,
    })
  }

  const handleDeleteCollection = () => {
    if (!deleteCollectionDialog.collection) return
    setCollections(collections.filter((c) => c.id !== deleteCollectionDialog.collection!.id))
    if (selectedCollection === deleteCollectionDialog.collection.id) {
      setSelectedCollection("all")
    }
    setDeleteCollectionDialog({ open: false, collection: null })
    toast({
      title: "Collection deleted",
      description: "The collection has been removed.",
    })
  }

  const handleCompareSelected = useCallback(() => {
    const axIds = selectedGroups
      .map((groupId) => {
        const group = mockWatchedGroups.find((g) => g.id === groupId)
        return group?.axId
      })
      .filter(Boolean)

    if (axIds.length >= 2) {
      router.push(`/compare?ids=${axIds.join(",")}`)
    }
  }, [selectedGroups, router])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden flex items-center gap-2 mb-4 bg-transparent">
                <Filter className="h-4 w-4" aria-hidden="true" />
                Collections
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80" hideCloseButton>
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
                <Plus className="h-4 w-4" aria-hidden="true" />
                New Collection
              </Button>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Search watched groups..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search watched groups"
                />
                {searchQuery && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Clear search"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Clear search</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            {/* Selection Bar - Disabled until >=2 selected, aria-live for count */}
            {selectedGroups.length > 0 && (
              <div
                className="flex items-center justify-between bg-accent/10 border border-accent/20 rounded-lg px-4 py-3 mb-4"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedGroups([])}
                          className="h-8 w-8 rounded-md bg-background flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Clear selection"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Clear selection</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-sm font-medium text-foreground">{selectedGroups.length} selected</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="gap-2 min-h-[40px]"
                        disabled={selectedGroups.length < 2}
                        aria-describedby={selectedGroups.length < 2 ? "compare-hint" : undefined}
                        onClick={handleCompareSelected}
                      >
                        <GitCompare className="h-4 w-4" aria-hidden="true" />
                        Compare Selected
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {selectedGroups.length < 2
                        ? "Select at least 2 groups to compare"
                        : `Compare ${selectedGroups.length} selected groups`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {selectedGroups.length < 2 && (
                  <span id="compare-hint" className="sr-only">
                    Select at least 2 groups to enable comparison
                  </span>
                )}
              </div>
            )}

            {/* Select All Row */}
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <Checkbox
                id="select-all"
                checked={selectedGroups.length === filteredGroups.length && filteredGroups.length > 0}
                onCheckedChange={toggleAllSelection}
                className="h-5 w-5"
                aria-label={
                  selectedGroups.length === filteredGroups.length ? "Deselect all groups" : "Select all groups"
                }
              />
              <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                Select all
              </label>
            </div>

            {/* Groups List */}
            <div className="space-y-3" role="list" aria-label="Watched people groups">
              {filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  role="listitem"
                  className={`p-4 md:p-5 transition-all hover:shadow-md ${
                    group.changes.length > 0 ? "border-l-4 border-l-accent" : ""
                  } ${selectedGroups.includes(group.id) ? "ring-2 ring-accent/50 bg-accent/5" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => toggleGroupSelection(group.id)}
                      className="mt-1 h-5 w-5"
                      aria-label={`Select ${group.name}`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <Link
                            href={`/profile/${group.id}`}
                            className="text-lg font-semibold text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            {group.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground font-mono">{group.axId}</span>
                            <span className="text-muted-foreground/50">·</span>
                            <div className="flex flex-wrap gap-1">
                              {group.countries.map((country) => (
                                <Badge key={country} variant="secondary" className="text-xs px-1.5 py-0">
                                  {country}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label={`Actions for ${group.name}`}
                                  >
                                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                                  </Button>
                                </DropdownMenuTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Actions</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/profile/${group.id}`} className="gap-2 cursor-pointer">
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => setRemoveGroupDialog({ open: true, group })}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                              Remove from Watchlist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3">
                        <Badge variant="outline" className={`${getEngagementColor(group.engagementStatus)}`}>
                          {normalizeEngagementStatus(group.engagementStatus)}
                        </Badge>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Users className="h-3.5 w-3.5" aria-hidden="true" />
                          <span aria-label={`Population: ${group.population.toLocaleString()}`}>
                            {group.population.toLocaleString()}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          Updated {group.lastUpdated}
                        </span>
                      </div>

                      {/* Change Indicators - Added tooltips explaining change logic */}
                      {group.changes.length > 0 && (
                        <div className="bg-muted/50 rounded-lg p-3 mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-accent" aria-hidden="true" />
                            <span className="text-sm font-medium text-foreground">Changes since you last viewed</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="h-4 w-4 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                                    aria-label="Learn about change indicators"
                                  >
                                    <Info className="h-4 w-4" aria-hidden="true" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>
                                    Changes are detected by comparing the current data with the snapshot from your last
                                    view of this group ({group.lastViewed}).
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.changes.includes("engagement") && group.engagementPrevious && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 bg-background rounded-md px-3 py-1.5 border border-border/50 cursor-help">
                                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                                      <span className="text-xs">
                                        <span className="text-muted-foreground">Engagement:</span>{" "}
                                        <span className="line-through text-muted-foreground/60">
                                          {normalizeEngagementStatus(group.engagementPrevious)}
                                        </span>{" "}
                                        <span className="font-medium text-foreground">
                                          {normalizeEngagementStatus(group.engagementStatus)}
                                        </span>
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Engagement status changed since {group.lastViewed}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {group.changes.includes("population") && group.populationChange !== null && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 bg-background rounded-md px-3 py-1.5 border border-border/50 cursor-help">
                                      {group.populationChange > 0 ? (
                                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                                      ) : (
                                        <ArrowDownRight className="h-3.5 w-3.5 text-red-500" aria-hidden="true" />
                                      )}
                                      <span className="text-xs">
                                        <span className="text-muted-foreground">Population:</span>{" "}
                                        <span
                                          className={`font-medium ${
                                            group.populationChange > 0
                                              ? "text-emerald-600 dark:text-emerald-400"
                                              : "text-red-600 dark:text-red-400"
                                          }`}
                                        >
                                          {group.populationChange > 0 ? "+" : ""}
                                          {group.populationChange.toLocaleString()}
                                        </span>
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Population estimate changed since {group.lastViewed}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {group.changes.includes("updated") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 bg-background rounded-md px-3 py-1.5 border border-border/50 cursor-help">
                                      <RefreshCw className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
                                      <span className="text-xs">
                                        <span className="text-muted-foreground">Data updated</span>{" "}
                                        <span className="font-medium text-foreground">{group.lastUpdated}</span>
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Source data was refreshed {group.lastUpdated}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Source Chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">Sources:</span>
                        {group.sources.map((source) => (
                          <Badge key={source} variant="outline" className="text-xs px-2 py-0.5 bg-muted/50">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No groups found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Add people groups to your watchlist to track changes."}
                </p>
              </div>
            )}
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
              <Label htmlFor="collection-name">Collection name</Label>
              <Input
                id="collection-name"
                placeholder="e.g., South Asia Focus"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCollectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Collection Dialog */}
      <Dialog
        open={renameCollectionDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setRenameCollectionDialog({ open: false, collection: null })
            setNewCollectionName("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Collection</DialogTitle>
            <DialogDescription>Enter a new name for this collection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-collection">Collection name</Label>
              <Input
                id="rename-collection"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRenameCollection()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameCollectionDialog({ open: false, collection: null })}>
              Cancel
            </Button>
            <Button onClick={handleRenameCollection} disabled={!newCollectionName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog
        open={deleteCollectionDialog.open}
        onOpenChange={(open) => {
          if (!open) setDeleteCollectionDialog({ open: false, collection: null })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteCollectionDialog.collection?.name}&quot;? The people groups
              will remain in your watchlist.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCollectionDialog({ open: false, collection: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Group Dialog */}
      <Dialog
        open={removeGroupDialog.open}
        onOpenChange={(open) => {
          if (!open) setRemoveGroupDialog({ open: false, group: null })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Watchlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &quot;{removeGroupDialog.group?.name}&quot; from your watchlist?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveGroupDialog({ open: false, group: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast({
                  title: "Removed from watchlist",
                  description: `"${removeGroupDialog.group?.name}" has been removed.`,
                })
                setRemoveGroupDialog({ open: false, group: null })
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

// Collections Sidebar Component
function CollectionsSidebar({
  collections,
  selectedCollection,
  setSelectedCollection,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection,
}: {
  collections: typeof mockCollections
  selectedCollection: string
  setSelectedCollection: (id: string) => void
  onCreateCollection: () => void
  onRenameCollection: (collection: (typeof mockCollections)[0]) => void
  onDeleteCollection: (collection: (typeof mockCollections)[0]) => void
}) {
  return (
    <div className="space-y-4">
      {/* Collections List */}
      <nav aria-label="Collections">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Collections</h2>
        <div className="space-y-1" role="listbox" aria-label="Select collection">
          {collections.map((collection) => (
            <div key={collection.id} className="group flex items-center gap-2">
              <button
                onClick={() => setSelectedCollection(collection.id)}
                role="option"
                aria-selected={selectedCollection === collection.id}
                className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedCollection === collection.id
                    ? "bg-accent/10 text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className={`h-2.5 w-2.5 rounded-full ${collection.color}`} aria-hidden="true" />
                <span className="flex-1 text-left truncate">{collection.name}</span>
                <span className="text-xs tabular-nums">{collection.count}</span>
              </button>
              {collection.id !== "all" && (
                <DropdownMenu>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label={`Actions for ${collection.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Collection actions</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onRenameCollection(collection)}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => onDeleteCollection(collection)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Create Collection Button */}
      <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={onCreateCollection}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Collection
      </Button>

      {/* Legend */}
      <div className="pt-4 border-t border-border/50">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Change Indicators</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            <span>Engagement improved</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            <span>Population increased</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-3.5 w-3.5 text-red-500" aria-hidden="true" />
            <span>Population decreased</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
            <span>Data updated</span>
          </div>
        </div>
      </div>
    </div>
  )
}
