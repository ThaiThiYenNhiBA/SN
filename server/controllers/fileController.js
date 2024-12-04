const File = require('../models/File');
const path = require('path');
const fs = require('fs');

// Upload file
exports.uploadFile = async (req, res) => {
    try {
        // Lấy thông tin file từ req.file
        const { filename, originalname, path: filepath, size, mimetype } = req.file;

        // Tạo document dựa trên FileSchema
        const file = new File({
            filename,
            originalname,
            filepath,
            mimetype,
            size,
        });

        // Lưu vào cơ sở dữ liệu
        await file.save();

        res.status(201).json({ message: 'File uploaded successfully', file });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
};


// Gửi file
exports.getFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(file.path, file.filename);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching file', error: err.message });
    }
};

// Lấy danh sách file
exports.getAllFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json({ files });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching files', error: err.message });
    }
};

// Lấy tệp có `uploadedAt` mới nhất
exports.getLatestFile = async (req, res) => {
    try {
        // Tìm tài liệu mới nhất dựa vào `createdAt`
        const latestFile = await File.findOne().sort({ createdAt: -1 }); 
        
        // Nếu không tìm thấy file
        if (!latestFile) {
            return res.status(404).json({ message: "No files found" });
        }

        // Trả về originalname
        res.status(200).json({
            originalname: latestFile.originalname, // Lấy giá trị từ cột `originalname`
            createdAt: latestFile.createdAt
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching latest file", error: err.message });
    }
};



