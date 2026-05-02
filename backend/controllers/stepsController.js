const StepsLog = require("../models/StepsLog");

function startOfDay(dateStr) {
  const d = new Date(dateStr || Date.now());
  d.setHours(0, 0, 0, 0);
  return d;
}

// GET /api/steps?date=YYYY-MM-DD
exports.getSteps = async (req, res) => {
  try {
    const date = startOfDay(req.query.date);
    const log = await StepsLog.findOne({ user: req.user._id, date });
    res.json({ steps: log?.steps ?? 0, date: log?.date ?? date });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/steps/history — last 7 days
exports.getHistory = async (req, res) => {
  try {
    const today = startOfDay(null);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const logs = await StepsLog.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 });

    // Fill in missing days with 0
    const history = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const found = logs.find(
        (l) => l.date.toISOString().slice(0, 10) === d.toISOString().slice(0, 10),
      );
      history.push({
        date: d.toISOString().slice(0, 10),
        steps: found?.steps ?? 0,
      });
    }
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/steps  — upsert today's steps
exports.logSteps = async (req, res) => {
  try {
    const { steps, date } = req.body;
    if (steps === undefined || steps < 0) {
      return res.status(400).json({ message: "Valid steps count required" });
    }
    const day = startOfDay(date);
    const log = await StepsLog.findOneAndUpdate(
      { user: req.user._id, date: day },
      { steps: Number(steps) },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    res.json({ log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
