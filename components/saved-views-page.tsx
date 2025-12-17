"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Folder,
  FolderOpen,
  Tag,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Copy,
  Trash2,
  Share2,
  Globe,
  Lock,
  Clock,
  Filter,
  X,
  Check,
  Users,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { AppLayout } from "@/components/app-layout"
import { APP_URL } from "@/lib/constants"

const initialFolders = [
  { id: "all", name: "All Views", count: 12, icon: Folder },
  { id: "research", name: "Research", count: 4, icon: Folder },
  { id: "priority", name: "Priority Lists", count: 3, icon: Folder },
  { id: "regional", name: "Regional Focus", count: 3, icon: Folder },
  { id: "shared", name: "Shared with Me", count: 2, icon: Folder },
]

const initialTags = [
  { id: "unreached", name: "Unreached", color: "bg-red-500", count: 5 },
  { id: "language", name: "Language Study", color: "bg-blue-500", count: 3 },
  { id: "frontier", name: "Frontier", color: "bg-amber-500", count: 4 },
  { id: "engagement", name: "Engagement", color: "bg-emerald-500", count: 2 },
]

const tagColorOptions = [
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Amber", value: "bg-amber-500" },
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Gray", value: "bg-gray-500" },
]

const initialSavedViews = [
  {
    id: 1,
    name: "Unreached in South Asia",
    description: "Focus on unreached people groups in India, Pakistan, Bangladesh, and Nepal with population > 100k",
    tags: ["Unreached", "Frontier"],
    folder: "priority",
    lastRun: "2 hours ago",
    resultCount: 847,
    shareStatus: "private" as const,
    createdBy: "You",
    filters: ["Countries: India, Pakistan, Bangladesh, Nepal", "Status: Unreached", "Population: >100k"],
  },
  {
    id: 2,
    name: "Mandarin Language Cluster",
    description: "All people groups with Mandarin as primary or secondary language",
    tags: ["Language Study"],
    folder: "research",
    lastRun: "Yesterday",
    resultCount: 234,
    shareStatus: "team" as const,
    createdBy: "You",
    filters: ["Language: Mandarin Chinese", "Include dialects: Yes"],
  },
  {
    id: 3,
    name: "Southeast Asia Engagement",
    description: "Tracking engagement status across Southeast Asian nations",
    tags: ["Engagement"],
    folder: "regional",
    lastRun: "3 days ago",
    resultCount: 1289,
    shareStatus: "public" as const,
    createdBy: "You",
    filters: ["Region: Southeast Asia", "Status: All"],
  },
  {
    id: 4,
    name: "Frontier Peoples Priority",
    description: "Frontier unreached peoples with no known believers and limited access",
    tags: ["Frontier", "Unreached"],
    folder: "priority",
    lastRun: "Last week",
    resultCount: 312,
    shareStatus: "private" as const,
    createdBy: "You",
    filters: ["Status: Frontier", "Believers: None known", "Access: Limited"],
  },
  {
    id: 5,
    name: "Arabic Speaking Groups",
    description: "People groups across MENA region with Arabic language family",
    tags: ["Language Study"],
    folder: "research",
    lastRun: "2 weeks ago",
    resultCount: 567,
    shareStatus: "team" as const,
    createdBy: "Sarah M.",
    filters: ["Language Family: Arabic", "Region: Middle East & North Africa"],
  },
  {
    id: 6,
    name: "High Data Quality Records",
    description: "People groups with verified data from multiple sources",
    tags: [],
    folder: "research",
    lastRun: "1 month ago",
    resultCount: 4521,
    shareStatus: "private" as const,
    createdBy: "You",
    filters: ["Data Quality: A or B", "Sources: 3+"],
  },
]

type SavedView = (typeof initialSavedViews)[number]
type FolderItem = (typeof initialFolders)[number]
type TagItem = (typeof initialTags)[number]

