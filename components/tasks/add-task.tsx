"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Task, Priority } from "@/lib/types"
import { motion } from "framer-motion"

interface AddTaskProps {
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void
}

export default function AddTask({ onAddTask }: AddTaskProps) {
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) return

    onAddTask({
      text: text.trim(),
      completed: false,
      priority,
      deadline,
    })

    // Reset form
    setText("")
    setPriority("Medium")
    setDeadline(undefined)
    setIsCalendarOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-colors duration-300"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow rounded-xl border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-xl">
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
                    "w-full sm:w-[200px] justify-start text-left font-normal rounded-xl",
                    !deadline && "text-muted-foreground",
                  )}
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

            <Button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={!text.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
