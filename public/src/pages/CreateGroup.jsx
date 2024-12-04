import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { createGroupRoute, allUserNoneId } from "../utils/APIRoutes";

export default function CreateGroup() {
  // State quản lý dữ liệu
  const [groupName, setGroupName] = useState("");
  const [currentUserId, setCurrentUserId] = useState(undefined);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  // Lấy danh sách người dùng
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(allUserNoneId);
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();

    const fetchCurrentUserId = async () => {
      try {
        const data = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        if (data && data._id) {
          setCurrentUserId(data._id);
          console.log("Current User ID:", data._id);
        }
      } catch (error) {
        console.error("Error fetching current user ID:", error);
      }
    };

    fetchCurrentUserId();
  }, []);

  // Xử lý thêm thành viên
  const handleAddMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember("");
    }
  };

  // Xử lý xóa thành viên
  const handleRemoveMember = (member) => {
    setMembers(members.filter((m) => m !== member));
  };

  // Tạo nhóm
  const handleCreateGroup = async () => {
    if (!groupName) {
      alert("Vui lòng nhập tên nhóm!");
      return;
    }
    if (members.length === 0) {
      alert("Nhóm cần có ít nhất 1 thành viên!");
      return;
    }
  
    try {
      const response = await axios.post(createGroupRoute, {
        name: groupName, // Chuyển từ state groupName
        members,
        adminId: currentUserId, // Sửa admin thành adminId
      });
      if (response.data.success) {
        alert("Tạo nhóm thành công!");
        setGroupName("");
        setMembers([]);
      } else {
        alert("Thành công");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Thành công");
    }
  };
  

  return (
    <Container>
      <Header>
        <h2>Tạo nhóm mới</h2>
      </Header>
      <GroupDetails>
        <Input
          type="text"
          placeholder="Tên nhóm"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <MembersList>
          {members.map((member, index) => {
            const user = allUsers.find((user) => user._id === member);
            return (
              <MemberItem key={index}>
                <span>{user ? user.username || user.email : "Người dùng không tồn tại"}</span>
                <RemoveButton onClick={() => handleRemoveMember(member)}>X</RemoveButton>
              </MemberItem>
            );
          })}
        </MembersList>
        <AddMember>
          <Select
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          >
            <option value="">Chọn thành viên</option>
            {allUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username || user.email}
              </option>
            ))}
          </Select>
          <AddButton onClick={handleAddMember}>Thêm</AddButton>
        </AddMember>
        <CreateGroupButton onClick={handleCreateGroup}>
          Tạo nhóm
        </CreateGroupButton>
      </GroupDetails>
    </Container>
  );
}

// Styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #282c34;
  color: white;
  min-height: 100vh;
`;

const Header = styled.div`
  h2 {
    color: #61dafb;
  }
`;

const GroupDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MemberItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3a3b3c;
  padding: 5px 10px;
  border-radius: 5px;

  span {
    font-size: 1rem;
  }
`;

const RemoveButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;

const AddMember = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const AddButton = styled.button`
  background-color: #61dafb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #21a1f1;
  }
`;

const CreateGroupButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: darkgreen;
  }
`;
