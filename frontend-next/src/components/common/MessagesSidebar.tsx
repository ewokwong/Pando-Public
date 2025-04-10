"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MessageSquare, Users, Clock } from "lucide-react"
import { io } from "socket.io-client"

// Connect to socket
let socket: any

// Initialize socket only on client side
if (typeof window !== "undefined") {
  socket = io("http://localhost:5001")
}

interface MessagesSidebarProps {
  userId: string
  currentChatId: string
}

interface Chat {
  _id: string
  participants: {
    _id: string
    name: string
    profilePhoto?: string
  }[]
  lastMessage?: {
    content: string
    timestamp: string
    senderId: string
  }
  unreadCount?: number
}

const MessagesSidebar = ({ userId, currentChatId }: MessagesSidebarProps) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // First, let's add a new state for tracking which chat has a new message animation
  // Add this after the other state declarations:

  const [animatingChatId, setAnimatingChatId] = useState<string | null>(null)

  // Fetch user chats from the backend
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`http://localhost:5001/api/chat/get-chats/${userId}`)
        console.log("Fetched chats:", response.data.chats)

        // Sort chats by latest message timestamp
        const sortedChats = response.data.chats.sort((a: Chat, b: Chat) => {
          if (!a.lastMessage?.timestamp) return 1
          if (!b.lastMessage?.timestamp) return -1
          return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
        })

        setChats(sortedChats)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching chats:", err)
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchChats()
    }
  }, [userId])

  // Now, update the handleNewMessage function in the socket listener useEffect:

  // Listen for new messages
  const handleNewMessage = (message: any) => {
    console.log("New message received via socket:", message)

    setChats((prevChats) => {
      // Find the chat that received the new message
      const chatIndex = prevChats.findIndex((chat) => chat._id === message.chatId)

      if (chatIndex === -1) return prevChats // Chat not found

      // Create a copy of the chats array
      const updatedChats = [...prevChats]
      const chat = { ...updatedChats[chatIndex] }

      // Update the chat with the new message
      chat.lastMessage = {
        content: message.content,
        timestamp: message.timestamp || new Date().toISOString(),
        senderId: message.senderId,
      }

      // Increment unread count if not the current chat
      chat.unreadCount = currentChatId === chat._id ? 0 : (chat.unreadCount || 0) + 1

      // Replace the chat in the array
      updatedChats[chatIndex] = chat

      // Remove the chat from its current position
      const [movedChat] = updatedChats.splice(chatIndex, 1)

      // Add it to the beginning of the array
      updatedChats.unshift(movedChat)

      // Trigger animation for this chat
      setAnimatingChatId(movedChat._id)

      // Clear animation after a delay
      setTimeout(() => {
        setAnimatingChatId(null)
      }, 1000)

      return updatedChats
    })
  }

  useEffect(() => {
    if (!socket || !userId) return

    console.log("Setting up socket listeners for user:", userId)

    // Join user's personal room to receive updates
    socket.emit("joinUserRoom", userId)

    socket.on("newMessage", handleNewMessage)

    // Clean up on unmount
    return () => {
      console.log("Cleaning up socket listeners")
      socket.off("newMessage", handleNewMessage)
      socket.emit("leaveUserRoom", userId)
    }
  }, [userId, currentChatId])

  // Reset unread count when changing chats
  useEffect(() => {
    if (currentChatId) {
      setChats((prevChats) =>
        prevChats.map((chat) => (chat._id === currentChatId ? { ...chat, unreadCount: 0 } : chat)),
      )
    }
  }, [currentChatId])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const now = new Date()

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If this week, show day name
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    }

    // Otherwise show date
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const truncateMessage = (message: string, maxLength = 30) => {
    if (!message) return ""
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message
  }

  const handleChatClick = (chatId: string) => {
    // Use Next.js router to navigate programmatically
    router.push(`/messages/${chatId}`)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="p-4 border-b border-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" />
          Messages
        </h2>
      </motion.div>

      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : chats.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-64 p-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-indigo-100 p-3 rounded-full mb-3">
              <Users className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="text-gray-500 mb-2">No conversations yet</p>
            <p className="text-sm text-gray-400">Connect with other users to start chatting</p>
          </motion.div>
        ) : (
          <motion.div className="divide-y divide-gray-100" variants={container} initial="hidden" animate="show">
            {chats.map((chat) => {
              const otherParticipant = chat.participants.find((p) => p._id !== userId)
              const isActive = currentChatId === chat._id
              const isOwnMessage = chat.lastMessage?.senderId === userId
              const isAnimating = animatingChatId === chat._id
              const hasUnread = !isActive && chat.unreadCount && chat.unreadCount > 0

              return (
                <motion.div
                  key={chat._id}
                  variants={item}
                  animate={
                    isAnimating
                      ? {
                          backgroundColor: ["rgba(79, 70, 229, 0.1)", "transparent"],
                          transition: { duration: 0.8 },
                        }
                      : {}
                  }
                >
                  <div onClick={() => handleChatClick(chat._id)} className="block cursor-pointer">
                    <motion.div
                      className={`p-3 hover:bg-gray-50 transition-colors duration-200 ${
                        isActive
                          ? "bg-indigo-50 border-l-4 border-indigo-500"
                          : hasUnread
                            ? "bg-indigo-50/30 border-l-4 border-indigo-300"
                            : ""
                      }`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        {otherParticipant?.profilePhoto ? (
                          <div
                            className={`w-12 h-12 rounded-full overflow-hidden mr-3 border ${hasUnread ? "border-indigo-400" : "border-gray-200"} flex-shrink-0 ${hasUnread ? "ring-2 ring-indigo-300" : ""}`}
                          >
                            <img
                              src={otherParticipant.profilePhoto || "/placeholder.svg"}
                              alt={otherParticipant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0 ${
                              isActive
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                : hasUnread
                                  ? "bg-gradient-to-r from-indigo-400 to-purple-500"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500"
                            } ${hasUnread ? "ring-2 ring-indigo-300" : ""}`}
                          >
                            {otherParticipant ? getInitials(otherParticipant.name) : "?"}
                          </div>
                        )}

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3
                              className={`font-medium truncate ${isActive ? "text-indigo-700" : hasUnread ? "text-indigo-600" : "text-gray-800"}`}
                            >
                              {otherParticipant ? otherParticipant.name : "Unknown User"}
                            </h3>
                            {chat.lastMessage?.timestamp && (
                              <div className="flex items-center ml-2 flex-shrink-0">
                                <Clock className={`h-3 w-3 ${hasUnread ? "text-indigo-500" : "text-gray-400"} mr-1`} />
                                <span
                                  className={`text-xs ${hasUnread ? "text-indigo-500 font-medium" : "text-gray-400"}`}
                                >
                                  {formatTimestamp(chat.lastMessage.timestamp)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            {chat.lastMessage ? (
                              <p
                                className={`text-sm truncate ${
                                  hasUnread ? "font-medium text-indigo-800" : "text-gray-500"
                                }`}
                              >
                                {isOwnMessage && (
                                  <span className={`${hasUnread ? "text-indigo-600" : "text-gray-400"} mr-1`}>
                                    You:
                                  </span>
                                )}
                                {truncateMessage(chat.lastMessage.content)}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No messages yet</p>
                            )}

                            {chat.unreadCount && !isActive ? (
                              <span className="ml-2 bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                                {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MessagesSidebar
