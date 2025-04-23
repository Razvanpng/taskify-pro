"use client"

import type { SortOption } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowDownAZ, ArrowUpDown, Calendar, CheckCircle } from "lucide-react"

interface SortBarProps {
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
}

export default function SortBar({ sortOption, setSortOption }: SortBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-colors duration-300"
    >
      <h3 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">Sort Tasks</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={sortOption === "none" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortOption("none")}
          className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ArrowDownAZ className="mr-1 h-4 w-4" />
          Newest
        </Button>
        <Button
          variant={sortOption === "deadline" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortOption("deadline")}
          className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Calendar className="mr-1 h-4 w-4" />
          Deadline
        </Button>
        <Button
          variant={sortOption === "priority" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortOption("priority")}
          className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ArrowUpDown className="mr-1 h-4 w-4" />
          Priority
        </Button>
        <Button
          variant={sortOption === "completion" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortOption("completion")}
          className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          Incomplete First
        </Button>
      </div>
    </motion.div>
  )
}
