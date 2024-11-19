const mongoose = require("mongoose");

const videoCallSchema = new mongoose.Schema({
  caller: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Người gọi (ref đến Users)
  callee: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Người nhận cuộc gọi (ref đến Users)
  status: { type: String, enum: ["pending", "active", "ended"], default: "pending" }, // Trạng thái cuộc gọi
  startedAt: { type: Date },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VideoCall", videoCallSchema);
