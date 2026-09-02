const express = require("express");
const { login, changePassword } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);

// Protected — must be authenticated to change password
router.put("/change-password", authenticate, changePassword);

module.exports = router;
