"use client"

import type React from "react"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { MobileTabBar } from "@/components/mobile-tab-bar"

interface AppLayoutProps {
  children: React.ReactNode
  onLogoClick?: () => void
  showFooter?: boolean
}

export function AppLayout({ children, onLogoClick, showFooter = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader onLogoClick={onLogoClick} />

      <main id="main-content" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>

      {showFooter && (
        <div className="pb-20 md:pb-0">
          <AppFooter />
        </div>
      )}

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar />
    </div>
  )
}
