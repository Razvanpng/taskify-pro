import { format, isToday, isTomorrow, isPast, addDays, isAfter } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface DeadlineTagProps {
  deadline: Date
}

export default function DeadlineTag({ deadline }: DeadlineTagProps) {
  const getDeadlineText = () => {
    if (isToday(deadline)) {
      return "Today"
    } else if (isTomorrow(deadline)) {
      return "Tomorrow"
    } else if (isPast(deadline)) {
      return "Overdue"
    } else if (isAfter(deadline, new Date()) && isAfter(addDays(new Date(), 7), deadline)) {
      return format(deadline, "EEEE") // Day of week
    } else {
      return format(deadline, "MMM d")
    }
  }

  const getColor = () => {
    if (isPast(deadline)) {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    } else if (isToday(deadline)) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    } else {
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Badge variant="outline" className={`rounded-xl px-2 py-1 text-xs font-medium ${getColor()}`}>
      <Clock className="h-3 w-3 mr-1" />
      {getDeadlineText()}
    </Badge>
  )
}
