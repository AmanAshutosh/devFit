const Exercise = require("../models/Exercise");
const Diet = require("../models/Diet");
const User = require("../models/User");
const SleepLog = require("../models/SleepLog");
const WaterIntake = require("../models/WaterIntake");
const StepsLog = require("../models/StepsLog");

// GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const [
      user,
      exerciseDays,
      dietData,
      totalExercises,
      sleepData,
      waterData,
      stepsData,
    ] = await Promise.all([
      User.findById(userId).select("weight streak createdAt"),
      Exercise.aggregate([
        { $match: { user: userId, date: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalSets: { $sum: "$sets" },
            exercises: { $push: "$name" },
            muscleGroups: { $push: "$muscleGroup" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Diet.find({ user: userId, date: { $gte: startDate } })
        .sort({ date: 1 })
        .select("date totalCalories totalProtein totalCarbs totalFats"),
      Exercise.countDocuments({ user: userId }),
      SleepLog.find({ user: userId, date: { $gte: startDate } })
        .sort({ date: 1 })
        .select("date hours quality"),
      WaterIntake.find({ user: userId, date: { $gte: startDate } })
        .sort({ date: 1 })
        .select("date glasses goalMl"),
      StepsLog.find({ user: userId, date: { $gte: startDate } })
        .sort({ date: 1 })
        .select("date steps"),
    ]);

    const sleepHistory = sleepData.map((s) => ({
      date: new Date(s.date).toISOString().slice(0, 10),
      hours: s.hours,
      quality: s.quality,
    }));

    const waterHistory = waterData.map((w) => ({
      date: new Date(w.date).toISOString().slice(0, 10),
      totalMl: w.glasses.reduce((sum, g) => sum + g.ml, 0),
      goalMl: w.goalMl,
    }));

    const stepsHistory = stepsData.map((s) => ({
      date: new Date(s.date).toISOString().slice(0, 10),
      steps: s.steps,
    }));

    const avgSleep = sleepHistory.length
      ? Math.round(
          (sleepHistory.reduce((s, d) => s + d.hours, 0) / sleepHistory.length) * 10,
        ) / 10
      : null;

    const avgWaterMl = waterHistory.length
      ? Math.round(
          waterHistory.reduce((s, d) => s + d.totalMl, 0) / waterHistory.length,
        )
      : null;

    const avgSteps = stepsHistory.length
      ? Math.round(
          stepsHistory.reduce((s, d) => s + d.steps, 0) / stepsHistory.length,
        )
      : null;

    res.status(200).json({
      streak: user.streak || 0,
      currentWeight: user.weight || null,
      memberSince: user.createdAt,
      workoutDays: exerciseDays,
      calorieHistory: dietData,
      totalExercises,
      sleepHistory,
      waterHistory,
      stepsHistory,
      avgSleep,
      avgWaterMl,
      avgSteps,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getOverview };
