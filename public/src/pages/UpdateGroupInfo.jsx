import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Swal from "sweetalert2";

const UpdateGroupInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");
  console.log ("cái này quan trọng nè "+groupId);

  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/group/getUsersById/${groupId}`);
        const { name, members, admin } = response.data;
        setName(name);
        setMembers(members);
        setAdminId(admin);
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
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        members,
        adminId,
      };
      console.log("đã vô tới");
      console.log("Group ID:", groupId); // Kiểm tra giá trị groupId
      await axios.put(`http://localhost:5000/api/group/updateUsers/${groupId}`, payload);
      alert("Cập nhật nhóm thành công!");
      navigate("/");
    } catch (error) {
      console.error("Error updating group:", error);
      alert("Cập nhật nhóm thất bại.");
    }
  };

  const handleMemberChange = async (userId) => {
    const user = allUsers.find((user) => user._id === userId);
    const action = members.includes(userId) ? "xóa" : "thêm";

    const result = await Swal.fire({
      title: `Xác nhận ${action} thành viên`,
      text: `Bạn có chắc chắn muốn ${action} ${user.username} vào nhóm không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      if (members.includes(userId)) {
        setMembers(members.filter((id) => id !== userId));
      } else {
        setMembers([...members, userId]);
      }

      Swal.fire({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} thành công!`,
        text: `${user.username} đã được ${action} vào nhóm.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Container>
      <Header>
        <h2>Cập nhật thông tin nhóm</h2>
      </Header>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="name">Tên nhóm:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="admin">Quản trị viên:</label>
          <select
            id="admin"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          >
            <option value="">Chọn quản trị viên</option>
            {allUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Thành viên:</label>
          <UserList>
            {allUsers.map((user) => (
              <UserItem key={user._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={members.includes(user._id)}
                    onChange={() => handleMemberChange(user._id)}
                  />
                  {user.username}
                </label>
              </UserItem>
            ))}
          </UserList>
        </FormGroup>
        <Button type="submit">Cập nhật nhóm</Button>
        <Button type="button" onClick={() => navigate("/group-info")}>
          Hủy
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateGroupInfo;

// Styled-components
// (Không thay đổi so với phiên bản trước)


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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 1.1rem;
    font-weight: bold;
  }

  input, select {
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserItem = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input[type="checkbox"] {
    transform: scale(1.5);
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

