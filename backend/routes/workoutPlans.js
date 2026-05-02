const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const c = require("../controllers/workoutPlansController");

router.use(protect);

router.get("/", c.list);
router.get("/active", c.getActive);
router.post("/", c.save);
router.post("/deactivate", c.deactivate);
router.put("/:id", c.update);
router.delete("/:id", c.remove);
router.post("/:id/activate", c.activate);

module.exports = router;
