"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, LogOut } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

export default function ProfilePage() {
  const { user, logout, updateUser, isLoading: authIsLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nameError, setNameError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !authIsLoading) {
      router.push("/login")
    }
  }, [user, router, authIsLoading])

  const validateProfileForm = () => {
    if (!name.trim()) {
      setNameError("Name is required")
      return false
    }
    return true
  }

  const validatePasswordForm = () => {
    const errors: {
      currentPassword?: string
      newPassword?: string
      confirmPassword?: string
    } = {}

    if (!currentPassword) {
      errors.currentPassword = "Current password is required"
    }

    if (!newPassword) {
      errors.newPassword = "New password is required"
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password"
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (updateUser && user) {
        updateUser({ ...user, name })
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsPasswordLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordErrors({})
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPasswordLoading(false)
    }
  }

  if (!user && !authIsLoading) {
    return null // Will redirect to login
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile sidebar */}
              <div className="w-full md:w-1/3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user?.avatar || "/placeholder.svg?height=96&width=96"} alt={user?.name} />
                          <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                          aria-label="Change avatar"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <h2 className="text-xl font-semibold">{user?.name}</h2>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>

                      <Separator className="my-4" />

                      <Button variant="destructive" className="w-full mt-2" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile content */}
              <div className="w-full md:w-2/3">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your account settings and change your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="general" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                      </TabsList>

                      <TabsContent value="general" className="space-y-4 pt-4">
                        <form onSubmit={handleProfileUpdate}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                  setName(e.target.value)
                                  if (nameError) setNameError(null)
                                }}
                                required
                                aria-invalid={!!nameError}
                                aria-describedby={nameError ? "name-error" : undefined}
                              />
                              {nameError && (
                                <p id="name-error" className="text-sm text-red-500">
                                  {nameError}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled
                                aria-disabled="true"
                              />
                              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                              {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>

                      <TabsContent value="password" className="space-y-4 pt-4">
                        <form onSubmit={handlePasswordUpdate}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => {
                                  setCurrentPassword(e.target.value)
                                  if (passwordErrors.currentPassword) {
                                    setPasswordErrors({
                                      ...passwordErrors,
                                      currentPassword: undefined,
                                    })
                                  }
                                }}
                                required
                                aria-invalid={!!passwordErrors.currentPassword}
                                aria-describedby={passwordErrors.currentPassword ? "current-password-error" : undefined}
                              />
                              {passwordErrors.currentPassword && (
                                <p id="current-password-error" className="text-sm text-red-500">
                                  {passwordErrors.currentPassword}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                  setNewPassword(e.target.value)
                                  if (passwordErrors.newPassword) {
                                    setPasswordErrors({
                                      ...passwordErrors,
                                      newPassword: undefined,
                                    })
                                  }
                                }}
                                required
                                minLength={8}
                                aria-invalid={!!passwordErrors.newPassword}
                                aria-describedby={passwordErrors.newPassword ? "new-password-error" : undefined}
                              />
                              {passwordErrors.newPassword ? (
                                <p id="new-password-error" className="text-sm text-red-500">
                                  {passwordErrors.newPassword}
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  Password must be at least 8 characters long
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value)
                                  if (passwordErrors.confirmPassword) {
                                    setPasswordErrors({
                                      ...passwordErrors,
                                      confirmPassword: undefined,
                                    })
                                  }
                                }}
                                required
                                aria-invalid={!!passwordErrors.confirmPassword}
                                aria-describedby={passwordErrors.confirmPassword ? "confirm-password-error" : undefined}
                              />
                              {passwordErrors.confirmPassword && (
                                <p id="confirm-password-error" className="text-sm text-red-500">
                                  {passwordErrors.confirmPassword}
                                </p>
                              )}
                            </div>

                            <Button type="submit" disabled={isPasswordLoading} className="w-full">
                              {isPasswordLoading ? "Updating..." : "Update Password"}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
