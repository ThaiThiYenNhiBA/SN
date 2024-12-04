const Share = require('../models/Share');
const Post = require('../models/postModel');

exports.addShare = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const newShare = new Share({ userId, postId });
    await newShare.save();

    // Cập nhật số lượng chia sẻ trên bài đăng
    await Post.findByIdAndUpdate(postId, { $inc: { shares: 1 } });

    return res.status(201).json({ message: 'Post shared', share: newShare });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sharing post' });
  }
};
