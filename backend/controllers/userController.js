const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

exports.uploadProfilePhoto = async (req, res) => {
  try {
    // multer puts file in req.file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // convert buffer → base64 for cloudinary
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "profile_photos",
    });

    // update user profile photo
    const user = await User.findByIdAndUpdate(
      req.user,
      { profilePhoto: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile photo updated",
      user,
    });
  } catch (error) {
    console.error("Profile upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

