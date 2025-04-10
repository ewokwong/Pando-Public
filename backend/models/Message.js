// MongoDB schema to hold all messages across Pando

const mongoose = require('mongoose');

// Define the Message schema
const messageSchema = new mongoose.Schema({

    // ID of the user who sent the message
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    
    // Secondary key to Chat mongoDB schema
    chatId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Chat', 
        required: true 
    },
    
    content: { 
        type: String, 
        required: true 
    },
    
    // URL pointing to any attachments
    media: { 
        type: String
    }, 
    
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    
    status: { 
        type: String, 
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
