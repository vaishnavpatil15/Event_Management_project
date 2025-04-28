const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClubAndLinkAdmin } = require('../utils/club.utils');

const register = async (req, res) => {
    try {
        const { name, email, password, phone, organization, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields',
                required: ['name', 'email', 'password']
            });
        }

        // Validate role
        const validRoles = ['user', 'clubadmin', 'superadmin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified',
                validRoles: validRoles
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            phone: phone || '',
            organization: organization || '',
            role: role || 'user'
        });

        // Save the user first to get their ID
        await user.save();

        // If user is a clubadmin, create a club
        if (role === 'clubadmin') {
            if (!organization) {
                return res.status(400).json({
                    success: false,
                    message: 'Organization name is required for club admins'
                });
            }

            try {
                // Create club data
                const clubData = {
                    name: organization,
                    description: `${organization} club`,
                    category: 'general',
                    email: email,
                    password: password,
                    status: 'active'
                };

                // Create club and link admin
                await createClubAndLinkAdmin(clubData, user._id);
                
                // Get updated user with clubId
                const updatedUser = await User.findById(user._id)
                    .select('-password')
                    .populate('clubId', 'name');
                
                if (!updatedUser.clubId) {
                    throw new Error('Failed to link club to admin');
                }

                // Generate token
                const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
                    expiresIn: '7d'
                });

                // Set cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

                // Send success response
                return res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    data: {
                        user: updatedUser,
                        token
                    }
                });
            } catch (error) {
                console.error('Club creation error:', error);
                // Delete the user if club creation failed
                await User.findByIdAndDelete(user._id);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create club for admin',
                    error: error.message
                });
            }
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
            expiresIn: '7d'
        });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Get updated user with clubId
        const updatedUser = await User.findById(user._id).select('-password');

        // Send success response
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: updatedUser,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
            expiresIn: '7d'
        });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging in', 
            error: error.message 
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ 
        success: true,
        message: 'Logged out successfully' 
    });
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching user', 
            error: error.message 
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, organization } = req.body;
        const userId = req.user._id;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.organization = organization || user.organization;

        // Save updated user
        await user.save();

        // Return updated user data (excluding sensitive information)
        const updatedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            organization: user.organization,
            role: user.role
        };

        res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile
}; 