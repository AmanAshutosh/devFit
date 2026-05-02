const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getHealthScore } = require("../controllers/healthScoreController");

router.use(auth);
router.get("/", getHealthScore);

module.exports = router;
