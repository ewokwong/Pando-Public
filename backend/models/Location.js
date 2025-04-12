const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    displayName: {
        type: String, // Human-readable name (e.g., "New York, USA")
        required: true,
    },
    latitude: {
        type: Number, // Latitude coordinate
        required: true,
    },
    longitude: {
        type: Number, // Longitude coordinate
        required: true,
    }
});

module.exports = mongoose.model('Location', locationSchema);