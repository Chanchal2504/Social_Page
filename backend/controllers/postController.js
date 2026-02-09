const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    console.log("Here")
    // validation (extra safety beyond schema)
    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Post must contain text or image" });
    }

    const post = await Post.create({
      author: req.user._id,   // from auth middleware
      text,
      image,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user
    const posts = await Post.find({ author: userId })
      .populate("author", "username profilePhoto")
      .populate("comments.user", "username profilePhoto")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      author: post.author,
      text: post.text,
      image: post.image,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      comments: post.comments,
      createdAt: post.createdAt,
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Get my posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username profilePhoto")
      .sort({ createdAt: -1 })
      .populate("comments.user", "username profilePhoto");

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      author: post.author,
      text: post.text,
      image: post.image,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      comments: post.comments,
      createdAt: post.createdAt,
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("comments.user", "username profilePhoto");

    res.status(201).json({
      message: "Comment added",
      comments: updatedPost.comments,
      commentsCount: updatedPost.comments.length,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("author", "username profilePhoto")
      .populate("likes", "username profilePhoto")
      .populate("comments.user", "username profilePhoto");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      _id: post._id,
      author: post.author,
      text: post.text,
      image: post.image,
      likesCount: post.likes.length,
      likes: post.likes,
      comments: post.comments,
      createdAt: post.createdAt,
    });
  } catch (error) {
    console.error("Get single post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

