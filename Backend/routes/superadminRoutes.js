const express = require('express');
const router = express.Router();
const { isAuthenticated, isSuperAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controller/superadminController');

// Get all users (except superadmin)
router.get('/users', isAuthenticated, isSuperAdmin, getAllUsers);

// Update user role
router.put('/users/:userId/role', isAuthenticated, isSuperAdmin, updateUserRole);

// Delete user
router.delete('/users/:userId', isAuthenticated, isSuperAdmin, deleteUser);

module.exports = router; 