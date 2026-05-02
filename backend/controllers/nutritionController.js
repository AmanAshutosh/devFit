const { searchFoods, scaleNutrition } = require("../services/nutritionService");

// GET /api/nutrition/search?q=chicken&qty=150
const searchNutrition = async (req, res) => {
  try {
    const { q, qty = 100 } = req.query;
    if (!q || q.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Query must be at least 2 characters." });
    }

    const results = await searchFoods(q.trim());
    const quantity = Number(qty) || 100;

    const withScaled = results.map((food) => ({
      ...food,
      scaled: scaleNutrition(food.per100g, quantity),
      quantity,
    }));

    res.json({ results: withScaled, query: q, total: withScaled.length });
  } catch (error) {
    console.error("Nutrition search error:", error.message);
    res.status(500).json({ message: "Nutrition search failed." });
  }
};

module.exports = { searchNutrition };
