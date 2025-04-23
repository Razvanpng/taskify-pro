"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"

/**
 * Authentication context interface
 * Defines the shape of the auth context data and methods
 */
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
  isLoading: boolean
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
  isLoading: true,
})

/**
 * Authentication provider component
 * Manages user authentication state and provides auth methods to children
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("taskify-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("taskify-user")
      }
    }
    setIsLoading(false)
  }, [])

  /**
   * Simulated login function
   * In a real app, this would make an API call to authenticate
   */
  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create mock user (in a real app, this would come from the backend)
    const mockUser: User = {
      id: generateUserId(),
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
    }

    setUser(mockUser)
    localStorage.setItem("taskify-user", JSON.stringify(mockUser))
  }

  /**
   * Simulated register function
   * In a real app, this would make an API call to create a new user
   */
  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required")
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long")
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create mock user (in a real app, this would come from the backend)
    const mockUser: User = {
      id: generateUserId(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    }

    setUser(mockUser)
    localStorage.setItem("taskify-user", JSON.stringify(mockUser))
  }

  /**
   * Update user profile information
   */
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("taskify-user", JSON.stringify(updatedUser))
  }

  /**
   * Log out the current user
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem("taskify-user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

/**
 * Helper function to generate a random user ID
 * In a real app, IDs would come from the backend
 */
function generateUserId() {
  return Math.random().toString(36).substring(2, 15)
}
