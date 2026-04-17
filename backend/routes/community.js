const express = require('express');
const CommunityPost = require('../models/CommunityPost');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all community posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('user', 'fullName userType company branch')
      .sort({ timestamp: 1 });

    // Format posts for the frontend
    const formattedPosts = posts.map(post => {
      // Create role string based on user type
      let role = 'Member';
      if (post.user) {
        if (post.user.userType === 'alumni') {
          role = `Alumni${post.user.company ? ' - ' + post.user.company : ''}`;
        } else if (post.user.userType === 'student') {
          role = `Student${post.user.branch ? ' - ' + post.user.branch : ''}`;
        }
      }

      return {
        id: post._id,
        sender: post.user && post.user._id.toString() === req.user._id.toString() ? 'current' : 'other',
        name: post.user ? post.user.fullName : 'Unknown User',
        role: role,
        message: post.content,
        timestamp: new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: post.user ? post.user.fullName.charAt(0) : '👤',
        type: post.type,
        fileName: post.fileName,
        fileSize: post.fileSize
      };
    });

    res.json({
      success: true,
      posts: formattedPosts
    });
  } catch (error) {
    console.error('Fetch community posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new community post
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.userType === 'guest') {
      return res.status(403).json({ success: false, message: 'Guests cannot perform this action' });
    }

    const { content, type, fileName, fileSize } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const newPost = new CommunityPost({
      user: userId,
      content,
      type: type || 'text',
      fileName,
      fileSize
    });

    await newPost.save();

    // Populate user info before returning
    await newPost.populate('user', 'fullName userType company branch');

    let role = 'Member';
    if (newPost.user) {
      if (newPost.user.userType === 'alumni') {
        role = `Alumni${newPost.user.company ? ' - ' + newPost.user.company : ''}`;
      } else if (newPost.user.userType === 'student') {
        role = `Student${newPost.user.branch ? ' - ' + newPost.user.branch : ''}`;
      }
    }

    res.status(201).json({
      success: true,
      post: {
        id: newPost._id,
        sender: 'current',
        name: newPost.user.fullName,
        role: role,
        message: newPost.content,
        timestamp: new Date(newPost.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: newPost.user.fullName.charAt(0),
        type: newPost.type,
        fileName: newPost.fileName,
        fileSize: newPost.fileSize
      }
    });
  } catch (error) {
    console.error('Create community post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
