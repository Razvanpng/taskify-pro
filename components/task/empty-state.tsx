"use client"

import { motion } from "framer-motion"
import { ClipboardList } from "lucide-react"
import type { Filter, Priority, TaskStatus } from "@/lib/types"

interface EmptyStateProps {
  filter: Filter
  statusFilter: TaskStatus | "all"
  priorityFilter: Priority | "all"
  projectFilter: string | "all"
  tagFilter: string | "all"
  deadlineFilter: string
  searchQuery: string
}

export default function EmptyState({
  filter,
  statusFilter,
  priorityFilter,
  projectFilter,
  tagFilter,
  deadlineFilter,
  searchQuery,
}: EmptyStateProps) {
  const isFiltered =
    filter !== "all" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    projectFilter !== "all" ||
    tagFilter !== "all" ||
    deadlineFilter !== "all" ||
    searchQuery !== ""

  const getMessage = () => {
    if (isFiltered) {
      return "No tasks match your current filters"
    }
    return "You don't have any tasks yet"
  }

  const getSubMessage = () => {
    if (isFiltered) {
      return "Try changing your filters or add a new task"
    }
    return "Add your first task to get started"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center transition-colors duration-300"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
          <ClipboardList className="h-12 w-12 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{getMessage()}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{getSubMessage()}</p>
      </div>
    </motion.div>
  )
}
