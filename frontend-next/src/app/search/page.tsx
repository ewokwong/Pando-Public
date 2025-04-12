"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import UserProfileDisplay from "@/components/common/UserProfileDisplay"
import FullPageContainer from "@/components/common/FullPageContainer"
import { Button } from "@/components/ui/button"
import { Search, Users, RefreshCw, X, Check, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DEFAULT_PROFILE_PHOTO } from "@/constants/defaults"

const SearchPage = () => {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [possibleConnections, setPossibleConnections] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState<{ id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTip, setShowTip] = useState(true)

  const FRONT_OF_LIST_INDEX = 0

  useEffect(() => {
    const userToken = localStorage.getItem("token")

    if (!userToken) {
      console.error("No token found")
      return
    }

    try {
      const decodedToken = jwtDecode<{ userId: string }>(userToken)
      const userId = decodedToken.userId
      setUserId(userId)

      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((response) => {
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching user data:", err)
          setIsLoading(false)
        })

      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${userId}/get-possible-connections`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((response) => {
          setPossibleConnections(response.data)
        })
        .catch((err) => {
          console.error("Error fetching suggested connections:", err)
        })
    } catch (err) {
      console.error("Invalid token:", err)
    }
  }, [router])

  useEffect(() => {
    if (possibleConnections.length > 0) {
      const userId = possibleConnections[FRONT_OF_LIST_INDEX]
      setUserProfile(null) // Reset profile to show loading state

      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${userId}`)
        .then((response) => {
          // Add a small delay for smoother transition
          setTimeout(() => {
            setUserProfile(response.data.user)
          }, 300)
        })
        .catch((err) => {
          console.error("Error fetching user profile", err)
        })
    }
  }, [possibleConnections])

  const handleOutgoingRequest = async (senderId: string, receiverId: string, newStatus: string) => {
    console.log("Sending request:", { senderId, receiverId, newStatus });

    try {
      // Fetch sender details
      const senderResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${senderId}`);
      const sender = senderResponse.data.user;

      // Fetch receiver details
      const receiverResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${receiverId}`);
      const receiver = receiverResponse.data.user;

      // Update outgoing request
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/update-outgoing-request`, {
        senderId,
        receiverId,
        newStatus,
      });

      console.log("Request sent successfully.");

      // If request is sent, send an email to the receiver
      if (newStatus === "pending") {
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/email/connection-invite`, {
          receiverEmail: receiver.email,
          requesterName: sender.name,
          requesterPhoto: sender.profilePhoto || DEFAULT_PROFILE_PHOTO,
          requesterId: senderId,
          requesterUTR: sender.UTR || "N/A",
          requesterLocation: sender.location || "Unknown",
        });
        console.log("Email notification sent successfully.");
      }

    } catch (err) {
      console.error("Error handling outgoing request:", err);
    } finally {
      moveToNextProfile();
    }
  }

  const moveToNextProfile = () => {
    setPossibleConnections((prev) => prev.filter((id) => id !== possibleConnections[FRONT_OF_LIST_INDEX]))
  }

  const refreshPossibleConnections = () => {
    setIsLoading(true)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${userId}/refresh-possible-connections`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      .then((response) => {
        const { updatedConnectionsCount } = response.data
        if (updatedConnectionsCount === 0) {
          alert("Please check back later - our Pando network is rapidly growing!")
        } else {
          window.location.reload()
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error refreshing possible connections:", err)
        setIsLoading(false)
      })
  }

  return (
    <TooltipProvider>
      <FullPageContainer>
        <motion.div
          className="max-w-4xl mx-auto w-full px-4 py-4 bg-slate-50 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-slate-50 p-4 rounded-lg"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Search className="mr-2 h-6 w-6 text-brand-500" />
              Find Tennis Partners
            </h1>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => router.push("/find-friends")}
                  className="flex items-center gap-2 hover:bg-indigo-600 transition-all duration-300"
                >
                  <Users size={16} />
                  <span>View Incoming Requests</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Check who wants to connect with you</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          {/* Tip Banner */}
          <AnimatePresence>
            {showTip && (
              <motion.div
                className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <div className="bg-blue-200 rounded-full p-2 mr-3">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-800">
                    Click on a profile to view more details and connect with potential tennis partners!
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTip(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className="flex flex-col justify-center items-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                  <p className="text-gray-500">Finding tennis partners...</p>
                </motion.div>
              ) : possibleConnections.length === 0 ? (
                <motion.div
                  key="empty"
                  className="p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <motion.div
                      className="bg-gray-50 rounded-full p-6 mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <RefreshCw className="h-12 w-12 text-indigo-500" />
                    </motion.div>

                    <motion.h3
                      className="text-xl font-semibold text-gray-900 mb-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      No More Profiles
                    </motion.h3>

                    <motion.p
                      className="text-gray-600 mb-6 max-w-md"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Our Pando network is ever-growing, so please check back daily for new accounts!
                    </motion.p>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={refreshPossibleConnections}
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition-all duration-300"
                      >
                        <RefreshCw size={16} />
                        View All Profiles Again
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  className="p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <UserProfileDisplay
                      userProfile={userProfile}
                      userId={userId || ""}
                      possibleConnections={possibleConnections}
                      handleOutgoingRequest={handleOutgoingRequest}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </FullPageContainer>
    </TooltipProvider>
  )
}


export default SearchPage

