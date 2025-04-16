const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controller/auth.controller');
const { auth } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', auth, logout);
router.get('/me', auth, getCurrentUser);

module.exports = router; 