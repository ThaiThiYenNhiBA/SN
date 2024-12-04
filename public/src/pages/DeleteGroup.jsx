import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const DeleteGroup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/group/getUsersById/${groupId}`);
        const { name } = response.data;
        setGroupName(name);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const handleDeleteGroup = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/group/deleteGroup/${groupId}`);
      navigate("/"); // Điều hướng về trang danh sách nhóm hoặc trang bạn muốn
    } catch (error) {
      console.error("Error deleting group:", error);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h2>Xóa nhóm</h2>
      </Header>
      <InfoSection>
        <h3>Bạn chắc chắn muốn xóa nhóm: {groupName}?</h3>
        <p>Việc xóa nhóm không thể hoàn tác!</p>
      </InfoSection>
      <ButtonGroup>
        <CancelButton onClick={() => navigate("/groups")}>Hủy</CancelButton>
        <DeleteButton onClick={handleDeleteGroup} disabled={loading}>
          {loading ? "Đang xóa..." : "Xóa nhóm"}
        </DeleteButton>
      </ButtonGroup>
    </Container>
  );
};

export default DeleteGroup;

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
    color: #e74c3c;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  text-align: center;

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  p {
    color: #ccc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #7f8c8d;
  }
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;
