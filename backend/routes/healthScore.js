const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getHealthScore } = require("../controllers/healthScoreController");

router.use(protect);
router.get("/", getHealthScore);

module.exports = router;
