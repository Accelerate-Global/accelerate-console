import type { Metadata } from "next"
import { Suspense } from "react"
import { ComparePage } from "@/components/compare-page"

export const metadata: Metadata = {
  title: "Compare | Accelerate Global // Data",
  description: "Compare multiple people groups side by side",
}

function ComparePageLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted rounded" />
        <div className="h-96 bg-muted rounded mt-6" />
      </div>
    </div>
  )
}

export default function CompareRoute() {
  return (
    <Suspense fallback={<ComparePageLoading />}>
      <ComparePage />
    </Suspense>
  )
}
