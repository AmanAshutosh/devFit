// ─── Exercise Image Map ────────────────────────────────────────────────────
// Curated Unsplash photo IDs for each exercise category
const IMG = {
  squat:
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=480&h=300&q=80",
  bench:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=480&h=300&q=80",
  back: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=480&h=300&q=80",
  shoulder:
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=480&h=300&q=80",
  deadlift:
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=480&h=300&q=80",
  cable:
    "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=480&h=300&q=80",
  pullup:
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=480&h=300&q=80",
  curl: "https://images.unsplash.com/photo-1583454155184-870a1f63aebc?auto=format&fit=crop&w=480&h=300&q=80",
  dip: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=480&h=300&q=80",
  legpress:
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=480&h=300&q=80",
  lunge:
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=480&h=300&q=80",
  core: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=480&h=300&q=80",
  calf: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=480&h=300&q=80",
  rdl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=480&h=300&q=80",
  row: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=480&h=300&q=80",
  fly: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=480&h=300&q=80",
};

export const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=480&h=300&q=80";

// ─── WORKOUT PLANS ──────────────────────────────────────────────────────────
export const WORKOUT_PLANS = {
  // ═══════════════════════════════════════════════════════════
  // BEGINNER — Full Body Split (3 days/week)
  // ═══════════════════════════════════════════════════════════
  beginner: {
    id: "beginner",
    name: "Full Body Split",
    badge: "Beginner",
    badgeColor: "info",
    subtitle: "3 Days / Week",
    description:
      "The ideal starting point. Three full-body sessions per week hit every major muscle group with enough frequency to build motor patterns, strength, and size simultaneously. Rest days between each session allow full recovery.",
    accentColor: "#2563eb",
    totalDays: 3,
    restDays: "Day 4–7 are rest/active-recovery days.",
    days: [
      {
        day: 1,
        label: "Full Body A",
        focus: "Quad & Push Dominant",
        duration: 60,
        muscleGroups: ["Quads", "Glutes", "Chest", "Back", "Triceps"],
        exercises: [
          {
            name: "Barbell Back Squats",
            sets: 4,
            reps: "8–10",
            rest: "90s",
            muscles: ["Quads", "Glutes", "Core"],
            image: IMG.squat,
            description:
              "The king of all exercises. Set up with the bar across your upper traps, feet shoulder-width apart. Sit back and down, keeping your chest tall and knees tracking over your toes. Drive through your heels to stand.",
          },
          {
            name: "Flat Barbell Bench Press",
            sets: 4,
            reps: "8–10",
            rest: "90s",
            muscles: ["Chest", "Triceps", "Front Delts"],
            image: IMG.bench,
            description:
              "The classic chest builder. Retract your shoulder blades, maintain a slight arch, and lower the bar to mid-chest. Press powerfully to full lockout. Control the descent.",
          },
          {
            name: "Wide-Grip Lat Pulldowns",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Lats", "Biceps", "Rear Delts"],
            image: IMG.pullup,
            description:
              "Lean back slightly and pull the bar to your upper chest, driving your elbows down and back. Great for building back width. Squeeze the lats at the bottom.",
          },
          {
            name: "Seated Dumbbell Overhead Press",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Shoulders", "Triceps", "Upper Traps"],
            image: IMG.shoulder,
            description:
              "Press dumbbells from shoulder height to overhead lockout. Maintain a neutral spine with core braced throughout. Control the descent to protect your shoulder joints.",
          },
          {
            name: "Romanian Deadlifts",
            sets: 3,
            reps: "10–12",
            rest: "90s",
            muscles: ["Hamstrings", "Glutes", "Lower Back"],
            image: IMG.rdl,
            description:
              "Hinge at the hips with a soft knee bend, feeling a deep stretch in your hamstrings. Keep the bar close to your legs. Drive your hips forward to return to standing.",
          },
          {
            name: "Cable Rope Pushdowns",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Triceps"],
            image: IMG.cable,
            description:
              "Attach a rope to a high cable. Keep elbows pinned at your sides and push the rope down, flaring the ends outward at full extension for maximum tricep contraction.",
          },
        ],
      },
      {
        day: 2,
        label: "Full Body B",
        focus: "Hinge & Pull Dominant",
        duration: 60,
        muscleGroups: ["Hamstrings", "Back", "Shoulders", "Biceps", "Core"],
        exercises: [
          {
            name: "Bent-Over Barbell Rows",
            sets: 4,
            reps: "8–10",
            rest: "90s",
            muscles: ["Back", "Biceps", "Rear Delts"],
            image: IMG.row,
            description:
              "Hinge forward to about 45°, overhand grip slightly wider than shoulders. Row the bar to your belly button, driving elbows back and squeezing shoulder blades together at the top.",
          },
          {
            name: "Incline Dumbbell Press",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Upper Chest", "Shoulders", "Triceps"],
            image: IMG.bench,
            description:
              "Set the bench to 30–45°. Press dumbbells up and slightly inward, focusing on upper chest activation. Touch dumbbells lightly at the top without fully locking out.",
          },
          {
            name: "Walking Lunges",
            sets: 3,
            reps: "12 each leg",
            rest: "60s",
            muscles: ["Quads", "Glutes", "Hamstrings"],
            image: IMG.lunge,
            description:
              "Step forward and drop the rear knee toward the floor, keeping your front shin vertical. Alternate legs continuously. Maintain an upright torso throughout.",
          },
          {
            name: "Dumbbell Lateral Raises",
            sets: 3,
            reps: "12–15",
            rest: "45s",
            muscles: ["Medial Delts"],
            image: IMG.shoulder,
            description:
              "Lead with your elbows and raise to shoulder height. A slight forward lean and bent elbow angle helps target the medial deltoid head. Control the descent.",
          },
          {
            name: "Barbell Curls",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Biceps", "Brachialis"],
            image: IMG.curl,
            description:
              "Grip shoulder-width, curl with strict form and squeeze at the top. Avoid swinging the body. Lower under control for maximum time under tension.",
          },
          {
            name: "Hanging Leg Raises",
            sets: 3,
            reps: "15–20",
            rest: "45s",
            muscles: ["Core", "Hip Flexors"],
            image: IMG.core,
            description:
              "Hang from a pull-up bar and raise your legs to parallel or higher. Control the descent and avoid swinging. For more difficulty, bring knees to chest first.",
          },
        ],
      },
      {
        day: 3,
        label: "Full Body C",
        focus: "Posterior Chain & Triceps",
        duration: 65,
        muscleGroups: ["Back", "Chest", "Legs", "Triceps", "Shoulders"],
        exercises: [
          {
            name: "Conventional Deadlifts",
            sets: 4,
            reps: "6–8",
            rest: "120s",
            muscles: ["Hamstrings", "Glutes", "Back", "Traps"],
            image: IMG.deadlift,
            description:
              "Push the floor away as you pull the bar up. Maintain a neutral spine from set-up to lockout. Bar stays close to your legs. Hinge back at the hips at the top.",
          },
          {
            name: "Weighted Chest Dips",
            sets: 3,
            reps: "8–12",
            rest: "90s",
            muscles: ["Chest", "Triceps", "Front Delts"],
            image: IMG.dip,
            description:
              "Lean forward slightly for chest focus. Lower until your shoulders drop below your elbows, then drive up powerfully. Add weight via a belt or dumbbell between your knees.",
          },
          {
            name: "Seated Cable Rows",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Mid Back", "Lats", "Biceps"],
            image: IMG.cable,
            description:
              "Pull the handle to your midsection, drawing elbows back and squeezing shoulder blades together. Keep your torso upright and avoid using momentum.",
          },
          {
            name: "Leg Press 45 Degree",
            sets: 4,
            reps: "10–12",
            rest: "90s",
            muscles: ["Quads", "Glutes", "Hamstrings"],
            image: IMG.legpress,
            description:
              "Position feet shoulder-width on the platform. Lower until your knees reach ~90°, then press through your heels. Never lock knees at the top.",
          },
          {
            name: "Face Pulls",
            sets: 3,
            reps: "15–20",
            rest: "45s",
            muscles: ["Rear Delts", "Rotator Cuff", "Traps"],
            image: IMG.cable,
            description:
              "Set a cable at face height with a rope attachment. Pull to your forehead with elbows high and wide. Essential for shoulder health and rear deltoid development.",
          },
          {
            name: "Skull Crushers",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Triceps"],
            image: IMG.bench,
            description:
              "Lie flat on a bench and lower an EZ-bar or dumbbells toward your forehead with elbows fixed. Extend fully at the top for full tricep engagement.",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // INTERMEDIATE — PPL + Arnold Split (6 days/week)
  // ═══════════════════════════════════════════════════════════
  intermediate: {
    id: "intermediate",
    name: "PPL + Arnold Split",
    badge: "Intermediate",
    badgeColor: "accent",
    subtitle: "6 Days / Week",
    description:
      "A proven 6-day split combining Push/Pull/Legs frequency with Arnold-style double sessions. Days 1–3 use PPL for pure strength; days 4–6 shift to Arnold bodybuilding pairings for volume and detail work.",
    accentColor: "#5cb800",
    totalDays: 6,
    restDays: "Day 7 is full rest.",
    days: [
      {
        day: 1,
        label: "Push",
        focus: "Chest, Shoulders & Triceps",
        duration: 65,
        muscleGroups: ["Chest", "Shoulders", "Triceps"],
        exercises: [
          {
            name: "Flat Dumbbell Press",
            sets: 4,
            reps: "8–10",
            rest: "90s",
            muscles: ["Chest", "Triceps", "Front Delts"],
            image: IMG.bench,
            description:
              "Greater range of motion than the barbell press. Lower dumbbells until they are level with your chest, then press up and slightly inward. Touch at the top without banging.",
          },
          {
            name: "Military Press",
            sets: 4,
            reps: "6–8",
            rest: "90s",
            muscles: ["Shoulders", "Triceps", "Traps"],
            image: IMG.shoulder,
            description:
              "Stand or sit with a barbell at chin level. Brace your core, press overhead to lockout. Lower under control. The strict press is a true test of shoulder strength.",
          },
          {
            name: "Cable Flyes",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Chest", "Front Delts"],
            image: IMG.cable,
            description:
              "Set cables at chest height. Arms sweep in a wide hugging arc — focus on the stretch at the start and squeeze the chest hard at the end of the movement.",
          },
          {
            name: "Lateral Raises",
            sets: 3,
            reps: "12–15",
            rest: "45s",
            muscles: ["Medial Delts"],
            image: IMG.shoulder,
            description:
              "Lead with elbows, raise to shoulder height. A slight forward lean and partial elbow bend help isolate the medial deltoid. Control the negative rep.",
          },
          {
            name: "Overhead Extension",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Triceps (Long Head)"],
            image: IMG.cable,
            description:
              "Hold a dumbbell or rope overhead with both hands. Lower behind your head keeping elbows close, then extend fully to target the long head of the triceps.",
          },
          {
            name: "Close-Grip Bench Press",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Triceps", "Chest", "Front Delts"],
            image: IMG.bench,
            description:
              "Grip the bar shoulder-width with elbows tucked close to your sides. Lower to mid-chest and press, focusing on tricep activation throughout the full range.",
          },
        ],
      },
      {
        day: 2,
        label: "Pull",
        focus: "Back & Biceps",
        duration: 65,
        muscleGroups: ["Back", "Biceps", "Rear Delts"],
        exercises: [
          {
            name: "Pull-ups",
            sets: 4,
            reps: "6–10",
            rest: "90s",
            muscles: ["Lats", "Biceps", "Rear Delts"],
            image: IMG.pullup,
            description:
              "Start from a dead hang, pull your chest to the bar. Use a full range and control the descent. Add weight when you can do 10+ clean reps.",
          },
          {
            name: "Dumbbell Rows",
            sets: 4,
            reps: "10–12",
            rest: "60s",
            muscles: ["Mid Back", "Lats", "Biceps"],
            image: IMG.row,
            description:
              "Brace one hand and knee on a bench. Row the dumbbell to your hip, keeping your back flat and pulling with your elbow. Full stretch at the bottom.",
          },
          {
            name: "T-Bar Rows",
            sets: 3,
            reps: "8–10",
            rest: "90s",
            muscles: ["Mid Back", "Lats", "Rhomboids"],
            image: IMG.row,
            description:
              "Straddle the bar and row it to your chest with elbows driving back. An excellent mass-builder for mid-back thickness and overall width.",
          },
          {
            name: "Reverse Curls",
            sets: 3,
            reps: "12–15",
            rest: "45s",
            muscles: ["Brachialis", "Brachioradialis", "Forearms"],
            image: IMG.curl,
            description:
              "Curl a barbell with an overhand grip. Builds the brachialis (which pushes up the bicep) and strengthens the forearms for better grip strength.",
          },
          {
            name: "Hammer Curls",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Brachialis", "Biceps", "Forearms"],
            image: IMG.curl,
            description:
              "Neutral (hammer) grip with thumbs up. Curl the dumbbell while keeping your wrist neutral. Targets brachialis and brachioradialis for arm thickness and density.",
          },
          {
            name: "Rear Delt Flyes",
            sets: 3,
            reps: "15–20",
            rest: "45s",
            muscles: ["Rear Delts", "Rhomboids", "Traps"],
            image: IMG.shoulder,
            description:
              "Bend forward at the hips or use a cable. Raise arms out to the sides targeting the posterior deltoid. Use lighter weight with strict form — squeeze hard at the top.",
          },
        ],
      },
      {
        day: 3,
        label: "Legs",
        focus: "Quads, Hamstrings & Calves",
        duration: 70,
        muscleGroups: ["Quads", "Hamstrings", "Glutes", "Calves"],
        exercises: [
          {
            name: "Front Squats",
            sets: 4,
            reps: "6–8",
            rest: "120s",
            muscles: ["Quads", "Glutes", "Core"],
            image: IMG.squat,
            description:
              "Bar rests on front deltoids. Requires a more upright torso than the back squat, placing heavy emphasis on the quads. Elbows high throughout the movement.",
          },
          {
            name: "Leg Extensions",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Quads"],
            image: IMG.legpress,
            description:
              "Sit at the machine and extend your legs fully, squeezing the quads hard at the top. Use a slow, controlled negative. Great quad isolation exercise.",
          },
          {
            name: "Leg Curls",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Hamstrings"],
            image: IMG.legpress,
            description:
              "Lie or sit at the leg curl machine. Curl your heels toward your glutes and squeeze hard at peak contraction. Full extension on every rep.",
          },
          {
            name: "Stiff Deadlifts",
            sets: 3,
            reps: "10–12",
            rest: "90s",
            muscles: ["Hamstrings", "Glutes", "Lower Back"],
            image: IMG.deadlift,
            description:
              "Minimal knee bend with a pure hip hinge. Bar travels close to your legs. Feel a deep hamstring and glute stretch at the bottom before driving hips forward.",
          },
          {
            name: "Calf Raises",
            sets: 4,
            reps: "15–20",
            rest: "45s",
            muscles: ["Calves (Gastrocnemius & Soleus)"],
            image: IMG.calf,
            description:
              "Use a full range — rise all the way up on your toes and fully stretch at the bottom. A slow eccentric (3 seconds down) maximizes calf development.",
          },
        ],
      },
      {
        day: 4,
        label: "Chest + Back",
        focus: "Arnold-Style Volume Day",
        duration: 70,
        muscleGroups: ["Chest", "Back", "Lats"],
        exercises: [
          {
            name: "Incline Bench Press",
            sets: 4,
            reps: "8–10",
            rest: "90s",
            muscles: ["Upper Chest", "Front Delts", "Triceps"],
            image: IMG.bench,
            description:
              "Set the bench to 30–45°. Press the bar to your upper chest for clavicular head activation. Elbows at about 75° to protect your shoulder joints.",
          },
          {
            name: "Barbell Rows",
            sets: 4,
            reps: "8–10",
            rest: "90s",
            muscles: ["Back", "Biceps", "Rear Delts"],
            image: IMG.row,
            description:
              "Bent over at 45°, overhand grip. Row the bar to your belly button with elbows driving back. One of the most effective mass-builders for the upper back.",
          },
          {
            name: "Pullovers",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Lats", "Chest", "Serratus"],
            image: IMG.fly,
            description:
              "Lie across a bench with a dumbbell. Arc the weight from above your chest to behind your head, feeling a huge lat and chest stretch. Squeeze on the way back.",
          },
          {
            name: "Cable Crossovers",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Inner Chest", "Front Delts"],
            image: IMG.cable,
            description:
              "High cables set at shoulder height. Cross your hands at the endpoint for inner chest peak contraction. The Arnold favourite for chest definition.",
          },
          {
            name: "Lat Pulldowns",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Lats", "Biceps", "Rear Delts"],
            image: IMG.pullup,
            description:
              "Wide grip, lean back slightly, pull the bar to your upper chest with elbows driving down. Builds the V-taper width Arnold was famous for.",
          },
        ],
      },
      {
        day: 5,
        label: "Shoulders + Arms",
        focus: "Arnold-Style Volume Day",
        duration: 65,
        muscleGroups: ["Shoulders", "Biceps", "Triceps"],
        exercises: [
          {
            name: "Arnold Press",
            sets: 4,
            reps: "10–12",
            rest: "75s",
            muscles: ["All Three Delt Heads", "Triceps"],
            image: IMG.shoulder,
            description:
              "Start with palms facing you at chin height, rotate outward as you press overhead. Invented by Arnold himself — hits all three deltoid heads through the rotation.",
          },
          {
            name: "Upright Rows",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Medial Delts", "Traps", "Biceps"],
            image: IMG.shoulder,
            description:
              "Pull a barbell or dumbbells up to chin level with elbows driving high and wide. Works traps and medial delts. Keep elbows above wrists throughout.",
          },
          {
            name: "Preacher Curls",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Biceps (Short Head)"],
            image: IMG.curl,
            description:
              "Use a preacher bench to eliminate body momentum. Full stretch at the bottom isolates the short head of the bicep for a peak contraction you can really feel.",
          },
          {
            name: "Incline Curls",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Biceps (Long Head)"],
            image: IMG.curl,
            description:
              "Lie back on an incline bench with arms hanging freely behind you. This deep stretch position targets the long head of the bicep for maximum development.",
          },
          {
            name: "Dips",
            sets: 3,
            reps: "10–15",
            rest: "75s",
            muscles: ["Triceps", "Chest", "Front Delts"],
            image: IMG.dip,
            description:
              "Keep your body upright for tricep focus. Lower until upper arms are parallel to the floor, then press back up. Add weight once you can do 15 clean reps.",
          },
          {
            name: "Cable Extensions",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Triceps"],
            image: IMG.cable,
            description:
              "Overhead or pushdown cable tricep extension with constant tension throughout the entire range. The cable maintains load even at the start position unlike dumbbells.",
          },
        ],
      },
      {
        day: 6,
        label: "Legs + Abs",
        focus: "Arnold-Style Volume Day",
        duration: 70,
        muscleGroups: ["Quads", "Glutes", "Hamstrings", "Core"],
        exercises: [
          {
            name: "Back Squats",
            sets: 5,
            reps: "6–8",
            rest: "120s",
            muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
            image: IMG.squat,
            description:
              "High volume heavy squats to end the week. Bar on upper traps, brace hard, sit back and down, drive through heels. The foundation of any great physique.",
          },
          {
            name: "Hack Squat",
            sets: 3,
            reps: "10–12",
            rest: "90s",
            muscles: ["Quads", "Glutes"],
            image: IMG.legpress,
            description:
              "Machine squat where the load is behind you. Places heavy emphasis on the quad sweep (teardrop). Feet low and close for more quad, high for more glute.",
          },
          {
            name: "Bulgarian Split Squat",
            sets: 3,
            reps: "10 each leg",
            rest: "75s",
            muscles: ["Quads", "Glutes", "Hamstrings"],
            image: IMG.lunge,
            description:
              "Rear foot elevated on a bench, front foot forward in a split stance. Drop straight down. Builds single-leg strength and addresses imbalances. Challenging but effective.",
          },
          {
            name: "Glute Raises",
            sets: 3,
            reps: "15–20",
            rest: "60s",
            muscles: ["Glutes", "Hamstrings"],
            image: IMG.rdl,
            description:
              "Lie on your back, feet flat on the floor. Drive your hips toward the ceiling and squeeze your glutes hard at the top. Can be weighted with a barbell across the hips.",
          },
          {
            name: "Crunches",
            sets: 4,
            reps: "20–25",
            rest: "45s",
            muscles: ["Rectus Abdominis"],
            image: IMG.core,
            description:
              "Short range crunch focusing on upper rectus abdominis. Hands behind head, do not pull the neck. Exhale on the way up. Slow and controlled beats fast and sloppy.",
          },
          {
            name: "Calf Raises",
            sets: 4,
            reps: "20–25",
            rest: "45s",
            muscles: ["Calves"],
            image: IMG.calf,
            description:
              "Full range of motion — stretch completely at the bottom and rise all the way onto your toes. Pause for 1 second at the top for added intensity.",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ADVANCED — PPL × 2 + Double Muscle Split (6 days/week)
  // ═══════════════════════════════════════════════════════════
  advanced: {
    id: "advanced",
    name: "PPL + Double Muscle Split",
    badge: "Advanced",
    badgeColor: "danger",
    subtitle: "6 Days / Week — Max Volume",
    description:
      "Designed for experienced lifters who have exhausted linear progression. Days 1–3 use a classic PPL for compound strength. Days 4–6 use a Double Muscle Split (antagonist pairing) for maximal hypertrophy. High volume, high frequency, and demanding recovery.",
    accentColor: "#e53e3e",
    totalDays: 6,
    restDays: "Day 7 is mandatory full rest.",
    days: [
      {
        day: 1,
        label: "Push",
        focus: "Strength-Oriented PPL",
        duration: 75,
        muscleGroups: ["Chest", "Shoulders", "Triceps"],
        exercises: [
          {
            name: "Bench Press",
            sets: 5,
            reps: "4–6",
            rest: "120s",
            muscles: ["Chest", "Front Delts", "Triceps"],
            image: IMG.bench,
            description:
              "The premier chest exercise. Flat bench, grip 1.5× shoulder width. Touch the bar to your mid-chest and press explosively. Use a spotter for heavy sets.",
          },
          {
            name: "Overhead Press",
            sets: 4,
            reps: "6–8",
            rest: "90s",
            muscles: ["Shoulders", "Triceps", "Upper Chest"],
            image: IMG.shoulder,
            description:
              "Stand and press the bar from chin level to overhead lockout. No leg drive — strict press only. Core braced, glutes squeezed to protect the lower back.",
          },
          {
            name: "Incline Flyes",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Upper Chest", "Front Delts"],
            image: IMG.fly,
            description:
              "Set bench to 30°. Wide arc from above your chest down and out, then squeeze together. Feel the upper pec stretch on every rep. Use moderate weight, not heavy.",
          },
          {
            name: "Lateral Raises",
            sets: 4,
            reps: "12–15",
            rest: "45s",
            muscles: ["Medial Delts"],
            image: IMG.shoulder,
            description:
              "Lead with your elbows, raise to shoulder height. Advanced technique: lean slightly forward and use a thumb-down grip (like pouring a pitcher) for deeper medial delt hit.",
          },
          {
            name: "Skull Crushers",
            sets: 3,
            reps: "10–12",
            rest: "75s",
            muscles: ["Triceps"],
            image: IMG.bench,
            description:
              "Use an EZ bar for wrist comfort. Lower to your forehead with elbows stationary, then extend powerfully. Can superset with close-grip bench for a giant tricep pump.",
          },
          {
            name: "Cable Pushdowns",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Triceps (Lateral & Medial Heads)"],
            image: IMG.cable,
            description:
              "Use a straight bar or rope attachment. Elbows pinned, push down to full extension and squeeze. The rope allows wrists to pronate for extra medial head engagement.",
          },
        ],
      },
      {
        day: 2,
        label: "Pull",
        focus: "Strength-Oriented PPL",
        duration: 75,
        muscleGroups: ["Back", "Biceps", "Rear Delts"],
        exercises: [
          {
            name: "Deadlift / Rack Pull",
            sets: 5,
            reps: "3–5",
            rest: "180s",
            muscles: ["Full Posterior Chain", "Traps", "Core"],
            image: IMG.deadlift,
            description:
              "The most taxing compound movement. Full deadlift for total-body strength, or rack pulls (from knee height) for maximum loading on the upper back and traps.",
          },
          {
            name: "Lat Pulldown",
            sets: 4,
            reps: "8–10",
            rest: "75s",
            muscles: ["Lats", "Biceps", "Rear Delts"],
            image: IMG.pullup,
            description:
              "Wide overhand grip, slight lean back. Pull to your upper chest, driving elbows toward your hips. Full arm extension overhead on every rep for maximum lat stretch.",
          },
          {
            name: "Cable Row",
            sets: 4,
            reps: "10–12",
            rest: "60s",
            muscles: ["Mid Back", "Lats", "Biceps"],
            image: IMG.cable,
            description:
              "Use a close neutral grip. Row to your midsection, elbows tight, and squeeze shoulder blades at the endpoint. Slow 3-second eccentric on every rep.",
          },
          {
            name: "Face Pull",
            sets: 3,
            reps: "15–20",
            rest: "45s",
            muscles: ["Rear Delts", "Rotator Cuff", "Mid Traps"],
            image: IMG.cable,
            description:
              "Rope at eye level. Pull to your face with elbows flared high. External rotate at the endpoint. Non-negotiable for shoulder health at high training volumes.",
          },
          {
            name: "Barbell Curl",
            sets: 3,
            reps: "8–10",
            rest: "75s",
            muscles: ["Biceps", "Brachialis"],
            image: IMG.curl,
            description:
              "Standing barbell curl with a controlled tempo. Keep your elbows fixed at your sides — any elbow travel forward turns it into a front raise. Full supination at the top.",
          },
          {
            name: "Hammer Curl",
            sets: 3,
            reps: "10–12",
            rest: "60s",
            muscles: ["Brachialis", "Brachioradialis", "Biceps"],
            image: IMG.curl,
            description:
              "Neutral grip alternating curls. The brachialis sits under the bicep — developing it pushes the bicep up for a taller peak. Essential for complete arm development.",
          },
        ],
      },
      {
        day: 3,
        label: "Legs",
        focus: "Strength-Oriented PPL",
        duration: 80,
        muscleGroups: ["Quads", "Hamstrings", "Glutes", "Calves"],
        exercises: [
          {
            name: "Squat",
            sets: 5,
            reps: "4–6",
            rest: "180s",
            muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
            image: IMG.squat,
            description:
              "Heavy low-bar or high-bar back squat. Brace your entire core, sit back and down, drive through heels and mid-foot. The king of lower body exercises.",
          },
          {
            name: "Romanian Deadlift",
            sets: 4,
            reps: "8–10",
            rest: "90s",
            muscles: ["Hamstrings", "Glutes", "Lower Back"],
            image: IMG.rdl,
            description:
              "Hip hinge with soft knees. Lower the bar until you feel maximum hamstring tension — typically mid-shin or lower depending on flexibility. Drive hips forward hard.",
          },
          {
            name: "Leg Press",
            sets: 4,
            reps: "10–12",
            rest: "90s",
            muscles: ["Quads", "Glutes", "Hamstrings"],
            image: IMG.legpress,
            description:
              "High foot placement for glutes, low and close for quads. Control the descent — never let the sled bounce at the bottom. Full range without locking the knees.",
          },
          {
            name: "Leg Extension",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Quads"],
            image: IMG.legpress,
            description:
              "Terminal knee extension isolation. Extend fully and hold for 1 second at the top. Use a slower tempo (2-0-2) for maximum time under tension and quad growth.",
          },
          {
            name: "Leg Curl",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Hamstrings"],
            image: IMG.legpress,
            description:
              "Prone or seated leg curl. Curl all the way to peak contraction. Dorsiflexing your foot (toes up) during the curl adds extra hamstring tension. Slow negative.",
          },
          {
            name: "Calf Raise",
            sets: 5,
            reps: "15–20",
            rest: "45s",
            muscles: ["Gastrocnemius", "Soleus"],
            image: IMG.calf,
            description:
              "Standing calf raise with a full 2-second stretch at the bottom and 1-second pause at the top. Rotate feet positions (straight, toes in, toes out) across sets.",
          },
        ],
      },
      {
        day: 4,
        label: "Chest + Triceps",
        focus: "Double Muscle Split — Hypertrophy",
        duration: 70,
        muscleGroups: ["Chest", "Triceps"],
        exercises: [
          {
            name: "Bench Press",
            sets: 4,
            reps: "6–8",
            rest: "90s",
            muscles: ["Chest", "Triceps", "Front Delts"],
            image: IMG.bench,
            description:
              "Second bench press session of the week — slightly higher reps than Day 1. Focus on time under tension and full range of motion rather than maximum weight.",
          },
          {
            name: "Incline Dumbbell Press",
            sets: 3,
            reps: "10–12",
            rest: "75s",
            muscles: ["Upper Chest", "Front Delts", "Triceps"],
            image: IMG.bench,
            description:
              "Incline at 30–45°. Greater range of motion than the bar. Lower dumbbells until a full chest stretch is felt, then press up and slightly together at the top.",
          },
          {
            name: "Cable Crossovers",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Inner Chest", "Front Delts"],
            image: IMG.cable,
            description:
              "Cross the handles in front of you for inner chest activation. The cable keeps constant tension throughout the arc — superior to dumbbells for isolation work.",
          },
          {
            name: "Close-Grip Bench Press",
            sets: 3,
            reps: "8–10",
            rest: "90s",
            muscles: ["Triceps", "Chest"],
            image: IMG.bench,
            description:
              "Shoulder-width grip with elbows tucked. A joint-friendly tricep compound movement that allows heavier loading than isolation exercises. Lower controlled, press hard.",
          },
          {
            name: "Skull Crushers",
            sets: 3,
            reps: "10–12",
            rest: "75s",
            muscles: ["Triceps"],
            image: IMG.bench,
            description:
              "EZ-bar or dumbbell lowered toward forehead with fixed elbows. Extend fully at the top. The best isolation movement for building tricep mass and definition.",
          },
          {
            name: "Cable Pushdowns",
            sets: 3,
            reps: "15–20",
            rest: "45s",
            muscles: ["Triceps"],
            image: IMG.cable,
            description:
              "Finisher set with lighter weight and higher reps. Constant cable tension provides an excellent pump. Use the rope to allow full wrist pronation at the bottom.",
          },
        ],
      },
      {
        day: 5,
        label: "Back + Biceps",
        focus: "Double Muscle Split — Hypertrophy",
        duration: 70,
        muscleGroups: ["Back", "Biceps"],
        exercises: [
          {
            name: "Deadlift / Rack Pull",
            sets: 4,
            reps: "5–6",
            rest: "120s",
            muscles: ["Back", "Traps", "Glutes", "Hamstrings"],
            image: IMG.deadlift,
            description:
              "Lighter than Day 2 — focus on perfect form and back engagement. Use a rack pull from knee height for extra loading on the upper back and traps.",
          },
          {
            name: "Lat Pulldown",
            sets: 4,
            reps: "10–12",
            rest: "75s",
            muscles: ["Lats", "Biceps"],
            image: IMG.pullup,
            description:
              "Try a different grip variation — neutral (close grip) or underhand — compared to Day 2. Each grip targets slightly different lat fibres for complete development.",
          },
          {
            name: "Cable Row",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Mid Back", "Lats"],
            image: IMG.cable,
            description:
              "High volume with moderate weight. Sit tall, pull the handle to your midsection and squeeze your back hard. Pause for 1 second at the peak contraction.",
          },
          {
            name: "Face Pull",
            sets: 3,
            reps: "20–25",
            rest: "45s",
            muscles: ["Rear Delts", "Rotator Cuff"],
            image: IMG.cable,
            description:
              "High rep face pulls every pull day. Your rotator cuff will thank you. Pull to the forehead with elbows high and externally rotate at the end position.",
          },
          {
            name: "Barbell Curl",
            sets: 3,
            reps: "10–12",
            rest: "75s",
            muscles: ["Biceps", "Brachialis"],
            image: IMG.curl,
            description:
              "Strict form barbell curls. Focus on the mind-muscle connection — squeeze every single rep. Full range from dead hang to peak contraction.",
          },
          {
            name: "Hammer Curl",
            sets: 3,
            reps: "12–15",
            rest: "60s",
            muscles: ["Brachialis", "Brachioradialis"],
            image: IMG.curl,
            description:
              "Neutral grip hammer curls alternating arms. The brachialis responds well to high volume. This is your second bicep session of the week — keep the weight honest.",
          },
        ],
      },
      {
        day: 6,
        label: "Shoulders + Legs",
        focus: "Double Muscle Split — Hypertrophy",
        duration: 75,
        muscleGroups: ["Shoulders", "Quads", "Glutes", "Hamstrings"],
        exercises: [
          {
            name: "Overhead Press",
            sets: 4,
            reps: "8–10",
            rest: "90s",
            muscles: ["Shoulders", "Triceps"],
            image: IMG.shoulder,
            description:
              "Slightly higher rep overhead press than Day 1. Focus on shoulder development rather than raw strength. Seated dumbbell variation can also be used here.",
          },
          {
            name: "Lateral Raises",
            sets: 4,
            reps: "15–20",
            rest: "45s",
            muscles: ["Medial Delts"],
            image: IMG.shoulder,
            description:
              "High-rep lateral raises for shoulder width. Use cables for constant tension or dumbbells with partial reps at the top. Rest-pause sets work well here.",
          },
          {
            name: "Squat",
            sets: 4,
            reps: "8–10",
            rest: "120s",
            muscles: ["Quads", "Glutes", "Hamstrings"],
            image: IMG.squat,
            description:
              "Second squat session of the week with higher reps. Focus on technique and quad activation. Lighter than Day 3 — leave about 3 reps in the tank.",
          },
          {
            name: "Romanian Deadlift",
            sets: 3,
            reps: "12–15",
            rest: "90s",
            muscles: ["Hamstrings", "Glutes"],
            image: IMG.rdl,
            description:
              "Higher rep RDL for hamstring hypertrophy. Slow 3-second negative on every rep. The stretch under load at the bottom drives muscle growth.",
          },
          {
            name: "Leg Press",
            sets: 3,
            reps: "15–20",
            rest: "75s",
            muscles: ["Quads", "Glutes"],
            image: IMG.legpress,
            description:
              "Drop sets or regular high-rep leg press as a finisher. Go until you feel a deep burn, then rack. Excellent for quad hypertrophy at the end of the week.",
          },
          {
            name: "Calf Raises",
            sets: 4,
            reps: "20–25",
            rest: "45s",
            muscles: ["Calves"],
            image: IMG.calf,
            description:
              "Final calves of the week. Full range — stretch completely at the bottom and hold the contraction for 2 seconds at the top. No bouncing.",
          },
        ],
      },
    ],
  },
};

export default WORKOUT_PLANS;
