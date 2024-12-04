const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/fileController');
const router = express.Router();

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu file
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Tên file
    },
});
const upload = multer({ storage });

// Route upload file
router.post('/uploadFile', upload.single('file'), (req, res, next) => {
    // Kiểm tra xem có file được upload không
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Nếu có file, gọi controller uploadFile để xử lý
    fileController.uploadFile(req, res, next);
});

// Route lấy danh sách file
router.get('/getAllFiles', fileController.getAllFiles);

// Route lấy file mới nhất
router.get('/getLatestFile', fileController.getLatestFile);

// Route lấy file theo ID
router.get('/getFile/:id', fileController.getFile);

module.exports = router;
