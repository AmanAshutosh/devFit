const SleepLog = require("../models/SleepLog");

const getDateBounds = (dateStr) => {
  const d = new Date(dateStr || new Date());
  d.setHours(0, 0, 0, 0);
  const next = new Date(d);
  next.setDate(next.getDate() + 1);
  return { d, next };
};

// GET /api/sleep?date=YYYY-MM-DD
const getSleep = async (req, res) => {
  try {
    const { d, next } = getDateBounds(req.query.date);
    const log = await SleepLog.findOne({
      user: req.user._id,
      date: { $gte: d, $lt: next },
    });
    res.json({ log: log || null });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/sleep — upsert for the day
const logSleep = async (req, res) => {
  try {
    const { date, hours, quality, notes } = req.body;
    if (hours == null || hours < 0 || hours > 24) {
      return res
        .status(400)
        .json({ message: "Hours must be between 0 and 24." });
    }
    const { d, next } = getDateBounds(date);

    const log = await SleepLog.findOneAndUpdate(
      { user: req.user._id, date: { $gte: d, $lt: next } },
      {
        user: req.user._id,
        date: d,
        hours: +hours,
        quality: quality || "good",
        notes: notes || "",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.json({ log, message: "Sleep logged." });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
};

// GET /api/sleep/history — last 14 days
const getSleepHistory = async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 14);
    since.setHours(0, 0, 0, 0);

    const logs = await SleepLog.find({
      user: req.user._id,
      date: { $gte: since },
    })
      .sort({ date: -1 })
      .select("date hours quality");

    res.json({ logs });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getSleep, logSleep, getSleepHistory };
