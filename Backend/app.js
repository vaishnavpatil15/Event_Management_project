const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();

const db = require("./config/db.config");
db();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require('./routes/user.routes');
const clubRoutes = require('./routes/club.routes');
const eventRegistrationRoutes = require("./routes/eventRegistration.routes");
const eventRoutes = require('./routes/event.routes');
const superadminRoutes = require('./routes/superadminRoutes');

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/clubs', clubRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 