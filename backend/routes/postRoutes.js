const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createPost,getAllPosts, toggleLike,addComment,getSinglePost } = require("../controllers/postController");

router.get("/", getAllPosts);
router.get("/:postId", getSinglePost);
router.post("/", authMiddleware, createPost);
router.put("/:postId/like", authMiddleware, toggleLike);
router.post("/:postId/comment", authMiddleware, addComment);
module.exports = router;
