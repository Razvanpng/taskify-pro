"use client"

import { motion } from "framer-motion"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <div className="relative w-20 h-20 mb-4">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </div>
        <motion.h1
          className="text-xl font-bold font-montserrat bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          Taskify Pro
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Loading your tasks...</p>
      </motion.div>
    </div>
  )
}
