"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, Moon, Sun, Monitor } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login")
    }
  }, [user, router, authLoading])

  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user && !authLoading) {
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
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how Taskify Pro looks on your device</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Theme</Label>
                      <RadioGroup
                        defaultValue={theme}
                        onValueChange={(value) => setTheme(value)}
                        className="flex flex-col space-y-1 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light" className="flex items-center cursor-pointer">
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="dark" />
                          <Label htmlFor="dark" className="flex items-center cursor-pointer">
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="system" />
                          <Label htmlFor="system" className="flex items-center cursor-pointer">
                            <Monitor className="h-4 w-4 mr-2" />
                            System
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for task reminders and updates
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        aria-label="Toggle email notifications"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                        aria-label="Toggle push notifications"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
