import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoCall from "./pages/VideoCall";
import CreateGroup from "./pages/CreateGroup";
import GroupInfo from "./pages/GroupInfo";
import UpdateGroupInfo from "./pages/UpdateGroupInfo";
import DeleteGroup from "./pages/DeleteGroup";
import NewsFeed from "./pages/NewsFeed";
import SearchPage from "./pages/SearchPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/videoCall" element={<VideoCall />} />
        <Route path="/CreateGroup" element={<CreateGroup />} />
        <Route path="/GroupInfo" element={<GroupInfo />} />
        <Route path="/UpdateGroupInfo" element={<UpdateGroupInfo />} />
        <Route path="/DeleteGroup" element={<DeleteGroup />} />
        <Route path="/NewsFeed" element={<NewsFeed />} />
        <Route path="/SearchPage" element={<SearchPage />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
