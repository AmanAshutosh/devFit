const mongoose = require("mongoose");

const supplementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true }, // e.g. "1 scoop", "2 capsules"
    time: { type: String, required: true }, // e.g. "08:00"
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

supplementSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Supplement", supplementSchema);
