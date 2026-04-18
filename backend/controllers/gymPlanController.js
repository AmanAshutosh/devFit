const GymPlan = require("../models/GymPlan");

const PREDEFINED_PLANS = {
  beginner: {
    fullBody: {
      planName: "Full Body Split",
      level: "beginner",
      days: [
        {
          day: 1,
          label: "Full Body A",
          duration: 45,
          muscleGroups: ["chest", "back", "legs"],
          exercises: [
            { name: "Squat", sets: 3, reps: "10-12", rest: "90s" },
            { name: "Bench Press", sets: 3, reps: "10-12", rest: "60s" },
            { name: "Bent Over Row", sets: 3, reps: "10-12", rest: "60s" },
            { name: "Overhead Press", sets: 3, reps: "10-12", rest: "60s" },
          ],
        },
        { day: 2, label: "Rest Day", isRestDay: true },
        {
          day: 3,
          label: "Full Body B",
          duration: 45,
          muscleGroups: ["chest", "back", "legs"],
          exercises: [
            { name: "Deadlift", sets: 3, reps: "8-10", rest: "90s" },
            { name: "Incline Press", sets: 3, reps: "10-12", rest: "60s" },
            {
              name: "Pull-ups / Lat Pulldown",
              sets: 3,
              reps: "8-10",
              rest: "60s",
            },
          ],
        },
        { day: 4, label: "Rest Day", isRestDay: true },
        {
          day: 5,
          label: "Full Body C",
          duration: 45,
          muscleGroups: ["chest", "back", "legs"],
          exercises: [
            { name: "Leg Press", sets: 3, reps: "12-15", rest: "60s" },
            { name: "Dumbbell Fly", sets: 3, reps: "12-15", rest: "60s" },
            { name: "Cable Row", sets: 3, reps: "12", rest: "60s" },
          ],
        },
        { day: 6, label: "Rest Day", isRestDay: true },
      ],
    },
  },
  intermediate: {
    chestTriceps: {
      planName: "Push / Pull / Legs",
      level: "intermediate",
      days: [
        {
          day: 1,
          label: "Chest + Triceps",
          duration: 60,
          muscleGroups: ["chest", "triceps"],
          exercises: [
            { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
            {
              name: "Incline Dumbbell Press",
              sets: 3,
              reps: "10-12",
              rest: "60s",
            },
            { name: "Cable Fly", sets: 3, reps: "12-15", rest: "60s" },
            { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: "45s" },
            { name: "Skull Crushers", sets: 3, reps: "10-12", rest: "60s" },
          ],
        },
        {
          day: 2,
          label: "Back + Biceps",
          duration: 60,
          muscleGroups: ["back", "biceps"],
          exercises: [
            { name: "Deadlift", sets: 4, reps: "6-8", rest: "120s" },
            { name: "Pull-ups", sets: 3, reps: "8-10", rest: "90s" },
            { name: "Seated Cable Row", sets: 3, reps: "10-12", rest: "60s" },
            { name: "Barbell Curl", sets: 3, reps: "10-12", rest: "60s" },
          ],
        },
        {
          day: 3,
          label: "Shoulders + Legs",
          duration: 60,
          muscleGroups: ["shoulders", "legs"],
          exercises: [
            { name: "Squat", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Overhead Press", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Lateral Raise", sets: 3, reps: "12-15", rest: "45s" },
            { name: "Leg Press", sets: 3, reps: "12-15", rest: "60s" },
          ],
        },
        { day: 4, label: "Rest Day", isRestDay: true },
        {
          day: 5,
          label: "Arnold Split",
          duration: 60,
          muscleGroups: ["chest", "back", "shoulders"],
          exercises: [
            { name: "Arnold Press", sets: 4, reps: "10-12", rest: "60s" },
            { name: "Pull-ups", sets: 3, reps: "8-10", rest: "90s" },
            { name: "Incline Press", sets: 3, reps: "10-12", rest: "60s" },
          ],
        },
        { day: 6, label: "Rest Day", isRestDay: true },
      ],
    },
  },
  advanced: {
    ppl: {
      planName: "Push/Pull/Legs (6 Days)",
      level: "advanced",
      days: [
        {
          day: 1,
          label: "Push (Chest Focus)",
          duration: 75,
          muscleGroups: ["chest", "shoulders", "triceps"],
          exercises: [
            { name: "Bench Press", sets: 5, reps: "5-6", rest: "120s" },
            { name: "Incline DB Press", sets: 4, reps: "8-10", rest: "90s" },
            { name: "OHP", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Lateral Raise", sets: 4, reps: "15-20", rest: "45s" },
            { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "60s" },
          ],
        },
        {
          day: 2,
          label: "Pull (Back Focus)",
          duration: 75,
          muscleGroups: ["back", "biceps", "rear delts"],
          exercises: [
            { name: "Deadlift", sets: 5, reps: "4-5", rest: "150s" },
            { name: "Weighted Pull-ups", sets: 4, reps: "6-8", rest: "90s" },
            { name: "Barbell Row", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Face Pull", sets: 3, reps: "15-20", rest: "45s" },
            { name: "Hammer Curl", sets: 3, reps: "10-12", rest: "60s" },
          ],
        },
        {
          day: 3,
          label: "Legs",
          duration: 75,
          muscleGroups: ["quads", "hamstrings", "glutes", "calves"],
          exercises: [
            { name: "Squat", sets: 5, reps: "5-6", rest: "150s" },
            { name: "Romanian Deadlift", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Leg Press", sets: 4, reps: "10-12", rest: "90s" },
            { name: "Leg Curl", sets: 3, reps: "12-15", rest: "60s" },
            { name: "Calf Raise", sets: 4, reps: "15-20", rest: "45s" },
          ],
        },
        {
          day: 4,
          label: "Push (Shoulder Focus)",
          duration: 75,
          muscleGroups: ["shoulders", "chest", "triceps"],
          exercises: [
            { name: "OHP", sets: 5, reps: "5-6", rest: "120s" },
            { name: "DB Press", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Arnold Press", sets: 3, reps: "10-12", rest: "60s" },
            { name: "Skull Crushers", sets: 4, reps: "8-10", rest: "60s" },
          ],
        },
        {
          day: 5,
          label: "Pull (Bicep Focus)",
          duration: 75,
          muscleGroups: ["back", "biceps"],
          exercises: [
            { name: "Weighted Pull-ups", sets: 5, reps: "5-6", rest: "120s" },
            { name: "Cable Row", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Barbell Curl", sets: 4, reps: "8-10", rest: "60s" },
            { name: "Incline DB Curl", sets: 3, reps: "10-12", rest: "60s" },
          ],
        },
        {
          day: 6,
          label: "Legs (Volume)",
          duration: 75,
          muscleGroups: ["quads", "hamstrings", "glutes"],
          exercises: [
            { name: "Front Squat", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Hack Squat", sets: 4, reps: "10-12", rest: "90s" },
            { name: "Walking Lunges", sets: 3, reps: "12/leg", rest: "60s" },
            { name: "Hip Thrust", sets: 4, reps: "10-12", rest: "60s" },
          ],
        },
      ],
    },
  },
};

// GET /api/gymplan
const getGymPlan = async (req, res) => {
  try {
    const plan = await GymPlan.findOne({ user: req.user._id });
    res
      .status(200)
      .json({ plan: plan || null, predefinedPlans: PREDEFINED_PLANS });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/gymplan — create or update
const saveGymPlan = async (req, res) => {
  try {
    const { planName, level, days } = req.body;

    let plan = await GymPlan.findOne({ user: req.user._id });
    if (plan) {
      plan.planName = planName;
      plan.level = level;
      plan.days = days;
      await plan.save();
    } else {
      plan = await GymPlan.create({
        user: req.user._id,
        planName,
        level,
        days,
      });
    }

    res.status(200).json({ plan, message: "Gym plan saved." });
  } catch (error) {
    console.error("Save gym plan error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/gymplan/load-predefined
const loadPredefined = async (req, res) => {
  try {
    const { level, planKey, key } = req.body;
    const resolvedKey = planKey || key;
    const planData = PREDEFINED_PLANS[level]?.[resolvedKey];

    if (!planData) {
      return res.status(400).json({ message: "Predefined plan not found." });
    }

    let plan = await GymPlan.findOne({ user: req.user._id });
    if (plan) {
      Object.assign(plan, planData);
      await plan.save();
    } else {
      plan = await GymPlan.create({ user: req.user._id, ...planData });
    }

    res.status(200).json({ plan, message: `Loaded ${planData.planName}.` });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getGymPlan, saveGymPlan, loadPredefined };
