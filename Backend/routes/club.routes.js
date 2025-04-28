const express = require('express');
const router = express.Router();
const { isAuthenticated, isSuperAdmin } = require('../middleware/auth');
const {
  getClubs,
  getClubDetails,
  createClub,
  updateClub,
  deleteClub
} = require('../controller/club.controller');

// Get all clubs (public)
router.get('/', getClubs);

// Get single club details (public)
router.get('/:id', getClubDetails);

// Create a new club (superadmin only)
router.post('/', isAuthenticated, isSuperAdmin, createClub);

// Update a club (superadmin only)
router.put('/:id', isAuthenticated, isSuperAdmin, updateClub);

// Delete a club and its admin (superadmin only)
router.delete('/:id', isAuthenticated, isSuperAdmin, deleteClub);

module.exports = router; 