// JS for BE Resource Endpoints
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// Create a new resource
router.post('/:userId/create-resource', async (req, res) => {
    try {
        const resource = new Resource({
            ...req.body,
            created_by: req.params.userId
        });
        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Fetch all resources
router.get('/get-resources', async (req, res) => {
    try {
        const resources = await Resource.find();
        // Sort resources by score (upvote count - downvote count) in descending order,
        // and by date_created in descending order as a secondary sort
        resources.sort((a, b) => {
            const scoreDifference = (b.upvoted_by.length - b.downvoted_by.length) - (a.upvoted_by.length - a.downvoted_by.length);
            if (scoreDifference !== 0) {
                return scoreDifference;
            }
            return new Date(b.date_created) - new Date(a.date_created);
        });
        res.status(200).json(resources);
    } catch (error) {
        console.log("Error fetching resources:", error);
        res.status(400).json({ error: error.message });
    }
});

// Edit a resource by ID
router.put('/:id', async (req, res) => {
    console.log("Editing resource");
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a resource by ID
router.delete('/:id', async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Upvote a resource by ID
router.post('/:resourceID/:userID/upvote', async (req, res) => {
    console.log(`Upvote called for resourceID: ${req.params.resourceID}, userID: ${req.params.userID}`);
    try {
        const resource = await Resource.findById(req.params.resourceID);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        if (!resource.upvoted_by.includes(req.params.userID)) {
            resource.upvoted_by.push(req.params.userID);
            await resource.save();
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Downvote a resource by ID
router.post('/:resourceID/:userID/downvote', async (req, res) => {
    console.log(`Downvote called for resourceID: ${req.params.resourceID}, userID: ${req.params.userID}`);
    try {
        const resource = await Resource.findById(req.params.resourceID);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        if (!resource.downvoted_by.includes(req.params.userID)) {
            resource.downvoted_by.push(req.params.userID);
            await resource.save();
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Remove vote from a resource by ID
router.post('/:resourceID/:userID/remove-vote', async (req, res) => {
    console.log("Going to remove vote");
    console.log(`Remove vote called for resourceID: ${req.params.resourceID}, userID: ${req.params.userID}`);
    try {
        const resource = await Resource.findById(req.params.resourceID);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        const upvoteIndex = resource.upvoted_by.indexOf(req.params.userID);
        if (upvoteIndex !== -1) {
            resource.upvoted_by.splice(upvoteIndex, 1);
        }
        const downvoteIndex = resource.downvoted_by.indexOf(req.params.userID);
        if (downvoteIndex !== -1) {
            resource.downvoted_by.splice(downvoteIndex, 1);
        }
        await resource.save();
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;