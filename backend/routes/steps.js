const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const c = require("../controllers/stepsController");

router.use(auth);

router.get("/history", c.getHistory);
router.get("/", c.getSteps);
router.post("/", c.logSteps);

module.exports = router;
