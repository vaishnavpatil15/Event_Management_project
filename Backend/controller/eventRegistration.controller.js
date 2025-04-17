const EventRegistration = require('../models/eventRegistration.model');
const Event = require('../models/event.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Register for an event
exports.registerForEvent = async (req, res) => {
    try {
        const { eventId, userId, name, email, phone, organization, requirements } = req.body;

        // Validate required fields
        if (!eventId || !userId || !name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing'
            });
        }

        // Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if event is still open for registration
        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({
                success: false,
                message: 'Registration deadline has passed'
            });
        }

        // Check if event is full
        if (event.currentParticipants >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Event is full'
            });
        }

        // Check if user is already registered
        const existingRegistration = await EventRegistration.findOne({
            event: eventId,
            user: userId
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        // Create new registration
        const registration = new EventRegistration({
            event: eventId,
            user: userId,
            name,
            email,
            phone,
            organization: organization || '',
            requirements: requirements || '',
            status: 'pending',
            paymentStatus: 'pending',
            paymentAmount: event.registrationFee,
            registrationDate: new Date()
        });

        await registration.save();

        // Update event's current participants count
        event.currentParticipants += 1;
        await event.save();

        res.status(201).json({
            success: true,
            message: 'Successfully registered for the event',
            data: registration
        });

    } catch (error) {
        console.error('Error in registerForEvent:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering for event',
            error: error.message
        });
    }
};

// Get user's event registrations
exports.getUserRegistrations = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from auth middleware

        const registrations = await EventRegistration.find({ user: userId })
            .populate('event', 'title date time location')
            .sort({ createdAt: -1 });

        // Transform the data to include event details
        const transformedRegistrations = registrations.map(reg => ({
            _id: reg._id,
            eventName: reg.event.title,
            eventDate: reg.event.date,
            eventTime: reg.event.time,
            eventLocation: reg.event.location,
            name: reg.name,
            email: reg.email,
            phone: reg.phone,
            organization: reg.organization,
            requirements: reg.requirements,
            status: reg.status,
            createdAt: reg.createdAt
        }));

        res.status(200).json({
            success: true,
            data: transformedRegistrations
        });

    } catch (error) {
        console.error('Error in getUserRegistrations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching registrations',
            error: error.message
        });
    }
};

// Cancel event registration
exports.cancelRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user._id; // Get user ID from auth middleware

        const registration = await EventRegistration.findOne({
            _id: registrationId,
            user: userId
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        // Update registration status
        registration.status = 'cancelled';
        await registration.save();

        // Update event's current participants count
        const event = await Event.findById(registration.event);
        if (event) {
            event.currentParticipants = Math.max(0, event.currentParticipants - 1);
            await event.save();
        }

        res.status(200).json({
            success: true,
            message: 'Registration cancelled successfully'
        });

    } catch (error) {
        console.error('Error in cancelRegistration:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling registration',
            error: error.message
        });
    }
}; 