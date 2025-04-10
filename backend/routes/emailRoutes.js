const express = require('express');
const {
  sendConnectionAccepted,
  sendConnectionRequest,
  sendLoginAlert,
  sendNewMessage,
} = require('../controllers/emailController');

const router = express.Router();

// Route to send an email when a connection request is accepted
router.post('/connection-accepted', sendConnectionAccepted);

// Route to send an email when a user receives an invite to connect
router.post('/connection-invite', sendConnectionRequest);

// Route to send a login notification email
router.post('/login-alert', sendLoginAlert);

// Route to send a new message notification email
router.post('/new-message', sendNewMessage);

module.exports = router;
