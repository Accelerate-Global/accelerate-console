"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Twitter, Github, Linkedin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TooltipWrapper } from "@/components/icon-button"
import { useToast } from "@/hooks/use-toast"

function PlaceholderLink({ children }: { children: React.ReactNode }) {
  return (
    <TooltipWrapper tooltip="Coming soon">
      <button
        type="button"
        aria-disabled="true"
        className="text-sm text-muted-foreground hover:text-muted-foreground/80 cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      >
        {children}
      </button>
    </TooltipWrapper>
  )
}

function PlaceholderSocialIcon({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <TooltipWrapper tooltip="Coming soon">
      <button
        type="button"
        aria-disabled="true"
        aria-label={`${label} (Coming soon)`}
        className="h-8 w-8 rounded-full bg-secondary/70 flex items-center justify-center text-muted-foreground hover:text-muted-foreground/80 cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </button>
    </TooltipWrapper>
  )
}

export function AppFooter() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Subscriptions not enabled yet",
      description: "This feature is coming soon.",
    })
  }

  const resourceLinks = ["Methodology", "Data Sources", "Changelog"]
  const legalLinks = ["Privacy", "Terms", "Accessibility"]
  const supportLinks = ["Contact", "Support", "Feedback"]

  const socialIcons = [
    { icon: Twitter, label: "Twitter" },
    { icon: Github, label: "GitHub" },
    { icon: Linkedin, label: "LinkedIn" },
  ]

  return (
    <footer className="border-t border-border/50 bg-card" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Mission Statement */}
          <div className="md:col-span-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We believe transparent, well-sourced data enables collaboration across organizations and supports wise,
              informed decisions for those working to serve the world&apos;s people groups.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
              Data is aggregated from multiple sources and may contain inaccuracies. Please verify critical information
              independently.
            </p>
          </div>

          {/* Links Columns - Using PlaceholderLink instead of Link */}
          <div className="md:col-span-5 grid grid-cols-3 gap-6">
            {/* Resources */}
            <div>
              <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {resourceLinks.map((label) => (
                  <li key={label}>
                    <PlaceholderLink>{label}</PlaceholderLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {legalLinks.map((label) => (
                  <li key={label}>
                    <PlaceholderLink>{label}</PlaceholderLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2.5">
                {supportLinks.map((label) => (
                  <li key={label}>
                    <PlaceholderLink>{label}</PlaceholderLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Updates Signup */}
          <div className="md:col-span-3">
            <div className="bg-secondary/50 rounded-xl p-5 border border-border/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
                <h4 className="text-sm font-medium text-foreground">Data updates</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Get notified when datasets refresh.</p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-9 text-sm bg-card border-border"
                    required
                    aria-label="Email address for data updates"
                    aria-describedby="email-consent"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 px-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Subscribe
                  </Button>
                </div>
                <p id="email-consent" className="text-[10px] text-muted-foreground/70">
                  By subscribing, you agree to our{" "}
                  <TooltipWrapper tooltip="Coming soon">
                    <button type="button" aria-disabled="true" className="underline cursor-not-allowed">
                      Privacy Policy
                    </button>
                  </TooltipWrapper>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Row - Using PlaceholderSocialIcon */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Accelerate Global. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialIcons.map((social) => (
              <PlaceholderSocialIcon key={social.label} icon={social.icon} label={social.label} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
