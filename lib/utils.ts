import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isTomorrow, isPast, isAfter, addDays } from "date-fns"
import type { Task, SortOption, Priority, TaskStatus } from "@/lib/types"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * Useful for conditional class application with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a random ID string
 * Used for creating unique identifiers for tasks and other entities
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Sorts tasks based on the provided sort option
 * Options include sorting by deadline, priority, completion status, or creation date
 */
export function sortTasks(tasks: Task[], sortOption: SortOption): Task[] {
  const sortedTasks = [...tasks]

  switch (sortOption) {
    case "deadline":
      return sortedTasks.sort((a, b) => {
        // Tasks without deadlines go to the end
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      })

    case "priority":
      return sortedTasks.sort((a, b) => {
        const priorityValues = { High: 3, Medium: 2, Low: 1 }
        return priorityValues[b.priority] - priorityValues[a.priority]
      })

    case "completion":
      return sortedTasks.sort((a, b) => {
        // Incomplete tasks first
        if (a.completed && !b.completed) return 1
        if (!a.completed && b.completed) return -1
        return 0
      })

    case "created":
    default:
      // Default sorting by creation date (newest first)
      return sortedTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

/**
 * Returns the appropriate CSS classes for a given priority level
 * Used for styling priority badges with appropriate colors
 */
export function getPriorityColor(priority: Priority) {
  switch (priority) {
    case "Low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  }
}

/**
 * Returns the appropriate CSS classes for a given task status
 * Used for styling status badges with appropriate colors
 */
export function getStatusColor(status: TaskStatus) {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  }
}

/**
 * Formats a deadline date into a human-readable string
 * Returns "Today", "Tomorrow", "Overdue", day of week, or date format
 */
export function formatDeadline(deadline: Date) {
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

/**
 * Returns the appropriate CSS classes for a deadline date
 * Used for styling deadline tags with appropriate colors based on urgency
 */
export function getDeadlineColor(deadline: Date) {
  if (isPast(deadline)) {
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
  } else if (isToday(deadline)) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
  } else {
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  }
}

/**
 * Counts the number of overdue tasks in a task list
 * Used for displaying statistics and alerts
 */
export function getOverdueTasks(tasks: Task[]): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return tasks.filter((task) => task.deadline && task.deadline < today && !task.completed).length
}
