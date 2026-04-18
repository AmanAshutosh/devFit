const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  resetProgress,
  getLeaderboard,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/reset-progress", protect, resetProgress);
router.get("/leaderboard", protect, getLeaderboard);

module.exports = router;
