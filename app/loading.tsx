import { Loader2 } from "lucide-react"

/**
 * Loading screen component
 *
 * Displayed during page transitions and initial data loading
 * Shows a spinning loader with a simple message
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
