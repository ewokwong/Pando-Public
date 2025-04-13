// Server Config Code

// Dependencies
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { createServer } = require("http") // Import HTTP server
const { Server } = require("socket.io") // Import Socket.io
const Chat = require("./models/Chat") // Import Chat model

// Load from .env file
require("dotenv").config()

// Defining endpoints
const routes = require("./routes/index")

// Server Setup
const app = express()
app.use(express.json())
app.use(cors())

// Connecting to DB
mongoose
  .connect(process.env.MONGO_PANDO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully to Pando namespace")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err) // Use console.error for better visibility
  })

// Create HTTP server and attach Socket.io
const server = createServer(app) // Create HTTP server with Express
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this for your frontend
    methods: ["GET", "POST"],
  },
})

// Socket.io connection event
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id)

  // Join a specific chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId)
    console.log(`User joined chat room: ${chatId}`)
  })

  // Join user's personal room for updates
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user:${userId}`)
    console.log(`User joined personal room: ${userId}`)
  })

  // Leave user's personal room
  socket.on("leaveUserRoom", (userId) => {
    socket.leave(`user:${userId}`)
    console.log(`User left personal room: ${userId}`)
  })

  // Handle new messages
  socket.on("sendMessage", async (message) => {
    console.log("Message received:", message)

    // Emit message to chat room (excluding sender)
    socket.to(message.chatId).emit("newMessage", message)

    try {
      // Get chat details to find participants
      const chat = await Chat.findById(message.chatId)

      if (chat && chat.participants) {
        // Emit to all participants' personal rooms for sidebar updates
        chat.participants.forEach((participantId) => {
          const participantIdStr = participantId.toString()

          // For sidebar updates, we need to notify all participants including sender
          // This ensures the sidebar updates for everyone
          io.to(`user:${participantIdStr}`).emit("newMessage", {
            ...message,
            chatId: message.chatId,
            // Include a flag to indicate this is for sidebar update
            forSidebar: true,
          })
        })
      }
    } catch (err) {
      console.error("Error finding chat participants:", err)
    }
  })

  // Handle typing indicator
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("userTyping")
  })

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// Using endpoints
app.use("/api", routes)

// Export app and socket server for testing
module.exports = { app, server, io }

// Starting the server (if not a test)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5001; // Use Render's PORT or fallback to 5001 for local development
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
