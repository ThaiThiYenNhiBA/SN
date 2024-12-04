const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Liên kết với model User
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Liên kết với model Post
    required: true,
  },
}, { timestamps: true });

const Share = mongoose.model('Share', shareSchema);

module.exports = Share;
