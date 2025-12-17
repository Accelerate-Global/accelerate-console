import type { Metadata } from "next"
import { ComparePage } from "@/components/compare-page"

export const metadata: Metadata = {
  title: "Compare | Accelerate Global // Data",
  description: "Compare multiple people groups side by side",
}

export default function CompareRoute() {
  return <ComparePage />
}
