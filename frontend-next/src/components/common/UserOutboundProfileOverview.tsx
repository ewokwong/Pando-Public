"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Percent, MapPin, Trophy } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { calculateAge } from "@/utils/dateUtils"
import { getPreferenceColor, getPreferenceLabel } from "@/utils/preferenceUtils"
import { DEFAULT_PROFILE_PHOTO } from "@/constants/defaults"
import UserOutboundProfileModal from "./UserOutboundProfileModal" // Import the new modal component

interface UserOutboundProfileOverviewProps {
  user: {
    name: string
    profilePhoto: string
    media: string[]
    dob?: string
    UTR?: string
    location?: {
      displayName: string
    }
    bio?: string
    compatibility?: number
    userPreferences?: {
      fun_social?: boolean
      training_for_competitions?: boolean
      fitness?: boolean
      learning_tennis?: boolean
    }
    [key: string]: any
  }
  userId: string
  handleOutgoingRequest: (senderId: string, receiverId: string, newStatus: string) => void
  onCancelRequest?: () => void
  compatibility?: number
}

const UserOutboundProfileOverview: React.FC<UserOutboundProfileOverviewProps> = ({
  user,
  userId,
  handleOutgoingRequest,
  compatibility = user.compatibility || 0, // Use user.compatibility directly
}) => {
  const [open, setOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const activePreferences = user.userPreferences
    ? Object.entries(user.userPreferences)
        .filter(([_, value]) => value)
        .map(([key, _]) => getPreferenceLabel(key))
    : []

  const getCompatibilityColor = (value: number): string => {
    if (value >= 80) return "bg-green-500"
    if (value >= 70) return "bg-green-400"
    if (value >= 60) return "bg-yellow-500"
    if (value >= 50) return "bg-yellow-400"
    return "bg-red-500"
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setOpen(true)}
      >
        <div className="p-4 md:p-6 relative">
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
            {/* Profile Image with animation */}
            <motion.div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-100 mx-auto md:mx-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={user.profilePhoto || DEFAULT_PROFILE_PHOTO}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* User Info */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 text-center md:text-left">
                <motion.h3
                  className="text-lg md:text-xl font-semibold text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {user.name}
                  {user.dob ? `, ${calculateAge(user.dob)}` : ""}
                </motion.h3>

                {/* Compatibility Bar with animation */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full cursor-help mx-auto sm:mx-0"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      transition={{ delay: 0.2 }}
                    >
                      <Percent size={14} className="text-brand-500" />
                      <div className="text-xs text-gray-500 mr-1">Match</div>
                      <div className="w-20 md:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getCompatibilityColor(compatibility)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${compatibility}%` }}
                          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                      <span className="text-xs font-medium text-gray-700">{compatibility}%</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Our system has deemed you {compatibility}% compatible</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <motion.div
                className="flex flex-wrap justify-center md:justify-start gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {/* UTR */}
                  {user.UTR ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-tennis-yellow/20 text-gray-700 rounded-md text-xs md:text-sm">
                          <Trophy size={12} className="mr-1 md:mr-2 md:size-4" />
                          UTR: {user.UTR}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This displays a user level</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs md:text-sm">
                          <Trophy size={12} className="mr-1 md:mr-2 md:size-4" />
                          UTR: Not assigned yet
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This user has not been assigned a UTR yet</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {/* Location */}
                <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                  <MapPin size={12} className="mr-1" />
                  {user.location?.displayName || "No location set"}
                </div>
              </motion.div>

              {/* Bio */}
              <motion.p
                className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-3 text-center md:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {user.bio || "No bio available"}
              </motion.p>

              {/* Preferences */}
              {activePreferences.length > 0 ? (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                  {Object.entries(user.userPreferences || {}).map(
                    ([key, value]) =>
                      value && (
                        <span
                          key={key}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPreferenceColor()}`}
                        >
                          {getPreferenceLabel(key)}
                        </span>
                      ),
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-xs md:text-sm mb-2 text-center md:text-left">
                  User has not yet added their preferences :(
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center md:justify-end gap-2 mt-4 md:absolute md:bottom-4 md:right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("UserOutboundProfileOverview - Passing user.id as receiverId:", user.id) // Debug log
                    handleOutgoingRequest(userId, user.userId, "pending")
                  }}
                  className="rounded-full border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <Check size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connect with this player</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("UserOutboundProfileOverview - Passing user.id as receiverId:", user.id) // Debug log
                    handleOutgoingRequest(userId, user.userId, "not-sent")
                  }}
                  className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Skip this profile (for now)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* View Profile Indicator - only shows on hover */}
        <motion.div
          className="bg-brand-500 text-black text-center py-2 text-xs md:text-sm font-medium"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          Click to view full profile
        </motion.div>
      </motion.div>

      {/* Use the extracted modal component */}
      <UserOutboundProfileModal
        open={open}
        onClose={() => setOpen(false)}
        user={{ ...user }}
        compatibility={compatibility} // Pass compatibility directly
      />
    </TooltipProvider>
  )
}

export default UserOutboundProfileOverview
