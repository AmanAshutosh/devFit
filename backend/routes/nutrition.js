const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { searchNutrition } = require("../controllers/nutritionController");

router.use(protect);
router.get("/search", searchNutrition);

module.exports = router;
