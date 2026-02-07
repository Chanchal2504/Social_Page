const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { uploadProfilePhoto } = require("../controllers/userController");

router.put(
  "/profile-photo",
  authMiddleware,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

module.exports = router;
