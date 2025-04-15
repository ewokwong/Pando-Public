// MongoDB schema to hold all user information across Pando
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // MongoDB auto-generates an _id for each document which will be used as unique User_ID (primary key)

    // Firebase UID will be used to identify users who use google Auth
    // Sparse means that it will be skipped for documents that do not have this field
    firebaseUID: {
        type: String,
        unique: false, // Set unique to false here; we'll define a partial index later
        sparse: true,  // Allows null values without violating the index
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        default: null, // Make password optional for Firebase users
    },

    // URL for the profile photo
    profilePhoto: {
        type: String,
        required: true,
        default: 'https://res.cloudinary.com/dsnrydwvc/image/upload/v1742098817/default-profile-account-unknown-icon-black-silhouette-free-vector_nczqdl.jpg'
    },

    // Whether user is verified or not
    verified: {
        type: Boolean,
        default: false,
        required: true
    },

    UTR: {
        type: Number,
        min: 1,
        max: 16.5,  // Ensure the UTR value is between 1 and 16.5
        required: false
    },

    dob: {
        type: Date,
        required: false, // DOB can be optional, unless needed otherwise
    },

    bio: {
        type: String,
        default: '', // Default bio text can be empty
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }],

    media: [{
        type: String,  // URLs for media about the user (photos, videos, etc.)
        required: false, // Not required initially
    }],

    // Location of user - look at Location.js file for more details
    location: {
        displayName: { type: String, required: false }, // Name of the location
        latitude: { type: Number, required: false },   // Latitude coordinate
        longitude: { type: Number, required: false }   // Longitude coordinate
    },

    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date when the user is created
    },

    // What the user is looking for
    userPreferences: {
        fun_social: { type: Boolean, default: false },
        training_for_competitions: { type: Boolean, default: false },
        fitness: { type: Boolean, default: false },
        learning_tennis: { type: Boolean, default: false }
    },

    // Boolean to determine whether users profile is complete
    // For a profile to be complete, these fields need to be done:
    // Done on signup:  Email, Name, Password, DOB
    // User to input: Profile Photo, Bio, 1 Photo, 1 Video, Preferences
    // Team to assign: UTR
    profileComplete: {
        type: Boolean,
        required: true,
        default: false
    }
});


module.exports = mongoose.model('User', userSchema);
