const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Please login to access this resource'
    });
  }
};

exports.isClubAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please login to access this resource'
    });
  }

  if (req.user.role !== 'clubadmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Club admin only.'
    });
  }

  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please login to access this resource'
    });
  }

  if (req.user.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin only.'
    });
  }

  next();
}; 