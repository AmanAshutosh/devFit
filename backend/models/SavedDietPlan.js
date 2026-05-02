const mongoose = require("mongoose");

const savedDietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planName: { type: String, default: "My Diet Plan", trim: true },
    calories: { type: Number },
    proteinG: { type: Number },
    carbG: { type: Number },
    fatG: { type: Number },
    bmr: { type: Number },
    tdee: { type: Number },
    bmi: { type: String },
    meals: {
      breakfast: { type: String },
      lunch: { type: String },
      dinner: { type: String },
      morningSnack: { type: String },
      eveningSnack: { type: String },
    },
    dietPreference: { type: String },
    goal: { type: String },
  },
  { timestamps: true },
);

savedDietPlanSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SavedDietPlan", savedDietPlanSchema);
