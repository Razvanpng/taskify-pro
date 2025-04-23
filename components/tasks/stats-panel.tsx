"use client"

import type React from "react"

import type { Task } from "@/lib/types"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle, Circle, ListTodo, Clock } from "lucide-react"
import { getOverdueTasks } from "@/lib/utils"

interface StatsPanelProps {
  tasks: Task[]
}

export default function StatsPanel({ tasks }: StatsPanelProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks
  const overdueTasks = getOverdueTasks(tasks)

  const lowPriorityTasks = tasks.filter((task) => task.priority === "Low").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "Medium").length
  const highPriorityTasks = tasks.filter((task) => task.priority === "High").length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-colors duration-300"
    >
      <h3 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">Task Statistics</h3>

      <div className="space-y-3">
        <StatItem icon={<ListTodo className="h-4 w-4 text-blue-500" />} label="Total Tasks" value={totalTasks} />

        <StatItem icon={<CheckCircle className="h-4 w-4 text-green-500" />} label="Completed" value={completedTasks} />

        <StatItem icon={<Circle className="h-4 w-4 text-orange-500" />} label="Pending" value={pendingTasks} />

        <StatItem icon={<Clock className="h-4 w-4 text-red-500" />} label="Overdue" value={overdueTasks} />

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <h4 className="text-xs font-medium mb-2 text-gray-500 dark:text-gray-400">By Priority</h4>

          <StatItem icon={<ArrowDown className="h-4 w-4 text-blue-500" />} label="Low" value={lowPriorityTasks} />

          <StatItem icon={<ArrowUp className="h-4 w-4 text-yellow-500" />} label="Medium" value={mediumPriorityTasks} />

          <StatItem icon={<AlertTriangle className="h-4 w-4 text-red-500" />} label="High" value={highPriorityTasks} />
        </div>
      </div>
    </motion.div>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center">
        {icon}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  )
}
