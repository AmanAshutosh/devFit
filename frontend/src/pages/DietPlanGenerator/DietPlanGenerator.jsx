import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import MobileHeader from "../../components/MobileHeader/MobileHeader.jsx";
import DisclaimerModal from "../../components/DisclaimerModal/DisclaimerModal.jsx";
import "./DietPlanGenerator.css";

// ── BMR / TDEE helpers ────────────────────────────────────────────────────────
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  super_active: 1.9,
};

function calcBMR(gender, weight, heightCm, age) {
  const base = 10 * weight + 6.25 * heightCm - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
}

function feetToCm(feet, inches) {
  return Math.round(feet * 30.48 + inches * 2.54);
}

function generateDietPlan(data) {
  const heightCm =
    data.heightUnit === "cm"
      ? Number(data.heightCm)
      : feetToCm(Number(data.heightFt), Number(data.heightIn));

  const bmr = calcBMR(
    data.gender,
    Number(data.weight),
    heightCm,
    Number(data.age),
  );
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[data.activityLevel]);

  let calories = tdee;
  if (data.goal === "weight_loss") calories = tdee - 500;
  if (data.goal === "muscle_gain") calories = tdee + 300;

  const proteinG = Math.round(Number(data.weight) * 2);
  const fatG = Math.round((calories * 0.25) / 9);
  const carbG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);

  const diet = data.dietPreference; // "vegetarian" | "non_vegetarian" | "vegan" | "eggetarian"

  const MEALS = {
    vegan: {
      breakfasts: [
        "Oats with almond milk, banana & chia seeds",
        "Poha with vegetables & peanuts",
        "Moong dal chilla with mint chutney",
        "Upma with mixed vegetables & peanuts",
        "Whole wheat toast + peanut butter + banana",
      ],
      lunches: [
        "Brown rice + rajma curry + cucumber salad",
        "Roti + chana masala + roasted vegetables",
        "Vegetable biryani + mixed dal + salad",
        "Quinoa pulao + black bean curry + salad",
        "Lentil soup + brown rice + stir-fried vegetables",
      ],
      dinners: [
        "Lentil soup + brown rice + salad",
        "Tofu stir-fry + roti + dal",
        "Dal makhni (vegan) + millet roti + sabzi",
        "Chickpea curry + brown rice + cucumber raita (soy)",
        "Mixed vegetable curry + roti + dal",
      ],
      snacks: [
        "Handful of mixed nuts + green tea",
        "Roasted chana + cucumber slices",
        "Fruit bowl (banana, apple, papaya)",
        "Peanut butter on rice cakes",
        "Hummus + carrot sticks",
      ],
    },

    vegetarian: {
      breakfasts: [
        "Paneer bhurji (100g) with 2 multigrain rotis",
        "Oats with milk, banana & almonds",
        "Vegetable poha with curd (150g)",
        "Moong dal chilla with mint chutney + curd",
        "Upma + sprouts salad + a glass of milk",
      ],
      lunches: [
        "2 rotis + paneer curry (100g) + dal + salad",
        "Brown rice + rajma + curd (150g)",
        "Veg khichdi + curd + papad + sabzi",
        "2 rotis + mixed veg sabzi + dal tadka + curd",
        "Brown rice + palak paneer + dal + salad",
      ],
      dinners: [
        "Dal makhni + 2 rotis + sabzi",
        "Paneer tikka (100g) + roti + salad",
        "Mixed veg soup + 2 rotis + dahi",
        "Paneer bhurji + 2 rotis + dal + salad",
        "Vegetable curry + brown rice + dal",
      ],
      snacks: [
        "Greek yogurt (150g) + walnuts",
        "Sprouts chaat + lemon water",
        "Paneer cubes (50g) + seasonal fruit",
        "Roasted makhana + green tea",
        "Buttermilk + mixed nuts",
      ],
    },

    eggetarian: {
      breakfasts: [
        "3-egg omelette with vegetables + 2 multigrain rotis",
        "2 boiled eggs + oats with milk & banana",
        "Egg bhurji (2 eggs) + 2 whole wheat rotis + curd",
        "Egg sandwich (2 eggs) on multigrain bread + orange juice",
        "Vegetable poha + 2 hard-boiled eggs on the side",
      ],
      lunches: [
        "2 rotis + egg curry (2 eggs) + dal + salad",
        "Brown rice + egg masala (2 eggs) + curd (100g)",
        "Egg fried rice (2 eggs) + mixed vegetable sabzi + dal",
        "2 rotis + scrambled eggs (2) + dal tadka + cucumber salad",
        "Brown rice + egg korma (2 eggs) + rajma + salad",
      ],
      dinners: [
        "Egg bhurji (2 eggs) + 2 rotis + dal + salad",
        "2 boiled eggs + dal makhni + roti + sabzi",
        "Egg curry (1–2 eggs) + brown rice + mixed vegetable salad",
        "Omelette (2 eggs) + 2 rotis + lentil soup",
        "Egg stir-fry with vegetables + roti + curd",
      ],
      snacks: [
        "2 boiled eggs + cucumber & tomato slices",
        "Egg sandwich (1 egg) on multigrain bread",
        "Boiled egg (1) + mixed nuts + green tea",
        "Greek yogurt (100g) + 1 boiled egg",
        "Sprouts chaat + 1 boiled egg",
      ],
    },

    non_vegetarian: {
      breakfasts: [
        "3-egg omelette with 2 multigrain rotis",
        "Oats with milk, boiled egg (2) & banana",
        "Chicken sandwich on multigrain bread + orange juice",
        "2 boiled eggs + upma with vegetables",
        "Egg bhurji (2 eggs) + whole wheat roti + a glass of milk",
      ],
      lunches: [
        "Brown rice + chicken curry (150g) + dal + salad",
        "2 rotis + egg curry (2 eggs) + dal tadka",
        "Chicken biryani (small portion) + raita + salad",
        "Brown rice + fish curry (150g) + dal + salad",
        "2 rotis + chicken tikka masala (150g) + dal + curd",
      ],
      dinners: [
        "Grilled chicken (150g) + sautéed vegetables + roti",
        "Fish curry (150g) + brown rice + salad",
        "Egg bhurji (2 eggs) + 2 rotis + dal",
        "Chicken soup + 2 rotis + mixed vegetable sabzi",
        "Baked fish (150g) + brown rice + cucumber salad",
      ],
      snacks: [
        "2 boiled eggs + cucumber slices",
        "Chicken tikka (100g) + buttermilk",
        "Greek yogurt (150g) + mixed nuts",
        "Boiled eggs (2) + roasted chana",
        "Tuna salad wrap (small) or egg salad",
      ],
    },
  };

  const planMeals = MEALS[diet] || MEALS.vegetarian;

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    bmr: Math.round(bmr),
    tdee,
    calories,
    proteinG,
    carbG,
    fatG,
    meals: {
      breakfast: pick(planMeals.breakfasts),
      lunch: pick(planMeals.lunches),
      dinner: pick(planMeals.dinners),
      morningSnack: pick(planMeals.snacks),
      eveningSnack: pick(planMeals.snacks),
    },
    heightCm,
    bmi: (Number(data.weight) / (heightCm / 100) ** 2).toFixed(1),
  };
}

