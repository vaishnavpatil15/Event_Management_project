const Event = require('../models/event.model');
const mongoose = require('mongoose');

// Create a new event
exports.createEvent = async (req, res) => {
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
            requirements,
            organizer,
            image
        } = req.body;

        // Validate required fields
        if (!title || !description || !date || !time || !location || !category || !maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing'
            });
        }

        const event = new Event({
            title,
            description,
            date,
            time,
            location,
            category,
            maxParticipants,
            currentParticipants: 0,
            registrationFee: registrationFee || 0,
            registrationDeadline: registrationDeadline || date,
            requirements,
            organizer,
            image
        });

        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });

    } catch (error) {
        console.error('Error in createEvent:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        
        res.status(200).json({
            success: true,
            data: events
        });

    } catch (error) {
        console.error('Error in getEvents:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });

    } catch (error) {
        console.error('Error in getEventById:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
}; 