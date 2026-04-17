const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get conversation history between current user and another user
router.get('/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      sender: msg.sender.toString() === currentUserId.toString() ? "sent" : "received",
      text: msg.text,
      timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    res.json({
      success: true,
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Fetch conversation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send a new message
router.post('/send', auth, async (req, res) => {
  try {
    if (req.user.userType === 'guest') {
      return res.status(403).json({ success: false, message: 'Guests cannot perform this action' });
    }

    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: 'Receiver and text are required' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text: text
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: {
        id: newMessage._id,
        sender: "sent",
        text: newMessage.text,
        timestamp: new Date(newMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
