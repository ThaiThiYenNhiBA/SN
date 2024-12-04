const fs = require('fs');
const express = require('express');
const path = require("path");
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');

// Đảm bảo thư mục 'uploads' tồn tại
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Thiết lập multer để upload file (hình ảnh/video)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Lưu trong thư mục uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file là thời gian hiện tại
    }
});
const upload = multer({ storage: storage });

// Route tạo bài đăng mới (với file hình ảnh hoặc video)
router.post('/create', upload.single('file'), postController.createPost);
// route lấy bài đăng 
router.get('/posts', postController.getAllPostNoneId);
module.exports = router;
