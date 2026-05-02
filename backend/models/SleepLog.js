const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    hours: { type: Number, required: true, min: 0, max: 24 },
    quality: {
      type: String,
      enum: ["poor", "fair", "good", "excellent"],
      default: "good",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

sleepSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("SleepLog", sleepSchema);
