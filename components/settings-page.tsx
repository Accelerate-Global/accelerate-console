"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Bell, Palette, User, Shield, ChevronRight, Sun, Moon, Monitor } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [appearanceDialog, setAppearanceDialog] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure theme is only read after mount to avoid hydration mismatch
  useState(() => {
    setMounted(true)
  })

  const getThemeLabel = () => {
    if (!mounted) return "System"
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      default:
        return "System"
    }
  }

  const handlePlaceholderAction = (action: string) => {
    toast({
      title: "Coming soon",
      description: `${action} will be available in a future update.`,
    })
  }

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences.</p>
          </div>

          {/* Settings Cards Grid */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {/* Notifications Card */}
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Notifications</CardTitle>
                    <CardDescription className="text-sm">
                      Control alerts for watchlists and record changes.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" className="w-full justify-between group bg-transparent">
                      <Link href="/settings/notifications">
                        Open
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Configure notification preferences</TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Appearance Card */}
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                    <CardDescription className="text-sm">Theme preferences.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Current theme</span>
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    {mounted && theme === "dark" ? (
                      <Moon className="h-3.5 w-3.5" />
                    ) : mounted && theme === "light" ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : (
                      <Monitor className="h-3.5 w-3.5" />
                    )}
                    {getThemeLabel()}
                  </span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between group bg-transparent"
                      onClick={() => setAppearanceDialog(true)}
                    >
                      Change theme
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Change theme preference</TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Account Card */}
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Account</CardTitle>
                    <CardDescription className="text-sm">Profile and email preferences.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between cursor-not-allowed opacity-60 bg-transparent"
                      aria-disabled="true"
                      onClick={() => handlePlaceholderAction("Edit profile")}
                    >
                      Edit profile
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Coming soon</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between cursor-not-allowed opacity-60 bg-transparent"
                      aria-disabled="true"
                      onClick={() => handlePlaceholderAction("Change email")}
                    >
                      Change email
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Coming soon</TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Security</CardTitle>
                    <CardDescription className="text-sm">Password and sessions.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between cursor-not-allowed opacity-60 bg-transparent"
                      aria-disabled="true"
                      onClick={() => handlePlaceholderAction("Change password")}
                    >
                      Change password
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Coming soon</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between cursor-not-allowed opacity-60 bg-transparent"
                      aria-disabled="true"
                      onClick={() => handlePlaceholderAction("Manage sessions")}
                    >
                      Manage sessions
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Coming soon</TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>

      {/* Appearance Dialog */}
      <Dialog open={appearanceDialog} onOpenChange={setAppearanceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appearance</DialogTitle>
            <DialogDescription>Choose your preferred theme for the application.</DialogDescription>
          </DialogHeader>
          <RadioGroup
            value={theme}
            onValueChange={(value) => {
              setTheme(value)
              toast({
                title: "Theme updated",
                description: `Theme set to ${value}.`,
              })
            }}
            className="grid gap-3 pt-4"
          >
            <Label
              htmlFor="theme-light"
              className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-secondary/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Light</p>
                  <p className="text-sm text-muted-foreground">A clean, bright appearance.</p>
                </div>
              </div>
              <RadioGroupItem value="light" id="theme-light" />
            </Label>
            <Label
              htmlFor="theme-dark"
              className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-secondary/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Dark</p>
                  <p className="text-sm text-muted-foreground">Easy on the eyes in low light.</p>
                </div>
              </div>
              <RadioGroupItem value="dark" id="theme-dark" />
            </Label>
            <Label
              htmlFor="theme-system"
              className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-secondary/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">System</p>
                  <p className="text-sm text-muted-foreground">Follows your device settings.</p>
                </div>
              </div>
              <RadioGroupItem value="system" id="theme-system" />
            </Label>
          </RadioGroup>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
