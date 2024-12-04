const Comment = require('../models/Comment');
const Post = require('../models/postModel');
const { post } = require('../routes/auth');

exports.addComment = async (req, res) => {
  try {
    const { userId, postId, content } = req.body;

    const newComment = new Comment({ userId, postId, content });
    await newComment.save();

    // Cập nhật số lượng bình luận trên bài đăng
    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    return res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding comment' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Post.findById({ postId }).populate('userId', 'username avatarImage');

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching comments' });
  }
};
