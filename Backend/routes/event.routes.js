const express = require('express');
const router = express.Router();
const eventController = require('../controller/event.controller');

// Create a new event
router.post('/', eventController.createEvent);

// Get all events
router.get('/', eventController.getEvents);

// Get event by ID
router.get('/:id', eventController.getEventById);

module.exports = router; 