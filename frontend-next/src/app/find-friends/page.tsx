"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import FullPageContainer from "@/components/common/FullPageContainer"
import { UserPlus, Search, Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import UserProfileOverview from "@/components/common/UserProfileOverview"
import { DEFAULT_PROFILE_PHOTO } from "@/constants/defaults"

// Helper function to calculate age from date of birth
const calculateAge = (dob: string) => {
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

const FindFriendsPage = () => {
  const { isLoggedIn } = useAuth()

  const [userId, setUserID] = useState<string | null>(null)
  const [incomingRequests, setIncomingRequests] = useState<{ _id: string; sender: string }[]>([])
  interface UserProfile {
    media: string[] // Ensure media is always an array
    profilePhoto?: string
    name: string
    dob?: string
    UTR?: number // Ensure UTR is optional
    location?: {
      displayName?: string // Matches schema
      latitude?: number
      longitude?: number
    } | null // Allow location to be null
    bio?: string
    userPreferences?: {
      fun_social?: boolean
      training_for_competitions?: boolean
      fitness?: boolean
      learning_tennis?: boolean
    }
  }

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTip, setShowTip] = useState(true)

  const FRONT_OF_LIST_INDEX = 0

  useEffect(() => {
    const userToken = localStorage.getItem("token")
    setIsLoading(true)

    if (!userToken) {
      console.error("No token found")
      setIsLoading(false)
      return
    }

    try {
      const decodedToken = jwtDecode<{ userId: string }>(userToken)
      const userId = decodedToken.userId

      setUserID(userId)

      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((response) => {
          return axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${userId}/getIncomingRequests?status=pending`,
            {
              headers: { Authorization: `Bearer ${userToken}` },
            },
          )
        })
        .then((response) => {
          setIncomingRequests(response.data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching data:", err)
          setIsLoading(false)
        })
    } catch (err) {
      console.error("Invalid token:", err)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (incomingRequests.length > 0) {
      setUserProfile(null) // Reset profile to show loading state

      const userId = incomingRequests[FRONT_OF_LIST_INDEX].sender
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${userId}`)
        .then((response) => {
          const user = response.data?.user || {} // Safely access user data
          setTimeout(() => {
            setUserProfile({
              ...user,
              media: user.media || [], // Default to an empty array
              location: user.location || null, // Default to null if location is missing
            })
          }, 300)
        })
        .catch((err) => {
          console.error("Error fetching user profile", err)
        })
    }
  }, [incomingRequests])

  const handleAccept = async (requestId: string, senderId: string, receiverId: string | null) => {
    console.log("Accepting request with ID:", requestId)

    try {
      // Fetch sender details
      const senderResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${senderId}`)
      const sender = senderResponse.data.user

      // Fetch receiver details
      const receiverResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${receiverId}`)
      const receiver = receiverResponse.data.user

      // Update the incoming request status to "accepted"
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/update-incoming-request`, {
        requestId,
        status: "accepted",
      })

      // Add sender and receiver as friends
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/add-friend`, {
        senderId,
        receiverId,
      })

      // Create a chat between the sender and receiver
      const chatResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/chat/create-chat`, {
        senderId,
        receiverId,
      })
      const chatId = chatResponse.data.chatId

      // Send connection accepted email
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/email/connection-accepted`, {
        receiverEmail: sender.email, // Email of the sender (who sent the request)
        acceptorName: receiver.name, // Name of the receiver (who accepted the request)
        acceptorPhoto: receiver.profilePhoto || DEFAULT_PROFILE_PHOTO, // Receiver's profile photo
        acceptorId: receiverId, // Receiver's ID
        acceptorUTR: receiver.UTR || "N/A", // Receiver's UTR rating
        acceptorLocation: receiver.location || "Unknown", // Receiver's location
      })

      console.log("Email notification sent successfully.")

      // Redirect to the chat page
      window.location.href = `/messages/${chatId}`
    } catch (err) {
      console.error("Error accepting request or adding friend:", err)
    }
  }

  interface RejectRequestParams {
    requestId: string
  }

  const handleReject = (requestId: RejectRequestParams["requestId"]) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/update-incoming-request`, {
        requestId,
        status: "rejected",
      })
      .then(() => moveToNextRequest())
      .catch((err: unknown) => {
        console.error("Error rejecting request", err)
      })
  }

  const moveToNextRequest = () => {
    setIncomingRequests((prevRequests) =>
      prevRequests.filter((request) => request._id !== incomingRequests[FRONT_OF_LIST_INDEX]._id),
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          ></motion.div>
          <motion.p
            className="mt-4 text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading your connections...
          </motion.p>
        </motion.div>
      )
    }

    if (!isLoggedIn) {
      return (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1742612869/Pando/mzmqqozsnnlip70xwlef.svg"
            alt="Pando Icon"
            className="w-24 h-24 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
          <motion.h2
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Join the Pando Network
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Become a member to connect with our community of tennis players and enthusiasts!
          </motion.p>
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* <Link href="/sign-up" legacyBehavior>
              <Button className="bg-brand-500 hover:bg-brand-600">Sign Up</Button>
            </Link> */}
            <Link href="/login" legacyBehavior>
              <Button variant="outline">Log In</Button>
            </Link>
          </motion.div>
        </motion.div>
      )
    }

    // Always show the main content, regardless of verification status
    return (
      // Container
      <motion.div
        className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="pt-6 px-4 md:px-6">
          <motion.div
            className="w-full flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-base md:text-xl font-semibold text-gray-900 flex items-center">
              <UserPlus className="mr-2 h-5 w-5 md:h-6 md:w-6 text-blue-500" />
              Find Tennis Friends
            </h1>
            <Link href="/search" legacyBehavior>
              <a>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-sm px-3 py-1.5 md:px-4 md:py-2 transition-all duration-300 w-full md:w-auto"
                    >
                      <Search size={16} />
                      <span>Find More Players</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Explore the Pando Network!</TooltipContent>
                </Tooltip>
              </a>
            </Link>
          </motion.div>
        </div>

        {/* Tip Banner - Only show when there are incoming requests */}
        <AnimatePresence>
          {showTip && incomingRequests.length > 0 && (
            <motion.div
              className="bg-yellow-50 border-y border-yellow-100 p-3 md:p-4 flex items-center justify-between mt-5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-full p-1.5 md:p-2 mr-2 md:mr-3">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                </div>
                <p className="text-xs md:text-sm text-yellow-700 font-medium">
                  These are players who want to connect with you. Accept to start a conversation!
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTip(false)}
                className="text-brand-500 hover:text-brand-700"
              >
                <X size={16} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content - Consistent padding with search page */}
        <div className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            {incomingRequests.length === 0 ? (
              <motion.div
                key="empty"
                className="flex flex-col items-center justify-center py-8 md:py-12 px-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-gray-50 rounded-full p-4 md:p-6 mb-4 md:mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Mail className="h-8 w-8 md:h-12 md:w-12 text-brand-500" />
                </motion.div>

                <motion.h3
                  className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  No Incoming Requests
                </motion.h3>

                <motion.p
                  className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  You don't have any connection requests at the moment. Begin expanding your tennis network with the top
                  right button!
                </motion.p>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <Link href="/search" legacyBehavior>
                    <a>
                      <Button className="bg-brand-500 hover:bg-brand-600 flex items-center gap-2">
                        <Search size={16} />
                        Find Players
                      </Button>
                    </a>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 md:mr-3">
                      <UserPlus size={14} className="md:size-16 text-green-600" />
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-green-700">
                      Connection Requests ({incomingRequests.length})
                    </h2>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                  Showing request {incomingRequests.length > 0 ? 1 : 0} of {incomingRequests.length}
                </p>

                <AnimatePresence mode="wait">
                  {userProfile ? (
                    <UserProfileOverview
                      user={{
                        ...userProfile,
                        userId: incomingRequests[FRONT_OF_LIST_INDEX].sender,
                        media: userProfile?.media || [], // Ensure media is provided as an array
                        profilePhoto: userProfile?.profilePhoto || "", // Provide a default value for profilePhoto
                        UTR: userProfile?.UTR?.toString() || undefined, // Convert UTR to string
                        location: userProfile?.location?.displayName
                          ? { displayName: userProfile.location.displayName }
                          : undefined, // Ensure location matches expected type
                      }}
                      userId={userId || ""}
                      handleOutgoingRequest={(senderId, receiverId, newStatus) => {
                        console.log("handleOutgoingRequest called with:", { senderId, receiverId, newStatus }) // Debug log
                        if (newStatus === "rejected") {
                          handleReject(incomingRequests[FRONT_OF_LIST_INDEX]._id)
                        } else if (newStatus === "accepted") {
                          handleAccept(
                            incomingRequests[FRONT_OF_LIST_INDEX]._id,
                            incomingRequests[FRONT_OF_LIST_INDEX].sender,
                            userId,
                          )
                        }
                      }}
                    />
                  ) : (
                    <motion.div
                      key="loading-profile"
                      className="flex justify-center items-center py-12 md:py-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-brand-500"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  return (
    <FullPageContainer>
      <motion.div
        className="py-0 px-4 md:px-6 max-w-4xl mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <TooltipProvider>{renderContent()}</TooltipProvider>
      </motion.div>
    </FullPageContainer>
  )
}

export default FindFriendsPage
