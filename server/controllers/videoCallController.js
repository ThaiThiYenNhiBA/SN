const VideoCall = require("../models/VideoCall");
const User = require("../models/userModel"); // Đảm bảo bạn đã import model người dùng

// Tạo cuộc gọi video mới
exports.startCall = async (req, res) => {
  const { callerId, calleeId } = req.body;

  try {
    // Kiểm tra xem người gọi và người nhận có tồn tại trong cơ sở dữ liệu không
    const caller = await User.findById(callerId);
    const callee = await User.findById(calleeId);

    if (!caller || !callee) {
      return res.status(404).json({ message: "User not found" });
    }

    const videoCall = new VideoCall({
      caller: caller._id,
      callee: callee._id,
      status: "pending",
      startedAt: new Date()
    });

    await videoCall.save();
    res.status(200).json({ message: "Video call initiated", videoCall });
  } catch (error) {
    res.status(500).json({ error: "Error starting video call", details: error });
  }
};

// Cập nhật trạng thái cuộc gọi
exports.updateCallStatus = async (req, res) => {
  const { callId, status } = req.body;

  try {
    const videoCall = await VideoCall.findById(callId);
    if (!videoCall) {
      return res.status(404).json({ message: "Call not found" });
    }

    videoCall.status = status;
    if (status === "ended") {
      videoCall.endedAt = new Date();
    }

    await videoCall.save();
    res.status(200).json({ message: "Call status updated", videoCall });
  } catch (error) {
    res.status(500).json({ error: "Error updating call status", details: error });
  }
};
