"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Bookmark, Eye, User } from "lucide-react"

const tabs = [
  { id: "explore", label: "Explore", icon: Compass, href: "/" },
  { id: "saved", label: "Saved", icon: Bookmark, href: "/saved-views" },
  { id: "watchlist", label: "Watchlist", icon: Eye, href: "/watchlist" },
  { id: "account", label: "Account", icon: User, href: "/settings" },
]

export function MobileTabBar() {
  const pathname = usePathname()

  // Determine which tab is active based on current route
  const getIsActive = (href: string) => {
    if (href === "/") {
      // Explore tab is active for home, search, and profile pages
      return pathname === "/" || pathname === "/search" || pathname.startsWith("/profile")
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 z-50 safe-area-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = getIsActive(tab.href)
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-2 px-4 min-w-[64px] min-h-[52px] rounded-lg transition-colors ${
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? "stroke-[2.5]" : ""}`} aria-hidden="true" />
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
