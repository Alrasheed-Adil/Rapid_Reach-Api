const express = require("express");
const { signupUser, loginUser, changePassword} = require("../controllers/userController");
// require the middleware function protect
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.put("/change-password",protect, changePassword);

module.exports = router;
