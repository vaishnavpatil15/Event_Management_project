const Club = require('../models/club.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Get all clubs with their admins
exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('admin', 'name email role')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: clubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clubs',
      error: error.message
    });
  }
};

// Get single club details with admin
exports.getClubDetails = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('admin', 'name email role');
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching club details',
      error: error.message
    });
  }
};

// Create a new club and its admin
exports.createClub = async (req, res) => {
  try {
    const { name, description, category, email, password } = req.body;

    // Check if club email already exists
    const existingClub = await Club.findOne({ email });
    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: 'Club with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create club admin user
    const admin = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: 'clubadmin'
    });
    await admin.save();

    // Create club
    const club = new Club({
      name,
      description,
      category,
      email,
      password: hashedPassword,
      admin: admin._id
    });
    await club.save();

    res.status(201).json({
      success: true,
      message: 'Club and admin created successfully',
      data: {
        club: {
          _id: club._id,
          name: club.name,
          description: club.description,
          category: club.category,
          email: club.email
        },
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating club',
      error: error.message
    });
  }
};

// Update a club
exports.updateClub = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { name, description, category },
      { new: true }
    ).populate('admin', 'name email role');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating club',
      error: error.message
    });
  }
};

// Delete a club and its admin
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Delete the club admin
    await User.findByIdAndDelete(club.admin);

    // Delete the club
    await Club.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Club and admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting club',
      error: error.message
    });
  }
}; 