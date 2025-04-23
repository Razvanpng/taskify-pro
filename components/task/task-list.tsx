"use client"

import type { Task } from "@/lib/types"
import TaskItem from "./task-item"
import { motion, AnimatePresence } from "framer-motion"

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onToggleCompletion: (id: string) => void
  onMoveTask: (dragIndex: number, hoverIndex: number) => void
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, onToggleCompletion, onMoveTask }: TaskListProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <AnimatePresence initial={false}>
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
      </AnimatePresence>
    </motion.div>
  )
}
