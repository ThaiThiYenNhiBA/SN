// models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: { type: String, required: true }, // Nội dung bài đăng (text)
  imageUrl: { type: String }, // Đường dẫn tới hình ảnh hoặc video
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // ID người dùng
  likes: { type: Number, default: 0 }, // Trường lưu số lượt like
  comments: { type: Number, default:0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
