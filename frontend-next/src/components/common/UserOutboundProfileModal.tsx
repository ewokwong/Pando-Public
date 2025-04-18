"use client"

import type React from "react"
import { Dialog } from "@mui/material"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Percent, MapPin, Trophy, ImageIcon, X } from "lucide-react"
import { calculateAge } from "@/utils/dateUtils"
import { getPreferenceColor, getPreferenceLabel } from "@/utils/preferenceUtils"
import { DEFAULT_PROFILE_PHOTO } from "@/constants/defaults"

interface UserOutboundProfileModalProps {
  open: boolean
  onClose: () => void
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
    userPreferences?: {
      fun_social?: boolean
      training_for_competitions?: boolean
      fitness?: boolean
      learning_tennis?: boolean
    }
    [key: string]: any
  }
  compatibility: number
}

const UserOutboundProfileModal: React.FC<UserOutboundProfileModalProps> = ({ open, onClose, user, compatibility }) => {
  const getCompatibilityColor = (value: number): string => {
    if (value >= 80) return "bg-green-500"
    if (value >= 70) return "bg-green-400"
    if (value >= 60) return "bg-yellow-500"
    if (value >= 50) return "bg-yellow-400"
    return "bg-red-500"
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          maxWidth: "100%",
          margin: "16px",
        },
      }}
    >
      <TooltipProvider>
        <div className="bg-white rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-3 md:p-4 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Player Profile</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X size={18} className="md:size-4 text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 md:p-6 relative">
            <div className="flex flex-col items-center mb-4 md:mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-brand-100 mb-3 md:mb-4">
                <img
                  src={user.profilePhoto || DEFAULT_PROFILE_PHOTO}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {user.name}
                {user.dob ? `, ${calculateAge(user.dob)}` : ""}
              </h3>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div></div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Age is calculated from date of birth</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full mb-4">
                    <Percent size={16} className="text-brand-500" />
                    <div className="text-xs md:text-sm text-gray-500 mr-1">Match Compatibility</div>
                    <div className="w-24 md:w-32 h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getCompatibilityColor(compatibility)}`}
                        style={{ width: `${compatibility}%` }} // Use compatibility directly
                      ></div>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">{compatibility}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Our system has deemed you {compatibility}% compatible</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
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

              {user.bio && (
                <div className="bg-brand-50 rounded-lg p-3 md:p-4 text-center mt-4">
                  <p className="text-xs md:text-sm text-gray-600">{user.bio}</p>
                </div>
              )}
            </div>

            {user.userPreferences && (
              <div className="mb-6 md:mb-8">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Tennis Preferences</h3>
                {Object.values(user.userPreferences).some((value) => value) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {Object.entries(user.userPreferences).map(
                      ([key, value]) =>
                        value && (
                          <div
                            key={key}
                            className={`px-3 py-2 rounded-md text-center text-xs md:text-sm font-medium ${getPreferenceColor()}`}
                          >
                            {getPreferenceLabel(key)}
                          </div>
                        ),
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs md:text-sm">User has not yet added their preferences :(</p>
                )}
              </div>
            )}

            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 flex items-center">
                <ImageIcon size={16} className="mr-2 text-brand-500" />
                Media ({user.media?.length || 0} / 4)
              </h3>

              {user.media && user.media.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {user.media.map((mediaUrl, index) => (
                    <div
                      key={index}
                      className="relative border border-gray-200 rounded-lg overflow-hidden h-36 md:h-48 group"
                    >
                      {mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm") ? (
                        <video src={mediaUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={mediaUrl || "/placeholder.svg"}
                          alt={`Media ${index}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 md:p-6 text-center">
                  <p className="text-gray-500 text-xs md:text-sm">No media available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </Dialog>
  )
}

export default UserOutboundProfileModal
