"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, X, ExternalLink, Copy } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type?: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const Toast: React.FC<ToastProps> = ({ message, type = "success", isVisible, onClose, duration = 5000, action }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Copy className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800"
      case "error":
        return "text-red-800"
      case "info":
        return "text-blue-800"
      default:
        return "text-gray-800"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
          <div className={`rounded-lg shadow-lg border px-4 py-3 flex items-center justify-between ${getBgColor()}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">{getIcon()}</div>
              <div className={`ml-3 ${getTextColor()}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {action && (
                <button
                  onClick={action.onClick}
                  className="ml-4 flex-shrink-0 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  {action.label}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-md p-1 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
