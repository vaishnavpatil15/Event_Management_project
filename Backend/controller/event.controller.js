const Event = require('../models/event.model');
const mongoose = require('mongoose');
const Club = require('../models/club.model');

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('clubId', 'name').populate('createdBy', 'name email');
        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events',
            error: error.message
        });
    }
};

// Get single event
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('clubId', 'name')
            .populate('createdBy', 'name email');
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event',
            error: error.message
        });
    }
};

// Get events created by the current user
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id })
            .populate('clubId', 'name')
            .populate('createdBy', 'name email');

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your events',
            error: error.message
        });
    }
};

// Create a new event
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            time,
            location,
            category,
            maxParticipants,
            registrationFee,
            registrationDeadline,
            organizer,
            clubId
        } = req.body;

        // Check if user is a clubadmin
        if (req.user.role !== 'clubadmin') {
            return res.status(403).json({
                success: false,
                message: 'Only club admins can create events'
            });
        }

        // Check if the club exists and the user is its admin
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        // Verify that the user is the admin of this club
        if (club.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create events for this club'
            });
        }

        // Create the event
        const event = new Event({
            title,
            description,
            date,
            time,
            location,
            category,
            maxParticipants,
            registrationFee,
            registrationDeadline,
            organizer,
            clubId,
            createdBy: req.user._id,
            currentParticipants: 0,
            participants: [],
            status: 'upcoming'
        });

        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error.message
        });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event',
            error: error.message
        });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: error.message
        });
    }
};

module.exports = {
    getEvents,
    getEventById,
    getMyEvents,
    createEvent,
    updateEvent,
    deleteEvent
}; 