"use client"

import { TooltipProvider } from "@/components/ui/tooltip"

import { useState } from "react"
import { Bell, Mail, Users, TrendingUp, Database, Calendar, ChevronDown, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AppLayout } from "@/components/app-layout"

const changeTypes = [
  {
    id: "engagement",
    name: "Engagement Status Changes",
    description: "Get notified when a people group's engagement status changes (e.g., Unreached to Engaged)",
    icon: TrendingUp,
    defaultEnabled: true,
  },
  {
    id: "population",
    name: "Population Threshold Changes",
    description: "Get notified when population estimates change by more than your set threshold",
    icon: Users,
    defaultEnabled: true,
    hasThreshold: true,
  },
  {
    id: "dataQuality",
    name: "Data Quality Changes",
    description: "Get notified when data quality ratings improve or decline",
    icon: Database,
    defaultEnabled: false,
  },
  {
    id: "lastUpdated",
    name: "Record Updates",
    description: "Get notified when any field on a watched people group is updated",
    icon: Calendar,
    defaultEnabled: false,
  },
]

const frequencyOptions = [
  {
    id: "immediate",
    name: "Immediate",
    description: "Receive notifications as changes happen",
    icon: Bell,
  },
  {
    id: "daily",
    name: "Daily Digest",
    description: "One email per day summarizing all changes",
    icon: Calendar,
  },
  {
    id: "weekly",
    name: "Weekly Digest",
    description: "One email per week summarizing all changes",
    icon: Calendar,
  },
]

const watchlists = [
  {
    id: "1",
    name: "South Asia Priority",
    itemCount: 156,
    overrideEnabled: false,
    overrideSettings: null,
  },
  {
    id: "2",
    name: "Unreached Frontier Peoples",
    itemCount: 312,
    overrideEnabled: true,
    overrideSettings: {
      frequency: "immediate",
      changeTypes: ["engagement", "population"],
    },
  },
  {
    id: "3",
    name: "Southeast Asia Watch",
    itemCount: 89,
    overrideEnabled: false,
    overrideSettings: null,
  },
  {
    id: "4",
    name: "Arabic Speaking Groups",
    itemCount: 234,
    overrideEnabled: true,
    overrideSettings: {
      frequency: "weekly",
      changeTypes: ["engagement"],
    },
  },
  {
    id: "5",
    name: "High Priority Research",
    itemCount: 45,
    overrideEnabled: false,
    overrideSettings: null,
  },
]

