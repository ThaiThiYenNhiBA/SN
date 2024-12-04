import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { MdAttachFile } from "react-icons/md";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import axios from "axios";

const host = "http://localhost:5000";
const postFile = `${host}/api/files/uploadFile`;

export default function ChatInput({ handleSendMsg, setFileUploaded }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      alert("yes: "+file.name);
      setSelectedFile(file.name);
      setFileUploaded(false); // Đặt lại trạng thái trước khi upload
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await axios.post("http://localhost:5000/api/files/uploadFile", formData);
        if (response.status === 200) {
          console.log("File uploaded successfully:", file.name); // Log khi tệp tải lên thành công
          setFileUploaded(true);
        }
      } catch (error) {
        console.error("File upload failed:", error.message); // Log lỗi nếu có
      }
      event.target.value = ""; // Đặt lại giá trị input file
    }
  };
  

  const sendChat = async (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", event.target.fileInput.files[0]);

      try {
        const response = await fetch(postFile, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("File uploaded successfully:", data);
        setFileUploaded(true); // Bật trạng thái khi file được tải lên
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setSelectedFile(null);
    document.getElementById("fileInput").value = "";
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <button
          type="button"
          className="attach-button"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <MdAttachFile />
          {selectedFile && <span>{selectedFile}</span>}
        </button>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9186f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9186f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9186f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    background-color: #ffffff34;
    border-radius: 2rem;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9186f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
    .attach-button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        font-size: 1.5rem;
        color: white;
      }
      span {
        margin-left: 0.5rem;
        font-size: 0.9rem;
        color: #b8b8b8;
      }
    }
  }
`;
