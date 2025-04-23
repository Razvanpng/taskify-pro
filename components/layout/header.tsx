"use client"

import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import SortDropdown from "@/components/tasks/sort-dropdown"
import type { SortOption } from "@/lib/types"

interface HeaderProps {
  toggleMobileFilter: () => void
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
}

export default function Header({ toggleMobileFilter, sortOption, setSortOption }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8"></div> {/* Placeholder for menu button */}
            <h1 className="text-xl font-bold font-montserrat bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Taskify Pro
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[180px] h-9 hidden md:block"></div> {/* Placeholder for sort dropdown */}
            <div className="w-9 h-9"></div> {/* Placeholder for theme toggle */}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 max-w-4xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileFilter}
            className="md:hidden rounded-full w-9 h-9 transition-transform duration-300 hover:scale-110 active:scale-95"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-montserrat bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Taskify Pro
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 transition-transform duration-300 hover:scale-110 active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
