const WaterIntake = require("../models/WaterIntake");

const getDateBounds = (dateStr) => {
  const d = new Date(dateStr || new Date());
  d.setHours(0, 0, 0, 0);
  const next = new Date(d);
  next.setDate(next.getDate() + 1);
  return { d, next };
};

const sumMl = (glasses) => glasses.reduce((s, g) => s + g.ml, 0);

// GET /api/water?date=YYYY-MM-DD
const getWater = async (req, res) => {
  try {
    const { d, next } = getDateBounds(req.query.date);
    const record = await WaterIntake.findOne({
      user: req.user._id,
      date: { $gte: d, $lt: next },
    });
    res.json({
      record: record || null,
      totalMl: record ? sumMl(record.glasses) : 0,
      goalMl: record?.goalMl ?? 2500,
      glassSize: record?.glassSize ?? 250,
    });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/water/add
const addGlass = async (req, res) => {
  try {
    const { date, ml, goalMl, glassSize } = req.body;
    const { d, next } = getDateBounds(date);

    let record = await WaterIntake.findOne({
      user: req.user._id,
      date: { $gte: d, $lt: next },
    });

    if (!record) {
      record = new WaterIntake({
        user: req.user._id,
        date: d,
        glasses: [],
        goalMl: goalMl ?? 2500,
        glassSize: glassSize ?? 250,
      });
    }

    if (goalMl != null) record.goalMl = goalMl;
    if (glassSize != null) record.glassSize = glassSize;

    record.glasses.push({ ml: ml ?? record.glassSize });
    await record.save();

    res.json({
      record,
      totalMl: sumMl(record.glasses),
      goalMl: record.goalMl,
      glassSize: record.glassSize,
    });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/water/remove/:glassId?date=YYYY-MM-DD
const removeGlass = async (req, res) => {
  try {
    const { d, next } = getDateBounds(req.query.date);
    const record = await WaterIntake.findOne({
      user: req.user._id,
      date: { $gte: d, $lt: next },
    });
    if (!record) return res.status(404).json({ message: "No record found." });

    record.glasses = record.glasses.filter(
      (g) => g._id.toString() !== req.params.glassId,
    );
    await record.save();

    res.json({ record, totalMl: sumMl(record.glasses) });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/water/settings
const updateSettings = async (req, res) => {
  try {
    const { date, goalMl, glassSize } = req.body;
    const { d, next } = getDateBounds(date);

    const record = await WaterIntake.findOneAndUpdate(
      { user: req.user._id, date: { $gte: d, $lt: next } },
      { $set: { goalMl, glassSize } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.json({ record });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
};

// GET /api/water/history — last 7 days
const getWaterHistory = async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    since.setHours(0, 0, 0, 0);

    const records = await WaterIntake.find({
      user: req.user._id,
      date: { $gte: since },
    })
      .sort({ date: -1 })
      .select("date glasses goalMl glassSize");

    const history = records.map((r) => ({
      date: r.date,
      totalMl: sumMl(r.glasses),
      goalMl: r.goalMl,
      glassCount: r.glasses.length,
    }));

    res.json({ history });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getWater,
  addGlass,
  removeGlass,
  updateSettings,
  getWaterHistory,
};
