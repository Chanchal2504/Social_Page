import React, { useRef, useEffect } from "react";
import "../Styles/Comment.css";

const CommentsOverlay = ({ post, onClose, handleComment, commentText, setCommentText }) => {
  const commentInputRef = useRef();
  
  useEffect(() => {
  commentInputRef.current?.focus();

  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);


  return (
    <div className="co-overlay" onClick={onClose}>
      <div className="co-overlay-content" onClick={(e) => e.stopPropagation()}>
        <button className="co-close-btn" onClick={onClose}>✖</button>
        <h3 className="co-title">Comments</h3>

        <div className="co-comments-list">
          {post.comments?.map((comment) => (
            <div key={comment._id} className="co-comment">
              <strong>{comment.user?.username || "unknown"}</strong>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>

        <div className="co-comment-input-wrapper">
          <input
            ref={commentInputRef}
            type="text"
            placeholder="Write a comment..."
            value={commentText[post._id] || ""}
            onChange={(e) =>
              setCommentText({ ...commentText, [post._id]: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleComment(post._id);
            }}
            className="co-comment-input"
          />
          <button
            className="co-comment-btn"
            onClick={() => handleComment(post._id)}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsOverlay;
