import type { TaskStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, CheckCircle } from "lucide-react"
import { getStatusColor } from "@/lib/utils"

interface StatusBadgeProps {
  status: TaskStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 mr-1" />
      case "in-progress":
        return <Activity className="h-3 w-3 mr-1" />
      case "completed":
        return <CheckCircle className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  const getLabel = () => {
    switch (status) {
      case "pending":
        return "Pending"
      case "in-progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  return (
    <Badge variant="outline" className={`rounded-xl px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}>
      {getIcon()}
      {getLabel()}
    </Badge>
  )
}
