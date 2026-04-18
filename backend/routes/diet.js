const express = require("express");
const router = express.Router();
const {
  getDiet,
  addEntry,
  deleteEntry,
  getDietHistory,
} = require("../controllers/dietController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getDiet);
router.get("/history", getDietHistory);
router.post("/entry", addEntry);
router.delete("/entry/:entryId", deleteEntry);

module.exports = router;
