const Group = require("../models/groupModel");

//tạo nhóm mới
module.exports.createGroup = async (req, res, next) => {
    try {
      const { name, members, adminId } = req.body;
  
      const group = await Group.create({
        name,
        admin: adminId,
        members: [...members, adminId], // Admin cũng là thành viên
      });
  
      return res.status(201).json({ group, msg: "Group created successfully!" });
    } catch (err) {
      next(err);
    }
  };
//gửi tin nhắn trong nhóm
module.exports.sendMessage = async (req, res, next) => {
    try {
      const { groupId, senderId, text } = req.body;
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ msg: "Group not found" });
      }
  
      const newMessage = {
        sender: senderId,
        text,
      };
  
      group.messages.push(newMessage);
      await group.save();
  
      return res.status(200).json({ msg: "Message sent successfully!" });
    } catch (err) {
      next(err);
    }
  };

//lấy tin nhắn trong nhóm
module.exports.getMessages = async (req, res, next) => {
    try {
      const { groupId } = req.params;
  
      const group = await Group.findById(groupId).populate("messages.sender", "username email");
      if (!group) {
        return res.status(404).json({ msg: "Group not found" });
      }
  
      return res.status(200).json({ messages: group.messages });
    } catch (err) {
      next(err);
    }
  };

  module.exports.addMember = async (req, res, next) => {
    try {
      const { groupId, memberId } = req.body;
  
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ msg: "Group not found" });
  
      // Kiểm tra nếu thành viên đã tồn tại
      if (group.members.includes(memberId)) {
        return res.status(400).json({ msg: "Member already in group" });
      }
  
      group.members.push(memberId);
      await group.save();
  
      return res.status(200).json({ msg: "Member added successfully!" });
    } catch (err) {
      next(err);
    }
  };


  module.exports.removeMember = async (req, res, next) => {
    try {
      const { groupId, memberId, adminId } = req.body;
  
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ msg: "Group not found" });
  
      // Chỉ admin mới có quyền xóa thành viên
      if (group.admin.toString() !== adminId) {
        return res.status(403).json({ msg: "Only admin can remove members" });
      }
  
      // Kiểm tra nếu thành viên không tồn tại
      if (!group.members.includes(memberId)) {
        return res.status(400).json({ msg: "Member not in group" });
      }
  
      group.members = group.members.filter((member) => member.toString() !== memberId);
      await group.save();
  
      return res.status(200).json({ msg: "Member removed successfully!" });
    } catch (err) {
      next(err);
    }
  };

  module.exports.getAllGroups = async (req, res, next) => {
    try {
      // Lấy danh sách tất cả các nhóm
      const groups = await Group.find().select(["_id", "name", "admin", "members", "createdAt"]);
      
      // Trả về danh sách nhóm
      return res.status(200).json(groups);
    } catch (err) {
      next(err); // Xử lý lỗi thông qua middleware
    }
  };
  
  module.exports.getUsersById = async (req, res, next) => {
    try {
      // Lấy ID người dùng từ request params
      const { id } = req.params;
  
      // Tìm thông tin người dùng theo ID
      const user = await Group.findById(id).select([
        "_id",
        "name",
        "admin",
        "members",
        "createdAt",
      ]);
  
      // Kiểm tra nếu không tìm thấy người dùng
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Trả về thông tin người dùng
      return res.status(200).json(user);
    } catch (err) {
      next(err); // Xử lý lỗi thông qua middleware
    }
  };

  module.exports.updateGroup = async (req, res, next) => {
    try {
      const { groupId } = req.params; // Lấy groupId từ params.
      const { name, members, adminId } = req.body; // Lấy dữ liệu cập nhật từ body.
  
      // Kiểm tra nếu nhóm tồn tại.
      console.log(groupId);
      const group = await Group.findById(groupId);
      console.log(group);
      if (!group) {
        return res.status(404).json({ msg: "Group not found!" });
      }
  
      // Cập nhật thông tin nhóm.
      group.name = name || group.name; // Cập nhật tên nhóm nếu có.
      group.admin = adminId || group.admin; // Cập nhật admin nếu có.
      
      // Nếu có danh sách thành viên, cập nhật danh sách (đảm bảo admin luôn có trong danh sách).
      if (members && Array.isArray(members)) {
        group.members = Array.from(new Set([...members, group.admin])); // Tránh trùng lặp.
      }
  
      // Lưu thay đổi vào database.
      await group.save();
  
      return res.status(200).json({ group, msg: "Group updated successfully!" });
    } catch (err) {
      next(err);
    }
  };

  module.exports.deleteGroup = async (req, res, next) => {
    try {
      const { groupId } = req.params; // Lấy groupId từ params.
      console.log(groupId);
  
      // Tìm nhóm trong cơ sở dữ liệu.
      const group = await Group.findById(groupId);
      
      // Kiểm tra xem nhóm có tồn tại hay không.
      if (!group) {
        return res.status(404).json({ msg: "Group not found!" });
      }
  
      // Xóa nhóm khỏi cơ sở dữ liệu.
      await group.remove();
  
      return res.status(200).json({ msg: "Group deleted successfully!" });
    } catch (err) {
      next(err);
    }
  };
  
  
  
  
  
  
