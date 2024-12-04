const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: false }, // Trường originalname
  filepath: { type: String, required: true },
  mimetype: { type: String, required: false },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  user: Array,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("File", FileSchema);
