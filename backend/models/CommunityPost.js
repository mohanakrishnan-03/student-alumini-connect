const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'file', 'file-text', 'opportunity'],
    default: 'text'
  },
  fileName: {
    type: String
  },
  fileSize: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
