// Server Config Code

// Dependencies
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { createServer } = require("http") // Import HTTP server
const { Server } = require("socket.io") // Import Socket.io
const Chat = require("./models/Chat") // Import Chat model

// For automated cron jobs
const cron = require('node-cron');
const axios = require('axios');

// Load from .env file
require("dotenv").config()

// Defining endpoints
const routes = require("./routes/index")

// Server Setup
const app = express()
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000", // For local development
        "https://pandotennis.vercel.app", // Your Vercel frontend URL
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Block the request
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies and authentication headers
  })
);

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
    origin: "http://localhost:3000",
    origin: "https://pandotennis.vercal.app", // Adjust this for your frontend
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
  console.log("Health check endpoint hit")
  res.status(200).json({
    status: 'OK',
    message: 'Backend is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// Easter Egg for my Bubi
app.get('/for-my-bubi', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>For My Love ❤️</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #fff5f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: #333;
          }
          .card {
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(255, 105, 180, 0.2);
            padding: 40px;
            max-width: 600px;
            text-align: center;
            animation: fadeIn 1s ease-in;
          }
          .title {
            color: #ff6b9c;
            font-size: 32px;
            margin-bottom: 20px;
          }
          .message {
            font-size: 20px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .images {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
          }
          .images img {
            max-width: 45%; /* Make the images smaller */
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          .footer {
            margin-top: 30px;
            font-size: 18px;
          }
          .timestamp {
            font-size: 14px;
            color: #999;
            margin-top: 30px;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1 class="title">For My Bubs</h1>
          <p class="message">
            Thank you for the support - we are one step closer now :D I love you!!!
          </p>
          <div class="images">
            <img src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1744507858/Pando/zyyjids7pcjemux08qbb.jpg" alt="Image 1">
            <img src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1744507879/Pando/vygjgzyd0dbjq9vj7mha.jpg" alt="Image 2">
          </div>
          <p class="footer">
            From your Lengzai
          </p>
          <div class="timestamp">
            <small>This special message was created just for you at: ${new Date().toLocaleString()}</small>
          </div>
        </div>
      </body>
    </html>
  `;
  res.status(200).send(html);
});


// Default Route for Root Path
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Pando Backend API!',
    endpoints: {
      health: '/health',
      api: '/api',
    },
  });
});

// Schedule a cron job to ping the health endpoint every 13 minutes
cron.schedule('*/13 * * * *', async () => {
  try {
    const HEALTHCHECK_URL = `${process.env.BACKEND_URL}/health`
    console.log('Pinging Pando health check endpoint...', HEALTHCHECK_URL);
    const response = await axios.get(HEALTHCHECK_URL);
    console.log('Health check response:', response.data);
  } catch (error) {
    console.error('Error pinging health check endpoint:', error.message);
  }
});

// Using endpoints
app.use("/api", routes);

// Export app and socket server for testing
module.exports = { app, server, io };

// Starting the server (if not a test)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5001; // Use Render's PORT or fallback to 5001 for local development
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}



