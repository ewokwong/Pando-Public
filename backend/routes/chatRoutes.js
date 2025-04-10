// BE code to handle chat routes
const express = require("express")
const router = express.Router()
const Chat = require("../models/Chat")
const User = require("../models/User")
const Message = require("../models/Message")

// Route to get users in a specific chat
router.get("/:chatId/get-users", async (req, res) => {
  try {
    const { chatId } = req.params

    console.log("Getting users in chat", chatId)

    // Find the chat by its ID and populate the 'participants' field (users)
    const chat = await Chat.findById(chatId).exec()

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Return a list of users: [userID, userID...]
    return res.json({ users: chat.participants })
  } catch (err) {
    console.error("Error fetching chat users:", err)
    return res.status(500).json({ message: "Failed to retrieve users" })
  }
})

// Route to get chats for a specific user
router.get("/get-chats/:userId", async (req, res) => {
  const { userId } = req.params // Extract userId from the route parameters
  console.log("Will get chats for user:", userId)

  try {
    // Find all chats that include the user as a participant
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name profilePhoto") // Populate participant names and profile photos
      .sort({ "lastMessage.timestamp": -1 }) // Sort by last message timestamp

    // Process chats to include last message details and unread counts
    const processedChats = await Promise.all(
      chats.map(async (chat) => {
        const chatObj = chat.toObject()

        // Count unread messages for this user in this chat
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          senderId: { $ne: userId }, // Not sent by this user
          read: { $ne: true }, // Not marked as read
        })

        return {
          ...chatObj,
          unreadCount: unreadCount || 0,
        }
      }),
    )

    console.log("Processed chats:", JSON.stringify(processedChats.slice(0, 2), null, 2)) // Log just first 2 for brevity

    // Return the chats as a list of chat objects
    res.status(200).json({ chats: processedChats })
  } catch (error) {
    console.error("Error fetching user's chats:", error)
    res.status(500).json({ message: "Server error while fetching chats." })
  }
})

// Route to create a chat
router.post("/create-chat", async (req, res) => {
  const { senderId, receiverId } = req.body

  try {
    // Ensure both users exist
    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId)

    if (!sender || !receiver) {
      return res.status(404).json({ message: "One or both users not found" })
    }

    // Create a new chat with both users as participants
    const newChat = new Chat({
      participants: [senderId, receiverId],
    })

    // Save the new chat in the database
    const chat = await newChat.save()

    // Return the newly created chat ID
    res.status(200).json({ message: "Chat created successfully", chatId: chat._id })
  } catch (error) {
    console.error("Error creating chat:", error)
    res.status(500).json({ message: "Server error while creating chat" })
  }
})

// Route to get message for a specific chat
router.get("/:chatId/get-messages", async (req, res) => {
  try {
    const { chatId } = req.params
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    console.log("Getting messages for chat", chatId, "page:", page, "limit:", limit)

    // Find messages by chatId with pagination
    const messages = await Message.find({ chatId })
      .sort({ timestamp: -1 }) // Sort by timestamp descending for pagination
      .skip(skip)
      .limit(limit)
      .populate("senderId", "name") // Populate sender name
      .exec()

    // Format messages for client
    const formattedMessages = messages
      .map((msg) => ({
        _id: msg._id,
        senderId: msg.senderId._id || msg.senderId,
        content: msg.content,
        senderName: msg.senderId.name || "Unknown",
        timestamp: msg.timestamp || msg.createdAt,
      }))
      .reverse() // Reverse to get chronological order

    console.log("Returning messages:", formattedMessages.length)

    return res.json({ messages: formattedMessages })
  } catch (err) {
    console.error("Error fetching messages:", err)
    return res.status(500).json({ message: "Failed to retrieve messages" })
  }
})

// Route to send message to a new chat
router.post("/:chatId/send-message", async (req, res) => {
  try {
    const { chatId } = req.params
    const { senderId, content, timestamp } = req.body

    console.log("Chat, sender, content =", chatId, senderId, content)

    // Get sender name for the response
    const sender = await User.findById(senderId).select("name")

    // Create a new message
    const newMessage = new Message({
      senderId,
      chatId,
      content,
      timestamp: timestamp || new Date(),
    })

    // Save the message to the database
    const savedMessage = await newMessage.save()

    // Get the current timestamp
    const messageTimestamp = savedMessage.timestamp || savedMessage.createdAt

    // Update the chat's lastMessage field and move it to the top of the list
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: {
        content,
        timestamp: messageTimestamp,
        senderId,
      },
      // Update the createdAt to move it to the top when sorting
      updatedAt: new Date(),
    })

    // Format the response
    const messageResponse = {
      _id: savedMessage._id,
      senderId,
      content,
      senderName: sender ? sender.name : "Unknown",
      timestamp: messageTimestamp,
      chatId: chatId, // Ensure chatId is included
    }

    console.log("Sending new message:", messageResponse)

    // Respond with the saved message
    return res.status(201).json(messageResponse)
  } catch (err) {
    console.error("Error sending message:", err)
    return res.status(500).json({ message: "Failed to send message" })
  }
})

module.exports = router
