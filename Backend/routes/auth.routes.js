const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser, updateProfile } = require('../controller/auth.controller');
const { auth } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', auth, logout);
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);

module.exports = router; 