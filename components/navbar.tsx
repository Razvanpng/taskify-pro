"use client"

import { useState } from "react"
import { Search, Moon, Sun, List, Columns, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/lib/theme-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LoginModal from "./login-modal"
import RegisterModal from "./register-modal"

interface NavbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortOption: string
  setSortOption: (option: string) => void
  viewMode: "kanban" | "list"
  setViewMode: (mode: "kanban" | "list") => void
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
}: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const getSortLabel = (option: string) => {
    switch (option) {
      case "newest":
        return "Newest First"
      case "oldest":
        return "Oldest First"
      case "interview":
        return "Interview Date"
      default:
        return "Sort By"
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <svg
                className="h-8 w-8 text-primary mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 12V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M9 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M19 16L17 18L15 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M17 14V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-bold text-xl">TrackApply</span>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] lg:w-[300px]"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    {getSortLabel(sortOption)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("oldest")}>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("interview")}>Interview Date</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("kanban")}
                  className="rounded-l-none"
                >
                  <Columns className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => setShowLoginModal(true)}>
                  Log in
                </Button>
                <Button onClick={() => setShowRegisterModal(true)}>Sign up</Button>
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden mt-3 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {viewMode === "list" ? <List className="h-4 w-4" /> : <Columns className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode("list")}>List View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("kanban")}>Kanban View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("oldest")}>Oldest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("interview")}>Interview Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onRegisterClick={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onLoginClick={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </header>
  )
}
