import type { Priority } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react"

interface PriorityBadgeProps {
  priority: Priority
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getColor = () => {
    switch (priority) {
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getIcon = () => {
    switch (priority) {
      case "Low":
        return <ArrowDown className="h-3 w-3 mr-1" />
      case "Medium":
        return <ArrowUp className="h-3 w-3 mr-1" />
      case "High":
        return <AlertTriangle className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <Badge variant="outline" className={`rounded-xl px-2 py-1 text-xs font-medium ${getColor()}`}>
      {getIcon()}
      {priority} Priority
    </Badge>
  )
}