export function NotificationsSettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [frequency, setFrequency] = useState("daily")
  const [changeTypeSettings, setChangeTypeSettings] = useState<Record<string, boolean>>({
    engagement: true,
    population: true,
    dataQuality: false,
    lastUpdated: false,
  })
  const [populationThreshold, setPopulationThreshold] = useState("10")
  const [watchlistOverrides, setWatchlistOverrides] = useState<Record<string, boolean>>({
    "2": true,
    "4": true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleChangeType = (id: string) => {
    setChangeTypeSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleWatchlistOverride = (id: string) => {
    setWatchlistOverrides((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Button href="/settings" className="hover:text-foreground transition-colors">
              Settings
            </Button>
            <ChevronDown className="h-4 w-4" />
            <span className="text-foreground">Notifications</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-accent" />
                </div>
                Notification Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure how and when you receive updates about your watched people groups
              </p>
            </div>
            <Button onClick={handleSave} className="gap-2 min-h-[44px]">
              {saved ? (
                <>
                  <Bell className="h-4 w-4" />
                  Saved
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Master Toggle */}
            <Card className="border-border/50">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Bell className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <Label htmlFor="notificationsEnabled" className="font-medium text-foreground">
                        Enable Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about changes to your watched people groups
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    className="scale-110"
                  />
                </div>

                {notificationsEnabled && (
                  <>
                    <Separator className="my-6" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <Mail className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <Label htmlFor="emailEnabled" className="font-medium text-foreground">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                    </div>
                  </>
                )}
              </div>
            </Card>

            {notificationsEnabled && (
              <>
                {/* Change Types */}
                <Card className="border-border/50">
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-2">Change Types</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select which types of changes you want to be notified about
                    </p>
                    <div className="space-y-4">
                      {changeTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`flex items-center justify-between gap-4 p-4 rounded-lg border transition-colors ${
                            changeTypeSettings[type.id] ? "border-accent/30 bg-accent/5" : "border-border/50 bg-card"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                                changeTypeSettings[type.id]
                                  ? "bg-accent/10 text-accent"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <type.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <Label htmlFor={type.id} className="font-medium text-foreground cursor-pointer">
                                {type.name}
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                              {type.hasThreshold && changeTypeSettings[type.id] && (
                                <div className="mt-3 flex items-center gap-3">
                                  <Label className="text-sm text-muted-foreground whitespace-nowrap">Threshold:</Label>
                                  <Input
                                    type="number"
                                    value={populationThreshold}
                                    onChange={(e) => setPopulationThreshold(e.target.value)}
                                    className="w-32 h-9"
                                  />
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">
                                        You'll be notified when population changes by more than this percentage
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          </div>
                          <Switch
                            id={type.id}
                            checked={changeTypeSettings[type.id]}
                            onCheckedChange={() => toggleChangeType(type.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Frequency */}
                <Card className="border-border/50">
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-2">Notification Frequency</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose how often you want to receive notifications
                    </p>
                    <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-3">
                      {frequencyOptions.map((option) => (
                        <label
                          key={option.id}
                          htmlFor={option.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                            frequency === option.id
                              ? "border-accent/30 bg-accent/5"
                              : "border-border/50 bg-card hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              frequency === option.id ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <option.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{option.name}</div>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          {option.id === "daily" && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </label>
                      ))}
                    </RadioGroup>

                    {frequency === "daily" && (
                      <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <Label className="text-sm font-medium">Delivery Time</Label>
                            <div className="flex items-center gap-3 mt-2">
                              <Select defaultValue="09:00">
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
                              <span className="text-sm text-muted-foreground">(Your local time)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {frequency === "weekly" && (
                      <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <Label className="text-sm font-medium">Delivery Day</Label>
                            <div className="flex items-center gap-3 mt-2">
                              <Select defaultValue="monday">
                                <SelectTrigger className="w-32">
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
                              <span className="text-sm text-muted-foreground">at 9:00 AM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Per-Watchlist Overrides */}
                <Card className="border-border/50">
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-2">Watchlist Overrides</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Customize notification settings for specific watchlists
                    </p>
                    <Collapsible type="multiple" className="space-y-3">
                      {watchlists.map((watchlist) => (
                        <div
                          key={watchlist.id}
                          className={`border rounded-lg px-4 transition-colors ${
                            watchlistOverrides[watchlist.id] ? "border-accent/30 bg-accent/5" : "border-border/50"
                          }`}
                        >
                          <div className="flex items-center gap-4 py-4">
                            <div
                              className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                                watchlistOverrides[watchlist.id]
                                  ? "bg-accent/10 text-accent"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <Users className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">{watchlist.name}</div>
                              <p className="text-sm text-muted-foreground">{watchlist.itemCount} people groups</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {watchlistOverrides[watchlist.id] && (
                                <Badge variant="outline" className="text-xs text-accent border-accent/30">
                                  Custom
                                </Badge>
                              )}
                              <Switch
                                checked={watchlistOverrides[watchlist.id] || false}
                                onCheckedChange={() => toggleWatchlistOverride(watchlist.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          {watchlistOverrides[watchlist.id] && (
                            <div className="pt-2 border-t border-border/50">
                              {/* Override Frequency */}
                              <div className="pt-4">
                                <Label className="text-sm font-medium mb-3 block">Notification Frequency</Label>
                                <RadioGroup
                                  defaultValue={watchlist.overrideSettings?.frequency || "daily"}
                                  className="flex flex-wrap gap-3"
                                >
                                  {frequencyOptions.map((option) => (
                                    <label
                                      key={option.id}
                                      htmlFor={`${watchlist.id}-${option.id}`}
                                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                                    >
                                      <RadioGroupItem value={option.id} id={`${watchlist.id}-${option.id}`} />
                                      <span className="text-sm">{option.name}</span>
                                    </label>
                                  ))}
                                </RadioGroup>
                              </div>

                              {/* Override Change Types */}
                              <div className="pt-2">
                                <Label className="text-sm font-medium mb-3 block">Change Types to Monitor</Label>
                                <div className="flex flex-wrap gap-2">
                                  {changeTypes.map((type) => {
                                    const isActive = watchlist.overrideSettings?.changeTypes?.includes(type.id) || false
                                    return (
                                      <button
                                        key={type.id}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                                          isActive
                                            ? "border-accent/30 bg-accent/10 text-accent"
                                            : "border-border/50 text-muted-foreground hover:bg-muted/50"
                                        }`}
                                      >
                                        <type.icon className="h-4 w-4" />
                                        {type.name.split(" ")[0]}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </Collapsible>

                    <div className="mt-4 pt-4 border-t border-border/50">
                      <Button href="/watchlist" className="text-sm text-accent hover:underline flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Manage your watchlists
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Quick Summary */}
                <Card className="border-accent/20 bg-accent/5">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Bell className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-2">Current Configuration Summary</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>
                            • Monitoring{" "}
                            <span className="text-foreground font-medium">
                              {Object.values(changeTypeSettings).filter(Boolean).length}
                            </span>{" "}
                            change types
                          </li>
                          <li>
                            • Receiving{" "}
                            <span className="text-foreground font-medium">
                              {frequencyOptions.find((f) => f.id === frequency)?.name.toLowerCase()}
                            </span>{" "}
                            notifications
                          </li>
                          <li>
                            •{" "}
                            <span className="text-foreground font-medium">
                              {Object.values(watchlistOverrides).filter(Boolean).length}
                            </span>{" "}
                            watchlists with custom settings
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </TooltipProvider>
    </AppLayout>
  )
}
