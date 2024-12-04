import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import { FaUsers, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, deleteMessageRoute } from "../utils/APIRoutes"; // Thêm route xóa tin nhắn


export default function ChatContainer({ currentChat, socket }) {
  let flag = false;
  const [isOnline, setIsOnline] = useState(false);
  const [isSecretChat, setIsSecretChat] = useState(false); // Biến lưu trạng thái chat bí mật
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
      secretChat: isSecretChat, // Gửi thông tin secretChat
    });
    setMessages(response.data);
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      secretChat: isSecretChat, // Gửi thông tin secretChat
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      secretChat: isSecretChat, // Gửi thông tin secretChat
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  // Hàm để thu hồi tin nhắn
  const handleDeleteMsg = async (messageId) => {
    const response = await axios.post(deleteMessageRoute, { messageId });
    if (response.data.msg === "Message deleted successfully") {
      setMessages(messages.filter((msg) => msg._id !== messageId)); // Cập nhật lại danh sách tin nhắn
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/allusers/${currentChat._id}`);
        console.log(currentChat._id);
        const user = response.data.find(user => user._id === currentChat._id);
        console.log("Người dùng " + currentChat._id);
        setIsOnline(currentChat._id ? true : false); // Cập nhật trạng thái online
      } catch (error) {
        console.error("Error fetching user status:", error);
        setIsOnline(false);
      }
    };
    // console.log("ra khỏi: "+flag);
    fetchUserStatus();
  }, [currentChat]);
  const handleCreateGroup = () => {
    navigate("/CreateGroup"); // Chuyển hướng đến trang CreateGroup
  };

  const Navigation = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/group/getUsersById/${currentChat._id}`);
      console.log(response.data); // Xử lý dữ liệu trả về từ API

      // Điều hướng với currentChat._id là tham số truy vấn
      navigate(`/GroupInfo?groupId=${currentChat._id}`);
    } catch (error) {
      console.error("Error fetching group info:", error);
    }
  };

  // promise.all 
  const Navigation_user = async () => {
    try {
      const data = await axios.get(`http://localhost:5000/api/auth/allusers/${currentChat._id}`);
      console.log("dữ liệu người dùng: "+ data.data);
      navigate(`/InvidualInfo?id=${currentChat._id}`);
    } catch (error) {
      console.error("Lỗi: ", error);
    }
  };

  const handleReplyMsg = (message) => {
    const reply = `Phản hồi: "${message.message}"`;
    setMessages((prevMessages) => [
      ...prevMessages,
      { fromSelf: true, message: reply },
    ]);
  };


  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
            <h3>{currentChat.name}</h3>
            <span style={{ color: isOnline ? "green" : "gray" }}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <div className="secret-chat-toggle">
            <label>
              <input
                type="checkbox"
                checked={isSecretChat}
                onChange={() => setIsSecretChat(!isSecretChat)}
              />
              Chat bí mật
            </label>
          </div>
        </div>
        <div className="actions">
          <div className="create-group">
            <button onClick={handleCreateGroup}>
              <FaUsers size={20} color="white" />
            </button>
          </div>
          {/* Thêm nút Info */}
          <div className="group-info">
            <button onClick={Navigation}>
              <FaInfoCircle size={20} color="white" />
            </button>
          </div>
          <Logout />
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                  {message.fromSelf && ( // Chỉ hiển thị nút thu hồi tin nhắn cho người gửi
                    <button
                      onClick={() => handleDeleteMsg(message._id)}
                      style={{ background: "red", color: "white" }}
                    >
                      Thu hồi
                    </button>
                  )}
                  <button
                    onClick={() => handleReplyMsg(message)} // Thêm chức năng phản hồi
                    style={{ background: "blue", color: "white", marginLeft: "5px" }}
                  >
                    Phản hồi
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
      color: #d1d1d1;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
  button {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  }
  button:hover {
    background-color: darkred;
  }

  .secret-chat-toggle {
  display: flex;
  align-items: center;
}

.secret-chat-toggle label {
  font-size: 14px;
  margin-left: 10px;
}

.secret-chat-toggle input {
  margin-right: 5px;
}

.actions {
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  gap: 1rem; /* Khoảng cách giữa các nút */
}

.create-group button {
  background-color: #4f04ff21;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-group button:hover {
  background-color: #4f04ff80;
}


`;
