const VIDEO_DB = [
  {
    id: "ultWZbUMPL8",
    title: "Perfect Squat Form",
    duration: "10 min",
    category: "Legs",
    keywords: ["squat", "leg press", "lunges", "leg extension", "hack squat", "goblet squat"],
  },
  {
    id: "wYREQkVtvEc",
    title: "How to Deadlift",
    duration: "11 min",
    category: "Back",
    keywords: ["deadlift", "romanian deadlift", "rdl", "sumo deadlift", "trap bar"],
  },
  {
    id: "IODxDxX7oi4",
    title: "Perfect Push-Up",
    duration: "8 min",
    category: "Chest",
    keywords: ["push up", "pushup", "chest press", "bench press", "incline press", "decline press", "pec fly", "chest fly"],
  },
  {
    id: "eGo4IYlbE5g",
    title: "Pull-Up Tutorial",
    duration: "9 min",
    category: "Back",
    keywords: ["pull up", "pullup", "chin up", "lat pulldown", "cable row", "seated row", "bent over row", "barbell row"],
  },
  {
    id: "CnBmiBqp-AI",
    title: "Overhead Press Guide",
    duration: "7 min",
    category: "Shoulders",
    keywords: ["overhead press", "ohp", "shoulder press", "military press", "arnold press", "lateral raise", "front raise", "upright row"],
  },
  {
    id: "kwG2ipFRgfo",
    title: "Barbell Curl Guide",
    duration: "6 min",
    category: "Arms",
    keywords: ["curl", "bicep curl", "barbell curl", "dumbbell curl", "hammer curl", "preacher curl", "concentration curl", "cable curl"],
  },
  {
    id: "UItWltVZZmE",
    title: "Full Body Stretching",
    duration: "15 min",
    category: "Mobility",
    keywords: ["stretch", "mobility", "warm up", "cool down", "yoga", "flexibility"],
  },
  {
    id: "vcBig73ojpE",
    title: "Bench Press Complete Guide",
    duration: "12 min",
    category: "Chest",
    keywords: ["bench", "bench press", "chest"],
  },
  {
    id: "1f8yoFFdkcY",
    title: "Core & Abs Workout",
    duration: "10 min",
    category: "Core",
    keywords: ["abs", "crunch", "plank", "sit up", "core", "leg raise", "russian twist", "bicycle crunch"],
  },
  {
    id: "nhoikoUEI8U",
    title: "Tricep Training Guide",
    duration: "8 min",
    category: "Arms",
    keywords: ["tricep", "skull crusher", "tricep pushdown", "close grip", "dips", "overhead tricep"],
  },
  {
    id: "3VcKaXpzqRo",
    title: "Calf Raises & Lower Leg",
    duration: "6 min",
    category: "Legs",
    keywords: ["calf", "calf raise", "seated calf", "standing calf"],
  },
  {
    id: "G8l_8chR5BE",
    title: "Cable Fly & Chest Isolation",
    duration: "7 min",
    category: "Chest",
    keywords: ["cable fly", "chest fly", "pec dec", "cable crossover"],
  },
];

const DEFAULT_VIDEO = {
  id: "IODxDxX7oi4",
  title: "General Workout Guide",
  duration: "8 min",
  category: "General",
};

export function getVideoForExercise(exerciseName) {
  if (!exerciseName) return buildVideoObject(DEFAULT_VIDEO);
  const name = exerciseName.toLowerCase();
  const match = VIDEO_DB.find((v) =>
    v.keywords.some((kw) => name.includes(kw) || kw.includes(name.split(" ")[0])),
  );
  return buildVideoObject(match || DEFAULT_VIDEO);
}

function buildVideoObject(v) {
  return {
    id: v.id,
    title: v.title,
    duration: v.duration,
    category: v.category,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    thumbUrl: `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`,
  };
}

export function getVideoForCategory(category) {
  if (!category) return buildVideoObject(DEFAULT_VIDEO);
  const cat = category.toLowerCase();
  const match = VIDEO_DB.find((v) => v.category.toLowerCase() === cat);
  return buildVideoObject(match || DEFAULT_VIDEO);
}
