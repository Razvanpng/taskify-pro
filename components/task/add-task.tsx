"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Plus, X, Tag } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Task, Priority, TaskStatus } from "@/lib/types"

interface AddTaskProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "userId">) => void
  projects: string[]
  onAddProject: (project: string) => void
  existingTags: string[]
}

export default function AddTask({ isOpen, onClose, onAddTask, projects, onAddProject, existingTags }: AddTaskProps) {
  const [text, setText] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [status, setStatus] = useState<TaskStatus>("pending")
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [project, setProject] = useState(projects[0] || "")
  const [newProject, setNewProject] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isAddingProject, setIsAddingProject] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) return

    onAddTask({
      text: text.trim(),
      description: description.trim() || undefined,
      completed: status === "completed",
      status,
      priority,
      deadline,
      project,
      tags: tags.length > 0 ? tags : undefined,
    })

    // Reset form
    setText("")
    setDescription("")
    setPriority("Medium")
    setStatus("pending")
    setDeadline(undefined)
    setProject(projects[0] || "")
    setTags([])
  }

  const handleAddProject = () => {
    if (newProject.trim()) {
      onAddProject(newProject.trim())
      setProject(newProject.trim())
      setNewProject("")
      setIsAddingProject(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="text">Task Name</Label>
            <Input
              id="text"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
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
            <Label>Deadline (Optional)</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Set deadline</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date) => {
                    setDeadline(date)
                    setIsCalendarOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Project</Label>
            {isAddingProject ? (
              <div className="flex gap-2">
                <Input
                  placeholder="New project name"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddProject} disabled={!newProject.trim()}>
                  Add
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingProject(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={project} onValueChange={setProject} className="flex-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={() => setIsAddingProject(true)}>
                  New
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-xs">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
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
              <Button type="button" size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
                <Tag className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {existingTags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Existing tags:</p>
                <div className="flex flex-wrap gap-1">
                  {existingTags
                    .filter((tag) => !tags.includes(tag))
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setTags([...tags, tag])}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!text.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
