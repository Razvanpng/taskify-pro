"use client"

import type { Task } from "@/lib/types"
import TaskItem from "./task-item"
import { motion } from "framer-motion"

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onToggleCompletion: (id: string) => void
  onMoveTask: (dragIndex: number, hoverIndex: number) => void
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, onToggleCompletion, onMoveTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300"
      >
        <p className="text-lg">No tasks found</p>
        <p className="text-sm mt-2">Add a new task or change your filters</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          onToggleCompletion={onToggleCompletion}
          onMoveTask={onMoveTask}
        />
      ))}
    </motion.div>
  )
}
