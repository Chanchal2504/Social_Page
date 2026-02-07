const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePhoto: {
      type: String, 
      default: "https://res.cloudinary.com/djb9dz0cb/image/upload/v1770327023/default_Profile_xvcnsw.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
