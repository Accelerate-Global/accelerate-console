"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Sparkles, Bookmark, Eye, Bell, Settings, LogOut, X, Sun, Moon, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface AppHeaderProps {
  onLogoClick?: () => void
}

export function AppHeader({ onLogoClick }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  const handleLogoClick = () => {
    setSearchQuery("")
    onLogoClick?.()
    router.push("/")
  }

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <TooltipProvider>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo - Left */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-2 shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Go to Explore"
              >
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground hidden sm:inline">PeopleGroups</span>
              </button>
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2 cursor-pointer">
                  {mounted && theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : mounted && theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className="gap-2 cursor-pointer"
                      aria-label="Switch to light theme"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                      {mounted && theme === "light" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className="gap-2 cursor-pointer"
                      aria-label="Switch to dark theme"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                      {mounted && theme === "dark" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("system")}
                      className="gap-2 cursor-pointer"
                      aria-label="Use system theme preference"
                    >
                      <Monitor className="h-4 w-4" />
                      System
                      {mounted && theme === "system" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
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
  )
}
