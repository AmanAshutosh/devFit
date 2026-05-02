const mongoose = require("mongoose");

const glassSchema = new mongoose.Schema({
  ml: { type: Number, required: true },
  loggedAt: { type: Date, default: Date.now },
});

const waterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    glasses: [glassSchema],
    goalMl: { type: Number, default: 2500 },
    glassSize: { type: Number, default: 250 },
  },
  { timestamps: true }
);

waterSchema.index({ user: 1, date: -1 });

waterSchema.virtual("totalMl").get(function () {
  return this.glasses.reduce((s, g) => s + g.ml, 0);
});

module.exports = mongoose.model("WaterIntake", waterSchema);
