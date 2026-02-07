const express = require("express");
const User = require("../models/User");
const {signup,login} = require("../controllers/authController");
const router = express.Router();

// Signup
router.post("/signup", signup);
router.post("/login", login);


module.exports = router;
