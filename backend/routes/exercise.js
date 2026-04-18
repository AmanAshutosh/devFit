const express = require("express");
const router = express.Router();
const {
  getExercises,
  addExercise,
  updateExercise,
  deleteExercise,
  exportExercises,
} = require("../controllers/exerciseController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getExercises);
router.get("/export", exportExercises);
router.post("/", addExercise);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

module.exports = router;
