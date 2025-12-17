"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string
  icon: React.ReactNode
  variant?: "default" | "ghost" | "outline" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
  children?: React.ReactNode
  tooltipSide?: "top" | "right" | "bottom" | "left"
}

export function IconButton({
  tooltip,
  icon,
  variant = "ghost",
  size = "icon",
  className,
  children,
  disabled,
  tooltipSide = "top",
  ...props
}: IconButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn(
              // Core centering and sizing
              "inline-flex items-center justify-center",
              // Consistent square sizing for icon-only buttons
              size === "icon" && "h-10 w-10",
              size === "sm" && "h-8 w-8",
              // Cursor states
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              className,
            )}
            aria-label={tooltip}
            disabled={disabled}
            {...props}
          >
            {icon}
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide} sideOffset={4} className="tooltip-content">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface TooltipLinkProps {
  tooltip: string
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

export function TooltipLink({ tooltip, href, children, className, external }: TooltipLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            className={cn("cursor-pointer", className)}
            aria-label={tooltip}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {children}
          </a>
        </TooltipTrigger>
        <TooltipContent sideOffset={4} className="tooltip-content">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface TooltipWrapperProps {
  tooltip: string
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
  asChild?: boolean
}

export function TooltipWrapper({
  tooltip,
  children,
  side = "top",
  sideOffset = 4,
  asChild = true,
}: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent side={side} sideOffset={sideOffset} className="tooltip-content">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
