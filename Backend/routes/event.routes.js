const express = require('express');
const router = express.Router();
const eventController = require('../controller/event.controller');
const { isAuthenticated, isClubAdmin } = require('../middleware/auth');

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.use(isAuthenticated);

// Get my events (clubadmin only)
router.get('/my/events', isClubAdmin, eventController.getMyEvents);

// Create event (clubadmin only)
router.post('/', isClubAdmin, eventController.createEvent);

// Update event (clubadmin only, their own events)
router.put('/:id', isClubAdmin, eventController.updateEvent);

// Delete event (clubadmin only, their own events)
router.delete('/:id', isClubAdmin, eventController.deleteEvent);

module.exports = router; 