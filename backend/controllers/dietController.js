const Diet = require('../models/Diet');

const getDateQuery = (dateStr) => {
  const d = new Date(dateStr || new Date());
  d.setHours(0, 0, 0, 0);
  const nextDay = new Date(d);
  nextDay.setDate(nextDay.getDate() + 1);
  return { $gte: d, $lt: nextDay };
};

// GET /api/diet?date=2024-01-01
const getDiet = async (req, res) => {
  try {
    const { date } = req.query;
    const diet = await Diet.findOne({ user: req.user._id, date: getDateQuery(date) });
    res.status(200).json({ diet: diet || null });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/diet/entry — add food entry for today
const addEntry = async (req, res) => {
  try {
    const { foodName, mealTime, quantity, unit, calories, protein, carbs, fats, date } = req.body;

    if (!foodName || !mealTime || !quantity) {
      return res.status(400).json({ message: 'Food name, meal time, and quantity are required.' });
    }

    const entryDate = date ? new Date(date) : new Date();
    entryDate.setHours(0, 0, 0, 0);

    let diet = await Diet.findOne({ user: req.user._id, date: getDateQuery(date) });

    if (!diet) {
      diet = new Diet({ user: req.user._id, date: entryDate, entries: [] });
    }

    diet.entries.push({ foodName, mealTime, quantity, unit, calories, protein, carbs, fats });
    await diet.save();

    res.status(201).json({ diet, message: 'Food entry added.' });
  } catch (error) {
    console.error('Add diet entry error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/diet/entry/:entryId
const deleteEntry = async (req, res) => {
  try {
    const { date } = req.query;
    const diet = await Diet.findOne({ user: req.user._id, date: getDateQuery(date) });
    if (!diet) return res.status(404).json({ message: 'Diet log not found.' });

    diet.entries = diet.entries.filter((e) => e._id.toString() !== req.params.entryId);
    await diet.save();

    res.status(200).json({ diet, message: 'Entry removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/diet/history — last 30 days summary
const getDietHistory = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = await Diet.find({
      user: req.user._id,
      date: { $gte: thirtyDaysAgo },
    })
      .sort({ date: -1 })
      .select('date totalCalories totalProtein totalCarbs totalFats');

    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getDiet, addEntry, deleteEntry, getDietHistory };
