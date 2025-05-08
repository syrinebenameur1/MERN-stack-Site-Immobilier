import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";

import "./profilePage.scss";

const API = axios.create({
  baseURL: "https://immobilier-api.onrender.com/api",
  withCredentials: true,
});

function ProfilePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Local state for posts, savedPosts, chats
  const [userPosts, setUserPosts]       = useState([]);
  const [savedPosts, setSavedPosts]     = useState([]);
  const [chats, setChats]               = useState([]);

  // Loading / error flags
  const [loadingPosts,   setLoadingPosts]   = useState(true);
  const [loadingSaved,   setLoadingSaved]   = useState(true);
  const [loadingChats,   setLoadingChats]   = useState(true);
  const [errorPosts,     setErrorPosts]     = useState(null);
  const [errorSaved,     setErrorSaved]     = useState(null);
  const [errorChats,     setErrorChats]     = useState(null);

  // Logout handler (unchanged)
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Fetch user posts
  useEffect(() => {
    API.get("/users/profilePosts")
      .then(res => setUserPosts(res.data.userPosts))
      .catch(err => setErrorPosts(err))
      .finally(() => setLoadingPosts(false));
  }, []);

  // Fetch saved posts
  useEffect(() => {
    API.get("/users/savedPosts")
      .then(res => setSavedPosts(res.data.savedPosts))
      .catch(err => setErrorSaved(err))
      .finally(() => setLoadingSaved(false));
  }, []);

  // Fetch chats
  useEffect(() => {
    API.get("/chats")
      .then(res => setChats(res.data))
      .catch(err => setErrorChats(err))
      .finally(() => setLoadingChats(false));
  }, []);

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          {/* User Info */}
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar" />
            </span>
            <span>Username: <b>{currentUser.username}</b></span>
            <span>E-mail: <b>{currentUser.email}</b></span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* My List */}
          <div className="title">
            <h1>My List</h1>
            <Link to="/add"><button>Create New Post</button></Link>
          </div>
          {loadingPosts ? (
            <p>Loading your posts…</p>
          ) : errorPosts ? (
            <p className="error">Error loading posts.</p>
          ) : (
            <List posts={userPosts} />
          )}

          {/* Saved List */}
          <div className="title">
            <h1>Saved List</h1>
          </div>
          {loadingSaved ? (
            <p>Loading saved posts…</p>
          ) : errorSaved ? (
            <p className="error">Error loading saved posts.</p>
          ) : (
            <List posts={savedPosts} />
          )}
        </div>
      </div>

      {/* Chats */}
      <div className="chatContainer">
        <div className="wrapper">
          <h2>Your Chats</h2>
          {loadingChats ? (
            <p>Loading chats…</p>
          ) : errorChats ? (
            <p className="error">Error loading chats.</p>
          ) : (
            <Chat chats={chats} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
