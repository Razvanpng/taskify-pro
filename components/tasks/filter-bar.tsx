"use client"

import type { Filter, Priority } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { CheckCircle, Circle, ListTodo } from "lucide-react"

interface FilterBarProps {
  filter: Filter
  setFilter: (filter: Filter) => void
  priorityFilter: Priority | "all"
  setPriorityFilter: (priority: Priority | "all") => void
  deadlineFilter: string
  setDeadlineFilter: (deadline: string) => void
  closeMobileFilter: () => void
}

export default function FilterBar({
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
  deadlineFilter,
  setDeadlineFilter,
  closeMobileFilter,
}: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-colors duration-300"
    >
      <div className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter("all")
                closeMobileFilter()
              }}
              className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ListTodo className="mr-1 h-4 w-4" />
              All
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter("completed")
                closeMobileFilter()
              }}
              className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Completed
            </Button>
            <Button
              variant={filter === "incomplete" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter("incomplete")
                closeMobileFilter()
              }}
              className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Circle className="mr-1 h-4 w-4" />
              Incomplete
            </Button>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority</h3>
          <Select
            value={priorityFilter}
            onValueChange={(value) => {
              setPriorityFilter(value as Priority | "all")
              closeMobileFilter()
            }}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Low">Low Priority</SelectItem>
              <SelectItem value="Medium">Medium Priority</SelectItem>
              <SelectItem value="High">High Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deadline Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Deadline</h3>
          <Select
            value={deadlineFilter}
            onValueChange={(value) => {
              setDeadlineFilter(value)
              closeMobileFilter()
            }}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Filter by deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deadlines</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
              <SelectItem value="tomorrow">Due Tomorrow</SelectItem>
              <SelectItem value="upcoming">Next 7 Days</SelectItem>
              <SelectItem value="later">Later</SelectItem>
              <SelectItem value="no-date">No Deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  )
}
