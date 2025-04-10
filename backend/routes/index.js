// File to include all routes
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

const userRoutes = require('./userRoutes');
router.use('/user', userRoutes);

const chatRoutes = require('./chatRoutes');
router.use('/chat', chatRoutes);

const uploadRoutes = require('./uploadRoutes');
router.use('/cloudinary', uploadRoutes)

const resourceRoutes = require('./resourceRoutes');
router.use('/resource', resourceRoutes);

const emailRoutes = require('./emailRoutes');
router.use('/email', emailRoutes);

module.exports = router;