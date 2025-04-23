"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    // Load theme from localStorage
    const storedTheme = localStorage.getItem("trackApply-theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove("light", "dark")

    // Apply the current theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Save to localStorage
    localStorage.setItem("trackApply-theme", theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
