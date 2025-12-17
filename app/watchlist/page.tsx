import { WatchlistPage } from "@/components/watchlist-page"
import { APP_NAME } from "@/lib/constants"

export const metadata = {
  title: `Watchlist - ${APP_NAME}`,
  description: "Track changes in your watched people groups",
}

export default function Page() {
  return <WatchlistPage />
}
