const Exercise = require("../models/Exercise");
const Diet = require("../models/Diet");
const User = require("../models/User");

// GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Weight progress (from user's weight history — stored as single value; show as flat line)
    const user = await User.findById(userId).select("weight streak createdAt");

    // Workout consistency — days with at least one exercise logged
    const exerciseDays = await Exercise.aggregate([
      { $match: { user: userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalSets: { $sum: "$sets" },
          exercises: { $push: "$name" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calories per day
    const dietData = await Diet.find({
      user: userId,
      date: { $gte: startDate },
    })
      .sort({ date: 1 })
      .select("date totalCalories totalProtein totalCarbs totalFats");

    // Total exercises logged
    const totalExercises = await Exercise.countDocuments({ user: userId });

    res.status(200).json({
      streak: user.streak || 0,
      currentWeight: user.weight || null,
      memberSince: user.createdAt,
      workoutDays: exerciseDays,
      calorieHistory: dietData,
      totalExercises,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getOverview };
