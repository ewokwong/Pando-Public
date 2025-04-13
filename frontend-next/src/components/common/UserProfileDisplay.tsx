"use client"

import type React from "react"
import UserOutboundProfileOverview from "./UserOutboundProfileOverview"
import { motion } from "framer-motion"

interface UserProfileDisplayProps {
  userProfile: any // Replace 'any' with the appropriate type if known
  userId: string // Assuming userId is a string, adjust the type if necessary
  possibleConnections: { userID: string; compatibility: number }[] // Updated type for possibleConnections
  handleOutgoingRequest: (senderId: string, receiverId: string, newStatus: string) => void // Adjust the function signature if necessary
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({
  userProfile,
  userId,
  possibleConnections,
  handleOutgoingRequest,
}) => {
  console.log("userID is", userId)
  console.log("userProfile is", userProfile)
  console.log("possibleConnections is", possibleConnections)

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="UserProfileDisplay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="UserProfileContent">
        <motion.div
          className="UserProfileActions"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <UserOutboundProfileOverview
            user={userProfile}
            userId={userId}
            handleOutgoingRequest={handleOutgoingRequest}
            compatibility={userProfile.compatibility} // Use userProfile.compatibility
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UserProfileDisplay

