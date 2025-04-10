// MongoDB schema to hold all chats across Pando
const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Store last message details directly in the chat document for efficient retrieval
  lastMessage: {
    content: { type: String },
    timestamp: { type: Date },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // Add updatedAt for sorting by recent activity
})

// Add a pre-save hook to update the updatedAt field
chatSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat
