"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, DropletsIcon as DragDropIcon, Moon, SlidersHorizontal } from "lucide-react"
import { motion } from "framer-motion"

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to Taskify Pro!</DialogTitle>
          <DialogDescription>Here's a quick overview of what you can do with this app.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <FeatureItem
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            title="Manage Tasks"
            description="Add, edit, complete, and delete tasks with ease."
          />

          <FeatureItem
            icon={<SlidersHorizontal className="h-5 w-5 text-blue-500" />}
            title="Filter & Sort"
            description="Filter tasks by status, priority, and deadline. Sort them your way."
          />

          <FeatureItem
            icon={<DragDropIcon className="h-5 w-5 text-purple-500" />}
            title="Drag & Drop"
            description="Reorder your tasks by dragging and dropping them into your preferred order."
          />

          <FeatureItem
            icon={<Moon className="h-5 w-5 text-yellow-500" />}
            title="Light & Dark Mode"
            description="Switch between light and dark themes based on your preference."
          />
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full rounded-xl">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3"
    >
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-medium text-gray-800 dark:text-gray-100">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </motion.div>
  )
}
