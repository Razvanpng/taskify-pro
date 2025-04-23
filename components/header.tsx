"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "./logo"
import { Skeleton } from "./ui/skeleton"

/**
 * Main application header component
 *
 * Includes:
 * - Logo and brand
 * - Theme toggle (light/dark)
 * - User authentication menu
 * - Responsive mobile menu
 */
export default function Header() {
  const { theme, setTheme } = useTheme()
  const { user, logout, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch with theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" aria-label="Taskify Pro Home">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-9 h-9 transition-transform duration-300 hover:scale-110 active:scale-95"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-600" />
                )}
              </Button>
            )}

            {/* User menu or login/signup buttons */}
            {isLoading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <Logo size="sm" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="h-8 w-8"
                      aria-label="Close menu"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 py-4">
                    {isLoading ? (
                      <div className="px-4 py-2">
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ) : user ? (
                      <>
                        <div className="flex items-center gap-2 px-4 py-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="px-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              window.location.href = "/profile"
                            }}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </div>
                        <div className="px-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              window.location.href = "/settings"
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Button>
                        </div>
                        <div className="px-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              logout()
                              setIsMobileMenuOpen(false)
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            window.location.href = "/login"
                          }}
                        >
                          Log in
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            window.location.href = "/register"
                          }}
                        >
                          Sign up
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Theme toggle in mobile menu */}
                  {mounted && (
                    <div className="mt-auto px-4 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Theme</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleTheme}
                          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        >
                          {theme === "dark" ? (
                            <Sun className="h-5 w-5 text-yellow-400" />
                          ) : (
                            <Moon className="h-5 w-5 text-blue-600" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
