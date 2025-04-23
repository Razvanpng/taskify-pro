"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Task } from "@/lib/types"
import { Pencil, Save, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import PriorityBadge from "./priority-badge"
import DeadlineTag from "./deadline-tag"
import { motion } from "framer-motion"
import { useDrag, useDrop } from "react-dnd"

interface TaskItemProps {
  task: Task
  index: number
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
  onToggleCompletion: (id: string) => void
  onMoveTask: (dragIndex: number, hoverIndex: number) => void
}

type DragItem = {
  index: number
  id: string
  type: string
}

export default function TaskItem({ task, index, onUpdate, onDelete, onToggleCompletion, onMoveTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)

  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { index, id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "TASK",
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      onMoveTask(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate({
        ...task,
        text: editText.trim(),
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditText(task.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 cursor-grab active:cursor-grabbing transition-all duration-300 ${
        task.completed ? "border-l-4 border-green-500" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="rounded-full h-5 w-5 transition-all duration-200"
          />
        </div>

        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="rounded-xl"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit} className="rounded-xl transition-all duration-200">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="rounded-xl transition-all duration-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p
                className={`text-base ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-100"}`}
              >
                {task.text}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <PriorityBadge priority={task.priority} />
                {task.deadline && <DeadlineTag deadline={task.deadline} />}
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="rounded-full h-8 w-8 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="sr-only">Edit task</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="rounded-full h-8 w-8 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
