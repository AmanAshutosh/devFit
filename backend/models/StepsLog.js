const mongoose = require("mongoose");

const stepsLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    steps: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

stepsLogSchema.index({ user: 1, date: -1 });
stepsLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("StepsLog", stepsLogSchema);
