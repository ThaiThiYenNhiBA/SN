import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const SearchPage = () => {
  const [username, setUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userId, setuserId] = useState(undefined);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!username) {
      setError("Vui lòng nhập tên người dùng!");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/auth/search?username=${username}`);
      console.log("Kết quả trả về từ API:", response.data);
      console.log(response.data[0]._id);

      if (Array.isArray(response.data) && response.data.length > 0) {

        setSearchResults(response.data);
        setuserId(response.data[0]._id)
        setError("");
      } else {
        setSearchResults([]);
        setError("Không tìm thấy người dùng nào.");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setError("Đã có lỗi xảy ra khi tìm kiếm.");
    }
  };

  // Tự động gọi handleSearch mỗi khi `username` thay đổi và không trống
  useEffect(() => {
    if (username) {
      handleSearch();
    } else {
      setSearchResults([]); // Nếu không có tên người dùng, làm sạch kết quả
      setError(""); // Làm sạch lỗi
    }
  }, [username]); // Theo dõi thay đổi giá trị `username`

  return (
    <Container>
      <Header>
        <h2>Tìm kiếm người dùng</h2>
      </Header>
      <SearchSection>
        <SearchInput
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên người dùng để tìm kiếm..."
        />
      </SearchSection>
      {error && <Error>{error}</Error>}
      <ResultsSection>
        {searchResults.length > 0 ? (
          <ResultList>
            {searchResults.map((user) => (
              <ResultItem key={user._id}>
                <span>{user.username}</span>
                <UserAvatar src={`data:image/svg+xml;base64,${user.avatarImage}`} />
              </ResultItem>
            ))}
          </ResultList>
        ) : (
          <div>Không có kết quả tìm kiếm nào phù hợp.</div>
        )}
      </ResultsSection>
    </Container>
  );
};

export default SearchPage;

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

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 300px;
`;

const Error = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const ResultsSection = styled.div`
  width: 100%;
  max-width: 600px;
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 10px;
  background-color: #333;
  border-radius: 5px;

  span {
    font-size: 1rem;
    color: #ccc;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
