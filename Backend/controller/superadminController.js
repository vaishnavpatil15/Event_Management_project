const User = require('../models/user.model');
const Club = require('../models/club.model');

// Get all users (except superadmin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'superadmin' } })
      .select('-password')
      .populate('clubId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: clubs
    });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clubs',
      error: error.message
    });
  }
};

// Update club
exports.updateClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const updates = req.body;

    const club = await Club.findByIdAndUpdate(
      clubId,
      updates,
      { new: true }
    ).populate('admin', 'name email');

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
    console.error('Error updating club:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating club',
      error: error.message
    });
  }
};

// Delete club
exports.deleteClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const club = await Club.findByIdAndDelete(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Also delete the associated clubadmin
    await User.findByIdAndDelete(club.admin);

    res.status(200).json({
      success: true,
      message: 'Club and associated admin deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting club',
      error: error.message
    });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'clubadmin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either user or clubadmin'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
}; 