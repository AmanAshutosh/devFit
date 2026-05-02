const Exercise = require("../models/Exercise");
const SleepLog = require("../models/SleepLog");
const WaterIntake = require("../models/WaterIntake");
const StepsLog = require("../models/StepsLog");

function startOfDay(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

// GET /api/health-score
exports.getHealthScore = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [exercises, sleepLogs, waterToday, stepsToday] = await Promise.all([
      Exercise.find({
        user: req.user._id,
        date: { $gte: sevenDaysAgo, $lte: new Date() },
      }).select("date"),
      SleepLog.find({
        user: req.user._id,
        date: { $gte: sevenDaysAgo, $lte: today },
      }).select("hours"),
      WaterIntake.findOne({ user: req.user._id, date: today }),
      StepsLog.findOne({ user: req.user._id, date: today }),
    ]);

    // ── Exercise consistency (0–35 pts) ──────────────────────────────────────
    const exerciseDays = new Set(
      exercises.map((e) => new Date(e.date).toISOString().slice(0, 10)),
    ).size;
    const exerciseScore = Math.round((exerciseDays / 7) * 35);

    // ── Sleep score (0–25 pts) ────────────────────────────────────────────────
    const avgSleep =
      sleepLogs.length > 0
        ? sleepLogs.reduce((s, l) => s + l.hours, 0) / sleepLogs.length
        : 0;
    let sleepScore = 0;
    if (avgSleep >= 7) sleepScore = 25;
    else if (avgSleep >= 6) sleepScore = 18;
    else if (avgSleep >= 5) sleepScore = 10;
    else if (avgSleep > 0) sleepScore = 5;

    // ── Water score (0–20 pts) ────────────────────────────────────────────────
    const totalMl = waterToday
      ? waterToday.glasses.reduce((s, g) => s + g.ml, 0)
      : 0;
    let waterScore = 0;
    if (totalMl >= 2000) waterScore = 20;
    else if (totalMl >= 1500) waterScore = 14;
    else if (totalMl >= 1000) waterScore = 8;
    else if (totalMl > 0) waterScore = 3;

    // ── Steps score (0–20 pts) ────────────────────────────────────────────────
    const steps = stepsToday?.steps ?? 0;
    let stepsScore = 0;
    if (steps >= 8000) stepsScore = 20;
    else if (steps >= 5000) stepsScore = 14;
    else if (steps >= 3000) stepsScore = 8;
    else if (steps > 0) stepsScore = 3;

    const totalScore = exerciseScore + sleepScore + waterScore + stepsScore;

    // ── Mood state ────────────────────────────────────────────────────────────
    let mood;
    if (totalScore >= 80) mood = "Excellent";
    else if (totalScore >= 60) mood = "Good";
    else if (totalScore >= 40) mood = "Average";
    else mood = "Needs Attention";

    // ── Stress level ──────────────────────────────────────────────────────────
    // Low sleep + low activity = high stress
    let stress;
    if (sleepScore <= 5 && exerciseScore <= 5) stress = "High";
    else if (totalScore >= 70) stress = "Low";
    else if (totalScore >= 45) stress = "Medium";
    else stress = "High";

    res.json({
      score: totalScore,
      mood,
      stress,
      breakdown: {
        exercise: { score: exerciseScore, max: 35, days: exerciseDays },
        sleep: { score: sleepScore, max: 25, avgHours: Math.round(avgSleep * 10) / 10 },
        water: { score: waterScore, max: 20, totalMl },
        steps: { score: stepsScore, max: 20, steps },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
