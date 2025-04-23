"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { PlusCircle, Search, Filter, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import Header from "@/components/header"
import AddTask from "@/components/task/add-task"
import TaskList from "@/components/task/task-list"
import FilterBar from "@/components/task/filter-bar"
import StatsPanel from "@/components/task/stats-panel"
import EmptyState from "@/components/task/empty-state"
import TaskSkeleton from "@/components/task/task-skeleton"
import { generateId } from "@/lib/utils"
import { useLocalStorage } from "@/lib/use-local-storage"
import { useAuth } from "@/lib/auth-context"
import type { Task, Filter as FilterType, Priority, SortOption, TaskStatus } from "@/lib/types"

export default function Home() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [tasks, setTasks] = useLocalStorage<Task[]>("taskify-tasks", [])
  const [projects, setProjects] = useLocalStorage<string[]>("taskify-projects", ["Personal", "Work", "Shopping"])
  const [userTasks, setUserTasks] = useState<Task[]>([])

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>("all")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [projectFilter, setProjectFilter] = useState<string | "all">("all")
  const [tagFilter, setTagFilter] = useState<string | "all">("all")
  const [deadlineFilter, setDeadlineFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("created")
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")

  // Simulate data loading with a short timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Filter tasks by current user
  useEffect(() => {
    if (user) {
      const filtered = tasks.filter((task) => task.userId === user.id)
      setUserTasks(filtered)
    } else {
      setUserTasks([])
    }
  }, [user, tasks])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !isInitialLoading) {
      router.push("/login")
    }
  }, [authLoading, user, router, isInitialLoading])

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(userTasks.flatMap((task) => task.tags || []))).sort()

  // Filter tasks
  const filteredTasks = userTasks.filter((task) => {
    // Filter by completion status
    if (filter === "completed" && !task.completed) return false
    if (filter === "incomplete" && task.completed) return false

    // Filter by task status
    if (statusFilter !== "all" && task.status !== statusFilter) return false

    // Filter by priority
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false

    // Filter by project
    if (projectFilter !== "all" && task.project !== projectFilter) return false

    // Filter by tag
    if (tagFilter !== "all" && !(task.tags || []).includes(tagFilter)) return false

    // Filter by deadline
    if (deadlineFilter !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      if (!task.deadline) {
        if (deadlineFilter !== "no-date") return false
      } else {
        const deadline = new Date(task.deadline)
        deadline.setHours(0, 0, 0, 0)

        switch (deadlineFilter) {
          case "overdue":
            if (!(deadline < today)) return false
            break
          case "today":
            if (!(deadline.getTime() === today.getTime())) return false
            break
          case "tomorrow":
            if (!(deadline.getTime() === tomorrow.getTime())) return false
            break
          case "upcoming":
            if (!(deadline >= today && deadline <= nextWeek)) return false
            break
          case "later":
            if (!(deadline > nextWeek)) return false
            break
          case "no-date":
            return false
        }
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        task.text.toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query) ||
        (task.tags || []).some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOption) {
      case "deadline":
        // Tasks without deadlines go to the end
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      case "priority":
        const priorityValues = { High: 3, Medium: 2, Low: 1 }
        return priorityValues[b.priority] - priorityValues[a.priority]
      case "completion":
        // Incomplete tasks first
        if (a.completed && !b.completed) return 1
        if (!a.completed && b.completed) return -1
        return 0
      case "created":
      default:
        // Default sorting by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  })

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (!user) return

    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
      userId: user.id,
      status: taskData.status || "pending",
    }

    setTasks([newTask, ...tasks])
    setIsAddTaskOpen(false)

    toast({
      title: "Task added",
      description: "Your task has been added successfully",
    })
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully",
    })
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))

    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully",
      variant: "destructive",
    })
  }

  const handleToggleCompletion = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const completed = !task.completed
          // Update status when completing/uncompleting
          const status = completed ? "completed" : task.status === "completed" ? "pending" : task.status
          return { ...task, completed, status }
        }
        return task
      }),
    )
  }

  const handleMoveTask = (dragIndex: number, hoverIndex: number) => {
    const draggedTask = sortedTasks[dragIndex]

    // Create a new array without the dragged task
    const newTasks = [...tasks]
    const taskIndex = newTasks.findIndex((task) => task.id === draggedTask.id)

    // Remove the task from its original position
    newTasks.splice(taskIndex, 1)

    // Find the task at the hover position in the original array
    const hoverTask = sortedTasks[hoverIndex]
    const hoverTaskIndex = newTasks.findIndex((task) => task.id === hoverTask.id)

    // Insert the dragged task at the new position
    newTasks.splice(hoverTaskIndex, 0, draggedTask)

    setTasks(newTasks)
  }

  const handleAddProject = (project: string) => {
    if (!projects.includes(project)) {
      setProjects([...projects, project])
    }
  }

  const handleShareList = () => {
    // Generate a mock shareable link
    const shareableId = Math.random().toString(36).substring(2, 10)
    const link = `${window.location.origin}/shared/${shareableId}`
    setShareLink(link)
    setIsShareDialogOpen(true)
  }

  // Show skeleton UI while loading
  const renderTaskList = () => {
    if (isInitialLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (sortedTasks.length > 0) {
      return (
        <TaskList
          tasks={sortedTasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleCompletion={handleToggleCompletion}
          onMoveTask={handleMoveTask}
        />
      )
    }

    return (
      <EmptyState
        filter={filter}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        projectFilter={projectFilter}
        tagFilter={tagFilter}
        deadlineFilter={deadlineFilter}
        searchQuery={searchQuery}
      />
    )
  }

  if (!user && !isInitialLoading && !authLoading) {
    return null // Will redirect to login
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Mobile filter toggle */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <Button variant="outline" size="sm" onClick={() => setIsMobileFilterOpen(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Newest First</SelectItem>
                  <SelectItem value="deadline">Earliest Deadline</SelectItem>
                  <SelectItem value="priority">Highest Priority</SelectItem>
                  <SelectItem value="completion">Incomplete First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile filter sidebar */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <div className="space-y-6">
                    <FilterBar
                      filter={filter}
                      setFilter={setFilter}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      priorityFilter={priorityFilter}
                      setPriorityFilter={setPriorityFilter}
                      projectFilter={projectFilter}
                      setProjectFilter={setProjectFilter}
                      tagFilter={tagFilter}
                      setTagFilter={setTagFilter}
                      deadlineFilter={deadlineFilter}
                      setDeadlineFilter={setDeadlineFilter}
                      projects={projects}
                      tags={allTags}
                      closeMobileFilter={() => setIsMobileFilterOpen(false)}
                    />
                    <StatsPanel tasks={userTasks} isLoading={isInitialLoading} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop sidebar */}
            <div className="hidden md:block w-64 space-y-6">
              <FilterBar
                filter={filter}
                setFilter={setFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                projectFilter={projectFilter}
                setProjectFilter={setProjectFilter}
                tagFilter={tagFilter}
                setTagFilter={setTagFilter}
                deadlineFilter={deadlineFilter}
                setDeadlineFilter={setDeadlineFilter}
                projects={projects}
                tags={allTags}
                closeMobileFilter={() => {}}
              />
              <StatsPanel tasks={userTasks} isLoading={isInitialLoading} />
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-8 w-full sm:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select
                    value={sortOption}
                    onValueChange={(value) => setSortOption(value as SortOption)}
                    className="hidden md:block"
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">Newest First</SelectItem>
                      <SelectItem value="deadline">Earliest Deadline</SelectItem>
                      <SelectItem value="priority">Highest Priority</SelectItem>
                      <SelectItem value="completion">Incomplete First</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={handleShareList} className="hidden md:flex">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share List
                  </Button>

                  <Button onClick={() => setIsAddTaskOpen(true)} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setFilter("all")}>
                    All Tasks
                  </TabsTrigger>
                  <TabsTrigger value="incomplete" onClick={() => setFilter("incomplete")}>
                    To Do
                  </TabsTrigger>
                  <TabsTrigger value="completed" onClick={() => setFilter("completed")}>
                    Completed
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {renderTaskList()}
            </div>
          </div>

          <AddTask
            isOpen={isAddTaskOpen}
            onClose={() => setIsAddTaskOpen(false)}
            onAddTask={handleAddTask}
            projects={projects}
            onAddProject={handleAddProject}
            existingTags={allTags}
          />

          {/* Share Dialog */}
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Task List</DialogTitle>
                <DialogDescription>Anyone with this link will be able to view your task list.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 mt-4">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink)
                    toast({
                      title: "Link copied",
                      description: "Share link has been copied to clipboard",
                    })
                  }}
                >
                  Copy
                </Button>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
        <Toaster />
      </div>
    </DndProvider>
  )
}
