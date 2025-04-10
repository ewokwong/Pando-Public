// MongoDB schema to hold all connection requests across Pando
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({

    // Secondary key referencing user who sent the friend request
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 

    // Secondary key referencing user who sent the friend request
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    // Status of the request ('sent', 'accepted', 'rejected', 'not-sent' -> user rejected profile in search)
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'not-sent'], 
        default: 'pending' 
    },

    // Date when the request was created
    createdAt: { 
        type: Date, 
        default: Date.now 
    },

    // Date when the request was last updated
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
