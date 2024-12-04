// controllers/postController.js
const Post = require('../models/postModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// Hàm tạo bài đăng mới
exports.createPost = async (req, res) => {
    try {
        const { content, userId } = req.body;
        console.log(userId);

        if (!content || !userId) {
            return res.status(400).json({ message: "Content and User ID are required" });
        }

        // Tìm người dùng
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra nếu có file (hình ảnh/video)
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Tạo bài đăng
        const newPost = new Post({
            content: content,
            imageUrl: imageUrl,
            user: userId,
        });

        // Lưu bài đăng
        await newPost.save();

        return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Hàm lấy tất cả bài đăng không cần userId
exports.getAllPostNoneId = async (req, res) => {
    try {
        // Lấy tất cả bài đăng và populate để lấy thông tin người dùng
        const posts = await Post.find()
            .populate('user', 'username avatarImage') // Chỉ lấy thuộc tính username từ User
            .sort({ createdAt: -1 });    // Sắp xếp bài đăng mới nhất ở đầu

        return res.status(200).json({ posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

