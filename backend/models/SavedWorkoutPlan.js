const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  detail: { type: String }, // e.g. "4 × 10" or "30 min"
});

const scheduleDaySchema = new mongoose.Schema({
  day: { type: String, required: true }, // "Monday", "Tuesday", etc.
  label: { type: String },
  exercises: [exerciseSchema],
});

const savedWorkoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planName: { type: String, default: "My Workout Plan", trim: true },
    metadata: {
      fitnessLevel: { type: String },
      goal: { type: String },
      location: { type: String },
      days: { type: Number },
      workoutTypes: [String],
    },
    schedule: [scheduleDaySchema],
  },
  { timestamps: true },
);

savedWorkoutPlanSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SavedWorkoutPlan", savedWorkoutPlanSchema);
