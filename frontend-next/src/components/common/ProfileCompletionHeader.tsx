"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { AlertCircle, ChevronRight } from "lucide-react"
import ProfileCompletionModal from "./ProfileCompletionModal"

const ProfileCompletionHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { userObject, isLoggedIn } = useAuth()

  // Check if profile is complete when user object changes
  useEffect(() => {
    if (userObject) {
      // Check if profile is complete based on required fields
      const hasProfilePhoto = userObject.profilePhoto && userObject.profilePhoto !== "/placeholder.svg"
      const hasBio = !!userObject.bio
      const hasPreferences =
        userObject.userPreferences && Object.values(userObject.userPreferences).some((val: any) => val === true)

      const isComplete = hasProfilePhoto && hasBio && hasPreferences
      setIsProfileComplete(isComplete || !!userObject.profileComplete)
    }
  }, [userObject, isLoggedIn])

  // Don't show if user is not logged in or profile is already complete
  if (!isLoggedIn || isProfileComplete || !isVisible) {
    return null
  }

  return (
    <div className="w-full bg-yellow-400 shadow-md z-30 relative px-4">
      <div className="container mx-auto px-4">
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-yellow-900 mr-2" />
            <p className="text-sm font-medium text-yellow-900">
              Your profile is incomplete! Complete it to help us match you better with our community!
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-medium text-yellow-900 flex items-center hover:text-yellow-800 transition-colors"
          >
            Complete Now
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {isModalOpen && <ProfileCompletionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default ProfileCompletionHeader