export function SavedViewsPage() {
  const { toast } = useToast()

  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [tags, setTags] = useState<TagItem[]>(initialTags)
  const [savedViews, setSavedViews] = useState<SavedView[]>(initialSavedViews)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Dialog states
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; view: SavedView | null }>({
    open: false,
    view: null,
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; view: SavedView | null }>({
    open: false,
    view: null,
  })
  const [shareDialog, setShareDialog] = useState<{ open: boolean; view: SavedView | null }>({
    open: false,
    view: null,
  })
  const [linkCopied, setLinkCopied] = useState(false)

  const [newViewDialog, setNewViewDialog] = useState(false)
  const [newFolderDialog, setNewFolderDialog] = useState(false)
  const [newTagDialog, setNewTagDialog] = useState(false)

  const [newViewForm, setNewViewForm] = useState({
    name: "",
    description: "",
    folder: "all",
    tags: [] as string[],
    visibility: "private" as "private" | "team" | "public",
  })
  const [newFolderName, setNewFolderName] = useState("")
  const [newTagForm, setNewTagForm] = useState({ name: "", color: "bg-blue-500" })

  // Rename form state
  const [renameForm, setRenameForm] = useState({ name: "", description: "" })

  const filteredViews = savedViews.filter((view) => {
    const matchesSearch =
      view.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      view.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = selectedFolder === "all" || view.folder === selectedFolder
    const matchesTag = !selectedTag || view.tags.includes(selectedTag)
    return matchesSearch && matchesFolder && matchesTag
  })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${APP_URL}/view/${shareDialog.view?.id}`)
    setLinkCopied(true)
    toast({ title: "Link copied", description: "Share link has been copied to clipboard." })
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleCreateView = () => {
    if (!newViewForm.name.trim()) {
      toast({ title: "Name required", description: "Please enter a name for the view.", variant: "destructive" })
      return
    }

    const newView: SavedView = {
      id: Date.now(),
      name: newViewForm.name,
      description: newViewForm.description,
      tags: newViewForm.tags,
      folder: newViewForm.folder,
      lastRun: "Just now",
      resultCount: 0,
      shareStatus: newViewForm.visibility,
      createdBy: "You",
      filters: [],
    }

    setSavedViews([newView, ...savedViews])
    setNewViewDialog(false)
    setNewViewForm({ name: "", description: "", folder: "all", tags: [], visibility: "private" })
    toast({ title: "View created", description: `"${newView.name}" has been created.` })
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({ title: "Name required", description: "Please enter a folder name.", variant: "destructive" })
      return
    }

    const newFolder: FolderItem = {
      id: newFolderName.toLowerCase().replace(/\s+/g, "-"),
      name: newFolderName,
      count: 0,
      icon: Folder,
    }

    setFolders([...folders, newFolder])
    setNewFolderDialog(false)
    setNewFolderName("")
    toast({ title: "Folder created", description: `"${newFolder.name}" has been created.` })
  }

  const handleCreateTag = () => {
    if (!newTagForm.name.trim()) {
      toast({ title: "Name required", description: "Please enter a tag name.", variant: "destructive" })
      return
    }

    const newTag: TagItem = {
      id: newTagForm.name.toLowerCase().replace(/\s+/g, "-"),
      name: newTagForm.name,
      color: newTagForm.color,
      count: 0,
    }

    setTags([...tags, newTag])
    setNewTagDialog(false)
    setNewTagForm({ name: "", color: "bg-blue-500" })
    toast({ title: "Tag created", description: `"${newTag.name}" has been created.` })
  }

  const handleOpenView = (view: SavedView) => {
    toast({ title: "Opening view...", description: `Loading "${view.name}" results.` })
  }

  const handleDuplicateView = (view: SavedView) => {
    const duplicatedView: SavedView = {
      ...view,
      id: Date.now(),
      name: `${view.name} (Copy)`,
      lastRun: "Just now",
      createdBy: "You",
    }
    setSavedViews([duplicatedView, ...savedViews])
    toast({ title: "View duplicated", description: `"${duplicatedView.name}" has been created.` })
  }

  const handleRenameView = () => {
    if (!renameForm.name.trim()) {
      toast({ title: "Name required", description: "Please enter a name.", variant: "destructive" })
      return
    }

    setSavedViews(
      savedViews.map((v) =>
        v.id === renameDialog.view?.id ? { ...v, name: renameForm.name, description: renameForm.description } : v,
      ),
    )
    setRenameDialog({ open: false, view: null })
    toast({ title: "View renamed", description: "Your changes have been saved." })
  }

  const handleDeleteView = () => {
    if (deleteDialog.view) {
      setSavedViews(savedViews.filter((v) => v.id !== deleteDialog.view?.id))
      toast({ title: "View deleted", description: `"${deleteDialog.view.name}" has been deleted.` })
    }
    setDeleteDialog({ open: false, view: null })
  }

  const toggleTagInForm = (tagName: string) => {
    setNewViewForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagName) ? prev.tags.filter((t) => t !== tagName) : [...prev.tags, tagName],
    }))
  }

  const getShareIcon = (status: string) => {
    switch (status) {
      case "public":
        return <Globe className="h-3.5 w-3.5" />
      case "team":
        return <Users className="h-3.5 w-3.5" />
      default:
        return <Lock className="h-3.5 w-3.5" />
    }
  }

  const getShareLabel = (status: string) => {
    switch (status) {
      case "public":
        return "Public"
      case "team":
        return "Team"
      default:
        return "Private"
    }
  }

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden flex items-center gap-2 mb-4 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Folders & Tags
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Folders & Tags</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SidebarContent
                    folders={folders}
                    tags={tags}
                    selectedFolder={selectedFolder}
                    setSelectedFolder={setSelectedFolder}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    onNewFolder={() => setNewFolderDialog(true)}
                    onNewTag={() => setNewTagDialog(true)}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <SidebarContent
                  folders={folders}
                  tags={tags}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                  onNewFolder={() => setNewFolderDialog(true)}
                  onNewTag={() => setNewTagDialog(true)}
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">Saved Views</h1>
                  <p className="text-muted-foreground mt-1">
                    {filteredViews.length} saved {filteredViews.length === 1 ? "view" : "views"}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="gap-2 min-h-[44px]"
                      onClick={() => setNewViewDialog(true)}
                      aria-label="Create new view"
                    >
                      <Plus className="h-4 w-4" />
                      New View
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Create new view</TooltipContent>
                </Tooltip>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search saved views..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search saved views"
                />
                {searchQuery && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-secondary flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Clear search</TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Active Filters */}
              {(selectedFolder !== "all" || selectedTag) && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-muted-foreground">Filtered by:</span>
                  {selectedFolder !== "all" && (
                    <Badge variant="secondary" className="gap-1.5 pr-1.5">
                      <Folder className="h-3 w-3" />
                      {folders.find((f) => f.id === selectedFolder)?.name}
                      <button
                        onClick={() => setSelectedFolder("all")}
                        className="ml-1 h-4 w-4 rounded-full hover:bg-muted-foreground/20 flex items-center justify-center"
                        aria-label="Remove folder filter"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  )}
                  {selectedTag && (
                    <Badge variant="secondary" className="gap-1.5 pr-1.5">
                      <Tag className="h-3 w-3" />
                      {selectedTag}
                      <button
                        onClick={() => setSelectedTag(null)}
                        className="ml-1 h-4 w-4 rounded-full hover:bg-muted-foreground/20 flex items-center justify-center"
                        aria-label="Remove tag filter"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Views List */}
              <div className="space-y-3">
                {filteredViews.map((view) => (
                  <Card key={view.id} className="p-4 md:p-5 hover:shadow-md transition-shadow border-border/50 group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex items-start gap-3 mb-2">
                          <button
                            onClick={() => handleOpenView(view)}
                            className="text-lg font-semibold text-foreground hover:text-accent transition-colors truncate text-left"
                          >
                            {view.name}
                          </button>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 cursor-default">
                                {getShareIcon(view.shareStatus)}
                                <span className="text-xs">{getShareLabel(view.shareStatus)}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{getShareLabel(view.shareStatus)} visibility</TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{view.description}</p>

                        {/* Tags */}
                        {view.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {view.tags.map((tag) => {
                              const tagData = tags.find((t) => t.name === tag)
                              return (
                                <Badge key={tag} variant="outline" className="text-xs gap-1.5 font-normal">
                                  <span className={`h-2 w-2 rounded-full ${tagData?.color || "bg-muted-foreground"}`} />
                                  {tag}
                                </Badge>
                              )
                            })}
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Last run {view.lastRun}
                          </span>
                          <span>{view.resultCount.toLocaleString()} results</span>
                          <span>Created by {view.createdBy}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 min-h-[36px] bg-transparent"
                              onClick={() => handleOpenView(view)}
                              aria-label={`Open ${view.name}`}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Open
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Open view</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="More actions">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>More actions</TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setRenameForm({ name: view.name, description: view.description })
                                setRenameDialog({ open: true, view })
                              }}
                              className="gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateView(view)} className="gap-2">
                              <Copy className="h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShareDialog({ open: true, view })} className="gap-2">
                              <Share2 className="h-4 w-4" />
                              Share settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ open: true, view })}
                              className="gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Filter Pills Preview */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex flex-wrap gap-2">
                        {view.filters.map((filter, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs font-normal">
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredViews.length === 0 && (
                <div className="text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No views found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedFolder("all")
                      setSelectedTag(null)
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>

        <Dialog open={newViewDialog} onOpenChange={setNewViewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New view</DialogTitle>
              <DialogDescription>Create a new saved view to organize your searches.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-view-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="new-view-name"
                  placeholder="Enter view name"
                  value={newViewForm.name}
                  onChange={(e) => setNewViewForm({ ...newViewForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-view-description">Description</Label>
                <Textarea
                  id="new-view-description"
                  placeholder="Optional description"
                  rows={2}
                  value={newViewForm.description}
                  onChange={(e) => setNewViewForm({ ...newViewForm, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-view-folder">Folder</Label>
                <Select
                  value={newViewForm.folder}
                  onValueChange={(value) => setNewViewForm({ ...newViewForm, folder: value })}
                >
                  <SelectTrigger id="new-view-folder">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTagInForm(tag.name)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs border transition-colors ${
                        newViewForm.tags.includes(tag.name)
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${tag.color}`} />
                      {tag.name}
                      {newViewForm.tags.includes(tag.name) && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: "private", icon: Lock, label: "Private", desc: "Only you can access" },
                    { value: "team", icon: Users, label: "Team", desc: "Anyone in your organization" },
                    { value: "public", icon: Globe, label: "Public", desc: "Anyone with the link" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        newViewForm.visibility === option.value
                          ? "border-accent bg-accent/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="new-visibility"
                        value={option.value}
                        checked={newViewForm.visibility === option.value}
                        onChange={() => setNewViewForm({ ...newViewForm, visibility: option.value as any })}
                        className="h-4 w-4"
                      />
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewViewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateView}>Create view</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={newFolderDialog} onOpenChange={setNewFolderDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>New folder</DialogTitle>
              <DialogDescription>Create a new folder to organize your views.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-folder-name">
                  Folder name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="new-folder-name"
                  placeholder="Enter folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewFolderDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create folder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={newTagDialog} onOpenChange={setNewTagDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>New tag</DialogTitle>
              <DialogDescription>Create a new tag with a color.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-tag-name">
                  Tag name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="new-tag-name"
                  placeholder="Enter tag name"
                  value={newTagForm.name}
                  onChange={(e) => setNewTagForm({ ...newTagForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {tagColorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewTagForm({ ...newTagForm, color: color.value })}
                      className={`h-8 w-8 rounded-full ${color.value} flex items-center justify-center transition-transform hover:scale-110 ${
                        newTagForm.color === color.value ? "ring-2 ring-offset-2 ring-accent" : ""
                      }`}
                      aria-label={`Select ${color.name} color`}
                    >
                      {newTagForm.color === color.value && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTagDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTag}>Create tag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rename Dialog */}
        <Dialog open={renameDialog.open} onOpenChange={(open) => setRenameDialog({ open, view: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename View</DialogTitle>
              <DialogDescription>Update the name and description for this saved view.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rename-name">Name</Label>
                <Input
                  id="rename-name"
                  value={renameForm.name}
                  onChange={(e) => setRenameForm({ ...renameForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rename-description">Description</Label>
                <Textarea
                  id="rename-description"
                  value={renameForm.description}
                  onChange={(e) => setRenameForm({ ...renameForm, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameDialog({ open: false, view: null })}>
                Cancel
              </Button>
              <Button onClick={handleRenameView}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, view: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete View</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deleteDialog.view?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false, view: null })}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteView}>
                Delete View
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={shareDialog.open} onOpenChange={(open) => setShareDialog({ open, view: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share View</DialogTitle>
              <DialogDescription>Share this view with others using a link.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input readOnly value={`${APP_URL}/view/${shareDialog.view?.id}`} className="flex-1" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleCopyLink}
                        className="gap-2 shrink-0 bg-transparent"
                        aria-label="Copy link"
                      >
                        {linkCopied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy link to clipboard</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                    <input type="radio" name="visibility" value="private" className="h-4 w-4" defaultChecked />
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Private</p>
                      <p className="text-xs text-muted-foreground">Only you can access</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                    <input type="radio" name="visibility" value="team" className="h-4 w-4" />
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Team</p>
                      <p className="text-xs text-muted-foreground">Anyone with the link in your organization</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                    <input type="radio" name="visibility" value="public" className="h-4 w-4" />
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Public</p>
                      <p className="text-xs text-muted-foreground">Anyone with the link</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShareDialog({ open: false, view: null })}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </AppLayout>
  )
}

function SidebarContent({
  folders,
  tags,
  selectedFolder,
  setSelectedFolder,
  selectedTag,
  setSelectedTag,
  onNewFolder,
  onNewTag,
}: {
  folders: FolderItem[]
  tags: TagItem[]
  selectedFolder: string
  setSelectedFolder: (folder: string) => void
  selectedTag: string | null
  setSelectedTag: (tag: string | null) => void
  onNewFolder: () => void
  onNewTag: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Folders Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Folders</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onNewFolder}
                aria-label="Create new folder"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create new folder</TooltipContent>
          </Tooltip>
        </div>
        <nav className="space-y-1">
          {folders.map((folder) => {
            const isSelected = selectedFolder === folder.id
            const Icon = isSelected ? FolderOpen : folder.icon
            return (
              <Tooltip key={folder.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] ${
                      isSelected ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`}
                    aria-label={`${folder.name} folder with ${folder.count} views`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      {folder.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {folder.count}
                    </Badge>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{folder.name}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </div>

      {/* Tags Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tags</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onNewTag} aria-label="Create new tag">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create new tag</TooltipContent>
          </Tooltip>
        </div>
        <div className="space-y-1">
          {tags.map((tag) => {
            const isSelected = selectedTag === tag.name
            return (
              <Tooltip key={tag.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSelectedTag(isSelected ? null : tag.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] ${
                      isSelected ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`}
                    aria-label={`${tag.name} tag with ${tag.count} views`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${tag.color}`} />
                      {tag.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {tag.count}
                    </Badge>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{tag.name}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent"
              asChild
              aria-label="Start a new search"
            >
              <Link href="/search">
                <Search className="h-4 w-4" />
                New Search
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Start a new search</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
