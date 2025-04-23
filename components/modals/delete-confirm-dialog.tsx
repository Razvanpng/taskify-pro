"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AnimatePresence } from "framer-motion"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskText: string
}

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, taskText }: DeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Task: <span className="font-normal">{taskText}</span>
              </p>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={onConfirm}
                className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
