const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getWater,
  addGlass,
  removeGlass,
  updateSettings,
  getWaterHistory,
} = require("../controllers/waterController");

router.use(protect);
router.get("/", getWater);
router.get("/history", getWaterHistory);
router.post("/add", addGlass);
router.delete("/remove/:glassId", removeGlass);
router.put("/settings", updateSettings);

module.exports = router;
