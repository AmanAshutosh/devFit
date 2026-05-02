const SavedDietPlan = require("../models/SavedDietPlan");
const User = require("../models/User");

// GET /api/diet-plans
exports.list = async (req, res) => {
  try {
    const plans = await SavedDietPlan.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    const user = await User.findById(req.user._id).select("activeDietPlanId");
    res.json({ plans, activeDietPlanId: user?.activeDietPlanId || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/diet-plans/active
exports.getActive = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("activeDietPlanId");
    if (!user?.activeDietPlanId) return res.json({ plan: null });

    const plan = await SavedDietPlan.findOne({
      _id: user.activeDietPlanId,
      user: req.user._id,
    });
    if (!plan) {
      await User.findByIdAndUpdate(req.user._id, { activeDietPlanId: null });
      return res.json({ plan: null });
    }
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/diet-plans
exports.save = async (req, res) => {
  try {
    const { planName, calories, proteinG, carbG, fatG, bmr, tdee, bmi, meals, dietPreference, goal } = req.body;
    if (!meals) {
      return res.status(400).json({ message: "Meals are required" });
    }
    const plan = await SavedDietPlan.create({
      user: req.user._id,
      planName: planName || "My Diet Plan",
      calories,
      proteinG,
      carbG,
      fatG,
      bmr,
      tdee,
      bmi,
      meals,
      dietPreference,
      goal,
    });
    res.status(201).json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/diet-plans/:id
exports.update = async (req, res) => {
  try {
    const fields = ["planName", "calories", "proteinG", "carbG", "fatG", "bmr", "tdee", "bmi", "meals", "dietPreference", "goal"];
    const updates = {};
    fields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const plan = await SavedDietPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true },
    );
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/diet-plans/:id
exports.remove = async (req, res) => {
  try {
    const plan = await SavedDietPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await User.updateOne(
      { _id: req.user._id, activeDietPlanId: req.params.id },
      { activeDietPlanId: null },
    );
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/diet-plans/:id/activate
exports.activate = async (req, res) => {
  try {
    const plan = await SavedDietPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await User.findByIdAndUpdate(req.user._id, { activeDietPlanId: plan._id });
    res.json({ message: "Plan activated", activeDietPlanId: plan._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/diet-plans/deactivate
exports.deactivate = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { activeDietPlanId: null });
    res.json({ message: "Active diet plan cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
