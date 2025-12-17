import { SavedViewsPage } from "@/components/saved-views-page"
import { APP_NAME } from "@/lib/constants"

export const metadata = {
  title: `Saved Views - ${APP_NAME}`,
  description: "Your saved searches and custom views",
}

export default function SavedViews() {
  return <SavedViewsPage />
}
