"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Task, Priority } from "@/lib/types"
import { CalendarIcon, Pencil, Save, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn, getPriorityColor } from "@/lib/utils"
import PriorityBadge from "./priority-badge"
import DeadlineTag from "./deadline-tag"
import { motion } from "framer-motion"
import { useDrag, useDrop } from "react-dnd"
import DeleteConfirmDialog from "../modals/delete-confirm-dialog"

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
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)
  const [editDeadline, setEditDeadline] = useState<Date | undefined>(task.deadline)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { index, id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
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
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  drag(drop(ref))

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate({
        ...task,
        text: editText.trim(),
        priority: editPriority,
        deadline: editDeadline,
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditText(task.text)
    setEditPriority(task.priority)
    setEditDeadline(task.deadline)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    onDelete(task.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isDragging ? 0.5 : 1,
          y: 0,
          scale: isDragging ? 1.02 : 1,
          boxShadow: isOver
            ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
            : isDragging
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : "none",
        }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          opacity: { duration: 0.2 },
        }}
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
              <div className="space-y-4">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="rounded-xl"
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={editPriority} onValueChange={(value) => setEditPriority(value as Priority)}>
                    <SelectTrigger className={`w-full sm:w-[150px] rounded-xl ${getPriorityColor(editPriority)}`}>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="High">High Priority</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full sm:w-[180px] justify-start text-left font-normal rounded-xl",
                          !editDeadline && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDeadline ? format(editDeadline, "PPP") : <span>Set deadline</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editDeadline}
                        onSelect={(date) => {
                          setEditDeadline(date)
                          setIsCalendarOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p
                  className={`text-base ${
                    task.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
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
                className="rounded-full h-8 w-8 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 active:scale-95"
              >
                <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Edit task</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="rounded-full h-8 w-8 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/20 hover:scale-110 active:scale-95"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        taskText={task.text}
      />
    </>
  )
}
