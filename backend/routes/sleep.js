const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getSleep,
  logSleep,
  getSleepHistory,
} = require("../controllers/sleepController");

router.use(protect);
router.get("/", getSleep);
router.get("/history", getSleepHistory);
router.post("/", logSleep);

module.exports = router;