// ── Step definitions ──────────────────────────────────────────────────────────
const STEPS = ["Personal Info", "Body Stats", "Activity", "Goals"];

const INITIAL = {
  age: "",
  gender: "",
  weight: "",
  heightUnit: "cm",
  heightCm: "",
  heightFt: "",
  heightIn: "",
  activityLevel: "",
  workoutDays: "",
  goal: "",
  dietPreference: "",
};

// ── Option buttons helper ─────────────────────────────────────────────────────
const OptionBtn = ({ selected, onClick, children }) => (
  <button
    type="button"
    className={`option-btn ${selected ? "option-btn--active" : ""}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// ── Main component ────────────────────────────────────────────────────────────
const DietPlanGenerator = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [plan, setPlan] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  // ── Validation per step ───────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.age || form.age < 10 || form.age > 100)
        e.age = "Enter a valid age (10–100)";
      if (!form.gender) e.gender = "Select a gender";
    }
    if (step === 1) {
      if (!form.weight || form.weight < 20 || form.weight > 300)
        e.weight = "Enter valid weight (20–300 kg)";
      if (form.heightUnit === "cm") {
        if (!form.heightCm || form.heightCm < 100 || form.heightCm > 250)
          e.height = "Enter valid height (100–250 cm)";
      } else {
        if (!form.heightFt || form.heightFt < 3 || form.heightFt > 8)
          e.height = "Enter valid feet (3–8)";
      }
    }
    if (step === 2) {
      if (!form.activityLevel) e.activityLevel = "Select activity level";
      if (!form.workoutDays || form.workoutDays < 0 || form.workoutDays > 7)
        e.workoutDays = "Enter valid days (0–7)";
    }
    if (step === 3) {
      if (!form.goal) e.goal = "Select a goal";
      if (!form.dietPreference) e.dietPreference = "Select diet preference";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setShowDisclaimer(true);
    }
  };

  const handleAccept = () => {
    sessionStorage.setItem("devfit_disclaimer", "accepted");
    setShowDisclaimer(false);
    setPlan(generateDietPlan(form));
  };

  const handleReset = () => {
    setForm(INITIAL);
    setPlan(null);
    setStep(0);
    setErrors({});
  };

  // ── Result view ───────────────────────────────────────────────────────────
  if (plan) {
    return (
      <div className="page-layout">
        <Sidebar />
        <MobileHeader />
        <main className="page-content diet-gen-content">
          <div className="page-header">
            <div>
              <h1 className="page-title">Your Diet Plan</h1>
              <p className="page-subtitle">Personalised based on your goals</p>
            </div>
            <button className="btn btn-ghost" onClick={handleReset}>
              ← Regenerate
            </button>
          </div>

          <div className="dg-result-grid">
            {/* Calorie summary */}
            <div className="card dg-summary-card">
              <h3 className="dg-section-title">Daily Calorie Target</h3>
              <div className="dg-calorie-big">
                {plan.calories} <span>kcal</span>
              </div>
              <div className="dg-meta-row">
                <span>
                  BMR <strong>{plan.bmr}</strong>
                </span>
                <span>
                  TDEE <strong>{plan.tdee}</strong>
                </span>
                <span>
                  BMI <strong>{plan.bmi}</strong>
                </span>
              </div>
            </div>

            {/* Macros */}
            <div className="card dg-macros-card">
              <h3 className="dg-section-title">Macronutrients</h3>
              <div className="dg-macros-grid">
                <div className="dg-macro dg-macro--protein">
                  <div className="dg-macro-value">{plan.proteinG}g</div>
                  <div className="dg-macro-label">Protein</div>
                  <div className="dg-macro-kcal">{plan.proteinG * 4} kcal</div>
                </div>
                <div className="dg-macro dg-macro--carbs">
                  <div className="dg-macro-value">{plan.carbG}g</div>
                  <div className="dg-macro-label">Carbs</div>
                  <div className="dg-macro-kcal">{plan.carbG * 4} kcal</div>
                </div>
                <div className="dg-macro dg-macro--fat">
                  <div className="dg-macro-value">{plan.fatG}g</div>
                  <div className="dg-macro-label">Fats</div>
                  <div className="dg-macro-kcal">{plan.fatG * 9} kcal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Plan */}
          <div className="card dg-meals-card">
            <h3 className="dg-section-title">Full Day Meal Plan</h3>
            <div className="dg-meals-grid">
              {[
                { emoji: "🌅", label: "Breakfast", key: "breakfast" },
                { emoji: "🍎", label: "Morning Snack", key: "morningSnack" },
                { emoji: "☀️", label: "Lunch", key: "lunch" },
                { emoji: "🥜", label: "Evening Snack", key: "eveningSnack" },
                { emoji: "🌙", label: "Dinner", key: "dinner" },
              ].map(({ emoji, label, key }) => (
                <div key={key} className="dg-meal-item">
                  <div className="dg-meal-icon">{emoji}</div>
                  <div className="dg-meal-info">
                    <div className="dg-meal-label">{label}</div>
                    <div className="dg-meal-desc">{plan.meals[key]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dg-tips card">
            <h3 className="dg-section-title">💡 Nutrition Tips</h3>
            <ul className="dg-tips-list">
              <li>Drink 2.5–3L of water daily</li>
              <li>Eat every 3–4 hours to keep metabolism active</li>
              <li>
                Include fibre-rich foods (vegetables, fruits, whole grains)
              </li>
              <li>Avoid processed foods and sugary drinks</li>
              <li>Get 7–8 hours of quality sleep for recovery</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // ── Questionnaire view ────────────────────────────────────────────────────
  return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content diet-gen-content">
        {showDisclaimer && (
          <DisclaimerModal
            onAccept={handleAccept}
            onCancel={() => setShowDisclaimer(false)}
          />
        )}

        <div className="page-header">
          <div>
            <h1 className="page-title">Diet Plan Generator</h1>
            <p className="page-subtitle">
              Answer a few questions to get your personalised plan
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="dg-progress-wrap">
          <div className="dg-step-labels">
            {STEPS.map((label, i) => (
              <span
                key={i}
                className={`dg-step-label ${i === step ? "dg-step-label--active" : ""} ${i < step ? "dg-step-label--done" : ""}`}
              >
                {i < step ? "✓" : i + 1}. {label}
              </span>
            ))}
          </div>
          <div className="dg-progress-bar">
            <div
              className="dg-progress-fill"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="card dg-form-card">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="dg-step-content">
              <h2 className="dg-step-heading">Tell us about yourself</h2>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 24"
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                  min={10}
                  max={100}
                />
                {errors.age && <span className="dg-error">{errors.age}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="option-grid">
                  {[
                    ["male", "♂ Male"],
                    ["female", "♀ Female"],
                    ["other", "⚧ Other"],
                  ].map(([val, lbl]) => (
                    <OptionBtn
                      key={val}
                      selected={form.gender === val}
                      onClick={() => set("gender", val)}
                    >
                      {lbl}
                    </OptionBtn>
                  ))}
                </div>
                {errors.gender && (
                  <span className="dg-error">{errors.gender}</span>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Body Stats */}
          {step === 1 && (
            <div className="dg-step-content">
              <h2 className="dg-step-heading">Your body stats</h2>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 70"
                  value={form.weight}
                  onChange={(e) => set("weight", e.target.value)}
                />
                {errors.weight && (
                  <span className="dg-error">{errors.weight}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Height</label>
                <div className="dg-toggle-row">
                  <button
                    type="button"
                    className={`dg-unit-btn ${form.heightUnit === "cm" ? "dg-unit-btn--active" : ""}`}
                    onClick={() => set("heightUnit", "cm")}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    className={`dg-unit-btn ${form.heightUnit === "feet" ? "dg-unit-btn--active" : ""}`}
                    onClick={() => set("heightUnit", "feet")}
                  >
                    ft / in
                  </button>
                </div>
                {form.heightUnit === "cm" ? (
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 175"
                    value={form.heightCm}
                    onChange={(e) => set("heightCm", e.target.value)}
                  />
                ) : (
                  <div className="dg-feet-row">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="ft"
                      value={form.heightFt}
                      onChange={(e) => set("heightFt", e.target.value)}
                      min={3}
                      max={8}
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="in"
                      value={form.heightIn}
                      onChange={(e) => set("heightIn", e.target.value)}
                      min={0}
                      max={11}
                    />
                  </div>
                )}
                {errors.height && (
                  <span className="dg-error">{errors.height}</span>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Activity */}
          {step === 2 && (
            <div className="dg-step-content">
              <h2 className="dg-step-heading">Activity & training</h2>

              <div className="form-group">
                <label className="form-label">Activity Level</label>
                <div className="option-grid option-grid--col1">
                  {[
                    ["sedentary", "🪑 Sedentary", "Little or no exercise"],
                    ["light", "🚶 Light", "1–3 days/week"],
                    ["moderate", "🏃 Moderate", "3–5 days/week"],
                    ["very_active", "💪 Very Active", "6–7 days/week"],
                    [
                      "super_active",
                      "🔥 Super Active",
                      "Intense daily training",
                    ],
                  ].map(([val, lbl, sub]) => (
                    <OptionBtn
                      key={val}
                      selected={form.activityLevel === val}
                      onClick={() => set("activityLevel", val)}
                    >
                      <span>{lbl}</span>
                      <span className="option-sub">{sub}</span>
                    </OptionBtn>
                  ))}
                </div>
                {errors.activityLevel && (
                  <span className="dg-error">{errors.activityLevel}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Workout Days per Week</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0–7"
                  value={form.workoutDays}
                  onChange={(e) => set("workoutDays", e.target.value)}
                  min={0}
                  max={7}
                />
                {errors.workoutDays && (
                  <span className="dg-error">{errors.workoutDays}</span>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="dg-step-content">
              <h2 className="dg-step-heading">Your goals</h2>

              <div className="form-group">
                <label className="form-label">Primary Goal</label>
                <div className="option-grid">
                  {[
                    ["weight_loss", "🔥 Weight Loss"],
                    ["muscle_gain", "💪 Muscle Gain"],
                    ["maintenance", "⚖️ Maintenance"],
                  ].map(([val, lbl]) => (
                    <OptionBtn
                      key={val}
                      selected={form.goal === val}
                      onClick={() => set("goal", val)}
                    >
                      {lbl}
                    </OptionBtn>
                  ))}
                </div>
                {errors.goal && <span className="dg-error">{errors.goal}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Diet Preference</label>
                <div className="option-grid">
                  {[
                    ["vegetarian", "🥦 Vegetarian"],
                    ["non_vegetarian", "🍗 Non-Vegetarian"],
                    ["vegan", "🌱 Vegan"],
                    ["eggetarian", "🥚 Eggetarian"],
                  ].map(([val, lbl]) => (
                    <OptionBtn
                      key={val}
                      selected={form.dietPreference === val}
                      onClick={() => set("dietPreference", val)}
                    >
                      {lbl}
                    </OptionBtn>
                  ))}
                </div>
                {errors.dietPreference && (
                  <span className="dg-error">{errors.dietPreference}</span>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="dg-nav-row">
            {step > 0 && (
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setStep((s) => s - 1)}
              >
                ← Back
              </button>
            )}
            <button
              className="btn btn-accent dg-next-btn"
              type="button"
              onClick={handleNext}
            >
              {step === STEPS.length - 1 ? "Generate My Plan →" : "Next →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DietPlanGenerator;
