const express = require("express");
const router = express.Router();
const {
  getGymPlan,
  saveGymPlan,
  loadPredefined,
} = require("../controllers/gymPlanController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getGymPlan);
router.post("/", saveGymPlan);
router.post("/load-predefined", loadPredefined);

module.exports = router;
