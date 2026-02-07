import React, { useEffect, useState } from "react";
import api from "../axios";
import "../Styles/Feed.css";
import ProfileHeader from "../components/ProfileHeader";


function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [currentUser] = useState(localStorage.getItem("username") || "User");
  const [showProfile, setShowProfile] = useState(false);
  const defaultProfilePhoto =
    "https://res.cloudinary.com/djb9dz0cb/image/upload/v1770327023/default_Profile_xvcnsw.jpg";
  const [profilePhoto, setProfilePhoto] = useState(defaultProfilePhoto);
  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const envApiUrl =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL
      : "";
  const serverURL = envApiUrl ? envApiUrl.replace("/api", "") : "http://localhost:5000";

  const resolveImageSrc = (src) => {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    if (src.startsWith("data:")) return src;
    if (src.startsWith("/")) return `${serverURL}${src}`;
    return src;
  };

  const fetchPosts = () => {
    api
      .get("/posts")
      .then((res) => {
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to load posts:", err);
      });
  };

  useEffect(() => {
    fetchPosts();
    api
      .get("/users/me", { headers: authHeaders })
      .then((res) => {
        if (res.data?.profilePhoto) {
          setProfilePhoto(res.data.profilePhoto);
        }
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      alert("Post must have text or image");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "/posts",
        { text: text.trim(), image: image || undefined },
        { headers: authHeaders }
      );
      setText("");
      setImage(null);
      setImagePreview(null);
      fetchPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.put(`/posts/${postId}/like`, {}, { headers: authHeaders });
      fetchPosts();
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleComment = async (postId) => {
    const comment = (commentText[postId] || "").trim();
    if (!comment) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      await api.post(
        `/posts/${postId}/comment`,
        { text: comment },
        { headers: authHeaders }
      );
      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch (err) {
      console.error("Failed to comment:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const getAvatarInitials = (username) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (username) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
      "#F8B88B",
      "#A9DFBF",
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="header-content">
          <h1>SocialPage</h1>
          <div className="header-right">
            <button
              type="button"
              className="user-avatar profile-avatar-btn header-avatar"
              onClick={() => setShowProfile(true)}
            >
              <img src={profilePhoto} alt="Profile" />
            </button>
            <div className="profile-block">
              <h2>{currentUser}</h2>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.href = "/login";
              }}
              className="logout-btn"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="feed-wrapper">

        <main className="feed-main">
          <div className="post-card create-post">
            <div className="post-header">
              <div className="user-info">
                <span className="user-avatar">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="avatar-img"
                  />
                </span>
                <strong>{currentUser}</strong>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="create-form">
              <textarea
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="3"
                className="textarea-input"
              />

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-img"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="form-actions">
                <label className="file-input-label">
                  🖼️ Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
                <button type="submit" disabled={loading} className="post-btn">
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>

          <div className="posts-feed">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <article key={post._id} className="post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <span className="user-avatar">
                        <img
                          src={post.author?.profilePhoto || defaultProfilePhoto}
                          alt="Author"
                          className="avatar-img"
                        />
                      </span>
                      <div>
                        <strong>{post.author?.username || "Unknown"}</strong>
                        <span className="post-time">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    {post.text && <p className="post-text">{post.text}</p>}

                    {post.image && (
                      <img
                        src={resolveImageSrc(post.image)}
                        alt="Post"
                        className="post-image"
                      />
                    )}
                  </div>

                  <div className="post-stats">
                    <span>❤️ {post.likesCount ?? 0} Likes</span>
                    <span>💬 {post.commentsCount ?? 0} Comments</span>
                  </div>

                  <div className="post-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleLike(post._id)}
                      type="button"
                    >
                      👍 Like
                    </button>
                    <button className="action-btn" type="button">
                      💬 Comment
                    </button>
                    
                  </div>

                  <div className="comments-section">
                    {post.comments && post.comments.length > 0 && (
                      <div className="comments-list">
                        {post.comments.map((comment) => (
                          <div key={comment._id} className="comment">
                            <strong>
                              {comment.user?.username || "unknown"}
                            </strong>
                            <p>{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="comment-input-wrapper">
                      <span className="comment-avatar">👤</span>
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [post._id]: e.target.value,
                          })
                        }
                        className="comment-input"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleComment(post._id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        className="comment-btn"
                        type="button"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="no-posts">
                <p>No posts yet. Be the first to share.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {showProfile && (
        <div className="profile-overlay" onClick={() => setShowProfile(false)}>
          <div
            className="profile-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <ProfileHeader />
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialFeed;
