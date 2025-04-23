import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { formatDeadline, getDeadlineColor } from "@/lib/utils"

interface DeadlineTagProps {
  deadline: Date
}

export default function DeadlineTag({ deadline }: DeadlineTagProps) {
  return (
    <Badge variant="outline" className={`rounded-xl px-2 py-1 text-xs font-medium ${getDeadlineColor(deadline)}`}>
      <Clock className="h-3 w-3 mr-1" />
      {formatDeadline(deadline)}
    </Badge>
  )
}
