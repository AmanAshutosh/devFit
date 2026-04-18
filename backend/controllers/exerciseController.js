const Exercise = require("../models/Exercise");
const User = require("../models/User");

const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5500, 9000, 14000, 21000, 30000, 42000];

function calculateFitXP(sets, reps, weight) {
  const base = sets * reps * 2;
  const weightBonus = weight > 0 ? Math.floor(weight * 0.5) : 0;
  return base + weightBonus;
}

function getLevelFromXP(xp) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 10);
}

// GET /api/exercise
const getExercises = async (req, res) => {
  try {
    const { date, startDate, endDate, limit = 50, page = 1 } = req.query;
    const query = { user: req.user._id };

    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: d, $lt: nextDay };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const exercises = await Exercise.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Exercise.countDocuments(query);

    res
      .status(200)
      .json({
        exercises,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      });
  } catch (error) {
    console.error("Get exercises error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/exercise
const addExercise = async (req, res) => {
  try {
    const { name, weight, reps, sets, date, notes, muscleGroup } = req.body;

    if (!name || !reps || !sets) {
      return res
        .status(400)
        .json({ message: "Name, reps, and sets are required." });
    }

    const exercise = await Exercise.create({
      user: req.user._id,
      name,
      weight: weight || 0,
      reps,
      sets,
      date: date || new Date(),
      notes,
      muscleGroup,
    });

    const xpGained = calculateFitXP(sets, reps, weight || 0);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { totalFitXP: xpGained } },
      { new: true },
    ).select("totalFitXP");
    const newLevel = getLevelFromXP(updatedUser.totalFitXP);
    if (newLevel !== req.user.level) {
      await User.findByIdAndUpdate(req.user._id, { level: newLevel });
    }

    res.status(201).json({
      exercise,
      xpGained,
      totalFitXP: updatedUser.totalFitXP,
      level: newLevel,
      message: "Exercise logged successfully.",
    });
  } catch (error) {
    console.error("Add exercise error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/exercise/:id
const updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!exercise)
      return res.status(404).json({ message: "Exercise not found." });

    const { name, weight, reps, sets, date, notes, muscleGroup } = req.body;
    Object.assign(exercise, {
      name,
      weight,
      reps,
      sets,
      date,
      notes,
      muscleGroup,
    });
    await exercise.save();

    res.status(200).json({ exercise, message: "Exercise updated." });
  } catch (error) {
    console.error("Update exercise error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/exercise/:id
const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!exercise)
      return res.status(404).json({ message: "Exercise not found." });
    res.status(200).json({ message: "Exercise deleted." });
  } catch (error) {
    console.error("Delete exercise error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// GET /api/exercise/export — returns all data for Excel export
const exportExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.status(200).json({ exercises });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getExercises,
  addExercise,
  updateExercise,
  deleteExercise,
  exportExercises,
};
