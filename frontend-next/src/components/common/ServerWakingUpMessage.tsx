"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Server, Coffee } from "lucide-react"

interface ServerWakingUpMessageProps {
  isVisible: boolean
}

const ServerWakingUpMessage: React.FC<ServerWakingUpMessageProps> = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md"
    >
      <div className="flex items-center">
        <div className="mr-3 flex-shrink-0">
          <Server className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-amber-800">Server is waking up</h3>
          <div className="mt-1 text-xs text-amber-700">
            <p>
              Our app is hosted on a free server that goes to sleep when inactive. It might take a few moments to wake
              up.
            </p>
            <div className="flex items-center mt-2">
              <Coffee className="h-4 w-4 text-amber-600 mr-1 animate-pulse" />
              <span className="text-amber-600 font-medium">Thanks for your patience!</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ServerWakingUpMessage
