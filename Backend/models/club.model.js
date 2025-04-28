const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Club description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Club category is required'],
    trim: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Club admin is required']
  },
  email: {
    type: String,
    required: [true, 'Club email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Club password is required']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
clubSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Club = mongoose.model('Club', clubSchema);
module.exports = Club; 