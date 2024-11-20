const express = require("express");
const router = express.Router();
const videoCallController = require("../controllers/videoCallController");

// Tạo cuộc gọi video mới
router.post("/start", videoCallController.startCall);

// Cập nhật trạng thái cuộc gọi
router.post("/update", videoCallController.updateCallStatus);

module.exports = router;
