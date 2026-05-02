const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const c = require("../controllers/stepsController");

router.use(protect);

router.get("/history", c.getHistory);
router.get("/", c.getSteps);
router.post("/", c.logSteps);

module.exports = router;
