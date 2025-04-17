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
app.use("/api/auth", authRoutes);

// Event Registration Routes
const eventRegistrationRoutes = require("./routes/eventRegistration.routes");
app.use("/api/event-registrations", eventRegistrationRoutes);

// Event Routes
const eventRoutes = require('./routes/event.routes');
app.use('/api/events', eventRoutes);

// Remove duplicate user routes since we're using auth routes
// const userRouter = require("./routes/user.routes");
// app.use("/user", userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 