// Schema for resources
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    // Will be tagged with same as preferences
    tags: {
        fun_social: { type: Boolean, default: false },
        training_for_competitions: { type: Boolean, default: false },
        fitness: { type: Boolean, default: false },
        learning_tennis: { type: Boolean, default: false }
    },
    upvoted_by: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: [] // Initialize as empty list
    }],
    downvoted_by: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: [] // Initialize as empty list
    }],
    date_created: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('Resource', ResourceSchema);
