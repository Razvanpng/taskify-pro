"use client"

import type { Filter, Priority, TaskStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, Circle, Calendar, Tag, Folder, Activity } from "lucide-react"

interface FilterBarProps {
  filter: Filter
  setFilter: (filter: Filter) => void
  statusFilter: TaskStatus | "all"
  setStatusFilter: (status: TaskStatus | "all") => void
  priorityFilter: Priority | "all"
  setPriorityFilter: (priority: Priority | "all") => void
  projectFilter: string | "all"
  setProjectFilter: (project: string | "all") => void
  tagFilter: string | "all"
  setTagFilter: (tag: string | "all") => void
  deadlineFilter: string
  setDeadlineFilter: (deadline: string) => void
  projects: string[]
  tags: string[]
  closeMobileFilter: () => void
}

export default function FilterBar({
  filter,
  setFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  projectFilter,
  setProjectFilter,
  tagFilter,
  setTagFilter,
  deadlineFilter,
  setDeadlineFilter,
  projects,
  tags,
  closeMobileFilter,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-colors duration-300">
      <Accordion type="multiple" defaultValue={["completion", "status", "priority", "project", "deadline", "tags"]}>
        <AccordionItem value="completion" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <Circle className="h-4 w-4 mr-2" />
              Completion
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter("all")
                  closeMobileFilter()
                }}
                className="justify-start"
              >
                All Tasks
              </Button>
              <Button
                variant={filter === "incomplete" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter("incomplete")
                  closeMobileFilter()
                }}
                className="justify-start"
              >
                <Circle className="mr-2 h-4 w-4" />
                To Do
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter("completed")
                  closeMobileFilter()
                }}
                className="justify-start"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Completed
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Status
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as TaskStatus | "all")
                closeMobileFilter()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="priority" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m3 16 4 4 4-4" />
                <path d="M7 20V4" />
                <path d="m21 8-4-4-4 4" />
                <path d="M17 4v16" />
              </svg>
              Priority
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Select
              value={priorityFilter}
              onValueChange={(value) => {
                setPriorityFilter(value as Priority | "all")
                closeMobileFilter()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="High">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="project" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <Folder className="h-4 w-4 mr-2" />
              Project
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Select
              value={projectFilter}
              onValueChange={(value) => {
                setProjectFilter(value)
                closeMobileFilter()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="deadline" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Deadline
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Select
              value={deadlineFilter}
              onValueChange={(value) => {
                setDeadlineFilter(value)
                closeMobileFilter()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deadlines</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="tomorrow">Due Tomorrow</SelectItem>
                <SelectItem value="upcoming">Next 7 Days</SelectItem>
                <SelectItem value="later">Later</SelectItem>
                <SelectItem value="no-date">No Deadline</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {tags.length > 0 && (
          <AccordionItem value="tags" className="border-b-0">
            <AccordionTrigger className="py-3 hover:no-underline">
              <span className="text-sm font-medium flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <Select
                value={tagFilter}
                onValueChange={(value) => {
                  setTagFilter(value)
                  closeMobileFilter()
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
