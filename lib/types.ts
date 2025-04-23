/**
 * Core type definitions for the Taskify Pro application
 */

// User profile information
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// Task priority levels
export type Priority = "Low" | "Medium" | "High"

// Task workflow status
export type TaskStatus = "pending" | "in-progress" | "completed"

// Task sorting options
export type SortOption = "created" | "deadline" | "priority" | "completion"

// Task filtering options
export type Filter = "all" | "completed" | "incomplete"

// Core task data structure
export interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  status: TaskStatus
  priority: Priority
  deadline?: Date
  createdAt: Date
  userId: string
  project?: string
  tags?: string[]
}
