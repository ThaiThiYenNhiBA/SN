// Imports
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

// Component chính: NewsFeed
const NewsFeed = () => {
    // State
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostFile, setNewPostFile] = useState(null);
    const [isCurrent, setIsCurrent] = useState(undefined);
    const [showCommentBox, setShowCommentBox] = useState(false); // State để điều khiển hiển thị ô comment
    const [commentContent, setCommentContent] = useState(""); // State để lưu nội dung bình luận
    const navigate = useNavigate();


    // Fetch posts từ API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/posts/posts");
                setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    // Fetch user hiện tại từ localStorage
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            setIsCurrent(data._id);
            console.log("id người dùng: " + data._id);
            console.log("UserName: " + data.username);
        };
        fetchCurrentUser();
    }, []);

    // Hàm xử lý
    const handleFileChange = (e) => {
        setNewPostFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isCurrent) {
            console.error("Current user ID is undefined. Cannot create post.");
            return;
        }

        const formData = new FormData();
        formData.append("content", newPostContent);
        formData.append("userId", isCurrent);
        if (newPostFile) {
            formData.append("file", newPostFile);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/posts/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setPosts([response.data.post, ...posts]);
            setNewPostContent("");
            setNewPostFile(null);
        } catch (error) {
            console.error("Error creating post:", error.response?.data || error.message);
        }
    };

    console.log("before: " + isCurrent)
    const handleLike = async (postId) => {
        console.log(isCurrent);
        try {
            const response = await fetch('http://localhost:5000/api/like/addlike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: postId.trim(), // Đảm bảo postId không có khoảng trắng
                    userId: isCurrent, // Gửi userId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error liking post:', errorData.message);
                alert(`Error: ${errorData.message}`);
                return;
            }

            const data = await response.json();
            console.log('Like added successfully:', data);
            alert('You liked the post successfully!');
        } catch (error) {
            console.error('Error during liking post:', error);
            alert('An error occurred while liking the post.');
        }
    };


    const handleShare = (postId) => {
        console.log(`Shared post with ID: ${postId}`);
    };

    const handleComment = (postId) => {
        console.log(`Commented on post with ID: ${postId}`);
        setShowCommentBox(!showCommentBox); // Toggle việc hiển thị ô comment
    };

    const handleCommentChange = (e) => {
        setCommentContent(e.target.value); // Cập nhật giá trị bình luận
    };

    // const getCommentContent = async (postId) => {
    //     try {
            
    //     }
    // };


    const handleSubmitComment = async (postId, event) => {
        console.log('Received postId:', postId);  // Kiểm tra giá trị postId
        console.log('Event:', event); // Kiểm tra sự kiện

        if (commentContent.trim() !== "") {
            try {
                const body = {
                    postId: postId,  // Đảm bảo là giá trị chính xác
                    userId: isCurrent,
                    content: commentContent.trim(),
                };
                console.log('Body data:', body);

                const response = await fetch('http://localhost:5000/api/comment/comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error submitting comment:', errorData.message);
                    alert(`Error: ${errorData.message}`);
                    return;
                }

                const data = await response.json();
                console.log('Comment submitted successfully:', data);
                alert('Your comment has been submitted successfully!');
                setCommentContent(""); // Xóa nội dung bình luận sau khi gửi thành công

            } catch (error) {
                console.error('Error during submitting comment:', error);
                alert('An error occurred while submitting the comment.');
            }
        } else {
            alert('Please enter a comment before submitting.');
        }
    };

    const handleSearchClick = () => {
        navigate(`/SearchPage`);
    };

    // JSX hiển thị
    return (
        <Container>
            <Header>News Feed</Header>
            {/* Ô tìm kiếm dưới Header */}
            <SearchBar>
                <SearchInput 
                    type="text" 
                    placeholder="Search..."
                    onClick={handleSearchClick} // Khi nhấp vào, sẽ điều hướng tới trang SearchPage
                />
            </SearchBar>
            <CreatePostForm onSubmit={handleSubmit}>
                <textarea
                    placeholder="What's on your mind?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                />
                <FileInput type="file" onChange={handleFileChange} />
                <PostButton type="submit">Post</PostButton>
            </CreatePostForm>
            <PostList>
                {posts.map((post) => (
                    <Post key={post._id}>
                        <PostHeader>
                            <Avatar>
                                <img src={`data:image/svg+xml;base64,${post.user.avatarImage}`} alt="Avatar" />
                            </Avatar>
                            <Author>Posted by: {post.user.username}</Author>
                        </PostHeader>
                        <Content>{post.content}</Content>
                        {post.imageUrl && post.imageUrl.endsWith(".mp4") ? (
                            <MediaContainer>
                                <video controls>
                                    <source src={`http://localhost:5000${post.imageUrl}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                {/* <CommentCount>{post.comments || 0} Comment</CommentCount> */}
                            </MediaContainer>
                        ) : post.imageUrl ? (
                            <MediaContainer>
                                <img src={`http://localhost:5000${post.imageUrl}`} alt="Post media" />
                                {/* <LikeCount>{post.likes || 0} Likes</LikeCount> */}
                            </MediaContainer>
                        ) : null}
                        <PostActions>
                            <ActionButton onClick={() => handleLike(post._id)}>
                                <FaThumbsUp /> Like
                                <LikeCount>{post.likes || 0} Likes</LikeCount> {/* Hiển thị số lượng Likes */}
                            </ActionButton>
                            
                            <ActionButton onClick={() => handleComment(post._id)}>
                                <FaComment /> Comment
                                <LikeCount>{post.comments || 0 } comment </LikeCount>
                            </ActionButton>

                            <ActionButton onClick={() => handleShare(post._id)}>
                                <FaShareAlt /> Share
                            </ActionButton>
                        </PostActions>
                        {/* Hiển thị textbox để người dùng nhập bình luận */}
                        {showCommentBox && (
                            <CommentBox>
                                <CommentInput
                                    value={commentContent}
                                    onChange={handleCommentChange}
                                    placeholder="Write your comment..."
                                    rows="4"
                                    cols="50"
                                />
                                <CommentSubmitButton onClick={() => handleSubmitComment(post._id)}>
                                    Submit Comment
                                </CommentSubmitButton>

                            </CommentBox>
                        )}

                    </Post>
                ))}
            </PostList>
        </Container>
    );
};

