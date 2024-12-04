const express = require("express");
const {
  createGroup,
  sendMessage,
  getMessages,
  addMember,
  removeMember,
  getAllGroups,
  getUsersById,
  updateGroup,
  deleteGroup,
} = require("../controllers/groupController");

const router = express.Router();

// Tạo nhóm mới
router.post("/create", createGroup);

// Gửi tin nhắn trong nhóm
router.post("/sendMessage", sendMessage);

// Lấy tin nhắn trong nhóm
router.get("/:groupId/messages", getMessages);

// Thêm thành viên vào nhóm
router.post("/addMember", addMember);

// Xóa thành viên khỏi nhóm
router.post("/removeMember", removeMember);

//lấy danh sách nhóm 
router.get("/getAllGroups", getAllGroups);

//lấy trông tin nhóm theo id
router.get("/getUsersById/:id", getUsersById);

//update thông tin nhóm
router.put("/updateUsers/:groupId", updateGroup);
// xóa nhóm 
router.delete("/deleteGroup/:groupId", deleteGroup);

module.exports = router;
