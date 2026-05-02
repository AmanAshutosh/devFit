const axios = require("axios");

const USDA_BASE = "https://api.nal.usda.gov/fdc/v1";

// Nutrient IDs from USDA FoodData Central
const NUTRIENT_MAP = {
  1008: "calories",   // Energy (kcal)
  2048: "calories",   // Energy (kcal) – alternate
  1003: "protein",    // Protein
  1005: "carbs",      // Carbohydrate, by difference
  1004: "fats",       // Total lipid (fat)
  1079: "fiber",      // Fiber, total dietary
  1093: "sodium",     // Sodium (mg)
  1092: "potassium",  // Potassium (mg)
  1087: "calcium",    // Calcium (mg)
  1089: "iron",       // Iron (mg)
  1162: "vitC",       // Vitamin C (mg)
};

function normalizeUSDAFood(food) {
  const n = {
    calories: 0, protein: 0, carbs: 0, fats: 0,
    fiber: 0, sodium: 0, potassium: 0, calcium: 0, iron: 0, vitC: 0,
  };

  (food.foodNutrients || []).forEach((fn) => {
    const id = fn.nutrientId || fn.nutrient?.id;
    const key = NUTRIENT_MAP[id];
    if (key && !n[key]) {
      n[key] = +(fn.value || fn.amount || 0);
    }
  });

  return {
    fdcId: food.fdcId,
    name: food.description,
    brand: food.brandOwner || food.brandName || null,
    source: "usda",
    dataType: food.dataType || "Foundation",
    per100g: n,
  };
}

function normalizeOFFFood(product) {
  const nm = product.nutriments || {};
  return {
    fdcId: null,
    name: product.product_name || "Unknown",
    brand: product.brands || null,
    source: "openfoodfacts",
    dataType: "Branded",
    per100g: {
      calories: nm["energy-kcal_100g"] || nm["energy-kcal"] || 0,
      protein: nm.proteins_100g || 0,
      carbs: nm.carbohydrates_100g || 0,
      fats: nm.fat_100g || 0,
      fiber: nm.fiber_100g || 0,
      sodium: (nm.sodium_100g || 0) * 1000, // g → mg
      potassium: nm.potassium_100g || 0,
      calcium: nm.calcium_100g || 0,
      iron: nm.iron_100g || 0,
      vitC: nm["vitamin-c_100g"] || 0,
    },
  };
}

async function searchUSDA(query) {
  const key = process.env.USDA_API_KEY;
  if (!key) return [];

  const { data } = await axios.get(`${USDA_BASE}/foods/search`, {
    params: {
      query,
      api_key: key,
      pageSize: 10,
      dataType: "Foundation,SR Legacy,Survey (FNDDS)",
    },
    timeout: 5000,
  });

  return (data.foods || []).map(normalizeUSDAFood);
}

async function searchOFF(query) {
  const { data } = await axios.get(
    "https://world.openfoodfacts.org/cgi/search.pl",
    {
      params: {
        search_terms: query,
        search_simple: 1,
        action: "process",
        json: 1,
        page_size: 8,
        fields: "product_name,nutriments,brands",
      },
      timeout: 7000,
    }
  );

  return (data.products || [])
    .filter((p) => p.product_name && p.nutriments?.["energy-kcal_100g"])
    .map(normalizeOFFFood);
}

async function searchFoods(query) {
  const [usdaResult, offResult] = await Promise.allSettled([
    searchUSDA(query),
    searchOFF(query),
  ]);

  const usda = usdaResult.status === "fulfilled" ? usdaResult.value : [];
  const off = offResult.status === "fulfilled" ? offResult.value : [];

  // USDA takes priority; deduplicate by first 20 chars of lowercase name
  const seen = new Set(usda.map((f) => f.name.toLowerCase().slice(0, 20)));
  const uniqueOFF = off.filter(
    (f) => !seen.has(f.name.toLowerCase().slice(0, 20))
  );

  return [...usda, ...uniqueOFF].slice(0, 15);
}

function scaleNutrition(per100g, quantity) {
  const scale = quantity / 100;
  return Object.fromEntries(
    Object.entries(per100g).map(([k, v]) => [k, +(v * scale).toFixed(2)])
  );
}

module.exports = { searchFoods, scaleNutrition };
