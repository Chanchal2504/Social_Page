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
