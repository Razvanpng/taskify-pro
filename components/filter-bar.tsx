"use client"

import type { Filter, Priority } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Calendar, CheckCircle, Circle } from "lucide-react"

interface FilterBarProps {
  filter: Filter
  setFilter: (filter: Filter) => void
  priorityFilter: Priority | "all"
  setPriorityFilter: (priority: Priority | "all") => void
}

export default function FilterBar({ filter, setFilter, priorityFilter, setPriorityFilter }: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-colors duration-300"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2 flex-grow">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-xl transition-all duration-200"
          >
            All Tasks
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className="rounded-xl transition-all duration-200"
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Completed
          </Button>
          <Button
            variant={filter === "incomplete" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("incomplete")}
            className="rounded-xl transition-all duration-200"
          >
            <Circle className="mr-1 h-4 w-4" />
            Incomplete
          </Button>
          <Button
            variant={filter === "deadline" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("deadline")}
            className="rounded-xl transition-all duration-200"
          >
            <Calendar className="mr-1 h-4 w-4" />
            By Deadline
          </Button>
        </div>

        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | "all")}>
          <SelectTrigger className="w-full md:w-[180px] rounded-xl">
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
    </motion.div>
  )
}
