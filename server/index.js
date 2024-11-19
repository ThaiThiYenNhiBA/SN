const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const videocallRoutes= require("./routes/videocall");
const socket = require("socket.io");
require("dotenv").config();

const app = express();

// Sử dụng CORS và middleware JSON
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Định nghĩa route cho test (ping)
app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

// Sử dụng các routes cho auth và messages
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/videocall",videocallRoutes);

// Khởi tạo server
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

// Thiết lập socket.io cho WebSocket
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // Đây là nơi bạn chạy frontend (React.js)
    credentials: true,
  },
});

// Lưu trữ những người dùng đang trực tuyến
global.onlineUsers = new Map();

// Khi một kết nối WebSocket được thiết lập
io.on("connection", (socket) => {
  global.chatSocket = socket;
  console.log("A user connected");

  // Thêm người dùng vào danh sách online
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added to online users`);
  });

  // Khi nhận được tin nhắn, gửi tin nhắn tới người nhận
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg); // Gửi tin nhắn tới người nhận
    }
  });

  // Khi người dùng ngắt kết nối
  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Xóa người dùng khỏi danh sách online khi ngắt kết nối
    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }
  });
});
