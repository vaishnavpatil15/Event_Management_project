const mongoose = require('mongoose');
const Event = require('./models/event.model');
const Club = require('./models/club.model');
const User = require('./models/user.model');
require('dotenv').config();

const seedEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the first admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('No admin user found. Please create an admin user first.');
            process.exit(1);
        }

        // Create a sample club if it doesn't exist
        let club = await Club.findOne({ name: 'Sample Club' });
        if (!club) {
            club = new Club({
                name: 'Sample Club',
                description: 'A sample club for testing',
                category: 'General',
                admin: adminUser._id,
                status: 'active'
            });
            await club.save();
            console.log('Created sample club');
        }

        const sampleEvents = [
            {
                title: "Tech Conference 2024",
                description: "Join us for the biggest tech conference of the year featuring industry leaders and innovative discussions.",
                date: "2025-05-10",
                time: "09:00 AM - 05:00 PM",
                location: "New York Convention Center",
                category: "Technology",
                maxParticipants: 600,
                registrationFee: 299,
                registrationDeadline: "2025-05-05",
                requirements: "Laptop, conference pass",
                organizer: "Tech Events Inc.",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                clubId: club._id,
                createdBy: adminUser._id,
                status: 'upcoming'
            },
            {
                title: "Music Festival",
                description: "Experience three days of amazing music performances from top artists around the world.",
                date: "2025-05-10",
                time: "12:00 PM - 11:00 PM",
                location: "LA Music Park",
                category: "Music",
                maxParticipants: 1200,
                registrationFee: 199,
                registrationDeadline: "2025-05-05",
                requirements: "Festival pass, comfortable clothing",
                organizer: "Music Festivals Co.",
                image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                clubId: club._id,
                createdBy: adminUser._id,
                status: 'upcoming'
            },
            {
                title: "Business Summit",
                description: "Network with industry leaders and learn about the latest business trends and strategies.",
                date: "2025-05-10",
                time: "08:00 AM - 06:00 PM",
                location: "Chicago Business Center",
                category: "Business",
                maxParticipants: 400,
                registrationFee: 399,
                registrationDeadline: "2025-05-05",
                requirements: "Business attire, business cards",
                organizer: "Business Leaders Association",
                image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                clubId: club._id,
                createdBy: adminUser._id,
                status: 'upcoming'
            }
        ];

        // Clear existing events
        await Event.deleteMany({});
        console.log('Cleared existing events');

        // Insert sample events
        await Event.insertMany(sampleEvents);
        console.log('Added sample events');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding events:', error);
        process.exit(1);
    }
};

seedEvents(); 