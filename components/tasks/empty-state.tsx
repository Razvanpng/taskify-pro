"use client"

import { motion } from "framer-motion"
import { ClipboardList, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Filter, Priority } from "@/lib/types"

interface EmptyStateProps {
  filter: Filter
  priorityFilter: Priority | "all"
  deadlineFilter: string
}

export default function EmptyState({ filter, priorityFilter, deadlineFilter }: EmptyStateProps) {
  const getMessage = () => {
    if (filter !== "all" || priorityFilter !== "all" || deadlineFilter !== "all") {
      return "No tasks match your current filters"
    }
    return "You don't have any tasks yet"
  }

  const getSubMessage = () => {
    if (filter !== "all" || priorityFilter !== "all" || deadlineFilter !== "all") {
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

        {(filter !== "all" || priorityFilter !== "all" || deadlineFilter !== "all") && (
          <Button className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        )}
      </div>
    </motion.div>
  )
}
