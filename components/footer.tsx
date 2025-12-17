"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, CheckCircle2, AlertCircle, Twitter, Github, Linkedin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate success/error (90% success rate for demo)
    if (Math.random() > 0.1) {
      setStatus("success")
      setEmail("")
    } else {
      setStatus("error")
      setErrorMessage("Unable to subscribe. Please try again.")
    }
  }

  const links = [
    { label: "Methodology", href: "/methodology" },
    { label: "Data Sources", href: "/data-sources" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ]

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ]

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Mission Statement */}
          <div className="md:col-span-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We believe transparent, well-sourced data enables collaboration across organizations and supports wise,
              informed decisions for those working to serve the world&apos;s people groups.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:pl-8">
            <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Updates Signup */}
          <div className="md:col-span-5">
            <div className="bg-secondary/50 rounded-xl p-5 border border-border/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Mail className="h-4 w-4 text-accent" />
                <h4 className="text-sm font-medium text-foreground">Data updates</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Get notified when datasets refresh.</p>

              {status === "success" ? (
                <div className="flex items-center gap-2 py-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">You&apos;re subscribed! We&apos;ll be in touch.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (status === "error") setStatus("idle")
                      }}
                      className="flex-1 h-9 text-sm bg-card border-border"
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="h-9 px-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? "..." : "Subscribe"}
                    </Button>
                  </div>
                  {status === "error" && (
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                      <span className="text-xs text-destructive">{errorMessage}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Accelerate Global. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-secondary/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
