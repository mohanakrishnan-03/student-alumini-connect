const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      fullName, 
      userType, 
      collegeId,
      yearOfStudy, 
      branch, 
      graduationYear, 
      company, 
      position 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if collegeId already exists
    const existingCollegeId = await User.findOne({ collegeId });
    if (existingCollegeId) {
      return res.status(400).json({ message: 'College ID already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      fullName,
      userType,
      collegeId,
      yearOfStudy,
      branch,
      graduationYear,
      company,
      position
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        collegeId: user.collegeId,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch,
        graduationYear: user.graduationYear,
        company: user.company,
        position: user.position
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Student Login route
router.post('/login/student', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with userType 'student'
    const user = await User.findOne({ email, userType: 'student' });
    if (!user) {
      return res.status(400).json({ 
        message: 'No student account found with this email. Please register as a student or check your credentials.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    res.json({
      message: 'Student login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        collegeId: user.collegeId,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch,
        graduationYear: user.graduationYear,
        company: user.company,
        position: user.position
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Alumni Login route
router.post('/login/alumni', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with userType 'alumni'
    const user = await User.findOne({ email, userType: 'alumni' });
    if (!user) {
      return res.status(400).json({ 
        message: 'No alumni account found with this email. Please register as an alumni or check your credentials.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    res.json({
      message: 'Alumni login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        collegeId: user.collegeId,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch,
        graduationYear: user.graduationYear,
        company: user.company,
        position: user.position
      }
    });
  } catch (error) {
    console.error('Alumni login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// General Login route (for backward compatibility)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        collegeId: user.collegeId,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch,
        graduationYear: user.graduationYear,
        company: user.company,
        position: user.position
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ============= ADD THESE TWO NEW ROUTES =============

// Get user profile by ID
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        collegeId: user.collegeId,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch,
        graduationYear: user.graduationYear,
        company: user.company,
        position: user.position,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user._id;

    // Remove fields that shouldn't be updated
    delete updates.email;
    delete updates.password;
    delete updates.collegeId;
    delete updates.userType;
    delete updates._id;
    delete updates.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        collegeId: user.collegeId,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch,
        graduationYear: user.graduationYear,
        company: user.company,
        position: user.position,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get all users (excluding current user)
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password -__v')
      .sort({ fullName: 1 });
    
    res.json({
      success: true,
      users: users.map(u => ({
        id: u._id,
        name: u.fullName,
        email: u.email,
        role: u.userType === 'alumni' 
          ? `Alumni${u.company ? ' - ' + u.company : ''}` 
          : `Student${u.branch ? ' - ' + u.branch : ''}`,
        status: 'online' // Mocking status for prototype
      }))
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// ============= END OF NEW ROUTES =============

module.exports = router;