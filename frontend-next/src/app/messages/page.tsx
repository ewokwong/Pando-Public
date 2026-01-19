"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { jwtDecode, type JwtPayload } from "jwt-decode"
import { useAuth } from "@/context/AuthContext"
import FullPageContainer from "@/components/common/FullPageContainer"
import MessagesSidebar from "@/components/common/MessagesSidebar"
import ChatComponent from "@/components/common/ChatComponent"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const MessagesPage = () => {
  const { isLoggedIn } = useAuth()
  const [userId, setUserId] = useState<string | null>(null)
  const params = useParams()
  const chatId = params?.chatId as string

  // Fetch userId from the decoded JWT token
  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload & { userId: string }>(token)
        setUserId(decodedToken.userId)
      } catch (err) {
        console.error("Error decoding token:", err)
      }
    }
  }, [])

  // Conditional rendering of views based on user data
  const renderContent = () => {
    if (!isLoggedIn) {
        return (
            <motion.div
              className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1768800568/Pando_logo_b7x06s.png"
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
          );
    } else {
      return (
        <motion.div
          className="w-full h-[80vh] flex overflow-hidden bg-gray-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left side: Messages Sidebar */}
          <motion.div
            className="w-1/3 h-full border-r border-gray-200 bg-white shadow-sm"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {userId && <MessagesSidebar userId={userId} currentChatId={chatId || ""} />}
          </motion.div>

          {/* Right side: Chat Window */}
          <motion.div
            className="w-2/3 h-full"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ChatComponent userId={userId || ""} />
          </motion.div>
        </motion.div>
      )
    }
  }

  return (
    <FullPageContainer>
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </FullPageContainer>
  )
}

export default MessagesPage