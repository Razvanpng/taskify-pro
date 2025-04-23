import type { Priority } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react"
import { getPriorityColor } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: Priority
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
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
    <Badge variant="outline" className={`rounded-xl px-2 py-1 text-xs font-medium ${getPriorityColor(priority)}`}>
      {getIcon()}
      {priority} Priority
    </Badge>
  )
}
