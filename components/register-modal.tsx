"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "./ui/use-toast"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginClick: () => void
}

export default function RegisterModal({ isOpen, onClose, onLoginClick }: RegisterModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(name, email, password)
      toast({
        title: "Registration successful",
        description: "Your account has been created. Welcome to TrackApply!",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>Sign up to track your job applications and interviews.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onLoginClick} className="sm:mr-auto">
              Already have an account?
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
