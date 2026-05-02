const SavedWorkoutPlan = require("../models/SavedWorkoutPlan");
const User = require("../models/User");

// GET /api/workout-plans
exports.list = async (req, res) => {
  try {
    const plans = await SavedWorkoutPlan.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    const user = await User.findById(req.user._id).select("activeWorkoutPlanId");
    res.json({ plans, activeWorkoutPlanId: user?.activeWorkoutPlanId || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/workout-plans/active
exports.getActive = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("activeWorkoutPlanId");
    if (!user?.activeWorkoutPlanId) return res.json({ plan: null });

    const plan = await SavedWorkoutPlan.findOne({
      _id: user.activeWorkoutPlanId,
      user: req.user._id,
    });
    if (!plan) {
      // Active plan was deleted — clear the reference
      await User.findByIdAndUpdate(req.user._id, { activeWorkoutPlanId: null });
      return res.json({ plan: null });
    }
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/workout-plans
exports.save = async (req, res) => {
  try {
    const { planName, metadata, schedule } = req.body;
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({ message: "Schedule is required" });
    }
    const plan = await SavedWorkoutPlan.create({
      user: req.user._id,
      planName: planName || "My Workout Plan",
      metadata: metadata || {},
      schedule,
    });
    res.status(201).json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/workout-plans/:id
exports.update = async (req, res) => {
  try {
    const { planName, metadata, schedule } = req.body;
    const plan = await SavedWorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { planName, metadata, schedule },
      { new: true, runValidators: true },
    );
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/workout-plans/:id
exports.remove = async (req, res) => {
  try {
    const plan = await SavedWorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // If deleted plan was the active one, clear the reference
    await User.updateOne(
      { _id: req.user._id, activeWorkoutPlanId: req.params.id },
      { activeWorkoutPlanId: null },
    );
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/workout-plans/:id/activate
exports.activate = async (req, res) => {
  try {
    const plan = await SavedWorkoutPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await User.findByIdAndUpdate(req.user._id, {
      activeWorkoutPlanId: plan._id,
    });
    res.json({ message: "Plan activated", activeWorkoutPlanId: plan._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/workout-plans/deactivate
exports.deactivate = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { activeWorkoutPlanId: null });
    res.json({ message: "Active plan cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
