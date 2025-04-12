"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import { io } from "socket.io-client"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Info, ArrowDown } from "lucide-react"
import UserOutboundProfileModal from "./UserOutboundProfileModal"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// Connect to socket
let socket: any

// Initialize socket only on client side
if (typeof window !== "undefined") {
  socket = io("http://localhost:5001")
}

const ChatComponent = ({ userId }: { userId: string }) => {
  const params = useParams()
  const chatId = params?.chatId as string
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  // State
  const [otherUser, setOtherUser] = useState<{
    id?: string
    _id?: string
    userId?: string
    name: string
    profilePhoto?: string
    bio?: string
    location?: {
      displayName?: string; // Matches schema
      latitude?: number;
      longitude?: number;
    } | null; // Allow location to be null
    UTR?: number; // Ensure UTR is optional
    dob?: string;
    media?: string[]; // Ensure media is always an array
    userPreferences?: {
      fun_social?: boolean
      training_for_competitions?: boolean
      fitness?: boolean
      learning_tennis?: boolean
    }
  } | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<
    { senderId: string; content: string; senderName: string; timestamp?: Date; _id?: string }[]
  >([])
  const [isTyping, setIsTyping] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  const MESSAGES_PER_PAGE = 20

  // Function to fetch messages with pagination
  const fetchMessages = useCallback(
    async (pageNum: number, shouldAppend = false) => {
      if (!chatId) return

      try {
        setIsLoadingMore(true)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/chat/${chatId}/get-messages?page=${pageNum}&limit=${MESSAGES_PER_PAGE}`,
        )

        const fetchedMessages = response.data.messages

        if (fetchedMessages.length < MESSAGES_PER_PAGE) {
          setHasMoreMessages(false)
        }

        if (shouldAppend) {
          // When loading older messages, add them to the beginning
          setMessages((prev) => [...fetchedMessages, ...prev])
        } else {
          // Initial load or refresh
          setMessages(fetchedMessages)
          setShouldScrollToBottom(true)
        }

        setIsLoadingMore(false)
      } catch (error) {
        console.error("Error fetching messages", error)
        setIsLoadingMore(false)
      }
    },
    [chatId],
  )

  useEffect(() => {
    if (!chatId || !userId) return

    // Reset state when chatId changes
    setMessages([])
    setOtherUser(null)
    setMessage("")
    setPage(1)
    setHasMoreMessages(true)
    setShouldScrollToBottom(true)

    // Fetch initial messages
    fetchMessages(1, false)

    // Fetch other user info
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/chat/${chatId}/get-users`)
      .then((response) => {
        const userIdList = response.data.users
        const otherUserId = userIdList.find((user: string) => user !== userId)
        if (otherUserId) {
          axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/${otherUserId}`)
            .then((response) => {
              const userData = response.data.user
              setOtherUser({
                ...userData,
                userId: userData._id || userData.id || otherUserId,
                media: userData.media || [], // Default to an empty array
                location: userData.location || null, // Default to null if location is missing
              })
            })
            .catch((error) => console.error("Error fetching other user's info:", error))
        }
      })
      .catch((error) => console.error("Error fetching chat users", error))

    // Join chat for socket updates
    if (socket) {
      socket.emit("joinChat", chatId)
      socket.on("newMessage", (newMessage: any) => {
        // Only add the message if it's not from the current user
        // This prevents duplicates when we send a message
        if (newMessage.senderId !== userId) {
          console.log("Received new message via socket:", newMessage)
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(
              (msg) =>
                msg._id === newMessage._id ||
                (msg.content === newMessage.content &&
                  msg.senderId === newMessage.senderId &&
                  new Date(msg.timestamp ?? 0).getTime() === new Date(newMessage.timestamp ?? 0).getTime()),
            )

            if (messageExists) {
              return prev
            }
            return [...prev, newMessage]
          })
          setShouldScrollToBottom(true)
        }
      })

      socket.on("userTyping", () => {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 3000)
      })
    }

    // Cleanup socket events on unmount or when chatId changes
    return () => {
      if (socket) {
        socket.off("newMessage")
        socket.off("userTyping")
        socket.emit("leaveChat", chatId)
      }
    }
  }, [chatId, userId, fetchMessages])

  // Handle scrolling and load more messages when scrolling to top
  useEffect(() => {
    const chatContainer = chatContainerRef.current

    if (!chatContainer) return

    const handleScroll = () => {
      // Show/hide scroll to bottom button based on scroll position
      const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100
      setShowScrollToBottom(!isNearBottom)

      // Load more messages when scrolling to top
      if (chatContainer.scrollTop < 50 && hasMoreMessages && !isLoadingMore) {
        const nextPage = page + 1
        setPage(nextPage)
        fetchMessages(nextPage, true)
      }
    }

    chatContainer.addEventListener("scroll", handleScroll)

    return () => {
      chatContainer.removeEventListener("scroll", handleScroll)
    }
  }, [hasMoreMessages, isLoadingMore, page, fetchMessages])

  // Scroll to bottom when new messages arrive or when initially loading
  useEffect(() => {
    if (shouldScrollToBottom && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      setShouldScrollToBottom(false)
    }
  }, [messages, shouldScrollToBottom])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const sendMessage = () => {
    if (message.trim() === "" || !chatId) return

    const messageData = {
      senderId: userId,
      content: message,
      timestamp: new Date(),
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/chat/${chatId}/send-message`, messageData)
      .then((response) => {
        // Add the message to the local state
        const newMessage = {
          ...response.data,
          senderName: "You", // Add sender name for display
        }

        setMessages((prev) => [...prev, newMessage])

        if (socket) {
          // Emit the message to others in the chat
          socket.emit("sendMessage", {
            ...response.data,
            chatId: chatId,
            senderName: "You",
          })
        }

        setMessage("") // Clear the input field after sending
        setShouldScrollToBottom(true)
      })
      .catch((error) => console.error("Error sending message", error))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Enter key, but not Shift + Enter
      e.preventDefault()
      sendMessage()
    } else if (socket) {
      socket.emit("typing", chatId)
    }
  }

  const handleOutgoingRequest = (senderId: string, receiverId: string, newStatus: string) => {
    console.log("Handling outgoing request:", senderId, receiverId, newStatus)
    // Here you would typically make an API call to update the connection status
    // For now, we'll just close the modal
    setIsProfileModalOpen(false)
  }

  if (!chatId) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-full bg-gray-50 p-8 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 bg-indigo-100 p-4 rounded-full"
        >
          <Info size={40} className="text-indigo-600" />
        </motion.div>
        <motion.p
          className="text-lg text-gray-600 text-center max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          No chat selected. Please select a conversation from the sidebar to start messaging.
        </motion.p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex flex-col h-full bg-gray-50 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chat Header */}
      <motion.div
        className="p-4 bg-white border-b border-gray-200 flex items-center shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {otherUser?.profilePhoto ? (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 mr-3">
            <img
              src={otherUser.profilePhoto || "/placeholder.svg"}
              alt={otherUser.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
            {otherUser?.name?.charAt(0) || "?"}
          </div>
        )}
        <div className="flex-grow">
          <h3 className="font-medium text-gray-900">{otherUser ? otherUser.name : "Loading..."}</h3>
          <p className="text-xs text-gray-500">{isTyping ? "Typing..." : "Online"}</p>
        </div>
        <motion.button
          onClick={() => setIsProfileModalOpen(true)}
          className="bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Profile
        </motion.button>
      </motion.div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && otherUser && (
          <UserOutboundProfileModal
            open={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            user={{
              name: otherUser.name,
              profilePhoto: otherUser.profilePhoto || "",
              bio: otherUser.bio || "",
              location: { displayName: otherUser.location?.displayName || "Unknown" }, // Use displayName or fallback
              UTR: otherUser.UTR?.toString() || "N/A", // Convert UTR to string
              dob: otherUser.dob || "",
              media: otherUser.media || [], // Ensure media is an array
              userPreferences: otherUser.userPreferences || {},
            }}
            compatibility={Math.floor(Math.random() * 41) + 60} // Example compatibility
          />
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 bg-gray-50 scroll-smooth">
        {/* Loading indicator for older messages */}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* End of history message */}
        {!hasMoreMessages && messages.length > 0 && (
          <div className="text-center py-2 mb-4">
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Beginning of conversation</span>
          </div>
        )}

        {messages.length === 0 && !isLoadingMore ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-center mb-2">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const isSent = msg.senderId === userId
              return (
                <motion.div
                  key={index}
                  className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20, x: isSent ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`max-w-[70%] ${isSent ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isSent
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className={`text-xs mt-1 ${isSent ? "text-right" : "text-left"} text-gray-500`}>
                      {isSent ? "You" : msg.senderName} •{" "}
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "Just now"}
                    </p>
                  </div>
                </motion.div>
              )
            })}
            <div ref={lastMessageRef} />
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollToBottom && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className="absolute bottom-24 right-6 bg-black text-white rounded-full p-3 shadow-lg z-10"
                  onClick={scrollToBottom}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowDown size={20} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Scroll to latest messages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div
        className="p-4 bg-white border-t border-gray-200"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all duration-200">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={handleKeyDown}
            className="flex-grow p-3 bg-transparent outline-none resize-none min-h-[60px] max-h-[120px] text-gray-800"
          />
          <div className="flex items-center h-full pr-3">
            <motion.button
              onClick={sendMessage}
              className={`p-3 rounded-full flex items-center justify-center ${
                message.trim() === ""
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white shadow-md hover:bg-gray-800"
              } transition-all duration-200`}
              whileHover={{ scale: message.trim() === "" ? 1 : 1.05 }}
              whileTap={{ scale: message.trim() === "" ? 1 : 0.95 }}
              disabled={message.trim() === ""}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ChatComponent
