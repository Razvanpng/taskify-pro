"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Task, Priority, TaskStatus } from "@/lib/types"
import { CalendarIcon, Pencil, Save, Trash2, X, Tag, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn, getPriorityColor } from "@/lib/utils"
import PriorityBadge from "./priority-badge"
import DeadlineTag from "./deadline-tag"
import StatusBadge from "./status-badge"
import { motion } from "framer-motion"
import { useDrag, useDrop } from "react-dnd"
import DeleteConfirmDialog from "../modals/delete-confirm-dialog"
import { Label } from "../ui/label"

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
  const [editDescription, setEditDescription] = useState(task.description || "")
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status || "pending")
  const [editDeadline, setEditDeadline] = useState<Date | undefined>(task.deadline)
  const [editProject, setEditProject] = useState(task.project || "")
  const [editTags, setEditTags] = useState<string[]>(task.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [errors, setErrors] = useState<{ text?: string }>({})

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

  const validateForm = () => {
    const newErrors: { text?: string } = {}

    if (!editText.trim()) {
      newErrors.text = "Task name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveEdit = () => {
    if (!validateForm()) {
      return
    }

    onUpdate({
      ...task,
      text: editText.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      status: editStatus,
      deadline: editDeadline,
      project: editProject,
      tags: editTags.length > 0 ? editTags : undefined,
      completed: editStatus === "completed",
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditText(task.text)
    setEditDescription(task.description || "")
    setEditPriority(task.priority)
    setEditStatus(task.status || "pending")
    setEditDeadline(task.deadline)
    setEditProject(task.project || "")
    setEditTags(task.tags || [])
    setErrors({})
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove))
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
        aria-label={`Task: ${task.text}${task.completed ? ", completed" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleCompletion(task.id)}
              className="rounded-full h-5 w-5 transition-all duration-200"
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            />
          </div>

          <div className="flex-grow">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-text-${task.id}`}>Task Name</Label>
                  <Input
                    id={`edit-text-${task.id}`}
                    value={editText}
                    onChange={(e) => {
                      setEditText(e.target.value)
                      if (errors.text) {
                        setErrors({})
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="rounded-xl"
                    aria-invalid={!!errors.text}
                    aria-describedby={errors.text ? `text-error-${task.id}` : undefined}
                  />
                  {errors.text && (
                    <p id={`text-error-${task.id}`} className="text-sm text-red-500">
                      {errors.text}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-description-${task.id}`}>Description (Optional)</Label>
                  <Textarea
                    id={`edit-description-${task.id}`}
                    placeholder="Description (optional)"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="min-h-[80px] rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-priority-${task.id}`}>Priority</Label>
                    <Select value={editPriority} onValueChange={(value) => setEditPriority(value as Priority)}>
                      <SelectTrigger
                        id={`edit-priority-${task.id}`}
                        className={`rounded-xl ${getPriorityColor(editPriority)}`}
                      >
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low Priority</SelectItem>
                        <SelectItem value="Medium">Medium Priority</SelectItem>
                        <SelectItem value="High">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-status-${task.id}`}>Status</Label>
                    <Select value={editStatus} onValueChange={(value) => setEditStatus(value as TaskStatus)}>
                      <SelectTrigger id={`edit-status-${task.id}`} className="rounded-xl">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-deadline-${task.id}`}>Deadline</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id={`edit-deadline-${task.id}`}
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal rounded-xl w-full",
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

                <div className="space-y-2">
                  <Label htmlFor={`edit-project-${task.id}`}>Project</Label>
                  <Input
                    id={`edit-project-${task.id}`}
                    value={editProject}
                    onChange={(e) => setEditProject(e.target.value)}
                    placeholder="Project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-tags-${task.id}`}>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editTags.map((tag) => (
                      <Badge key={tag} className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-xs"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id={`edit-tags-${task.id}`}
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                      aria-label="Add tag"
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
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
                <div className="flex flex-col">
                  <p
                    className={`text-base ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {task.text}
                  </p>

                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status || "pending"} />
                  {task.deadline && <DeadlineTag deadline={task.deadline} />}

                  {task.project && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Folder className="h-3 w-3 mr-1" />
                      {task.project}
                    </Badge>
                  )}

                  {task.tags &&
                    task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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
                aria-label="Edit task"
              >
                <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="rounded-full h-8 w-8 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/20 hover:scale-110 active:scale-95"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => onDelete(task.id)}
        taskText={task.text}
      />
    </>
  )
}
