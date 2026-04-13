const mongoose = require('mongoose');

const dietEntrySchema = new mongoose.Schema({
  foodName: { type: String, required: true, trim: true },
  mealTime: {
    type: String,
    enum: ['morning', 'breakfast', 'lunch', 'snack', 'dinner', 'night'],
    required: true,
  },
  quantity: { type: Number, required: true }, // grams or ml
  unit: { type: String, default: 'g' },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 }, // g
  carbs: { type: Number, default: 0 },   // g
  fats: { type: Number, default: 0 },    // g
});

const dietSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    entries: [dietEntrySchema],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFats: { type: Number, default: 0 },
  },
  { timestamps: true }
);

dietSchema.index({ user: 1, date: -1 });

// Recalculate totals before save
dietSchema.pre('save', function (next) {
  this.totalCalories = this.entries.reduce((sum, e) => sum + (e.calories || 0), 0);
  this.totalProtein = this.entries.reduce((sum, e) => sum + (e.protein || 0), 0);
  this.totalCarbs = this.entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  this.totalFats = this.entries.reduce((sum, e) => sum + (e.fats || 0), 0);
  next();
});

module.exports = mongoose.model('Diet', dietSchema);
