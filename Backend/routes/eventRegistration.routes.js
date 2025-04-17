const express = require('express');
const router = express.Router();
const eventRegistrationController = require('../controller/eventRegistration.controller');
const { auth } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(auth);

// Register for an event
router.post('/register', eventRegistrationController.registerForEvent);

// Get user's event registrations
router.get('/user/:userId', eventRegistrationController.getUserRegistrations);

// Cancel event registration
router.delete('/:registrationId', eventRegistrationController.cancelRegistration);

module.exports = router; 