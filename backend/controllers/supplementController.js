const Supplement = require("../models/Supplement");

// GET /api/supplements?date=2024-01-01
const getSupplements = async (req, res) => {
  try {
    const { date } = req.query;
    const d = new Date(date || new Date());
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);

    const supplements = await Supplement.find({
      user: req.user._id,
      date: { $gte: d, $lt: nextDay },
    }).sort({ time: 1 });

    res.status(200).json({ supplements });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/supplements
const addSupplement = async (req, res) => {
  try {
    const { name, quantity, time, date, notes } = req.body;

    if (!name || !quantity || !time) {
      return res
        .status(400)
        .json({ message: "Name, quantity, and time are required." });
    }

    const supplement = await Supplement.create({
      user: req.user._id,
      name,
      quantity,
      time,
      date: date || new Date(),
      notes,
    });

    res.status(201).json({ supplement, message: "Supplement logged." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/supplements/:id
const deleteSupplement = async (req, res) => {
  try {
    const supplement = await Supplement.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!supplement)
      return res.status(404).json({ message: "Supplement not found." });
    res.status(200).json({ message: "Supplement deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getSupplements, addSupplement, deleteSupplement };
