const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    weight: { type: Number, default: 0 }, // kg
    reps: { type: Number, required: true },
    sets: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true },
    muscleGroup: { type: String, trim: true },
  },
  { timestamps: true }
);

exerciseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