export default NewsFeed;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Header = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const CreatePostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  textarea {
    resize: none;
    height: 100px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }
`;

const FileInput = styled.input`
  margin-top: 0.5rem;
`;

const PostButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1rem;
`;

const Post = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
`;

const Author = styled.p`
  font-size: 0.9rem;
  color: #555;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const Content = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  color: #333;
  margin-bottom: 1rem;
`;

const MediaContainer = styled.div`
    max-width: 100%;
  max-height: 300px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  margin-top: 1rem; /* Thêm khoảng cách giữa media và nội dung trên */
  padding-bottom: 30px; /* Thêm khoảng cách dưới phần media */

   margin-left: auto;
  margin-right: auto;

  img,
  video {
    width: 100%;
    max-height: 300px; /* Giới hạn chiều cao của hình ảnh/video */
    object-fit: cover; /* Đảm bảo nội dung giữ tỷ lệ và không bị biến dạng */
    border-radius: 10px; /* Bo tròn góc */
  }
`;


const PostActions = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 1rem;
  align-items: center; /* Căn giữa các phần tử theo chiều dọc */
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  flex-direction: column; /* Hiển thị nút Like và số lượng like theo chiều dọc */

  &:hover {
    color: #000;
    text-decoration: underline;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const CommentBox = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 10px auto;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
`;

// Comment input (textarea)
const CommentInput = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical; /* Cho phép người dùng kéo để thay đổi kích thước */
  margin-bottom: 10px;
  background-color: #f1f1f1;
  color: #333;
  font-family: 'Arial', sans-serif;

  &:focus {
    outline: none;
    border-color: #4caf50;
    background-color: #fff;
  }
`;

// Submit button
const CommentSubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #387e3a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
const LikeCount = styled.span`
  margin-left: px; /* Khoảng cách giữa nút like và số lượng like */
  font-size: 14px;
  color: #555;
`;

const CommentCount = styled.div`
   margin-left: px; /* Khoảng cách giữa nút like và số lượng like */
  font-size: 14px;
  color: #555;
`;
const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 5px;
  outline: none;
  margin-right: 10px;
  
  &:focus {
    border-color: #007bff;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const SearchButton = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

