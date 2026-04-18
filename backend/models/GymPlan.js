const mongoose = require("mongoose");

const exercisePlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number },
  reps: { type: String }, // e.g. "8-12"
  rest: { type: String }, // e.g. "60s"
});

const dayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true, min: 1, max: 6 }, // Day 1–6
  label: { type: String }, // e.g. "Chest + Triceps"
  duration: { type: Number }, // minutes
  muscleGroups: [String],
  exercises: [exercisePlanSchema],
  isRestDay: { type: Boolean, default: false },
});

const gymPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    planName: { type: String, default: "My Custom Plan" },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    days: [dayPlanSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("GymPlan", gymPlanSchema);
