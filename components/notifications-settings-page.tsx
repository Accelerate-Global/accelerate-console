"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useCallback } from "react"
import { Bell, Mail, Smartphone, Users, TrendingUp, Database, RefreshCw, Clock, Settings2, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { AppLayout } from "@/components/app-layout"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ChangeTypeConfig {
  id: string
  label: string
  description: string
  icon: typeof TrendingUp
}

interface WatchlistItem {
  id: string
  name: string
  itemCount: number
  hasOverride: boolean
}

interface WatchlistOverrideSettings {
  frequency: string
  changeTypes: string[]
}

interface NotificationSettings {
  enabled: boolean
  emailEnabled: boolean
  changeTypes: Record<string, boolean>
  populationThreshold: string
  frequency: string
  deliveryTime: string
  deliveryDay: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CHANGE_TYPES: ChangeTypeConfig[] = [
  {
    id: "engagement",
    label: "Engagement status changes",
    description: "When a people group's engagement status changes",
    icon: TrendingUp,
  },
  {
    id: "population",
    label: "Population threshold changes",
    description: "When population estimates change beyond your threshold",
    icon: Users,
  },
  {
    id: "dataQuality",
    label: "Data quality changes",
    description: "When data quality ratings improve or decline",
    icon: Database,
  },
  {
    id: "recordUpdates",
    label: "Record updates",
    description: "When any field on a watched people group is updated",
    icon: RefreshCw,
  },
]

const WATCHLISTS: WatchlistItem[] = [
  { id: "1", name: "South Asia Priority", itemCount: 156, hasOverride: false },
  { id: "2", name: "Unreached Frontier Peoples", itemCount: 312, hasOverride: true },
  { id: "3", name: "Southeast Asia Watch", itemCount: 89, hasOverride: false },
  { id: "4", name: "Arabic Speaking Groups", itemCount: 234, hasOverride: true },
  { id: "5", name: "High Priority Research", itemCount: 45, hasOverride: false },
]

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  emailEnabled: true,
  changeTypes: {
    engagement: true,
    population: true,
    dataQuality: false,
    recordUpdates: false,
  },
  populationThreshold: "10",
  frequency: "daily",
  deliveryTime: "09:00",
  deliveryDay: "monday",
}

// ─────────────────────────────────────────────────────────────────────────────
// Sticky Save Bar Component
// ─────────────────────────────────────────────────────────────────────────────

function StickySaveBar({
  isDirty,
  onSave,
  onCancel,
}: {
  isDirty: boolean
  onSave: () => void
  onCancel: () => void
}) {
  if (!isDirty) return null

  return (
    <>
      {/* Desktop: bottom sticky bar */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">You have unsaved changes</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onCancel} className="min-h-[44px]">
              Cancel
            </Button>
            <Button onClick={onSave} className="min-h-[44px]">
              Save changes
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: top sticky bar */}
      <div className="md:hidden fixed top-14 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Unsaved changes</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel} className="min-h-[44px]">
              Cancel
            </Button>
            <Button size="sm" onClick={onSave} className="min-h-[44px]">
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Watchlist Override Sheet Component
// ─────────────────────────────────────────────────────────────────────────────

function WatchlistOverrideSheet({
  watchlist,
  open,
  onOpenChange,
}: {
  watchlist: WatchlistItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { toast } = useToast()
  const [overrideFrequency, setOverrideFrequency] = useState("daily")
  const [overrideChangeTypes, setOverrideChangeTypes] = useState<Record<string, boolean>>({
    engagement: true,
    population: true,
    dataQuality: false,
    recordUpdates: false,
  })

  const handleSaveOverride = () => {
    toast({
      title: "Override saved (placeholder)",
      description: `Custom settings for "${watchlist?.name}" have been saved.`,
    })
    onOpenChange(false)
  }

  const toggleOverrideChangeType = (id: string) => {
    setOverrideChangeTypes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (!watchlist) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border shrink-0">
          <div className="flex items-center justify-between p-6">
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-lg font-semibold truncate">Customize: {watchlist.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{watchlist.itemCount} people groups</p>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 -mr-2 cursor-pointer inline-flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-6">
            {/* Override Frequency Card */}
            <div className="rounded-lg border border-border p-4">
              <Label className="text-sm font-medium mb-4 block">Notification Frequency</Label>
              <RadioGroup value={overrideFrequency} onValueChange={setOverrideFrequency} className="space-y-2">
                <label
                  htmlFor="override-immediate"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${
                    overrideFrequency === "immediate"
                      ? "border-accent/50 bg-accent/5"
                      : "border-border border-border hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value="immediate" id="override-immediate" />
                  <span className="text-sm">Immediate</span>
                </label>
                <label
                  htmlFor="override-daily"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${
                    overrideFrequency === "daily" ? "border-accent/50 bg-accent/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value="daily" id="override-daily" />
                  <span className="text-sm">Daily digest</span>
                </label>
                <label
                  htmlFor="override-weekly"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${
                    overrideFrequency === "weekly" ? "border-accent/50 bg-accent/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value="weekly" id="override-weekly" />
                  <span className="text-sm">Weekly digest</span>
                </label>
              </RadioGroup>
            </div>

            {/* Override Change Types Card */}
            <div className="rounded-lg border border-border p-4">
              <Label className="text-sm font-medium mb-4 block">Change Types</Label>
              <div className="space-y-2">
                {CHANGE_TYPES.map((type) => (
                  <label
                    key={type.id}
                    htmlFor={`override-${type.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${
                      overrideChangeTypes[type.id] ? "border-accent/50 bg-accent/5" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      id={`override-${type.id}`}
                      checked={overrideChangeTypes[type.id]}
                      onCheckedChange={() => toggleOverrideChangeType(type.id)}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Sticky Footer with safe-area padding */}
        <div className="sticky bottom-0 z-10 bg-background border-t border-border shrink-0 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-12 cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleSaveOverride} className="flex-1 h-12 cursor-pointer">
              Save override
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function NotificationsSettingsPage() {
  const { toast } = useToast()

  // Settings state
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS)
  const [savedSettings, setSavedSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS)

  // UI state
  const [overrideSheet, setOverrideSheet] = useState<{
    open: boolean
    watchlist: WatchlistItem | null
  }>({ open: false, watchlist: null })

  // Dirty state tracking
  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings)

  // Handlers
  const handleSave = useCallback(() => {
    setSavedSettings({ ...settings })
    toast({
      title: "Saved (placeholder)",
      description: "Your notification preferences have been saved.",
    })
  }, [settings, toast])

  const handleCancel = useCallback(() => {
    setSettings({ ...savedSettings })
  }, [savedSettings])

  const updateSetting = <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const toggleChangeType = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      changeTypes: {
        ...prev.changeTypes,
        [id]: !prev.changeTypes[id],
      },
    }))
  }

  const openOverrideSheet = (watchlist: WatchlistItem) => {
    setOverrideSheet({ open: true, watchlist })
  }

  const handleManageWatchlists = () => {
    toast({
      title: "Coming soon",
      description: "Watchlist management will be available in a future update.",
    })
  }

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground mt-2 text-balance">
                Configure how and when you receive updates about watched people groups.
              </p>
            </header>

            <div className="space-y-6 pb-32 md:pb-24">
              {/* ───────────────────────────────────────────────────────────────
                  Card 1: Delivery Channels
              ─────────────────────────────────────────────────────────────── */}
              <Card className="p-6 border-border/50">
                <h2 className="text-lg font-semibold text-foreground mb-1">Delivery Channels</h2>
                <p className="text-sm text-muted-foreground mb-6">Choose how you want to receive notifications.</p>

                <div className="space-y-4">
                  {/* Master Toggle */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Bell className="h-5 w-5 text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <Label htmlFor="notifications-enabled" className="font-medium text-foreground cursor-pointer">
                          Enable notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your watched people groups
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="notifications-enabled"
                      checked={settings.enabled}
                      onCheckedChange={(checked) => updateSetting("enabled", checked)}
                      aria-label="Enable notifications"
                    />
                  </div>

                  {/* Email Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex items-center justify-between gap-4 p-4 rounded-lg border border-border/50 transition-opacity ${
                          !settings.enabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                          </div>
                          <div>
                            <Label
                              htmlFor="email-enabled"
                              className={`font-medium text-foreground ${
                                !settings.enabled ? "cursor-not-allowed" : "cursor-pointer"
                              }`}
                            >
                              Email
                            </Label>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                        </div>
                        <Switch
                          id="email-enabled"
                          checked={settings.emailEnabled}
                          onCheckedChange={(checked) => updateSetting("emailEnabled", checked)}
                          disabled={!settings.enabled}
                          aria-label="Enable email notifications"
                        />
                      </div>
                    </TooltipTrigger>
                    {!settings.enabled && <TooltipContent>Enable notifications first</TooltipContent>}
                  </Tooltip>

                  {/* In-app Placeholder (disabled) */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/50 opacity-50 cursor-not-allowed">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Smartphone className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                          </div>
                          <div>
                            <Label className="font-medium text-foreground cursor-not-allowed">In-app</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                          </div>
                        </div>
                        <Switch disabled aria-label="In-app notifications (coming soon)" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Coming soon</TooltipContent>
                  </Tooltip>
                </div>
              </Card>

              {/* ───────────────────────────────────────────────────────────────
                  Card 2: Change Types
              ─────────────────────────────────────────────────────────────── */}
              <Card
                className={`p-6 border-border/50 transition-opacity ${
                  !settings.enabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <h2 className="text-lg font-semibold text-foreground mb-1">Change Types</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Select which types of changes you want to be notified about.
                </p>

                <div className="space-y-3">
                  {CHANGE_TYPES.map((type) => {
                    const isPopulation = type.id === "population"
                    const isChecked = settings.changeTypes[type.id]

                    return (
                      <div key={type.id}>
                        <label
                          htmlFor={`change-${type.id}`}
                          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                            isChecked ? "border-accent/50 bg-accent/5" : "border-border/50 hover:bg-muted/50"
                          }`}
                        >
                          <Checkbox
                            id={`change-${type.id}`}
                            checked={isChecked}
                            onCheckedChange={() => toggleChangeType(type.id)}
                            className="mt-0.5"
                            aria-label={type.label}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                              <span className="font-medium text-foreground">{type.label}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                          </div>
                        </label>

                        {/* Population threshold input */}
                        {isPopulation && isChecked && (
                          <div className="ml-10 mt-3 flex items-center gap-3">
                            <Label
                              htmlFor="population-threshold"
                              className="text-sm text-muted-foreground whitespace-nowrap"
                            >
                              Threshold:
                            </Label>
                            <Input
                              id="population-threshold"
                              type="number"
                              min="1"
                              max="100"
                              value={settings.populationThreshold}
                              onChange={(e) => updateSetting("populationThreshold", e.target.value)}
                              className="w-20 h-9"
                              aria-label="Population change threshold percentage"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Threshold help">
                                  <span className="text-xs text-muted-foreground">?</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                You&apos;ll be notified when population estimates change by more than this percentage.
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* ───────────────────────────────────────────────────────────────
                  Card 3: Frequency
              ─────────────────────────────────────────────────────────────── */}
              <Card
                className={`p-6 border-border/50 transition-opacity ${
                  !settings.enabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <h2 className="text-lg font-semibold text-foreground mb-1">Frequency</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose how often you want to receive notifications.
                </p>

                <RadioGroup
                  value={settings.frequency}
                  onValueChange={(value) => updateSetting("frequency", value)}
                  className="space-y-3"
                >
                  {/* Immediate */}
                  <label
                    htmlFor="freq-immediate"
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      settings.frequency === "immediate"
                        ? "border-accent/50 bg-accent/5"
                        : "border-border/50 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="immediate" id="freq-immediate" />
                    <div className="flex-1">
                      <span className="font-medium text-foreground">Immediate</span>
                      <p className="text-sm text-muted-foreground">Receive notifications as changes happen</p>
                    </div>
                  </label>

                  {/* Daily Digest */}
                  <label
                    htmlFor="freq-daily"
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      settings.frequency === "daily"
                        ? "border-accent/50 bg-accent/5"
                        : "border-border/50 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="daily" id="freq-daily" />
                    <div className="flex-1">
                      <span className="font-medium text-foreground">Daily digest</span>
                      <p className="text-sm text-muted-foreground">One email per day summarizing all changes</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Recommended
                    </Badge>
                  </label>

                  {/* Weekly Digest */}
                  <label
                    htmlFor="freq-weekly"
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      settings.frequency === "weekly"
                        ? "border-accent/50 bg-accent/5"
                        : "border-border/50 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="weekly" id="freq-weekly" />
                    <div className="flex-1">
                      <span className="font-medium text-foreground">Weekly digest</span>
                      <p className="text-sm text-muted-foreground">One email per week summarizing all changes</p>
                    </div>
                  </label>
                </RadioGroup>

                {/* Delivery Time (Daily) */}
                {settings.frequency === "daily" && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <div className="flex-1">
                        <Label htmlFor="delivery-time" className="text-sm font-medium">
                          Delivery time
                        </Label>
                        <div className="flex items-center gap-3 mt-2">
                          <Select
                            value={settings.deliveryTime}
                            onValueChange={(value) => updateSetting("deliveryTime", value)}
                          >
                            <SelectTrigger id="delivery-time" className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="06:00">6:00 AM</SelectItem>
                              <SelectItem value="09:00">9:00 AM</SelectItem>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="18:00">6:00 PM</SelectItem>
                              <SelectItem value="21:00">9:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">Your local time</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Day + Time (Weekly) */}
                {settings.frequency === "weekly" && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <div className="flex-1">
                        <Label htmlFor="delivery-day" className="text-sm font-medium">
                          Delivery day
                        </Label>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <Select
                            value={settings.deliveryDay}
                            onValueChange={(value) => updateSetting("deliveryDay", value)}
                          >
                            <SelectTrigger id="delivery-day" className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">Wednesday</SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                              <SelectItem value="saturday">Saturday</SelectItem>
                              <SelectItem value="sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">at</span>
                          <Select
                            value={settings.deliveryTime}
                            onValueChange={(value) => updateSetting("deliveryTime", value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="06:00">6:00 AM</SelectItem>
                              <SelectItem value="09:00">9:00 AM</SelectItem>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="18:00">6:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">Your local time</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* ───────────────────────────────────────────────────────────────
                  Card 4: Watchlist Overrides
              ─────────────────────────────────────────────────────────────── */}
              <Card
                className={`p-6 border-border/50 transition-opacity ${
                  !settings.enabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Watchlist Overrides</h2>
                    <p className="text-sm text-muted-foreground">
                      Customize notification settings for specific watchlists.
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManageWatchlists}
                        className="shrink-0 min-h-[36px] bg-transparent"
                        aria-disabled="true"
                      >
                        Manage watchlists
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Coming soon</TooltipContent>
                  </Tooltip>
                </div>

                <div className="space-y-2">
                  {WATCHLISTS.map((watchlist) => (
                    <div
                      key={watchlist.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{watchlist.name}</p>
                          <p className="text-sm text-muted-foreground">{watchlist.itemCount} people groups</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {watchlist.hasOverride && (
                          <Badge variant="outline" className="text-xs text-accent border-accent/30">
                            Custom
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openOverrideSheet(watchlist)}
                          className="min-h-[36px] gap-1.5"
                          aria-label={`Customize notifications for ${watchlist.name}`}
                        >
                          <Settings2 className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden sm:inline">Customize</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Sticky Save Bar */}
          <StickySaveBar isDirty={isDirty} onSave={handleSave} onCancel={handleCancel} />

          {/* Watchlist Override Sheet */}
          <WatchlistOverrideSheet
            watchlist={overrideSheet.watchlist}
            open={overrideSheet.open}
            onOpenChange={(open) =>
              setOverrideSheet((prev) => ({ ...prev, open, watchlist: open ? prev.watchlist : null }))
            }
          />
        </div>
      </TooltipProvider>
    </AppLayout>
  )
}
