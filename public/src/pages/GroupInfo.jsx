import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const GroupInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");
  console.log("Group ID from query params:", groupId);

  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/group/getUsersById/${groupId}`);
        const { name, members, admin } = response.data;
        setName(name);
        setMembers(members);
        setAdminId(admin);

        // Lấy tên quản trị viên từ danh sách người dùng
        const adminUser = allUsers.find(user => user._id === admin);
        if (adminUser) {
          setAdminUsername(adminUser.username);
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/getallusers");
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    if (groupId) {
      fetchGroupData();
      fetchAllUsers();
    }
  }, [groupId, allUsers]);

  return (
    <Container>
      <Header>
        <h2>Thông tin nhóm</h2>
      </Header>
      <InfoSection>
        <InfoGroup>
          <label>Tên nhóm:</label>
          <span>{name}</span>
        </InfoGroup>
        <InfoGroup>
          <label>Quản trị viên:</label>
          <span>{adminUsername}</span>
        </InfoGroup>
        <InfoGroup>
          <label>Thành viên:</label>
          <UserList>
            {members.map((userId) => {
              const user = allUsers.find((user) => user._id === userId);
              return user ? (
                <UserItem key={user._id}>
                  <span>{user.username}</span>
                </UserItem>
              ) : null;
            })}
          </UserList>
        </InfoGroup>
      </InfoSection>
      <Button onClick={() => navigate("/UpdateGroupInfo?groupId=" + groupId)}>
        Cập nhật thông tin nhóm
      </Button>
      {/* Nút "Xóa nhóm" sẽ điều hướng tới trang DeleteGroup */}
      <Button onClick={() => navigate("/DeleteGroup?groupId=" + groupId)} style={{ backgroundColor: "#e74c3c" }}>
        Xóa nhóm
      </Button>
    </Container>
  );
};

export default GroupInfo;

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

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 1.1rem;
    font-weight: bold;
  }

  span {
    font-size: 1rem;
    color: #ccc;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserItem = styled.div`
  span {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  background-color: #61dafb;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #4db3e0;
  }
`;
