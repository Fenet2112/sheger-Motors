const express = require("express");
const { getStats, getSettings, updateSettings } = require("../controllers/adminController");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard statistics
router.get("/stats", authenticate, authorizeAdmin, getStats);

// Application settings
router.get("/settings", authenticate, authorizeAdmin, getSettings);
router.put("/settings", authenticate, authorizeAdmin, updateSettings);

module.exports = router;
