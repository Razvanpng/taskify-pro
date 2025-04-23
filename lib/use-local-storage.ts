"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook for persisting state in localStorage
 *
 * @param key - The localStorage key to store the value under
 * @param initialValue - The initial value to use if no value exists in localStorage
 * @returns A stateful value and a function to update it (persists to localStorage)
 *
 * Example usage:
 * const [tasks, setTasks] = useLocalStorage('tasks', [])
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Initialize state with value from localStorage or fallback to initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return initialValue
    }
  })

  // Update localStorage when the state changes
  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }

  // Sync with other tabs/windows
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue))
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
      return () => {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [key])

  return [storedValue, setValue]
}
