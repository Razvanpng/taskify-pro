"use client"

import type React from "react"

import type { Task } from "@/lib/types"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle, Circle, ListTodo } from "lucide-react"

interface StatsPanelProps {
  tasks: Task[]
}

export default function StatsPanel({ tasks }: StatsPanelProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  const lowPriorityTasks = tasks.filter((task) => task.priority === "Low").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "Medium").length
  const highPriorityTasks = tasks.filter((task) => task.priority === "High").length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-colors duration-300"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Task Statistics</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={<ListTodo className="h-5 w-5 text-blue-500" />}
          label="Total"
          value={totalTasks}
          color="bg-blue-50 dark:bg-blue-900/20"
        />

        <StatCard
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          label="Completed"
          value={completedTasks}
          color="bg-green-50 dark:bg-green-900/20"
        />

        <StatCard
          icon={<Circle className="h-5 w-5 text-orange-500" />}
          label="Pending"
          value={pendingTasks}
          color="bg-orange-50 dark:bg-orange-900/20"
        />

        <StatCard
          icon={<ArrowDown className="h-5 w-5 text-blue-500" />}
          label="Low"
          value={lowPriorityTasks}
          color="bg-blue-50 dark:bg-blue-900/20"
        />

        <StatCard
          icon={<ArrowUp className="h-5 w-5 text-yellow-500" />}
          label="Medium"
          value={mediumPriorityTasks}
          color="bg-yellow-50 dark:bg-yellow-900/20"
        />

        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          label="High"
          value={highPriorityTasks}
          color="bg-red-50 dark:bg-red-900/20"
        />
      </div>
    </motion.div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div
      className={`${color} p-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center justify-center mb-2">{icon}</div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  )
}
