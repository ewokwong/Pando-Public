"use client"

import type React from "react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({ isOpen, onClose, children, maxWidth = "max-w-lg" }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
              className={`relative bg-white rounded-xl shadow-xl w-full ${maxWidth} max-h-[95vh] overflow-hidden z-10`}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.25 } }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AnimatedModal

