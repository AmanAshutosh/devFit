const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    mobile: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    age: { type: Number, min: 10, max: 120 },
    weight: { type: Number, min: 20, max: 500 }, // kg
    heightFeet: { type: Number, min: 1, max: 9 },
    heightInches: { type: Number, min: 0, max: 11 },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    otpResendCount: { type: Number, default: 0 },
    otpResendLastAt: { type: Date },
    gymTime: { type: String }, // e.g. "07:00"
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    notificationsEnabled: { type: Boolean, default: false },
    totalFitXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    activeWorkoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavedWorkoutPlan",
      default: null,
    },
    activeDietPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavedDietPlan",
      default: null,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate unique username from name
userSchema.methods.generateUsername = function () {
  const base = this.name.toLowerCase().replace(/\s+/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
};

// Virtual: BMI
userSchema.virtual("bmi").get(function () {
  if (!this.weight || !this.heightFeet) return null;
  const totalInches = this.heightFeet * 12 + Number(this.heightInches || 0);
  const meters = totalInches * 0.0254;
  const bmiVal = this.weight / (meters * meters);
  return (this.weight / (meters * meters)).toFixed(1);
});

module.exports = mongoose.model("User", userSchema);
