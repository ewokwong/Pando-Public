"use client"

import type React from "react"
import UserOutboundProfileOverview from "./UserOutboundProfileOverview"
import { motion } from "framer-motion"

interface UserProfile {
  id: string
  name: string
  email: string
  profilePhoto: string
  media: string[]
  // Add other relevant fields for the user profile
}

export interface UserProfileDisplayProps {
  userProfile: UserProfile;
  userId: string;
  possibleConnections: string[]; // Added this line
  handleOutgoingRequest: (senderId: string, receiverId: string, newStatus: string) => Promise<void>;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({
  userProfile,
  userId,
  handleOutgoingRequest,
}) => {
  console.log("userID is", userId)
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
            user={{ ...userProfile, userId }}
            userId={userId}
            handleOutgoingRequest={handleOutgoingRequest}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UserProfileDisplay

